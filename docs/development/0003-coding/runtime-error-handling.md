# Runtime error handling

Distinguish between two types of runtime errors:

- **Internal exceptions**: Unexpected events due to implementation issues where the caller cannot take action.
  - e.g. The database fails to connect.
  - Corresponds to HTTP status code `500`.
- **Bad requests**: Expected errors caused by invalid input which the caller can correct.
  - e.g. The user provides the wrong password.
  - Corresponds to HTTP status code `400`.

## Handling strategy

Adopt the following rules for handling these errors:

- **Internal exceptions**: **Do not handle manually**. Allow the error to propagate (crash). Rely on the monitoring system to alert the team for a fix.
- **Bad requests**: Catch these errors and return a user-friendly response, clearly indicating how the user can correct the issue.

### Example: Internal server action

```ts
'use server'

async function readUser(id: string): Promise<User> {
  // Use `findUniqueOrThrow` since this is an internal server action
  // and is **expected** to be given an existing user ID.
  // If the user is not found, it is unexpected behavior and should
  // crash the process to trigger an alert in the monitoring system.
  const user = await db.user.findUniqueOrThrow({
    where: { id }
  })
}
```

### Example: Handling user input

```ts
'use server'

// ...

export async function editUser(input: Input): Promise<Output> {
  const { userId, formData: { email } } = input

  try {
    await db.user.update({
      where: { id: userId },
      data: { email },
    })
    return { type: 'ok' }
  }
  catch (e) {
    // If the database error is due to an email conflict, return a clear message to the user.
    const emailExists = isEmailExistsError(e)
    if (emailExists) {
      return { type: 'bad', message: 'Email already used' }
    }

    // Throw the error if it is not an expected validation error.
    throw e
  }
}
```
