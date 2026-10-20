# Build-time over runtime

We should utilize build-time methods sufficiently to avoid runtime exceptions as much as possible.

## Type safety

The entire codebase is strongly typed with strict linting. Make sure everything is strongly typed.

❌ Bad example

```tsx
const person = {
  name: 'David',
  age: 3,
}
```

✅ Good example

```tsx
interface Person {
  name: string
  age: number
}

const person: Person = {
  name: 'David',
  age: 3,
}
```
