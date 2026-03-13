# ADIGSI Website CMS

## Table of Contents

- [Running on Server (Production)](#running-on-server-production)
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

```bash
cd /var/www/adigsi-cms
git pull
pnpm install --frozen-lockfile
pnpm build
pm2 restart adigsi-cms
```

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