# Claude connector

The admin's tool endpoint, `/api/mcp` on the admin host, speaks the Model Context Protocol and is reached by Claude through a custom connector on the owner's claude.ai account. The connector carries the endpoint's URL and the runner secret as a fixed request header, so no repository is cloned and no cloud environment is configured for a run. Static request headers on custom connectors are a beta that the owner's account has; should it disappear, the fallback is an OAuth server in the admin, as claude.com's "Authentication for connectors" page describes.

## Create the connector

- Generate the secret with `openssl rand -base64 32`, set it as `RUNNER_SECRET_CLAUDE` in the admin's Vercel project and deploy. The admin does not start without it.
- Check the endpoint from a public network: `curl -sI https://<admin host>/api/mcp` answers 405, because only `POST` exists, and must not answer with a redirect, because a redirect to another host drops the `Authorization` header; a `POST` without a token answers 401 with `WWW-Authenticate: Bearer`.
- In claude.ai go to **Customize > Connectors** and click **Add custom connector**. Name it "Enjore admin", enter `https://<admin host>/api/mcp` as the MCP server URL and continue.
- Under **Authentication** choose **No sign-in**. The detection step may say the server requires sign-in, because its unauthenticated probe gets 401; choose **No sign-in** anyway.
- Under **Request headers** add the header `authorization` with the value `Bearer <RUNNER_SECRET_CLAUDE>`: one space after `Bearer` and nothing after the secret, since any other shape gets 401. Mark it **Required** and click **Add**.
- The connector shows **Connected** under **Your connectors**, and its page lists the endpoint's tools under **Tool permissions**.

## Tool permissions

- Unattended runs cannot answer approval prompts. On the connector's page set the job tools to **Always allow**; until milestone 0005 that is `claim-job` alone, afterwards every tool the endpoint registers.
- Every new scheduled task includes all connected connectors by default. Remove this connector from tasks that do not need it, and remove other connectors from the admin's tasks.

## Scheduled task

- At claude.ai/code/routines create a task without a repository and keep only this connector on it.
- Save the generic runner prompt: claim a job, follow the returned instructions, submit through the tools, and repeat until `claim-job` answers `{ "job": null }` or the per-run limit is reached. From milestone 0005 the prompt lives in `packages/lib/src/runner-prompt.ts`.
- Schedule it hourly and add an API trigger; the trigger is what "Run now" fires.

## Where the connector is used

- Chats on claude.ai, the desktop and mobile apps: turn the connector on under **+ > Connectors** in the conversation.
- Scheduled tasks at claude.ai/code/routines: create the task without a repository and keep only this connector on it. A task with an API trigger runs as a Claude Code cloud session; a task with a schedule only runs in claude.ai chat.
- Claude Code in the terminal and in cloud sessions: the connector appears in `/mcp` whenever the CLI is signed in with the claude.ai account. No `.mcp.json` is needed.

## Rotate the secret

- Generate a new value, set `RUNNER_SECRET_CLAUDE` in Vercel and redeploy; the old connector now gets 401.
- A connector's authentication settings cannot be edited. Remove the connector and add it again with the new header value, then set the tool permissions again.

## "Run now"

- The admin's "Run now" button, delivered by milestone 0005, fires the scheduled task through its API trigger: `POST https://api.anthropic.com/v1/claude_code/routines/<task id>/fire` with the task's own bearer token and the headers `anthropic-beta: experimental-cc-routine-2026-04-01` and `anthropic-version: 2023-06-01`. The response carries the session URL. Each task allows 30 fires per hour.
- The task's fire URL and token go into the admin's environment as `CLOUD_TASK_TRIGGER_URL` and `CLOUD_TASK_TRIGGER_SECRET`, mandatory from milestone 0005 like every other variable; the token is shown once when generated in the task's edit dialog.

## Verify a run

- The run's transcript shows a tool call on the connector returning the endpoint's answer; a green status alone does not prove the work happened.
- Vercel's logs filtered by `/api/mcp` show `POST` requests with status 200 at the time of the run.
