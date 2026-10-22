import type { JSX } from 'react'
import { useStore } from './context'
import { StepEntry } from './step-entry'
import { StepReview } from './step-review'

export function Render(): JSX.Element {
  const step = useStore(s => s.step)

  switch (step.type) {
    case 'entry':
      return <StepEntry initialValues={step.initialValues} />
    case 'review':
      return <StepReview key={step.placeId ?? 'none'} data={step} />
  }
}
