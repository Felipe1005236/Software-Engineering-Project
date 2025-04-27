import { Injectable, NotFoundException } from '@nestjs/common';
import { DateRecord } from './date-record.interface';

@Injectable()
export class DateDetailService {
  private records: DateRecord[] = [];
  private nextId = 1;

  getAll(): DateRecord[] {
    return this.records;
  }

  getOne(id: number): DateRecord {
    const record = this.records.find(r => r.id === id);
    if (!record) throw new NotFoundException('Date record not found');
    return record;
  }

  create(name: string, date: string): DateRecord {
    const newRecord: DateRecord = {
      id: this.nextId++,
      name,
      date,
    };
    this.records.push(newRecord);
    return newRecord;
  }

  update(id: number, updates: Partial<DateRecord>): DateRecord {
    const record = this.getOne(id);
    Object.assign(record, updates);
    return record;
  }

  delete(id: number) {
    const index = this.records.findIndex(r => r.id === id);
    if (index === -1) throw new NotFoundException('Record not found');
    this.records.splice(index, 1);
  }
}
