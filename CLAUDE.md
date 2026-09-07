# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Additional rules

Before writing or editing code, also read the rule packs under `.claude/rules/ecc/` (`common/`, `typescript/`, `web/`) — coding style, testing, security, and performance conventions imported from the ECC marketplace. These apply on top of everything else in this file; where they conflict with project-specific guidance above, this file wins.

## Repository layout

This repo actually contains **two independent projects with separate git histories**:

- **`/` (root)** — Next.js portfolio frontend. This is the git repository Claude Code operates in.
- **`/backend`** — NestJS API. It has its own `.git` directory (currently an unborn `master` branch with no commits) and is *not* tracked by the root repo — `git status` at the root shows it as a single untracked `backend/` entry. Treat it as a separate project: run its commands from inside `backend/`, and don't expect root-level `git` commands to see inside it.

Run all frontend commands from the repo root and all backend commands from `backend/`.

## Commands

### Frontend (root)

```bash
npm run dev      # next dev (Turbopack), http://localhost:3000
npm run build     # next build
npm run start     # next start (serve production build)
npm run lint      # eslint
```

There is no frontend test suite/script configured.

### Backend (`backend/`)

```bash
npm run start:dev         # nest start --watch, http://localhost:8000
npm run build              # nest build
npm run lint                # eslint --fix on src/apps/libs/test
npm run format              # prettier --write src/**/*.ts test/**/*.ts

npm test                    # jest unit tests (*.spec.ts colocated with source)
npm run test:watch
npm run test:cov
npm run test:e2e            # jest -c test/jest-e2e.json (test/*.e2e-spec.ts)

npx jest src/auth/auth.service.spec.ts   # run a single unit test file
npx jest -t "some test name"              # run tests matching a name
```

Prisma (schema at `backend/prisma/schema.prisma`, client generated to `backend/generated/prisma`):

```bash
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

The backend listens on `PORT` (default `8000`) and serves everything under the global prefix `/api/v1`; Swagger docs are at `/api/docs`.

## Architecture

### Frontend: single-page portfolio + admin panel

`app/page.tsx` renders one scrolling page composed of section components (`Hero`, `About`, `Skills`, `Projects`, `Contact`, plus a floating `AIChat` widget and `FloatingDock` nav) inside a fixed-height glass-morphism container over a WebGL `Iridescence` background. `app/layout.tsx` wraps everything with a global mechanical-keyboard sound/visual effect (`components/ui/keyboard.tsx`) and click-spark cursor effects.

`app/admin/` is a separate authenticated area (`/admin/login`, `/admin/dashboard`) for managing site content (projects, skills, about, CV, contact messages) via `Admin*` components in `app/components/`. Auth state is checked by calling the backend (`GET /admin/checkAuth`) on mount and redirecting to `/admin/login` on failure.

All backend calls go through the shared axios instance in `lib/axios.ts`, which points at `NEXT_PUBLIC_API_BASE_URL`, falling back to `http://localhost:8000/api/v1` in dev and a hardcoded Vercel URL in production.

**Frontend/backend are out of sync**: the admin dashboard and `Tracker.jsx` call endpoints like `/admin/checkAuth`, `/admin/logout`, `/projects`, `/skills`, `/about`, `/track/visit` that do not exist yet in the NestJS backend — only `/profile` and `/auth/*` are implemented (see below). Before wiring up new frontend features against the backend, check whether the corresponding controller actually exists.

### Backend: NestJS modules, mostly scaffolded

`backend/src/app.module.ts` wires up three feature modules:

- **`profile/`** — `GET /profile`. Currently returns a hardcoded mock `Profile` object, not backed by Prisma yet, even though `Profile` exists as a full model in `prisma/schema.prisma`.
- **`auth/`** — admin-only auth, not user auth. Login flow is email+password (`LocalStrategy`) → OTP emailed via `EmailService` → `POST /auth/verify-otp` exchanges the OTP for a JWT. Also supports Google OAuth (`GoogleStrategy`) as an alternate login path. Both paths hard-restrict access to the single admin email (`SMTP_USER` or a hardcoded fallback) — there is no general user signup.
- **`email/`** — thin wrapper around `nodemailer` (Gmail SMTP) used only to send OTP emails today.

The Prisma schema (`backend/prisma/schema.prisma`) already models the full site's content — `Profile`, `SocialLink`, `Skill`, `Project`/`ProjectSkill`, `Experience`, `Education`, `Testimonial`, `ContactMessage`, `Admin` — but most of these models have no corresponding NestJS module/controller yet. When adding a new admin-manageable content type, follow the existing module pattern (`profile/`: `*.module.ts` + `*.controller.ts` + `*.service.ts`) and back it with Prisma instead of a mock object.

`PrismaService` (`backend/src/prisma.service.ts`) is provided directly in modules that need it (see `auth.module.ts`) rather than via a shared global `PrismaModule`.

### Env vars

Backend `.env` (gitignored) requires: `DATABASE_URL`/`POSTGRES_URL`/`PRISMA_DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`.

Frontend reads `NEXT_PUBLIC_API_BASE_URL` to locate the backend.
