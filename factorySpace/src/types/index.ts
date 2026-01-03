export interface Event {
  id: string;
  timestamp: string;
  type: 'system' | 'user' | 'error' | 'success';
  message: string;
}

export interface TaskFormData {
  preset: string;
  targetObject: string;
  taskDescription: string;
  expectedOutcome: string;
  exceptionScenarios: string;
}

export type ExecutionStatus = 'idle' | 'running' | 'paused' | 'stopped';

export type PlanViewMode = 'json' | 'text';

export interface RobotPlan {
  preExecutionChecks?: string[];
  steps?: Array<{
    step: number;
    action: string;
    description: string;
  }>;
  safetyConsiderations?: string[];
  errorHandling?: string[];
  successCriteria?: string[];
  [key: string]: any;
}

