# Adigsi landing page

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/itsmezulkifli-gmailcoms-projects/v0-adigsi-web-and-cms)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/n0Mdhxqp0wM)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/itsmezulkifli-gmailcoms-projects/v0-adigsi-web-and-cms](https://vercel.com/itsmezulkifli-gmailcoms-projects/v0-adigsi-web-and-cms)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/n0Mdhxqp0wM](https://v0.app/chat/n0Mdhxqp0wM)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## CMS Login with MongoDB

CMS login uses MongoDB user data from collection `cms_users`.

### Environment variables

Set these variables in `.env.local`:

```bash
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority"
MONGODB_DB_NAME="adigsi_cms"
CMS_AUTH_SECRET="ganti-dengan-random-secret-yang-panjang"
CMS_SETUP_SECRET="secret-khusus-untuk-inisialisasi-admin"
```

Note: `CMS_AUTH_SECRET` is used for session token signing. Can also be named `CMS_SESSION_SECRET` if preferred.

### Required user document

Create at least one admin document in `cms_users`:

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

For backward compatibility, field `password` (plain text) is still accepted, but `passwordHash` is recommended.

### Create first admin via API

Use endpoint `POST /api/cms/setup-admin` once for initial setup.

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

Endpoint ini hanya bisa membuat admin pertama (single-use saat koleksi user masih kosong).

## Troubleshooting

### Login returns 500 error
- Check console log pada dev server untuk error detail
- Pastikan `CMS_AUTH_SECRET` atau `CMS_SESSION_SECRET` sudah diset di `.env.local`
- Pastikan `MONGODB_URI` valid dan koneksi ke cluster MongoDB terhubung
- Pastikan admin user sudah dibuat via endpoint `setup-admin`

### Cannot connect to MongoDB
- Verifikasi `MONGODB_URI` format dan credential
- Pastikan MongoDB cluster membolehkan koneksi dari IP address mesin development
- Test koneksi: `mongosh "<MONGODB_URI>"`

### Setup-admin returns 409 (conflict)
- Admin user sudah pernah dibuat sebelumnya
- Jika ingin reset, hapus collection `cms_users` dari MongoDB