const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
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
    const githubKeywordRegex =
      /\b(?:Close|Closes|Closed|Fix|Fixes|Fixed|Resolve|Resolves|Resolved)\s+#\d+\b/gi;
    const isClosingIssue = prPayload.body.match(githubKeywordRegex);

    if (isClosingIssue) {
      // Regular expression to match Jira task pattern
      const jiraTaskPattern = /[A-Z]{2,}-\d+/g;
      const titleHasJiraTask = jiraTaskPattern.test(prTitle);
      const bodyHasJiraTask = jiraTaskPattern.test(prBody);
      const jiraTaskInTitleOrBody = titleHasJiraTask || bodyHasJiraTask;

      if (!jiraTaskInTitleOrBody) {
        // Mark the pipeline as failed
        core.setFailed(
          "The pull request needs to mention in the title or body the Jira task that it is linked to."
        );
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

module.exports = { run };
