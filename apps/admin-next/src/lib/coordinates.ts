import { z } from 'zod'

// A WGS-84 position, as the `latitude` and `longitude` columns of a restaurant hold it. Set and cleared together.
export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})

export type Coordinates = z.infer<typeof coordinatesSchema>
