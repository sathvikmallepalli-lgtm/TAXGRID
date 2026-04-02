# How to start developing with GST System APIs (official v1.2 guide)

This document tracks **GSTN’s** instructions from *How To Start Developing Application Using GST System API v1.2* and maps them to this project.

## 1. Read the API specification

- Open the **[GST Developer Portal](https://developer.gst.gov.in/apiportal/)**.
- Under the **Taxpayer API** tab, read the current specification (GSTN supports the **last two versions** of APIs; check **Release Notes** for what is live on Sandbox).

## 2. Get Sandbox credentials (via a GSP)

- You **do not** get sandbox keys directly from the portal alone. You must work with an **empanelled GSP** (Goods and Services Tax Suvidha Provider).
- **List of GSPs:** [gstn.org.in – empanelled GSPs](https://gstn.org.in/empanelled-gsps).
- Credential requests are processed **fortnightly** (e.g. apply on 1st April → expect credentials roughly by **15th April**).
- Provide a **valid email and phone** for the person who will test — **OTP** for authentication is sent only to those.

## 3. Authentication first

- You must call the **Authentication API** and obtain an **Auth Token** before calling other taxpayer APIs.
- Details: [Taxpayer API – Authentication](https://developer.gst.gov.in/apiportal/taxpayer/authentication) (use the **“more info”** links on the portal).
- For **`app_key`** and **encryption/decryption**, use the **sample code** in the portal **Download** section.
- For the **GST Sandbox public key**, use the samples in the **Download** section.

## 4. API list and URLs

- Released APIs and URLs: Developer Portal → **How to Start** (and your internal list, e.g. `Released_API_List_*.xlsx`).
- Sandbox may lag the published spec by a few days; watch **Google group** notifications for Sandbox availability.

## 5. Community and announcements

- Search for **“GSP Discussion Group”** on Google for technical/business discussions.
- Use the group’s search (e.g. filter by **ecosystem.gstn@gmail.com** or tags like **release**, **API**, **announcement**).

---

## How this maps to TaxGrid

| GSTN step | In this repo |
|-----------|----------------|
| Protect secrets | Use **`npm run gst-proxy`** and **`GST_API_KEY` / `GST_CLIENT_ID`** in `.env` (never commit `.env`). |
| Commercial API while you wait for GSP | The proxy can call a **GSP/commercial** GSTIN API (default URL is Masters India–style); this is **not** the same as GSTN Sandbox until you point `GST_SEARCH_URL` and auth to GSTN. |
| Full GSTN Sandbox (Auth → Search, etc.) | Requires **your GSP credentials**, **app_key / encryption** per Download samples, and a **server-side** implementation (extend `server/gst-proxy.mjs` or add a dedicated GSTN module). The React app should only talk to **your** backend. |

**Next step for true GSTN integration:** after GSP issues Sandbox credentials, implement the **Authentication API** flow using GSTN’s sample code, cache the **Auth Token**, then call **Public / Taxpayer** APIs (e.g. Search Taxpayer) per the portal spec — all **server-side**.
