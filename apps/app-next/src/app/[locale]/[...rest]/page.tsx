import { notFound } from 'next/navigation'

// Any path that no other route matches renders the localized `not-found.tsx`.
export default function Page(): never {
  notFound()
}
