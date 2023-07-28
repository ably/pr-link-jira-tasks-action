const core = require("@actions/core");
const github = require("@actions/github");
const { run } = require("./index");

describe("Pull Request Validation", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Pipeline fails when PR closes a github issue but does not mention Jira task", async () => {
    const prPayload = { title: "Test PR", body: "Closes #111 Test Body" };
    github.context.payload.pull_request = prPayload;

    const setFailedMock = jest.spyOn(core, "setFailed");
    await run();
    expect(setFailedMock).toHaveBeenCalledWith(
      "The pull request needs to mention in the title or body the Jira task that it is linked to."
    );
  });

  test("Pipeline passes when PR closes a github issue and mentions Jira task in title", async () => {
    const prPayload = {
      title: "Test PR [ABC-123]",
      body: "Closes #111 Test Body",
    };
    github.context.payload.pull_request = prPayload;

    const setFailedMock = jest.spyOn(core, "setFailed");
    await run();
    expect(setFailedMock).not.toHaveBeenCalled();
  });

  test("Pipeline passes when PR closes a github issue and mentions Jira task in body", async () => {
    const prPayload = {
      title: "Test PR",
      body: "Closes #111 Test Body [ABC-123]",
    };
    github.context.payload.pull_request = prPayload;

    const setFailedMock = jest.spyOn(core, "setFailed");
    await run();
    expect(setFailedMock).not.toHaveBeenCalled();
  });

  test("Pipeline passes when PR closes a github issue and mentions Jira task in both title and body", async () => {
    const prPayload = {
      title: "Test PR [ABC-123]",
      body: "Closes #111 Test Body [ABC-123]",
    };
    github.context.payload.pull_request = prPayload;

    const setFailedMock = jest.spyOn(core, "setFailed");
    await run();
    expect(setFailedMock).not.toHaveBeenCalled();
  });

  test("Pipeline passes when PR is not closing a github issue", async () => {
    const prPayload = {
      title: "Test PR",
      body: "Test Body",
    };
    github.context.payload.pull_request = prPayload;

    const setFailedMock = jest.spyOn(core, "setFailed");
    await run();
    expect(setFailedMock).not.toHaveBeenCalled();
  });
});
