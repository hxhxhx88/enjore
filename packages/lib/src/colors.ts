import { converter, formatHsl } from 'culori'

const convertOklchToHsl = converter('hsl')

export function oklchToHsl(color: string): string {
  const hsl = convertOklchToHsl(color)
  return hsl ? formatHsl(hsl) : color
}
