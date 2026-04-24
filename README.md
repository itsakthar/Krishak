# Krishak

Krishak is a mobile-first marketplace and labour web app for farmers, with a separate admin dashboard.

## What is included

- Mobile number login/register flow with secure hashed-password demo auth
- First-login language selection for English, Bengali, and Hindi
- Floating language switch button on authenticated pages
- Marketplace browsing, cart, seller submission flow, and seller history
- Labour browsing and labour registration flow
- Profile editing with locked mobile number
- Buyer-seller chat flow and call option
- Separate `/admin` dashboard for approvals, edits, orders, users, chats, and UI settings
- Demo seed data in `data/demo-db.json`
- Firebase Hosting, Firestore, and Storage config files

## Run locally

1. Copy `.env.example` to `.env.local`
2. Set `ADMIN_PASSWORD`
3. Keep `NEXT_PUBLIC_DEMO_MODE=true` for the out-of-the-box local demo backend
4. Install dependencies with `npm install`
5. Start the app with `npm run dev`

## Admin login

- URL: `/admin`
- Password source: `ADMIN_PASSWORD` from environment variables
- The password is verified in backend route handlers, not hardcoded in the frontend

## Demo data

Demo persistence lives in [data/demo-db.json](/C:/Users/itsak/Documents/Codex/2026-04-23-create-a-full-stack-mobile-first/data/demo-db.json).

- Approved products already appear in the marketplace
- Approved labour profiles already appear in the labour module
- New seller and labour submissions stay pending until approved in the admin dashboard

## Firebase-ready files

- Firestore rules: [firestore.rules](/C:/Users/itsak/Documents/Codex/2026-04-23-create-a-full-stack-mobile-first/firestore.rules)
- Storage rules: [storage.rules](/C:/Users/itsak/Documents/Codex/2026-04-23-create-a-full-stack-mobile-first/storage.rules)
- Firebase Hosting config: [firebase.json](/C:/Users/itsak/Documents/Codex/2026-04-23-create-a-full-stack-mobile-first/firebase.json)
- Firebase helpers: [client.ts](/C:/Users/itsak/Documents/Codex/2026-04-23-create-a-full-stack-mobile-first/src/lib/firebase/client.ts) and [admin.ts](/C:/Users/itsak/Documents/Codex/2026-04-23-create-a-full-stack-mobile-first/src/lib/firebase/admin.ts)

The current MVP runs immediately in demo mode with the local JSON store. The structure is set up so you can replace the demo service layer with Firebase-backed persistence using the same routes and UI.

## Main routes

- `/auth`
- `/language`
- `/marketplace`
- `/marketplace/seller`
- `/labour`
- `/orders`
- `/cart`
- `/profile`
- `/admin`
