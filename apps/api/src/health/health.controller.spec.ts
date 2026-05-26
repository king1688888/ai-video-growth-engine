import { describe, it, expect } from 'vitest';
import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should return health status', () => {
    const result = controller.health();
    expect(result.success).toBe(true);
    expect(result.data.status).toBe('ok');
    expect(result.data.service).toBe('ai-video-growth-engine-api');
  });

  it('should return version info', () => {
    const result = controller.version();
    expect(result.success).toBe(true);
    expect(result.data.version).toBeDefined();
  });

  it('should return ready status', () => {
    const result = controller.ready();
    expect(result.success).toBe(true);
    expect(result.data.status).toBe('ready');
  });
});
