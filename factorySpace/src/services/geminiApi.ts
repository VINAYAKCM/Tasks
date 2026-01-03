export interface GeminiRequest {
  preset: string;
  targetObject: string;
  taskDescription: string;
  expectedOutcome: string;
  exceptionScenarios: string;
}

export interface GeminiResponse {
  plan: RobotPlan;
  text: string;
}

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

export async function generateRobotPlan(data: GeminiRequest): Promise<GeminiResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.REACT_APP_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY or REACT_APP_GEMINI_API_KEY environment variable.');
  }

  const prompt = `You are an AI assistant helping to create a robotic task execution plan.
Task Details:
- Preset: ${data.preset}
- Target Object: ${data.targetObject}
- Task Description: ${data.taskDescription}
- Expected Outcome: ${data.expectedOutcome}
- Exception Scenarios: ${data.exceptionScenarios}

Generate a concise, medium-sized step-by-step plan for a robot to learn and execute this skill. Keep the response brief and focused. Include:
1. Pre-execution checks (limit to 3-5 items)
2. Sequential steps with precise actions (limit to 5-8 steps)
3. Safety considerations (limit to 3-4 items)
4. Error handling procedures (limit to 2-3 items)
5. Success criteria (limit to 2-3 items)

IMPORTANT: Keep descriptions brief (1-2 sentences max per item). Provide the response in a structured JSON format that can be executed by a robot control system. Return a JSON object with the following structure:
{
  "preExecutionChecks": ["brief check1", "brief check2"],
  "steps": [
    {"step": 1, "action": "action name", "description": "brief description"},
    ...
  ],
  "safetyConsiderations": ["brief consideration1"],
  "errorHandling": ["brief procedure1"],
  "successCriteria": ["brief criterion1"]
}`;

  try {
    // According to official Gemini API docs: https://ai.google.dev/gemini-api/docs/quickstart
    // Use v1beta API version and pass API key as header
    const modelsToTry = [
      { name: 'gemini-2.5-flash', version: 'v1beta' }, // Latest model from official docs
      { name: 'gemini-1.5-flash', version: 'v1beta' },
      { name: 'gemini-1.5-pro', version: 'v1beta' },
    ];

    let lastError: Error | null = null;

    for (const model of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/${model.version}/models/${model.name}:generateContent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey, // API key as header per official docs
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt,
                    },
                  ],
                },
              ],
              generationConfig: {
                maxOutputTokens: 1500, // Limit response to medium size (~1500 tokens)
                temperature: 0.7, // Balanced creativity and consistency
              },
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error?.message || `API request failed with status ${response.status}`;
          lastError = new Error(errorMessage);
          // Try next model if this one fails
          continue;
        }

        // Success - process the response
        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Try to extract JSON from the response
        let plan: RobotPlan = {};
        try {
          // Look for JSON in the response
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            plan = JSON.parse(jsonMatch[0]);
          } else {
            // If no JSON found, create a structured plan from text
            plan = {
              rawText: text,
            };
          }
        } catch (parseError) {
          // If parsing fails, use the raw text
          plan = {
            rawText: text,
          };
        }

        return {
          plan,
          text,
        };
      } catch (error) {
        // Continue to next model
        if (error instanceof Error) {
          lastError = error;
        }
        continue;
      }
    }

    // If all models failed, throw the last error
    if (lastError) {
      throw lastError;
    }
    throw new Error('Failed to generate robot plan: All model attempts failed');

  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate robot plan');
  }
}

