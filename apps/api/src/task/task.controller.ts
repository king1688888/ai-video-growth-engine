import { Controller, Post, Get, Param, Body, Query } from '@nestjs/common';

@Controller('tasks')
export class TaskController {
  @Post()
  async create(@Body() body: { sourceAssetId: string; profileId: string; idempotencyKey?: string }) {
    // TODO: Validate consent, estimate credits, hold credits, create task, enqueue
    return { success: true, data: { id: 'placeholder', status: 'CREATED' } };
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return { success: true, data: { id, status: 'CREATED', progress: 0 } };
  }

  @Get(':id/progress')
  async progress(@Param('id') id: string) {
    // TODO: Return step-by-step progress
    return { success: true, data: { taskId: id, steps: [], progress: 0 } };
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string) {
    // TODO: Cancel task, release credits
    return { success: true, data: { id, status: 'CANCELED' } };
  }

  @Get()
  async list(@Query('cursor') cursor?: string, @Query('limit') limit?: string) {
    return { success: true, data: [], meta: { next_cursor: null } };
  }
}
