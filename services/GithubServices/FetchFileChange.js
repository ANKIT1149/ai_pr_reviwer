import { getOctokitForInstallation } from "./AuthenticateRepo.js";


export async function fetchFileChange(owner, repo, pull_number, installationId) {
  if (owner === undefined || repo === undefined || pull_number === undefined) {
    console.log('Please provide all the details');
  }

  try {
    const octokit = getOctokitForInstallation(installationId);

    const response = await octokit.pulls.listFiles({
      owner,
      repo,
      pull_number,
    });

    return response.data.map((f) => ({
      filename: f.filename,
      status: f.status,
      additions: f.additions,
      deletions: f.deletions,
      changes: f.changes,
    }));
  } catch (error) {
    console.log('Error in Fetching file', error);
    throw error;
  }
}
