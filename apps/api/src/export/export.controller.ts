import { Controller, Post, Get, Param, Body } from '@nestjs/common';

@Controller('exports')
export class ExportController {
  @Post()
  async create(@Body() body: { taskId: string; format?: string; idempotencyKey?: string }) {
    // TODO: Verify risk passed + AIGC labeled, then create export job
    return { success: true, data: { id: 'placeholder', status: 'PENDING' } };
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return { success: true, data: { id, status: 'PENDING', downloadUrl: null } };
  }
}
