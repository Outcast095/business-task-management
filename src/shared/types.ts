
// для фронта 
export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

// для бекэнда 
export interface ITask extends Task {
  created_at: Date;
}