export type AiTaskType = 
  | 'quick_extraction' 
  | 'chat_fast' 
  | 'weekly_review' 
  | 'deep_reasoning' 
  | 'quick_capture';

export interface ModelRouteConfig {
  model: string;
  maxTokens: number;
  temperature: number;
}

export const modelRouter = {
  getRoute(task: AiTaskType): ModelRouteConfig {
    const defaultModel = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
    const reasoningModel = process.env.GEMINI_REASONING_MODEL || 'gemini-3.1-flash-lite';

    switch (task) {
      case 'quick_extraction':
        return {
          model: defaultModel,
          maxTokens: 250,
          temperature: 0.2
        };
      case 'quick_capture':
        return {
          model: defaultModel,
          maxTokens: 300,
          temperature: 0.3
        };
      case 'chat_fast':
        return {
          model: defaultModel,
          maxTokens: 450,
          temperature: 0.6
        };
      case 'weekly_review':
        return {
          model: reasoningModel,
          maxTokens: 600,
          temperature: 0.5
        };
      case 'deep_reasoning':
        return {
          model: reasoningModel,
          maxTokens: 800,
          temperature: 0.4
        };
      default:
        return {
          model: defaultModel,
          maxTokens: 400,
          temperature: 0.5
        };
    }
  }
};
