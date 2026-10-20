import type { JSX } from 'react'
import { notFound } from 'next/navigation'

export default function Default(): JSX.Element {
  notFound()
}
