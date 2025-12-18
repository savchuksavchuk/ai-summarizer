import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/common/pipes/file-validation.pipe';
import { SummaryService } from './summary.service';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summarizerService: SummaryService) {}

  @Post('summarize')
  @UseInterceptors(FileInterceptor('file'))
  async summarize(
    @UploadedFile(
      new FileValidationPipe({
        maxSizeInBytes: 50 * 1024 * 1024,
        allowedTypes: ['application/pdf'],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.summarizerService.summarizeFile(file);
  }
}
