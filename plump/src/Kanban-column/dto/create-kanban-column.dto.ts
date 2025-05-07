import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreateKanbanColumnDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  projectID: number;
}
