# Complete and consistent from structure

Similar to the principle in `database-design.md`, when defining the state of something (e.g., a component), we should try our best to ensure the allowed states in code match the allowed states in business logic. To put it another way, our defined state should induce a structure that is consistent and complete regarding the allowed user experience.

Here are some examples.

## Modal open and close

Suppose we use a modal to create a user. Once mounted, the modal has 3 states:

- Opened
- Closed without a new user
- Closed with a new user

A naive approach to define the modal state might be:

```tsx
export function MyModal(): JSX.Element {
  const [open, setOpen] = useState<boolean>(true)
  const [user, setUser] = useState<User | undefined>(undefined)
}
```

However, such a definition has 2 immediate problems:

- It allows 4 different states (e.g., `open=true` with a user, which might be invalid depending on logic).
- Updating the state is suboptimal, since we need to call both `setOpen` and `setUser`, resulting in two renders.

A better approach is:

```tsx
interface StatusOpen {
  type: 'open'
}

interface StatusClosed {
  type: 'closed'
  user: User | undefined
}

type Status = StatusOpen | StatusClosed

export function MyModal(): JSX.Element {
  const [status, setStatus] = useState<Status>({ type: 'open' })
}
```

Now, the above two problems are solved:

- There are exactly 3 allowed code states, matching the 3 possible product states.
- When updating the state, only one `setStatus` call is needed.

## Modal presence

In a complex page, there can be many modals for different purposes. For example, in a user detail page, we can use modals to update and delete the user. A naive approach is to define something like:

```tsx
export function MyPage(): JSX.Element {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
}
```

Then, we call the corresponding `setXXXOpen` to open the modal. However, such a design allows two modals to be open simultaneously, which is unexpected and does not make sense from a UI perspective. To address this, we can do:

```tsx
type ModalType = 'edit' | 'delete'

export function MyPage(): JSX.Element {
  const [modalOpen, setModalOpen] = useState<ModalType | undefined>(undefined)
}
```

In this manner, at most one modal is presented at a time, perfectly solving the problem.
