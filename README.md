# VOUR Sanity Studio

Sanity Studio for managing VOUR live dates. The Studio is connected to project
`0r5tszo2` and the `production` dataset.

## Run locally

```powershell
npm install
npm run dev
```

Sign in with an account that has access to the VOUR Sanity project. To build the
static Studio bundle, run `npm run build`.

## Manage live dates

Create a **Konzert** document for each event. The schema supports confirmed,
cancelled, and postponed events; optional venue and ticket links; address and
map links; descriptions and times; and an ordered list of other bands with
optional profile links and logos.

Keep past and cancelled events in the dataset for the band's full concert
history. The `In der App anzeigen` and `Auf der Website anzeigen` switches
allow each published event to be included or excluded from those channels.

## Deploy the Studio

Run `npm run deploy` and follow the Sanity CLI prompts to choose a Studio
hostname. This deploys the editing interface; it does not publish app or website
changes.

The `production` dataset must allow public read access for unauthenticated app
and website queries. Studio editing still requires an authorized Sanity account.
Do not put Sanity write tokens in the mobile app or commit them to this repo.
