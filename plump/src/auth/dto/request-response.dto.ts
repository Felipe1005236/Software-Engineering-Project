import { IsEnum } from 'class-validator';
import { RequestStatus } from '@prisma/client';

export class RequestResponseDto {
  @IsEnum(RequestStatus)
  status: RequestStatus;
} 