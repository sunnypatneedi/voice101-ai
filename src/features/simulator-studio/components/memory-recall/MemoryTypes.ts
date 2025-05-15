
export interface MemoryResult {
  query: string;
  expectedAnswer: string | null;
  actualAnswer: string | null;
  accuracy: number;
  responseTime: number;
}
