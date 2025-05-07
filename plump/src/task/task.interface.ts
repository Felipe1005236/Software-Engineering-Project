export interface Task {
  taskID: number;
  projectID: number;
  dateID: number;
  title: string;
  percentageComplete: number;
  priority: string;
  userID: number;
  details: string;
  status: string;
}
