# DISC Assessment Prototype

Web prototype of a DISC personality assessment, built for the Talentology technical challenge.

## Features
- Participants rank 14 groups of 4 words (drag and drop), using a private invite link
- Scoring: 4/3/2/1 points per rank, summed per dimension (D, I, S, C); the top two dimensions give the profile
- Participant result page: profile, scores, ranking, personality name and description, bar chart
- Facilitator dashboard: all participants, status, results, invite links, full reports
- HR manager dashboard: invited, completed, pending, completion %, profile distribution, group results

## Tech stack
- Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS, Recharts, dnd-kit
- Backend: Node.js, Express 5, TypeScript, Zod, JWT, bcryptjs
- Database: PostgreSQL (Neon) with Prisma
- Tests: Vitest (scoring logic)
- Hosting: Railway

## Structure
- `backend/` - REST API (`src/modules/*`: assessment, auth, participants, dashboard)
- `frontend/` - Next.js app
- `data/` - original Excel file; its content is converted to `backend/src/data/*.json`

## Run locally
1. Create a PostgreSQL database and copy `backend/.env.example` to `backend/.env`.
2. Backend: `cd backend && npm install && npx prisma migrate dev && npx prisma generate && npx prisma db seed && npm run dev`
3. Frontend: copy `frontend/.env.example` to `frontend/.env.local`, then `cd frontend && npm install && npm run dev`
4. Tests: `cd backend && npm test`

## Demo accounts
- Facilitator: facilitator@talentology.test / Password123!
- Manager: manager@talentology.test / Password123!
- Participants: sign in as the facilitator and use "Copy invite link" next to a pending participant.

## Notes and assumptions
- The Excel sheet has profile names and keywords but no full descriptions. The descriptions shown are short texts written for this prototype.
- Ties between dimensions are broken in the fixed order D, I, S, C.
- The D/I/S/C mapping stays on the server; the participant only receives the words.
- Seeded demo data is generated with the real scoring code.
