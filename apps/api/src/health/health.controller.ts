import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  health() {
    return {
      success: true,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'ai-video-growth-engine-api',
        version: process.env.APP_VERSION || '0.1.0',
      },
    };
  }

  @Get('ready')
  ready() {
    // TODO: Check DB and Redis connectivity
    return {
      success: true,
      data: {
        status: 'ready',
        checks: {
          database: 'not_configured',
          redis: 'not_configured',
          storage: 'not_configured',
        },
      },
    };
  }

  @Get('version')
  version() {
    return {
      success: true,
      data: {
        version: process.env.APP_VERSION || '0.1.0',
        environment: process.env.NODE_ENV || 'development',
        commit: process.env.GIT_COMMIT || 'unknown',
        buildTime: process.env.BUILD_TIME || 'unknown',
      },
    };
  }
}
