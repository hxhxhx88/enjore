# Modal

A modal is anything that overlays the current UI to present some information or request some action. Examples are:

- A [dialog](https://ui.shadcn.com/docs/components/base/dialog).
- A [sheet](https://ui.shadcn.com/docs/components/base/sheet).

## General principles

- Use zustand and [discriminated union](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions) to make sure at most one modal is presented at any time.
- Decouple a modal container and its content. The container may change due to the viewport.
  - For example, at desktop widths we may present the sheet from the right, while at narrow widths from the bottom.

## File structure

Usually modals are used in a complex component:

```text
my-component/
├── modal-*.tsx           # a single modal
├── modal-controller.tsx  # a centralized place to control the display of modals
├── context.tsx           # in the store there will be a field for the presenting modal
└── ...                   # other files of the component
```

## Examples

See `examples/web/src/modal` for detailed examples and explanations.

## Workflow

- Define some `ModalDataXXX` interfaces in the `context.tsx`.
- Union those `ModalDataXXX`s into a single `ModalData` type, and add the modal status to the state.
  ```ts
  interface State {
    // ...
    modalData: ModalData | undefined
    setModalData: (modalData: ModalData | undefined) => void
  }
  ```
- Implement `modal-<entity>-<action>.tsx` for each modal, such as `modal-tier-edit.tsx`. The scaffold can usually be copied from an example.
- Implement `modal-controller.tsx` and mount it after the children of the component's provider: `index.tsx` in the examples, `provider.tsx` in the admin's `detail-<entity>/`.

## Base UI notes

The primitives in `packages/ui-web` are built on [Base UI](https://base-ui.com/), which differs from Radix in two ways that matter for modals:

- Compose custom elements through the `render` prop, not `asChild`.
  ```tsx
  <SheetClose render={<Button variant="outline" />}>Close</SheetClose>
  ```
- Unmount a modal after its close animation with `onOpenChangeComplete` on the root, not with animation events on the content.
  ```tsx
  <Dialog
    open={open}
    onOpenChange={setOpen}
    onOpenChangeComplete={(open) => {
      if (!open) {
        setModalData(undefined)
      }
    }}
  >
    {/* ... */}
  </Dialog>
  ```
