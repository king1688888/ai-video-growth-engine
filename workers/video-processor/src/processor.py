"""
Video Processing Pipeline - Core Functions
Authority: D08

All outputs are stored in object storage (S3/R2), only references stored in DB.
"""

import subprocess
import json
import os
from dataclasses import dataclass, asdict
from typing import Optional, List
from pathlib import Path


@dataclass
class VideoMetadata:
    duration_ms: int
    width: int
    height: int
    fps: float
    codec: str
    file_size_bytes: int
    has_audio: bool
    audio_codec: Optional[str] = None
    bitrate_kbps: Optional[int] = None


@dataclass
class ProcessingQualityReport:
    """Per D08: Every processing step must produce a quality report."""
    step_name: str
    success: bool
    confidence: float
    warnings: List[str]
    error: Optional[str] = None
    duration_ms: Optional[int] = None


def extract_metadata(video_path: str) -> VideoMetadata:
    """Extract video metadata using FFprobe."""
    cmd = [
        "ffprobe", "-v", "quiet", "-print_format", "json",
        "-show_format", "-show_streams", video_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    if result.returncode != 0:
        raise RuntimeError(f"FFprobe failed: {result.stderr}")
    
    data = json.loads(result.stdout)
    video_stream = next((s for s in data.get("streams", []) if s["codec_type"] == "video"), None)
    audio_stream = next((s for s in data.get("streams", []) if s["codec_type"] == "audio"), None)
    fmt = data.get("format", {})
    
    if not video_stream:
        raise ValueError("No video stream found")
    
    duration_ms = int(float(fmt.get("duration", 0)) * 1000)
    fps_parts = video_stream.get("r_frame_rate", "30/1").split("/")
    fps = float(fps_parts[0]) / float(fps_parts[1]) if len(fps_parts) == 2 else 30.0
    
    return VideoMetadata(
        duration_ms=duration_ms,
        width=int(video_stream.get("width", 0)),
        height=int(video_stream.get("height", 0)),
        fps=round(fps, 2),
        codec=video_stream.get("codec_name", "unknown"),
        file_size_bytes=int(fmt.get("size", 0)),
        has_audio=audio_stream is not None,
        audio_codec=audio_stream.get("codec_name") if audio_stream else None,
        bitrate_kbps=int(fmt.get("bit_rate", 0)) // 1000 if fmt.get("bit_rate") else None,
    )


def generate_proxy(video_path: str, output_path: str, max_height: int = 720) -> str:
    """Generate proxy video for processing (lower resolution)."""
    cmd = [
        "ffmpeg", "-i", video_path, "-y",
        "-vf", f"scale=-2:{max_height}",
        "-c:v", "libx264", "-preset", "fast", "-crf", "28",
        "-c:a", "aac", "-b:a", "128k",
        output_path
    ]
    subprocess.run(cmd, capture_output=True, timeout=300, check=True)
    return output_path


def extract_frames(video_path: str, output_dir: str, interval_sec: float = 2.0) -> List[str]:
    """Extract keyframes at regular intervals."""
    os.makedirs(output_dir, exist_ok=True)
    cmd = [
        "ffmpeg", "-i", video_path, "-y",
        "-vf", f"fps=1/{interval_sec}",
        "-q:v", "2",
        os.path.join(output_dir, "frame_%04d.jpg")
    ]
    subprocess.run(cmd, capture_output=True, timeout=120, check=True)
    frames = sorted(Path(output_dir).glob("frame_*.jpg"))
    return [str(f) for f in frames]


def extract_audio(video_path: str, output_path: str) -> str:
    """Extract audio track as WAV for ASR."""
    cmd = [
        "ffmpeg", "-i", video_path, "-y",
        "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1",
        output_path
    ]
    subprocess.run(cmd, capture_output=True, timeout=120, check=True)
    return output_path


def detect_shots(video_path: str, threshold: float = 0.3) -> List[dict]:
    """Basic shot detection using FFmpeg scene filter."""
    cmd = [
        "ffmpeg", "-i", video_path,
        "-vf", f"select='gt(scene,{threshold})',showinfo",
        "-f", "null", "-"
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    
    # Parse showinfo output for timestamps
    shots = []
    current_start = 0.0
    for line in result.stderr.split("\n"):
        if "pts_time:" in line:
            try:
                pts_time = float(line.split("pts_time:")[1].split()[0])
                shots.append({
                    "start_ms": int(current_start * 1000),
                    "end_ms": int(pts_time * 1000),
                    "duration_ms": int((pts_time - current_start) * 1000),
                })
                current_start = pts_time
            except (IndexError, ValueError):
                continue
    
    return shots


def build_evidence_pack(
    metadata: VideoMetadata,
    frames: List[str],
    transcript_segments: List[dict],
    ocr_segments: List[dict],
    shots: List[dict],
) -> dict:
    """
    Assemble multimodal evidence pack per D08.
    This is the input to AI understanding models.
    """
    return {
        "schema_version": "1.0",
        "metadata": asdict(metadata),
        "frame_count": len(frames),
        "frame_refs": frames[:20],  # Limit to 20 key frames
        "transcript_segment_count": len(transcript_segments),
        "transcript_segments": transcript_segments,
        "ocr_segment_count": len(ocr_segments),
        "ocr_segments": ocr_segments,
        "shot_count": len(shots),
        "shots": shots,
        "has_visual_evidence": len(frames) > 0,
        "has_text_evidence": len(transcript_segments) > 0 or len(ocr_segments) > 0,
    }
