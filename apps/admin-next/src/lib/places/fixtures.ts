// Place Details responses in the shape the API documents, one per region the guide meets first. They drive the
// mapping tests; replace them with captures from the real API when the components Google returns differ.

// A Hong Kong dim sum house: a neighborhood component, a period that closes after midnight.
export const placeHongKong: unknown = {
  id: 'ChIJ_hk_tim_ho_wan',
  displayName: { text: 'Tim Ho Wan', languageCode: 'en' },
  formattedAddress: 'Shop 12A, Hong Kong Station, Central, Hong Kong',
  addressComponents: [
    { longText: 'Shop 12A', shortText: 'Shop 12A', types: ['subpremise'], languageCode: 'en' },
    { longText: 'Hong Kong Station', shortText: 'Hong Kong Station', types: ['premise'], languageCode: 'en' },
    { longText: 'Central', shortText: 'Central', types: ['neighborhood', 'political'], languageCode: 'en' },
    { longText: 'Hong Kong Island', shortText: 'Hong Kong Island', types: ['administrative_area_level_1', 'political'], languageCode: 'en' },
    { longText: 'Hong Kong', shortText: 'HK', types: ['country', 'political'], languageCode: 'en' },
  ],
  location: { latitude: 22.2849, longitude: 114.1582 },
  internationalPhoneNumber: '+852 2332 3078',
  websiteUri: 'https://www.timhowan.com/',
  regularOpeningHours: {
    periods: [
      { open: { day: 1, hour: 9, minute: 0 }, close: { day: 1, hour: 21, minute: 0 } },
      { open: { day: 5, hour: 18, minute: 0 }, close: { day: 6, hour: 2, minute: 0 } },
    ],
    weekdayDescriptions: ['Monday: 9:00 AM – 9:00 PM', 'Friday: 6:00 PM – 2:00 AM'],
  },
  businessStatus: 'OPERATIONAL',
}

// A Macau palace: no neighborhood, a sublocality instead, open around the clock.
export const placeMacau: unknown = {
  id: 'ChIJ_mo_wing_lei_palace',
  displayName: { text: 'Wing Lei Palace', languageCode: 'en' },
  formattedAddress: 'Avenida da Nave Desportiva, Cotai, Macao',
  addressComponents: [
    { longText: 'Avenida da Nave Desportiva', shortText: 'Av. da Nave Desportiva', types: ['route'], languageCode: 'pt' },
    { longText: 'Cotai', shortText: 'Cotai', types: ['sublocality_level_1', 'sublocality', 'political'], languageCode: 'en' },
    { longText: 'Macao', shortText: 'MO', types: ['country', 'political'], languageCode: 'en' },
  ],
  location: { latitude: 22.1476, longitude: 113.5668 },
  internationalPhoneNumber: '+853 8889 3663',
  regularOpeningHours: {
    periods: [{ open: { day: 0, hour: 0, minute: 0 } }],
  },
  businessStatus: 'OPERATIONAL',
}

// A Tokyo counter: the district is the coarsest of several sublocality levels, no website, temporarily closed.
export const placeJapan: unknown = {
  id: 'ChIJ_jp_sukiyabashi_jiro',
  displayName: { text: 'Sukiyabashi Jiro', languageCode: 'en' },
  formattedAddress: 'Tsukamoto Sogyo Building, B1F, 4-2-15 Ginza, Chuo City, Tokyo 104-0061, Japan',
  addressComponents: [
    { longText: '15', shortText: '15', types: ['premise'], languageCode: 'en' },
    { longText: '2', shortText: '2', types: ['sublocality_level_4', 'sublocality', 'political'], languageCode: 'en' },
    { longText: '4-chōme', shortText: '4-chōme', types: ['sublocality_level_3', 'sublocality', 'political'], languageCode: 'en' },
    { longText: 'Ginza', shortText: 'Ginza', types: ['sublocality_level_2', 'sublocality', 'political'], languageCode: 'en' },
    { longText: 'Chuo City', shortText: 'Chuo City', types: ['locality', 'political'], languageCode: 'en' },
    { longText: 'Tokyo', shortText: 'Tokyo', types: ['administrative_area_level_1', 'political'], languageCode: 'en' },
    { longText: 'Japan', shortText: 'JP', types: ['country', 'political'], languageCode: 'en' },
    { longText: '104-0061', shortText: '104-0061', types: ['postal_code'], languageCode: 'en' },
  ],
  location: { latitude: 35.6713, longitude: 139.7636 },
  internationalPhoneNumber: '+81 3-3535-3600',
  regularOpeningHours: {
    periods: [
      { open: { day: 2, hour: 11, minute: 30 }, close: { day: 2, hour: 14, minute: 0 } },
      { open: { day: 2, hour: 17, minute: 0 }, close: { day: 2, hour: 20, minute: 30 } },
    ],
  },
  businessStatus: 'CLOSED_TEMPORARILY',
}
