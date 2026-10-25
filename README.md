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

The Studio is deployed at [vour.sanity.studio](https://vour.sanity.studio).
To redeploy it after changing its schema or interface, run:

```powershell
npm run deploy -- --url vour --yes --schema-required
```

This deploys the editing interface; it does not publish app or website changes.

## Import the original concert history

The 63 original entries from the website are kept in `data/live-history.json`.
To regenerate that file from the existing website table:

```powershell
python scripts/import_live_history.py ..\vour.rocks\pages\live.html
```

After authenticating with Sanity, import missing documents without overwriting
existing edits:

```powershell
npm exec --yes sanity@latest -- documents create data/live-history.json --missing
```

The `production` dataset must allow public read access for unauthenticated app
and website queries. Studio editing still requires an authorized Sanity account.
Do not put Sanity write tokens in the mobile app or commit them to this repo.
