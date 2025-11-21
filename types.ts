export interface UserSelections {
  taskType: string;
  taskTypeOther: string;
  depth: string[];
  context: string;
  examples: string; // Existing input examples
  role: string;
  roleOther: string;
  // New fields
  additionalResources: string;
  additionalResourcesOther: string;
  citationStyle: string;
  specificExamples: string; // New specific examples request
  // End new fields
  audience: string;
  audienceOther: string;
  format: string;
}

export type AppStage = 'INPUT' | 'REVIEW' | 'RESULT';

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  generatedPrompt: string;
  finalResult: string;
}

export interface SavedConfig {
  id: string;
  name: string;
  createdAt: number;
  selections: UserSelections;
}