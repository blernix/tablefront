import { ApiClient } from './base';
import {
  DayBlock,
  CreateDayBlockInput,
  BulkCreateDayBlocksInput,
} from '@/types';

export class DayBlocksApi extends ApiClient {
  async getDayBlocks(): Promise<{ dayBlocks: DayBlock[] }> {
    return this.request('/api/day-blocks');
  }

  async checkDayBlock(date: string): Promise<{
    isBlocked: boolean;
    dayBlock: DayBlock | null;
  }> {
    return this.request(`/api/day-blocks/check/${date}`);
  }

  async createDayBlock(data: CreateDayBlockInput): Promise<{ dayBlock: DayBlock }> {
    return this.request('/api/day-blocks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async bulkCreateDayBlocks(data: BulkCreateDayBlocksInput): Promise<{
    message: string;
    dayBlocks: DayBlock[];
    errors?: Array<{ date: string; reason: string }>;
  }> {
    return this.request('/api/day-blocks/bulk', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteDayBlock(id: string): Promise<{ message: string }> {
    return this.request(`/api/day-blocks/${id}`, {
      method: 'DELETE',
    });
  }
}
