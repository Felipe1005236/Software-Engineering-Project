export interface Task {
  taskID: number;
  projectID: number;
  title: string;
  percentageComplete: number;
  priority: string;
  userID: number;
  details: string;
  status: string;
  startDate: Date;
  targetDate: Date;
  actualCompletion?: Date;
}
