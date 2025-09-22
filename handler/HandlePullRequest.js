import { AIReview } from '../services/AIServices/AIReview.js';
import { getOctokitForInstallation } from '../services/GithubServices/AuthenticateRepo.js';
import { fetchFileChange } from '../services/GithubServices/FetchFileChange.js';
import { runESLint } from '../services/LintServices/ESLintService.js';
import { postComment } from '../services/PostCommentService/PostCommentService.js';

export const handlePullRequest = async ({ id, name, payload }) => {
  if (payload.action === 'opened' || payload.action === 'synchronize') {
    console.log(
      `Received event ${name} with id ${id}`,
      payload.pull_request.html_url
    );

    const owner = payload.repository.owner.login;
    const repo = payload.repository.name;
    const pull_number = payload.number;
    const installation = payload.installation;

    console.log(owner, repo, pull_number, installation);
    if (!installation || !installation.id) {
      console.log('No installation ID found for this PR. Skipping...');
      return;
    }

    const installationId = installation.id;

    const octokit = getOctokitForInstallation(installationId);
    console.log(
      '🔑 Authenticated with GitHub App installation ID:',
      installationId
    );

    const files = await fetchFileChange(
      owner,
      repo,
      pull_number,
      installationId
    );
    console.log('📂 Changed files in PR:', files);

    for (const file of files) {
      let lintResults = null;
      let fileContent = null;

      if (file.filename.endsWith('.js') || file.filename.endsWith('.ts')) {
        lintResults = await runESLint(file, octokit, owner, repo);
        fileContent = lintResults.fileContent;
        console.log('ESLint Results:', lintResults);
      }

      const aireview = await AIReview(file.filename, lintResults, fileContent);

      await postComment({
        owner,
        repo,
        pull_number,
        body: `### AI Review for \`${file.filename}\`\n\n${aireview}`,
        installationId,
      });
      console.log(`🤖 AI Review for ${file.filename}:`);
      console.log(aireview);
    }
  }
};
