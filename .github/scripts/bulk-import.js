import { Octokit } from "@octokit/rest";
import parse from "csv-parse/lib/sync.js";
import fs from "fs";
import 'dotenv/config';

// Initialize Github Client using a Personal Access Token (PAT)
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const REPO_OWNER = "your-org-or-username";
const REPO_NAME = "your-asset-repo";
const PROJECT_ID = "PVT_kwDOA12345"; // Target GitHub Project Node ID

async function importAssets() {
  const fileContent = fs.readFileSync("assets.csv", "utf-8");
  const records = parse(fileContent, { columns: true, skip_empty_lines: true });

  for (const asset of records) {
    console.log(`Processing asset: ${asset.asset_tag}...`);

    const issueTitle = `[${asset.asset_tag}] - ${asset.vendor} ${asset.model}`;
    const issueBody = `### 🖥️ Asset Profile: ${asset.asset_tag}\n- **Vendor:** ${asset.vendor}\n- **Model:** ${asset.model}\n- **Initial Location:** ${asset.location}`;

    try {
      // 1. Create the base Repository Issue tracking the asset
      const { data: issue } = await octokit.rest.issues.create({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        title: issueTitle,
        body: issueBody,
        labels: [`vendor:${asset.vendor.toLowerCase()}`, "type:hardware"]
      });

      // 2. Attach the created Issue to the designated GitHub Project board via GraphQL
      const addToProjectMutation = `
        mutation($projectId: ID!, $contentId: ID!) {
          addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
            item { id }
          }
        }
      `;
      
      const projectItemResult = await octokit.graphql(addToProjectMutation, {
        projectId: PROJECT_ID,
        contentId: issue.node_id
      });
      
      const projectItemId = projectItemResult.addProjectV2ItemById.item.id;
      console.log(`Successfully added asset ${asset.asset_tag} to Project. Item ID: ${projectItemId}`);
      
      // Note: You can expand this step by writing additional GraphQL mutations 
      // to populate the 'IP Address' and 'RAM (GB)' project columns directly.

    } catch (error) {
      console.error(`Failed to import asset ${asset.asset_tag}:`, error.message);
    }
  }
}

importAssets();
