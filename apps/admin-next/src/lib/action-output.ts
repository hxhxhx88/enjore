// The result every server action returns: user-correctable failures come back as a message, internal errors throw.
// See `docs/development/0003-coding/nextjs-server-action.md`.
interface ActionOutputOk {
  type: 'ok'
}

interface ActionOutputBad {
  type: 'bad'
  message: string
}

export type ActionOutput = ActionOutputOk | ActionOutputBad

// Returned when the server-side re-validation of the input fails; the form validates the same schema first, so an
// operator only sees it when the client and the server disagree.
export const invalidInput: ActionOutputBad = { type: 'bad', message: 'The form has invalid values.' }
