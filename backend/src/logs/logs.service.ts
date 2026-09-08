import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

@Injectable()
export class LogsService {
  private readonly logsDir = process.env.VERCEL ? path.join(os.tmpdir(), 'logs') : path.join(process.cwd(), 'logs');

  getLogFiles(): string[] {
    if (!fs.existsSync(this.logsDir)) {
      return [];
    }
    
    return fs.readdirSync(this.logsDir)
      .filter(file => file.endsWith('.log'))
      .sort((a, b) => b.localeCompare(a)); // Newest first
  }

  getLogContent(filename: string): string {
    const filePath = path.join(this.logsDir, filename);
    
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`Log file ${filename} not found`);
    }
    
    // Security check to prevent directory traversal
    if (!filePath.startsWith(this.logsDir)) {
      throw new NotFoundException(`Invalid file path`);
    }

    return fs.readFileSync(filePath, 'utf8');
  }
}
