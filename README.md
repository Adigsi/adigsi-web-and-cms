# ADIGSI Website CMS

## Table of Contents

- [Running on Server (Production)](#running-on-server-production)
- [Deploying with CI/CD (GitHub Actions)](#deploying-with-cicd-github-actions)
- [CMS Login with MongoDB](#cms-login-with-mongodb)
- [File Upload API](#file-upload-api)
- [Image & PDF Compression](#image--pdf-compression)
- [Troubleshooting](#troubleshooting)

---

## Running on Server (Production)

### Requirements

- Node.js 20+ (`node -v`)
- pnpm (`npm install -g pnpm`)
- ghostscript — required for PDF compression (`sudo apt install ghostscript`)
- MongoDB Atlas or a MongoDB instance accessible from the server

### 1. Clone & install

```bash
git clone <repo-url> /var/www/adigsi-cms
cd /var/www/adigsi-cms
pnpm install --frozen-lockfile
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
nano .env.local
```

Fill in all required variables. At minimum:

```bash
# MongoDB
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority"
MONGODB_DB_NAME="adigsi_cms"

# Session auth
CMS_AUTH_SECRET="replace-with-a-random-string-at-least-32-characters"
CMS_SETUP_SECRET="secret-used-for-initial-admin-setup"

# Upload provider (see File Upload API section for all options)
UPLOAD_PROVIDER=local
UPLOAD_LOCAL_PATH=/var/uploads/adigsi-cms
```

Generate a random secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Build

```bash
pnpm build
```

### 4. Create the first admin account

Start the server temporarily with `pnpm start`, then call the setup-admin endpoint once:

```bash
curl -X POST http://localhost:3000/api/cms/setup-admin \
  -H "Content-Type: application/json" \
  -H "x-setup-secret: <CMS_SETUP_SECRET>" \
  -d '{"email": "admin@adigsi.id", "password": "changeThisPassword", "name": "Admin ADIGSI"}'
```

### 5. Run with PM2 (recommended)

PM2 keeps the process running and restarts it on server reboot.

```bash
# Install PM2
npm install -g pm2

# Start Next.js
pm2 start pnpm --name "adigsi-cms" -- start

# Save config so it auto-starts after reboot
pm2 save
pm2 startup   # follow the printed instructions
```

Useful PM2 commands:
```bash
pm2 status            # check all process statuses
pm2 logs adigsi-cms   # stream logs in real time
pm2 restart adigsi-cms
pm2 stop adigsi-cms
```

### 6. Configure Nginx as a reverse proxy

#### Install Nginx

```bash
sudo apt update
sudo apt install nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

#### Create the site configuration file

```bash
sudo nano /etc/nginx/sites-available/adigsi.id
```

Paste the following configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name adigsi.id www.adigsi.id;

    # Redirect all HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name adigsi.id www.adigsi.id;

    # SSL — filled in automatically by certbot (step 7)
    ssl_certificate /etc/letsencrypt/live/adigsi.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/adigsi.id/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Required for PDF uploads up to 20 MB
    client_max_body_size 25m;

    # Extended timeout for PDF compression processing
    proxy_read_timeout 120s;
    proxy_send_timeout 120s;

    # Gzip compression for performance
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
    gzip_min_length 1000;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache Next.js static assets
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

#### Enable the configuration

```bash
# Create symlink to sites-enabled
sudo ln -s /etc/nginx/sites-available/adigsi.id /etc/nginx/sites-enabled/

# Remove default config if still present
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration syntax
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

#### Verify Nginx is running

```bash
sudo systemctl status nginx
curl -I http://adigsi.id   # should return 301 redirect to https after certbot
```

### 7. HTTPS with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx

# Generate certificate and auto-update Nginx config
sudo certbot --nginx -d adigsi.id -d www.adigsi.id
```

Certbot will:
1. Fill in the `ssl_certificate` block in the Nginx configuration
2. Add a cron job for auto-renewal every 90 days

Verify auto-renewal:
```bash
sudo certbot renew --dry-run
```

### 8. Local upload folder (if `UPLOAD_PROVIDER=local`)

```bash
sudo mkdir -p /var/uploads/adigsi-cms
sudo chown -R <user>:<group> /var/uploads/adigsi-cms
# Replace <user>:<group> with the user running pm2, e.g.: ubuntu:ubuntu
```

### Deploying updates

Updates are deployed automatically by GitHub Actions. See [Deploying with CI/CD](#deploying-with-cicd-github-actions).

---

## Deploying with CI/CD (GitHub Actions)

Every push or merge to `main` builds the app on GitHub Actions and deploys it to the production VM. Pull requests to `main` only run the build (plus a smoke test) as a check. A deploy can also be started manually from **Actions → Build & Deploy → Run workflow**.

### How it works

1. **Build** (`.github/workflows/deploy.yml`, job `build`):
   - `pnpm build` with `output: 'standalone'`, producing `server.js` and a minimal `node_modules`.
   - A smoke test starts the server and checks that `sharp` loads.
   - The result is packed as `release.tgz`.
2. **Deploy** (job `deploy`): the archive is copied to the VM over SSH, then [`scripts/deploy/activate-release.sh`](scripts/deploy/activate-release.sh) runs there:
   - extracts it to `releases/<timestamp>-<sha>`;
   - points the `current` symlink at it;
   - runs `pm2 startOrReload` with [`ecosystem.config.js`](ecosystem.config.js);
   - waits for `GET /api/health` to return 200.
3. If the health check fails, `current` is switched back to the previous release automatically and the workflow fails.
4. The last 5 releases are kept on the VM.

Server layout:

```
/home/ubuntu/app/adigsi-web-and-cms/
  current -> releases/20261012T101500-ab12cd3   # pm2 app "adigsi-web" runs from here
  releases/                                      # last 5 releases
  shared/.env.production                         # production env vars, never touched by deploys
```

Production env vars are loaded from `shared/.env.production` at runtime (`node --env-file`). The only exceptions are the `NEXT_PUBLIC_*` values, which are inlined at build time and therefore come from GitHub repository variables.

### One-time setup

1. **Check the server:**
   - `node -v` must be **≥ 20.9**, as required by Next.js 16.
   - `uname -m` must be `x86_64`, because releases are built for linux-x64.
   - Run `pm2 ls` and note the name of the existing process.
   - `gs --version` should confirm ghostscript is installed.
   - **Pick the deploy user.** It must be the Linux user that owns the app folder and runs pm2; in production this is `adigsi_id`. Check with:
     ```bash
     ls -ld /home/ubuntu/app/adigsi-web-and-cms
     ps -eo user,cmd | grep "PM2" | grep -v grep
     ```
     All SSH and pm2 steps below use this user.

2. **Create a deploy SSH key** on your own machine (not the server):
   ```bash
   ssh-keygen -t ed25519 -f adigsi_deploy -C github-actions -N ""
   ```
   - Add `adigsi_deploy.pub` to `~/.ssh/authorized_keys` of the deploy user on the VM.
     - This can also be done via GCP Console → Compute Engine → Metadata → SSH Keys.
     - In GCP metadata, the last word of the key line is the username, so it must be the deploy user (e.g. `adigsi_id`).
   - Then check that it works from outside GCP:
     ```bash
     ssh -i adigsi_deploy <DEPLOY_USER>@<VM_IP> 'whoami'
     ```
   - If this fails, GitHub Actions can't reach the VM either. Common causes are a firewall rule that only allows certain IPs, or OS Login being enabled. In that case the workflow needs to be switched to an IAP tunnel (`gcloud compute ssh --tunnel-through-iap`).

3. **Prepare the deploy folders on the VM.** The running app is not affected by this step.
   ```bash
   cd /home/ubuntu/app/adigsi-web-and-cms
   mkdir -p releases shared
   cp .env.local shared/.env.production
   chmod 600 shared/.env.production
   ```

4. **Configure GitHub** (repository → Settings):
   - **Environments → `production` → Environment secrets:**

     | Secret | Value |
     |---|---|
     | `SSH_HOST` | VM external IP |
     | `SSH_USER` | the deploy user from step 1 (production: `adigsi_id`) |
     | `SSH_PRIVATE_KEY` | contents of `adigsi_deploy` (private key) |
     | `SSH_KNOWN_HOSTS` | output of `ssh-keyscan <VM_IP>` (must use the same host as `SSH_HOST`) |

   - **Secrets and variables → Actions → Variables (repository):**

     | Variable | Value |
     |---|---|
     | `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | same as in the server `.env.local` |
     | `NEXT_PUBLIC_UMAMI_ANALYTICS_URL` | same as in the server `.env.local` |
     | `LEGACY_PM2_NAME` | name of the old pm2 process from step 1 (first deploy only) |
     | `SSH_PORT` | optional, defaults to `22` |

5. **Point nginx at IPv4 localhost.** The app listens on `127.0.0.1:3000` only.
   - In the site config (production: `/etc/nginx/sites-available/adigsi-cms`), change `proxy_pass http://localhost:3000;` to `proxy_pass http://127.0.0.1:3000;`.
   - Then run:
     ```bash
     sudo nginx -t && sudo systemctl reload nginx
     ```

6. **First deploy (cutover):**
   - Merge to `main`, or run the workflow manually. The first deploy removes the old pm2 process (`LEGACY_PM2_NAME`) and starts `adigsi-web` in its place, with a few seconds of downtime. If the new release fails its health check, the old process is started again.
   - Once the site is confirmed working:
     - Delete the `LEGACY_PM2_NAME` variable.
     - Make sure pm2 starts on boot. As the deploy user, run `pm2 startup` and then the `sudo …` command it prints. `systemctl list-unit-files 'pm2-*'` should then list `pm2-<deploy user>.service`.
     - Remove the files of the old manual clone:
       ```bash
       cd /home/ubuntu/app/adigsi-web-and-cms
       find . -mindepth 1 -maxdepth 1 ! -name releases ! -name shared ! -name current -exec rm -rf {} +
       ```

### Day-to-day operations

```bash
pm2 status                      # process status
pm2 logs adigsi-web             # live logs
curl -s http://127.0.0.1:3000/api/health

# Change production env vars, then restart
nano /home/ubuntu/app/adigsi-web-and-cms/shared/.env.production
pm2 restart adigsi-web

# Manual rollback to an earlier release
cd /home/ubuntu/app/adigsi-web-and-cms
ls releases/                                  # pick a release id
ln -sfn releases/<release-id> current
pm2 reload current/ecosystem.config.js --update-env && pm2 save
```

Each deploy restarts the single pm2 instance, so expect 1–3 seconds of 502 responses from nginx while it restarts. This is intentional: the app runs one instance because `instrumentation.ts` starts the server-stats timer once per process.

---

## CMS Login with MongoDB

CMS login uses MongoDB user data from collection `cms_users`.

### Environment variables

Set these variables in `.env.local`:

```bash
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority"
MONGODB_DB_NAME="adigsi_cms"
CMS_AUTH_SECRET="replace-with-a-long-random-secret"
CMS_SETUP_SECRET="secret-for-admin-initialization"
```

Note: `CMS_AUTH_SECRET` is used for session token signing. Can also be named `CMS_SESSION_SECRET` if preferred.

### Required user document

Create at least one admin document in the `cms_users` collection:

```json
{
	"email": "admin@adigsi.id",
	"emailLower": "admin@adigsi.id",
	"passwordHash": "scrypt$<salt>$<hash>",
	"name": "Admin ADIGSI",
	"role": "admin",
	"isActive": true
}
```

For backward compatibility, the `password` field (plain text) is still accepted, but `passwordHash` is recommended.

### Create the first admin via API

Use the `POST /api/cms/setup-admin` endpoint once for initial setup.

Example request:

```bash
curl -X POST http://localhost:3000/api/cms/setup-admin \
	-H "Content-Type: application/json" \
	-H "x-setup-secret: <CMS_SETUP_SECRET>" \
	-d '{
		"email": "admin@adigsi.id",
		"password": "admin12345",
		"name": "Admin ADIGSI"
	}'
```

This endpoint is single-use — it only works when the `cms_users` collection is empty.

## Troubleshooting

### Login returns 500 error
- Check the dev server console for detailed error output
- Ensure `CMS_AUTH_SECRET` or `CMS_SESSION_SECRET` is set in `.env.local`
- Ensure `MONGODB_URI` is valid and the MongoDB cluster is reachable
- Ensure the admin user was created via the `setup-admin` endpoint

### Cannot connect to MongoDB
- Verify the `MONGODB_URI` format and credentials
- Ensure the MongoDB cluster allows connections from your server's IP address
- Test the connection: `mongosh "<MONGODB_URI>"`

### Setup-admin returns 409 (conflict)
- An admin user was already created previously
- To reset, drop the `cms_users` collection from MongoDB

---

## File Upload API

Centralised upload API supporting multiple storage providers. The active provider is selected via the `UPLOAD_PROVIDER` environment variable.

### Endpoints

| Method | URL | Description |
|---|---|---|
| `POST` | `/api/cms/upload` | Upload a file (requires a valid CMS session) |
| `GET` | `/api/cms/upload/file/[...path]` | Serve a local file (only active when `UPLOAD_PROVIDER=local`) |

### Request

```
POST /api/cms/upload
Content-Type: multipart/form-data
Cookie: adigsi_cms_session=<token>

Fields:
  file    (required) — the file to upload
  folder  (optional) — destination subfolder in storage
```

### Response

```json
{
  "success": true,
  "url": "https://...",
  "filename": "1710000000_a1b2c3d4_photo.webp",
  "originalName": "photo.jpg",
  "size": 204800,
  "mimeType": "image/webp",
  "provider": "local"
}
```

### File size limits (server-enforced)

| File type | Limit |
|---|---|
| `image/*` | 5 MB |
| `application/pdf` | 20 MB |
| Others | 10 MB |

Client-side validation uses the same limits via `validateFileSize()` from `lib/upload/compress-image.ts`.

### Storage providers

Set `UPLOAD_PROVIDER` in `.env.local`:

#### `local` — Folder outside the project

Files are saved to a directory on the server outside the project root, and served back via a Next.js API route.

```bash
UPLOAD_PROVIDER=local
UPLOAD_LOCAL_PATH=/var/uploads/adigsi-cms
```

Ensure the directory exists and is writable by the user running Next.js:
```bash
mkdir -p /var/uploads/adigsi-cms
chown -R <user>:<group> /var/uploads/adigsi-cms
```

#### `cloudinary` — Cloudinary

Sign up at [cloudinary.com](https://cloudinary.com) and get your credentials from the dashboard.

```bash
UPLOAD_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=uploads         # optional, default: uploads
```

#### `r2` — Cloudflare R2

Create a bucket in the Cloudflare Dashboard → R2. Enable public access or set up a custom domain.

```bash
UPLOAD_PROVIDER=r2
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET=your_bucket_name
R2_PUBLIC_URL=https://cdn.example.com   # or https://pub-xxxx.r2.dev
```

#### `gcs` — Google Cloud Storage

Create a bucket in the [Google Cloud Console](https://console.cloud.google.com) → Cloud Storage. Create a service account with the `Storage Object Admin` role.

```bash
UPLOAD_PROVIDER=gcs
GCS_PROJECT_ID=your_gcp_project_id
GCS_BUCKET=your_bucket_name
GCS_PUBLIC_URL=https://storage.googleapis.com/your_bucket_name   # optional
GCS_FOLDER=uploads                                                # optional

# Authentication — choose one:
# Option 1: inline service account JSON (recommended for VPS/hosting)
GCS_KEY_JSON={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}

# Option 2: path to service account JSON file (for local development)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

### Using the upload hook in React components

```tsx
'use client'
import { useFileUpload } from '@/hooks/use-file-upload'

export function ImageUploader() {
  const { upload, status, progress, error, result, reset } = useFileUpload()

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const uploaded = await upload(file, 'images') // folder is optional
    if (uploaded) {
      console.log('URL:', uploaded.url)
    }
  }

  return (
    <div>
      <input type="file" onChange={handleChange} disabled={status === 'uploading' || status === 'compressing'} />
      {status === 'compressing' && <p>Compressing image...</p>}
      {status === 'uploading' && <p>Uploading... {progress}%</p>}
      {status === 'done' && <p>Done: {result?.url}</p>}
      {status === 'error' && <p>Error: {error}</p>}
    </div>
  )
}
```

**Status lifecycle:** `idle` → `compressing` (images only) → `uploading` → `done` / `error`

---

## Image & PDF Compression

### Images

Pipeline: **Client-side compress → Server-side WebP encode**

1. **Client-side** (`browser-image-compression`): resize to max 1920px, target ~1 MB, runs in a Web Worker (non-blocking). Skipped for SVG and GIF.
2. **Server-side** (`sharp`): convert to WebP at quality 80, max 1920px, strip EXIF metadata. Output is always `.webp`.

| Input | Estimated output |
|---|---|
| 5 MB JPEG | 200–600 KB WebP |
| 5 MB PNG (photo) | 150–400 KB WebP |
| PNG (logo / transparency) | 80–250 KB WebP |

> **Note:** SVG and GIF are uploaded as-is without re-encoding.

### PDF

Pipeline: **Server-side ghostscript `/ebook` preset**

- 150 dpi — text remains sharp and selectable, images are compressed
- `gs` availability is auto-detected: if not installed, the PDF is uploaded without compression (no error)
- If the ghostscript output is larger than the input, the original is used instead

| Input | Estimated output |
|---|---|
| 20 MB PDF (image-heavy) | 4–8 MB |
| 20 MB PDF (text-dominant) | 2–5 MB |

#### Install ghostscript on VPS (Ubuntu/Debian)

```bash
sudo apt install ghostscript

# Verify
gs --version
```

Without ghostscript, PDFs are still uploaded — just without compression.

### Troubleshooting upload & compression

#### Upload fails with status 413
- Check file size before uploading (limits: images 5 MB, PDF 20 MB, others 10 MB)
- If using Nginx, make sure `client_max_body_size` is set accordingly:
  ```nginx
  client_max_body_size 25m;
  ```

#### Image not converted to WebP
- Verify `sharp` is installed: `pnpm list sharp`
- Ensure `sharp` is listed in `serverExternalPackages` in `next.config.mjs`
- SVG and GIF are intentionally not converted (by design)

#### PDF not compressed
- Run `gs --version` on the server to confirm ghostscript is installed
- Check the server console for `[PDF Compress]` log entries
- PDFs are still uploaded even when ghostscript is unavailable