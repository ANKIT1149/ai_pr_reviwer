import { ESLint } from 'eslint';

export async function runESLint(file, octokit, owner, repo) {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: file.filename,
      ref: file.sha,
    });

    const fileContent = Buffer.from(data.content, 'base64').toString('utf-8');

    const eslint = new ESLint({
      useEslintrc: true,
    });
    const results = await eslint.lintText(fileContent, {
      filePath: file.filename,
    });

    return {
      results: results.map((r) => ({
        filePath: r.filePath,
        messages: r.messages.map((m) => ({
          ruleId: m.ruleId,
          severity: m.severity,
          message: m.message,
          line: m.line,
          column: m.column,
        })),
      })),
      fileContent,
    };
  } catch (err) {
    console.error('Error in running ESLint', err);
    return [];
  }
}
