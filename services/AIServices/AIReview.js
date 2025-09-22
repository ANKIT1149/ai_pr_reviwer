import fs from 'fs';
import { openai } from '../../openai/AiConfig.js';

export async function AIReview(filePath, eslintResult, fileContent) {
  if (!filePath || !eslintResult || !fileContent) {
    console.log('File path and ESLint result are required');
    return;
  }
  try {
    const prompt = `
You are an AI code reviewer. 
The developer submitted the following file: ${filePath}.
Lint results: ${JSON.stringify(eslintResult, null, 2)}.

Here is the code:
---
${fileContent}
---

Give a structured review:
1. Major issues (bugs, vulnerabilities)
2. Code style issues
3. Performance improvements
4. Security risks
5. Suggestions for better readability & maintainability
6. Final verdict (Good / Needs improvement)
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.log('Error in AI Review', error);
    throw error;
  }
}
