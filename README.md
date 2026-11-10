# SSJU Connect

SSJU Connect is a campus community for Soban Singh Jeena University. It includes a discussion feed, faculty directory, student profiles, search, sharing, and a vault for student-contributed previous-year question paper PDFs.

The frontend is a single page app in `index.html` and `app.bundle.js`, styled with Tailwind's CDN and `styles.css`. `server.js` is the supported backend. It uses Node's built-in modules and stores JSON data and uploaded PDFs on disk. `server.py` is only a compatibility launcher that starts the same Node server; it is not a separate backend.

## Run locally

Install Node.js 18 or newer, then run:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000), create an account, and sign in. The app must be opened through the Node server; opening `index.html` directly will not load local demo data. `start.bat` starts the same server on Windows.

By default, the JSON database is `data/db.json` and PDF files are in `uploads/`. Set `DATA_DIR` and `UPLOAD_DIR` to use other locations. Keep these directories private and backed up; they contain account data and user uploads.

## Deploy on Render

The checked-in [`render.yaml`](render.yaml) deploys one Node web service and mounts a 1 GB persistent disk at `/var/data`. The service plan is Starter because Render requires a paid web service for a persistent disk. Render's filesystem is otherwise ephemeral; the disk preserves data across deploys. A disk-backed service is single-instance and cannot scale horizontally. See Render's [persistent disk documentation](https://render.com/docs/disks) and [Blueprint reference](https://render.com/docs/blueprint-spec).

1. Push this project to a GitHub repository.
2. In Render, create a new Blueprint and select the repository.
3. Review the service and disk from `render.yaml`, then apply the Blueprint.
4. Open the service URL and create an account.

Send friends the public Render service URL (for example, `https://ssju-connect.onrender.com` if that hostname is assigned). `localhost` links only work on the computer running the server. Once hosted, the in-app Share dialog generates its link and QR code from the public hostname. The URL stays available while the Render service remains deployed; you can also attach a custom domain.

The Blueprint requests `https://ssju-connect.onrender.com`. If Render assigns a different hostname, update the structured-data URL in `index.html`, plus `robots.txt` and `sitemap.xml`.

For larger deployments, move account and feed data to a managed database and PDFs to object storage before running multiple instances.

## Security and data behavior

- Static HTTP access is limited to the named app files. The database, server source, configuration, scraper output, and project directories are not served.
- Sign-up and sign-in use per-account random salts with `crypto.scrypt`. Bearer tokens expire after seven days; the database stores token fingerprints, not the token values. The first launch after the session-storage upgrade revokes old sessions, so users sign in again.
- Creating posts, comments, papers, profile changes, and faculty entries requires a valid session. Author identity, votes, reputation, and upload ownership are set or checked by the server.
- User text is escaped before it is rendered. Avatar and attachment URLs are restricted to supported image schemes.
- Paper uploads must be PDFs (including a `%PDF-` file signature), are limited to 20 MB, and are tied to the uploading account. A vault entry cannot be created without its uploaded file. The vault does not fabricate or generate exam papers, and existing placeholder rows without stored PDFs are removed during database migration.
- The share dialog requests a real QR image from [QR Server](https://goqr.me/api/), passing it the public app URL.

## Files

```text
index.html          App shell and dialogs
app.bundle.js       Served frontend and UI logic
styles.css          Custom styles
server.js           Authenticated Node.js API and allowlisted static server
server.py           Compatibility launcher for server.js
package.json        Project metadata and start command
render.yaml         Render service and persistent disk configuration
data/db.json        Runtime database (ignored by Git)
uploads/            Runtime PDF files (ignored by Git)
robots.txt          Crawler rules for the Render hostname
sitemap.xml         Sitemap for the Render hostname
scrape_ssju.py      Optional title scraper; its output is not loaded by the app
ssju_scraped_papers.json  Scraper output; not served or imported
```
