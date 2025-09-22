import { getOctokitForInstallation } from "../GithubServices/AuthenticateRepo.js";

export async function postComment({owner, repo, pull_number, body, installationId}) {
    if (!owner || !repo || !pull_number || !body) {
        console.log('All parameters are required to post a comment');
        return;
    }
    
    try {
        const octokit = getOctokitForInstallation(installationId);
        
        const response = await octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number: pull_number, 
            body
        })

        console.log('Comment posted:', response.data.html_url);
        return response.data;
    } catch (error) {
        console.log('Error posting comment:', error);
        throw error;
    }
}