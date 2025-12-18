import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiSummaryService {
  private readonly logger = new Logger(AiSummaryService.name);
  private readonly openai: OpenAI;
  private readonly maxTokensPerPage = 200;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.getOrThrow<string>('OPENAI_API_KEY'),
    });
  }

  async summarizePageText(text: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4.1',
        messages: [
          {
            role: 'user',
            content: `Summarize the following text:\n\n${text}`,
          },
        ],
        max_completion_tokens: this.maxTokensPerPage,
      });

      return response.choices[0].message?.content?.trim() ?? '';
    } catch (error) {
      this.logger.error('OpenAI summary failed', error as any);
      throw error;
    }
  }

  async summarizeFileText(text: string, pagesCount: number): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4.1',
        messages: [
          {
            role: 'user',
            content: `Provide a concise summary for the following document text:\n\n${text}`,
          },
        ],
        max_completion_tokens: pagesCount * this.maxTokensPerPage,
      });

      return response.choices[0].message?.content?.trim() ?? '';
    } catch (error) {
      this.logger.error('OpenAI file summary failed', error as any);
      throw error;
    }
  }
}
