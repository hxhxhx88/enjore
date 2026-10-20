# Next.js app

All Next.js apps will be deployed on [Vercel](https://vercel.com/). Each `*-next` folder in `apps` will have a corresponding project in Vercel.

- Create a new project in Vercel.
- Link the project to the GitHub repository.
- Specify the "Root Directory" as `apps/*-next`.
- Set the Node.js version to the major pinned in `.nvmrc` (Vercel also reads `engines.node` from the root `package.json`).
- Add the environment variable `ENABLE_EXPERIMENTAL_COREPACK=1` so Vercel installs the pnpm version pinned in `packageManager`.
  - Without it, Vercel infers pnpm from the lockfile and only maps to pnpm 10 or older, which cannot read this lockfile.
- Add all environment variables defined in `lib/env.ts` for the app and its dependent `@repo/*` packages.
  - **Use the pooling connection string** for `DATABASE_URL`.
- Confirm deployment.
- After a short wait, a functional deployment of `*-next` will be online.
- Check the first build log: it must print the pinned pnpm version and Node.js major.
