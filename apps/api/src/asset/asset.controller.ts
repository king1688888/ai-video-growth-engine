import { Controller, Post, Get, Param, Body } from '@nestjs/common';

@Controller('assets')
export class AssetController {
  @Post('upload-url')
  async getUploadUrl(@Body() body: { fileName: string; mimeType: string; sizeBytes: number }) {
    // TODO: Validate mime/size, generate S3 presigned URL, create Asset record
    return { success: true, data: { assetId: 'placeholder', uploadUrl: 'placeholder', expiresIn: 3600 } };
  }

  @Post('confirm')
  async confirmUpload(@Body() body: { assetId: string }) {
    // TODO: Verify file exists in S3, update status to UPLOADED
    return { success: true, data: { assetId: body.assetId, status: 'UPLOADED' } };
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return { success: true, data: { id, status: 'AVAILABLE' } };
  }
}
