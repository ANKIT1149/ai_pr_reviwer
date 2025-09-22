import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { APP_ID, PRIVATE_KEY } from "../../config.js";

export function getOctokitForInstallation(installationId) {
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: APP_ID,
      privateKey: PRIVATE_KEY,
      installationId
    }
  });
}