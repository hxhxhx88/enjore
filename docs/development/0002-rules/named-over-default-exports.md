# Prefer named export to default export

Whenever possible, use **named exports** instead of default exports.

✅

```tsx
function MyComponent(): JSX.Element { /* ... */ }
export { MyComponent }
```

❌

```tsx
function MyComponent(): JSX.Element { /* ... */ }
export default MyComponent
```

✅

```tsx
class MyPage { /* ... */ }
export const page = new Page()
```

❌

```tsx
class MyPage { /* ... */ }
export default new Page()
```
