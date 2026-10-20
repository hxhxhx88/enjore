# Workflows

You can find all workflow tasks and related commands in `taskfile.yaml` and `tasks/*`. To list all tasks, run:

```bash
task --list-all
```

If your command requires environment variables, make sure to run it using `task ...` rather than running the command directly, as `task` loads `.env.local` automatically.

- For example, instead of running `pnpm ...`, run `task pnpm -- ...`.

## Workflow topics

- `development.md`: baseline local quality loop.
- `dependency-installation.md`: package and UI dependency installation.
- `database.md`: schema changes and migrations.
- `i18n.md`: translation extraction and completion workflow.
