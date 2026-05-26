import { Controller, Get, Param } from '@nestjs/common';

@Controller('tasks/:taskId')
export class ReportController {
  @Get('report')
  async getReport(@Param('taskId') taskId: string) {
    // TODO: Return analysis report (Content DNA + metadata)
    return { success: true, data: { taskId, report: null } };
  }

  @Get('deliverables')
  async getDeliverables(@Param('taskId') taskId: string) {
    // TODO: Return deliverable pack (scripts, titles, covers, prompts)
    return { success: true, data: { taskId, deliverables: null } };
  }
}
