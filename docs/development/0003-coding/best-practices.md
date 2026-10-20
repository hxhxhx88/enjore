# Best practices

## Async operations

- **Rule:** Use `Promise.all` when awaiting multiple independent promises.
- **Bad:**
  ```ts
  await a()
  await b()
  ```
- **Good:**
  ```ts
  await Promise.all([a(), b()])
  ```

## Destructuring

- **Rule:** Prefer object destructuring.
- **Bad:**
  ```ts
  const name = user.name
  ```
- **Good:**
  ```ts
  const { name } = user
  ```

## Concise local variable names

- **Rule:** Local variables can have concise names to shorten the code. Try to not break lines.
- **Bad:**
  ```ts
  const existingSession = await db.session.findUnique({ /* ... */ })
  const isSessionInvalid = !existingSession
    || existingSession.userId !== userId
    || existingSession.expiresAt < new Date()
  if (isSessionInvalid) {
    return { type: 'bad', message: 'Invalid session' }
  }
  ```
- **Good:** rename `existingSession` and `isSessionInvalid` to `sess` and `isInvalid`
  ```ts
  const sess = await db.session.findUnique({ /* ... */ })
  const isInvalid = !sess || sess.userId !== userId || sess.expiresAt < new Date()
  if (isInvalid) {
    return { type: 'bad', message: 'Invalid session' }
  }
  ```
