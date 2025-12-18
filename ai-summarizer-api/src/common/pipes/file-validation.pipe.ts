import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

interface FileValidationOptions {
  maxSizeInBytes?: number;
  allowedTypes?: string[];
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly options: FileValidationOptions) {}

  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (this.options.maxSizeInBytes) {
      if (file.size > this.options.maxSizeInBytes) {
        throw new BadRequestException(
          `File is too large. Maximum allowed size is ${this.options.maxSizeInBytes} Bytes`,
        );
      }
    }

    if (
      this.options.allowedTypes &&
      !this.options.allowedTypes.includes(file.mimetype)
    ) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.options.allowedTypes.join(', ')}`,
      );
    }

    return file;
  }
}
