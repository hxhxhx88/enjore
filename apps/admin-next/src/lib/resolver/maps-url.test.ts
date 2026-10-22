import { describe, expect, it } from 'vitest'
import { expandMapsUrl, googleMapsLink, isShortMapsUrl, parseMapsUrl } from '@/lib/resolver/maps-url'

describe('parseMapsUrl', () => {
  it('reads the name and the pin of a place link, preferring the pin over the viewport', () => {
    const url = 'https://www.google.com/maps/place/Tim+Ho+Wan/@22.2849,114.1582,17z/data=!3m1!4b1!4m6!3m5!1s0x3404007a:0x1!8m2!3d22.2851!4d114.1585!16s%2Fg%2F1'
    expect(parseMapsUrl(url)).toEqual({ name: 'Tim Ho Wan', coordinates: { latitude: 22.2851, longitude: 114.1585 }, placeId: null })
  })

  it('falls back to the viewport when there is no pin and decodes the name', () => {
    expect(parseMapsUrl('https://www.google.com.hk/maps/place/%E6%B7%BB%E5%A5%BD%E9%81%8B/@22.28,114.15,17z')).toEqual({
      name: '添好運',
      coordinates: { latitude: 22.28, longitude: 114.15 },
      placeId: null,
    })
  })

  it('reads a place id from the Maps URLs form and from q=place_id:', () => {
    expect(parseMapsUrl('https://www.google.com/maps/search/?api=1&query=Tim%20Ho%20Wan&query_place_id=ChIJabc')).toEqual({
      name: 'Tim Ho Wan',
      coordinates: null,
      placeId: 'ChIJabc',
    })
    expect(parseMapsUrl('https://www.google.com/maps/place/?q=place_id:ChIJxyz')).toEqual({ name: null, coordinates: null, placeId: 'ChIJxyz' })
  })

  it('reads coordinates from q and a text from a search path', () => {
    expect(parseMapsUrl('https://maps.google.com/?q=22.2819,114.1584')).toEqual({
      name: null,
      coordinates: { latitude: 22.2819, longitude: 114.1584 },
      placeId: null,
    })
    expect(parseMapsUrl('https://www.google.com/maps/search/dim+sum+central/@22.28,114.15,15z')?.name).toBe('dim sum central')
  })

  it('rejects other hosts, malformed URLs and links without a place', () => {
    expect(parseMapsUrl('https://example.com/maps/place/x')).toBeUndefined()
    expect(parseMapsUrl('not a url')).toBeUndefined()
    expect(parseMapsUrl('https://www.google.com/maps')).toBeUndefined()
  })
})

describe('isShortMapsUrl', () => {
  it('recognizes the short hosts only', () => {
    expect(isShortMapsUrl('https://maps.app.goo.gl/AbCdEf')).toBe(true)
    expect(isShortMapsUrl('https://goo.gl/maps/AbCdEf')).toBe(true)
    expect(isShortMapsUrl('https://g.co/kgs/AbCdEf')).toBe(true)
    expect(isShortMapsUrl('https://www.google.com/maps/place/x')).toBe(false)
    expect(isShortMapsUrl('nope')).toBe(false)
  })
})

describe('expandMapsUrl', () => {
  it('follows redirects until a page answers', async () => {
    const hops: string[] = []
    const fetchImpl: typeof fetch = async (input) => {
      const url = String(input)
      hops.push(url)
      if (url === 'https://maps.app.goo.gl/x') {
        return new Response(null, { status: 302, headers: { location: '/maps/place/Tim+Ho+Wan/@22.28,114.15,17z' } })
      }
      return new Response('<html></html>', { status: 200 })
    }

    await expect(expandMapsUrl('https://maps.app.goo.gl/x', fetchImpl)).resolves.toBe('https://maps.app.goo.gl/maps/place/Tim+Ho+Wan/@22.28,114.15,17z')
    expect(hops).toHaveLength(2)
  })

  it('stops after five hops', async () => {
    let count = 0
    const fetchImpl: typeof fetch = async () => {
      count += 1
      return new Response(null, { status: 301, headers: { location: `https://maps.app.goo.gl/${count}` } })
    }

    await expect(expandMapsUrl('https://maps.app.goo.gl/0', fetchImpl)).resolves.toBe('https://maps.app.goo.gl/5')
    expect(count).toBe(5)
  })
})

describe('googleMapsLink', () => {
  it('builds the documented search form with the place id', () => {
    expect(googleMapsLink('ChIJabc', 'Tim Ho Wan')).toBe('https://www.google.com/maps/search/?api=1&query=Tim+Ho+Wan&query_place_id=ChIJabc')
  })
})
