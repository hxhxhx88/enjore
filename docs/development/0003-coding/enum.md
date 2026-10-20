# Enum

When defining a fixed list of possible values, use the following pattern:

```ts
import { z } from 'zod'

export const values = ['value1', 'value2', 'value3'] as const
export const valueSchema = z.enum(values)
export type Value = (typeof values)[number]
```

Use the `values` array to enumerate options, for example in a select component:

```tsx
<SelectContent>
  {values.map((value) => {
    return (
      <SelectItem key={value} value={value}>
        {value}
      </SelectItem>
    )
  })}
</SelectContent>
```

Use the `valueSchema` Zod schema for validation:

```tsx
const { value: rawValue } = await db.user.findUniqueOrThrow({ where: { id } })
const value = valueSchema.parse(rawValue)
```

Use the `Value` type for type safety, such as in function definitions:

```tsx
function check(value: Value): boolean {
  // ...
}
```
