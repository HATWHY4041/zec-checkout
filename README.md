# ZecCheckout - Zcash Shielded Payments Hackathon Project

A privacy-focused, zero-leak e-commerce checkout widget built for the ZECATHON by zkSNARKs.

## Live Stack
- **Frontend & Serverless API:** Next.js 14 App Router on Vercel
- **Database & Realtime Sync:** Supabase
- **Protocol Standard:** Zcash ZIP-321 Payment URI (Unified Address / Orchard)

## Supabase Credentials Configured
- **URL:** `https://sidcjddnlkrstjkosfkh.supabase.co`
- **Key:** Preconfigured in `.env.local`

## Running Locally
1. `npm install`
2. `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000)

## Deploying to Vercel
1. Import this repository into Vercel.
2. In Project Settings -> Environment Variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://sidcjddnlkrstjkosfkh.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_8VZe4tfIVmxiemZ9tzjKrA_01d_choI`
3. Click Deploy!
