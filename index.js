const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const token = core.getInput("github-token", { required: true });
    const octokit = github.getOctokit(token);

    // Get the pull request information from the event payload
    const prPayload = github.context.payload.pull_request;

    if (!prPayload) {
      core.setFailed(
        "This action is meant to be triggered on pull_request events."
      );
      return;
    }

    const prTitle = prPayload.title;
    const prBody = prPayload.body;
    const isClosingIssue = prPayload.body.match(/closes #\d+/i);

    if (isClosingIssue) {
      // Regular expression to match Jira task pattern
      const jiraTaskPattern = /[A-Z]{2,}-\d+/g;
      const titleHasJiraTask = jiraTaskPattern.test(prTitle);
      const bodyHasJiraTask = jiraTaskPattern.test(prBody);
      const jiraTaskInTitleOrBody = titleHasJiraTask || bodyHasJiraTask;

      if (!jiraTaskInTitleOrBody) {
        // Mark the pipeline as failed
        await octokit.rest.checks.create({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          name: "Jira Task Check",
          head_sha: prPayload.head.sha,
          conclusion: "failure",
          output: {
            title: "Jira task is not mentioned",
            summary:
              "The pull request needs to mention in the title or body the Jira task that it is linked to.",
          },
        });
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

module.exports = { run };
