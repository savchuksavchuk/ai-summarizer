import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { access, mkdir, readFile, unlink, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileStorageService {
  private readonly logger = new Logger(FileStorageService.name);
  private readonly uploadDir = join(process.cwd(), 'uploads');

  constructor() {
    this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists(): Promise<void> {
    try {
      await access(this.uploadDir);
    } catch {
      await mkdir(this.uploadDir, { recursive: true });
      this.logger.log(`Created upload directory: ${this.uploadDir}`);
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const fileExtension = extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = join(this.uploadDir, fileName);

    await writeFile(filePath, file.buffer);
    this.logger.log(`File saved: ${fileName}`);

    return fileName;
  }

  async readFile(fileName: string): Promise<Buffer> {
    const filePath = join(this.uploadDir, fileName);

    try {
      await access(filePath);
      const content = await readFile(filePath);
      this.logger.log(`File read: ${fileName}`);
      return content;
    } catch {
      this.logger.error(`File not found: ${fileName}`);
      throw new NotFoundException(`File not found: ${fileName}`);
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    const filePath = join(this.uploadDir, fileName);

    try {
      await access(filePath);
      await unlink(filePath);
      this.logger.log(`File deleted: ${fileName}`);
    } catch {
      this.logger.error(`File not found: ${fileName}`);
      throw new NotFoundException(`File not found: ${fileName}`);
    }
  }

  async getFilePath(fileName: string): Promise<string> {
    const filePath = join(this.uploadDir, fileName);

    try {
      await access(filePath);
      return filePath;
    } catch {
      throw new NotFoundException(`File not found: ${fileName}`);
    }
  }

  async fileExists(fileName: string): Promise<boolean> {
    const filePath = join(this.uploadDir, fileName);

    try {
      await access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
