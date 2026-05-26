"""
Model Router + Provider Adapter
Authority: D11

All model calls MUST go through this router.
Business code MUST NOT call provider APIs directly.
"""

import os
import json
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass, field, asdict
from typing import Dict, Any, Optional, List
from datetime import datetime


@dataclass
class ModelCallRequest:
    """Input to model router."""
    prompt_run_id: str
    task_id: Optional[str]
    prompt_text: str
    model_preference: Optional[str] = None
    max_tokens: int = 4096
    temperature: float = 0.7
    json_mode: bool = True
    timeout_seconds: int = 60


@dataclass
class ModelCallResult:
    """Output from model router."""
    success: bool
    content: Optional[str] = None
    provider: str = ""
    model: str = ""
    input_tokens: int = 0
    output_tokens: int = 0
    cost_micro_usd: int = 0
    latency_ms: int = 0
    error: Optional[str] = None
    is_mock: bool = False


@dataclass
class ModelCallLogEntry:
    """Per D11/D16: Every model call must be logged."""
    id: str
    task_id: Optional[str]
    prompt_run_id: str
    provider: str
    model: str
    input_tokens: int
    output_tokens: int
    cost_micro_usd: int
    latency_ms: int
    status: str  # SUCCEEDED, FAILED, TIMEOUT, RATE_LIMITED
    error_code: Optional[str] = None
    is_mock: bool = False
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")


class ProviderAdapter(ABC):
    """Abstract provider adapter interface."""
    
    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass
    
    @abstractmethod
    async def call(self, request: ModelCallRequest) -> ModelCallResult:
        pass
    
    @abstractmethod
    def estimate_cost(self, input_tokens: int, output_tokens: int) -> int:
        """Estimate cost in micro USD."""
        pass


class MockProviderAdapter(ProviderAdapter):
    """Mock provider for development/testing. Production MUST disable."""
    
    @property
    def provider_name(self) -> str:
        return "mock"
    
    async def call(self, request: ModelCallRequest) -> ModelCallResult:
        if os.environ.get("NODE_ENV") == "production" and not os.environ.get("FORCE_MOCK"):
            raise RuntimeError("MockProvider cannot be used in production")
        
        # Simulate latency
        time.sleep(0.1)
        
        mock_response = {
            "mock": True,
            "message": "This is a mock response. Replace with real model output.",
            "prompt_length": len(request.prompt_text),
        }
        
        return ModelCallResult(
            success=True,
            content=json.dumps(mock_response, ensure_ascii=False),
            provider="mock",
            model="mock-model",
            input_tokens=len(request.prompt_text) // 4,
            output_tokens=100,
            cost_micro_usd=0,
            latency_ms=100,
            is_mock=True,
        )
    
    def estimate_cost(self, input_tokens: int, output_tokens: int) -> int:
        return 0


class OpenAICompatibleAdapter(ProviderAdapter):
    """OpenAI-compatible API adapter (works with OpenAI, Azure, local proxies)."""
    
    def __init__(self, provider: str = "openai", model: str = "gpt-4.1-mini"):
        self._provider = provider
        self._model = model
        self._api_key = os.environ.get("OPENAI_API_KEY", "")
        self._base_url = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1")
    
    @property
    def provider_name(self) -> str:
        return self._provider
    
    async def call(self, request: ModelCallRequest) -> ModelCallResult:
        """Call OpenAI-compatible API."""
        try:
            import openai
            client = openai.OpenAI(api_key=self._api_key, base_url=self._base_url)
            
            start = time.time()
            kwargs: Dict[str, Any] = {
                "model": request.model_preference or self._model,
                "messages": [{"role": "user", "content": request.prompt_text}],
                "max_tokens": request.max_tokens,
                "temperature": request.temperature,
            }
            if request.json_mode:
                kwargs["response_format"] = {"type": "json_object"}
            
            response = client.chat.completions.create(**kwargs)
            latency_ms = int((time.time() - start) * 1000)
            
            usage = response.usage
            return ModelCallResult(
                success=True,
                content=response.choices[0].message.content,
                provider=self._provider,
                model=response.model,
                input_tokens=usage.prompt_tokens if usage else 0,
                output_tokens=usage.completion_tokens if usage else 0,
                cost_micro_usd=self.estimate_cost(
                    usage.prompt_tokens if usage else 0,
                    usage.completion_tokens if usage else 0,
                ),
                latency_ms=latency_ms,
            )
        except Exception as e:
            return ModelCallResult(
                success=False,
                provider=self._provider,
                model=self._model,
                error=str(e),
            )
    
    def estimate_cost(self, input_tokens: int, output_tokens: int) -> int:
        """Estimate cost in micro USD. Prices per 1M tokens."""
        # GPT-4.1-mini: $0.40/1M input, $1.60/1M output
        input_cost = (input_tokens * 400) // 1_000_000
        output_cost = (output_tokens * 1600) // 1_000_000
        return input_cost + output_cost


class ModelRouter:
    """
    Central model routing service.
    All AI calls go through here for:
    - Provider selection
    - Cost estimation
    - Retry/fallback
    - Logging
    """
    
    def __init__(self):
        self._adapters: Dict[str, ProviderAdapter] = {}
        self._call_logs: List[ModelCallLogEntry] = []
        self._setup_adapters()
    
    def _setup_adapters(self):
        """Initialize available adapters based on environment."""
        use_mock = os.environ.get("FEATURE_MOCK_AI", "true").lower() == "true"
        
        if use_mock:
            self._adapters["mock"] = MockProviderAdapter()
        
        if os.environ.get("OPENAI_API_KEY") and not os.environ.get("OPENAI_API_KEY", "").startswith("sk-placeholder"):
            self._adapters["openai"] = OpenAICompatibleAdapter("openai", "gpt-4.1-mini")
        
        if not self._adapters:
            self._adapters["mock"] = MockProviderAdapter()
    
    def estimate_credits(self, prompt_length: int, expected_output: int = 2000) -> int:
        """Estimate credits for a task (1 credit ≈ cost of one standard call)."""
        # Rough: 10 credits per full analysis task
        return 10
    
    async def route_and_call(self, request: ModelCallRequest) -> ModelCallResult:
        """Route request to best available provider with retry."""
        import uuid
        
        # Select provider (priority: real > mock)
        adapter = self._select_adapter(request)
        
        # Call with retry
        max_retries = 2
        last_error = None
        
        for attempt in range(max_retries + 1):
            result = await adapter.call(request)
            
            # Log the call
            log_entry = ModelCallLogEntry(
                id=str(uuid.uuid4()),
                task_id=request.task_id,
                prompt_run_id=request.prompt_run_id,
                provider=result.provider,
                model=result.model,
                input_tokens=result.input_tokens,
                output_tokens=result.output_tokens,
                cost_micro_usd=result.cost_micro_usd,
                latency_ms=result.latency_ms,
                status="SUCCEEDED" if result.success else "FAILED",
                error_code=result.error,
                is_mock=result.is_mock,
            )
            self._call_logs.append(log_entry)
            
            if result.success:
                return result
            
            last_error = result.error
            # Try fallback adapter on failure
            if attempt < max_retries and "mock" in self._adapters:
                adapter = self._adapters["mock"]
        
        return ModelCallResult(success=False, error=f"All retries failed: {last_error}")
    
    def _select_adapter(self, request: ModelCallRequest) -> ProviderAdapter:
        """Select best adapter for request."""
        # Prefer real providers over mock
        for name, adapter in self._adapters.items():
            if name != "mock":
                return adapter
        return self._adapters.get("mock", MockProviderAdapter())
    
    def get_call_logs(self) -> List[ModelCallLogEntry]:
        """Return all call logs for persistence."""
        return self._call_logs
    
    def clear_logs(self):
        """Clear logs after persistence."""
        self._call_logs = []
