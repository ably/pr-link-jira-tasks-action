# PR Jira Task Check Action

A simple Github Action that checks if a PR which is closing a Github issue mentions a Jira task.

## Example

```yml
name: Jira Task Check

on:
  pull_request:
    types:
      - opened
      - reopened
      - edited
      - synchronize

jobs:
  check_jira_task:
    runs-on: ubuntu-latest

    steps:
      - name: Check out code
        uses: actions/checkout@v2

      - name: Run Jira Task Check
        uses: ably/pr-link-jira-tasks-action@v1.0.4
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```
