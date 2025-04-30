export class GanttResponseDto {
    tasks: {
      id: number;
      name: string;
      start: Date;
      end: Date;
      progress: number;
      dependencies: number[];
    }[];
  }