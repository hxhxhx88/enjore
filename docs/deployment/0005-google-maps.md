# Google Maps

The admin uses two Google Maps Platform keys from one Google Cloud project: a server key for Places API (New), which resolves entries, fills the basics and runs "Refresh from Places", and a browser key for the Maps Static API, which draws the map previews. Both are mandatory: the admin does not start without them, as `docs/implementation/admin/index.md` requires of every variable.

## Create the project and enable the APIs

- In the Google Cloud console, create a project or reuse one, with billing enabled. Both APIs are billed per request beyond the monthly free usage of their SKUs; check the Maps Platform pricing page for the current figures.
- Under **APIs & Services**, enable **Places API (New)** and **Maps Static API**. The legacy "Places API" is not used.

## Server key

- Under **Credentials**, create an API key named "Enjore admin server". Under **API restrictions**, restrict it to Places API (New). Leave the application restriction at none: Vercel's functions have no fixed address, and the key never reaches a browser.
- Set it as `GOOGLE_PLACES_API_KEY` in `.env.local` and in the admin's Vercel project.

## Browser key

- Create a second key named "Enjore admin browser". Under **Application restrictions** choose websites and add `https://<admin host>/*` and `http://localhost:3001/*`; under **API restrictions**, restrict it to Maps Static API.
- Set it as `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` in `.env.local` and in Vercel. Next.js inlines it in the client bundle at build time, so a changed value needs a redeploy.
- The admin requests the map image from the browser with `unoptimized` on the image, so the request carries the admin's referrer; the image optimizer would send none and the referrer restriction would refuse it.

## What each call costs

- "Add restaurant" makes one Text Search, with the display name requested (Pro SKU), and one Place Details call for the facts, with the phone, website and hours (Enterprise SKU). "Refresh from Places" makes one Place Details call. Creating from a picked search result makes one more Place Details call.
- Each map preview is one Maps Static API request per image load.

## Verify

- Run `task dev -- --filter=admin-next`, open "Restaurants" and "Add restaurant", type a name and an address and click "Resolve": the review step shows the Google Places facts and a map.
- A refusal from Places comes back as a warning that quotes Google's message, which names the restriction or the API that refused the key.
