import type { JSX } from 'react'
import { cn } from '@repo/ui-web/lib/utils'
import Image from 'next/image'
import { env } from '@/lib/env'

interface Props {
  readonly latitude: number
  readonly longitude: number
  readonly className?: string | undefined
}

const width = 640
const height = 320

// A Maps Static API preview around a position. The image stays unoptimized so the browser fetches it itself, with
// the referrer the browser key is restricted to; the image optimizer would send none.
export function MapStatic({ latitude, longitude, className }: Props): JSX.Element {
  const center = `${latitude},${longitude}`
  const parameters = new URLSearchParams({
    center,
    zoom: '16',
    size: `${width}x${height}`,
    scale: '2',
    markers: `color:red|${center}`,
    key: env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY,
  })

  return (
    <Image
      src={`https://maps.googleapis.com/maps/api/staticmap?${parameters.toString()}`}
      alt={`Map around ${center}`}
      width={width}
      height={height}
      unoptimized
      className={cn('h-auto w-full max-w-xl border', className)}
    />
  )
}
