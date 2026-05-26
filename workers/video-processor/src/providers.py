"""
ASR/OCR Provider Adapters
Authority: D08, D11

All providers implement a common interface.
Mock providers for testing; real providers for production.
"""

import os
from abc import ABC, abstractmethod
from typing import List
from dataclasses import dataclass


@dataclass
class TranscriptSegment:
    start_ms: int
    end_ms: int
    text: str
    confidence: float
    language: str = "zh"


@dataclass
class OcrSegment:
    frame_index: int
    timestamp_ms: int
    text: str
    confidence: float
    region: str = "full_frame"  # full_frame, subtitle_area, overlay


class ASRProvider(ABC):
    """Abstract ASR provider interface."""
    
    @abstractmethod
    async def transcribe(self, audio_path: str) -> List[TranscriptSegment]:
        pass


class OCRProvider(ABC):
    """Abstract OCR provider interface."""
    
    @abstractmethod
    async def extract_text(self, frame_paths: List[str]) -> List[OcrSegment]:
        pass


class MockASRProvider(ASRProvider):
    """Mock ASR for development/testing. MUST NOT be used in production."""
    
    async def transcribe(self, audio_path: str) -> List[TranscriptSegment]:
        if os.environ.get("NODE_ENV") == "production":
            raise RuntimeError("MockASRProvider cannot be used in production (is_mock=true violation)")
        
        return [
            TranscriptSegment(
                start_ms=0, end_ms=3000,
                text="[MOCK] 大家好，欢迎来到今天的视频",
                confidence=0.95, language="zh"
            ),
            TranscriptSegment(
                start_ms=3000, end_ms=8000,
                text="[MOCK] 今天我们来聊一聊短视频运营的核心技巧",
                confidence=0.92, language="zh"
            ),
        ]


class MockOCRProvider(OCRProvider):
    """Mock OCR for development/testing. MUST NOT be used in production."""
    
    async def extract_text(self, frame_paths: List[str]) -> List[OcrSegment]:
        if os.environ.get("NODE_ENV") == "production":
            raise RuntimeError("MockOCRProvider cannot be used in production (is_mock=true violation)")
        
        return [
            OcrSegment(
                frame_index=0, timestamp_ms=0,
                text="[MOCK] 短视频运营技巧", confidence=0.88
            ),
        ]


def get_asr_provider() -> ASRProvider:
    """Factory: return appropriate ASR provider based on config."""
    provider = os.environ.get("ASR_PROVIDER", "mock")
    if provider == "mock":
        return MockASRProvider()
    # TODO: Add real providers (aliyun_paraformer, whisper_api, etc.)
    raise ValueError(f"Unknown ASR provider: {provider}")


def get_ocr_provider() -> OCRProvider:
    """Factory: return appropriate OCR provider based on config."""
    provider = os.environ.get("OCR_PROVIDER", "mock")
    if provider == "mock":
        return MockOCRProvider()
    # TODO: Add real providers (aliyun_ocr, paddleocr, etc.)
    raise ValueError(f"Unknown OCR provider: {provider}")
