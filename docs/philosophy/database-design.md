# Ensure consistency through database schema design

The database schema is the starting point of everything. It defines the space of **allowed states in code**, which may not exactly match the space of **allowed states in the business**. The goal is to design the schema so that these two spaces overlap as much as possible.

Let's take an example. Suppose we are building an e-commerce website with two product types: **books** and **videos**. Each book must have a title, a publisher, and an ISBN. Each video must have a title, a duration, and a playback URL.

A naive schema might look like this:

```prisma
model Product {
  // ... other fields

  type      String   // "video" or "book"
  title     String
  isbn      String?
  publisher String?
  duration  Int?
  url       String?
}
```

- `type` distinguishes books from videos.
- `title` can be mandatory because both types require it.
- However, `isbn`, `publisher`, `duration`, and `url` must all be optional because each is relevant to only one product type.

This design immediately opens the door to **inconsistent records** — states the database allows but the business does not:

| type  | title | isbn | publisher | duration | url | Problem                                     |
| ----- | ----- | ---- | --------- | -------- | --- | ------------------------------------------- |
| book  | xxx   | 123  |           |          |     | Missing `publisher`                         |
| book  | xxx   | 123  | Oxford    | 123      |     | Unexpected `duration` on a book             |
| video | xxx   | 123  | Oxford    |          |     | Has book attributes but no video attributes |

A better approach is to **separate type-specific attributes into their own tables**:

```prisma
model Product {
  // ... other fields

  type    String   // "video" or "book"
  title   String

  // Exactly one of the following IDs should be present.
  bookId  String?
  videoId String?
}

model ProductBook {
  // ... other fields

  isbn      String
  publisher String
}

model ProductVideo {
  // ... other fields

  duration Int
  url      String
}
```

Each attribute table can now enforce its own mandatory fields correctly. However, inconsistency is still possible through the `type` field and the foreign keys:

| type  | bookId | videoId | Problem                                  |
| ----- | ------ | ------- | ---------------------------------------- |
| book  |        | xxx     | `type` says book, but ID points to video |
| video | xxx    |         | `type` says video, but ID points to book |
| book  | xxx    | yyy     | Multiple IDs — ambiguous type            |
| video |        |         | No ID at all                             |

To close the gap further:

1. **Remove `type`** — infer the product type from the presence of `bookId` or `videoId`.
2. **Define a precedence order** — if more than one ID is unexpectedly present, treat the first non-null field (in definition order) as authoritative.
3. **Accept one runtime invariant** — all ID fields being null is a runtime error that cannot be prevented at the schema level.

The refined schema:

```prisma
model Product {
  // ... other fields

  title   String

  // Exactly one of the following IDs should be present.
  // The presence of an ID determines the product type.
  // If multiple IDs are non-null, the first in definition order takes precedence.
  // All IDs being null is a runtime error.
  bookId  String?
  videoId String?
}

model ProductBook {
  // ... other fields

  isbn      String
  publisher String
}

model ProductVideo {
  // ... other fields

  duration Int
  url      String
}
```

This is the best we can achieve at the schema level. The remaining edge case (all IDs being null) must be caught at runtime.
