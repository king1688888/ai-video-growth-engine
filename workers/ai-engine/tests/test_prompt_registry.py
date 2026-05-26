"""
Prompt Registry Tests
Authority: D10, D12

Tests:
1. All P0 prompts are registered
2. Prompt rendering works
3. Variables are correctly injected
4. No raw prompt text in business code
"""

import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from prompts.registry import (
    PROMPT_REGISTRY, get_prompt, list_prompts, render_prompt,
)


REQUIRED_PROMPTS = [
    "P01_VIDEO_UNDERSTANDING",
    "P02_CONTENT_DNA",
    "P03_ANALYSIS_REPORT",
    "P04_CREATIVE_IR",
    "P05_ORIGINAL_SCRIPT",
    "P06_TITLE_GENERATION",
    "P07_COVER_SUGGESTION",
    "P08_VIDEO_PROMPT_BLUEPRINT",
    "P09_QUALITY_CHECK",
    "P10_RISK_CHECK",
]


def test_all_p0_prompts_registered():
    """All 10 P0 prompts must be in registry."""
    for prompt_id in REQUIRED_PROMPTS:
        prompt = get_prompt(prompt_id)
        assert prompt is not None, f"Missing prompt: {prompt_id}"
        assert prompt.version >= 1
        assert prompt.template != ""
        assert len(prompt.variables) > 0
        assert prompt.output_schema_ref != ""


def test_prompt_count():
    """Exactly 10 P0 prompts."""
    prompts = list_prompts()
    assert len(prompts) == 10


def test_prompt_rendering():
    """Variables are correctly injected."""
    rendered = render_prompt("P02_CONTENT_DNA", {
        "video_understanding": "test understanding",
        "industry": "本地餐饮",
    })
    assert "test understanding" in rendered
    assert "本地餐饮" in rendered
    assert "{{video_understanding}}" not in rendered
    assert "{{industry}}" not in rendered


def test_prompts_have_prohibition_clauses():
    """Key prompts must contain prohibition language."""
    critical_prompts = ["P01_VIDEO_UNDERSTANDING", "P04_CREATIVE_IR", "P05_ORIGINAL_SCRIPT"]
    for prompt_id in critical_prompts:
        prompt = get_prompt(prompt_id)
        assert "禁止" in prompt.template or "不得" in prompt.template, \
            f"Prompt {prompt_id} missing prohibition clause"


def test_prompts_have_json_output_requirement():
    """Prompts requiring JSON output must specify model_requirements."""
    for prompt in list_prompts():
        if "JSON Schema" in prompt.template or "json" in prompt.template.lower():
            assert prompt.model_requirements.get("json_output") is True, \
                f"Prompt {prompt.id} mentions JSON but doesn't require json_output"


if __name__ == "__main__":
    test_all_p0_prompts_registered()
    test_prompt_count()
    test_prompt_rendering()
    test_prompts_have_prohibition_clauses()
    test_prompts_have_json_output_requirement()
    print("All prompt registry tests passed!")
