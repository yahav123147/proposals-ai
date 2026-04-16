# AI Proposals Dashboard

A Next.js dashboard for creating, managing, and tracking professional PDF proposals with WhatsApp notifications.

## Features

- **Proposal Templates** — Premium, Generic, and Content AI templates with dark theme design
- **Sales Rep Dashboard** — Assign proposals to sales reps, track views and approvals
- **PDF Preview** — Real-time preview with mentor sections, social proof, and pricing
- **WhatsApp Notifications** — Automatic notifications when clients view or approve proposals (via Green API)
- **Template Editor** — Edit mentors, social proof, pricing, and content per proposal
- **Auth** — Password-protected access with sales rep roles

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Framer Motion
- Green API (WhatsApp)
- TypeScript

## Setup

```bash
# Install dependencies
pnpm install

# Set environment variables
cp .env.example .env.local

# Run dev server
pnpm dev
```

## Environment Variables

```bash
PROPOSALS_PASSWORD=your_secure_password
GREEN_API_INSTANCE_ID=your_instance_id
GREEN_API_TOKEN=your_token
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Structure

```
src/app/proposals/
  page.tsx                    # Dashboard entry
  Dashboard.tsx               # Sales rep dashboard
  ProposalPreview.tsx         # Full proposal preview/PDF
  login/                      # Auth pages
  new/                        # Create new proposal
  [id]/edit/                  # Edit existing proposal
  lib/
    auth.ts                   # Authentication
    types.ts                  # TypeScript interfaces
    storage.ts                # Local storage
    sales-reps.ts             # Sales rep configuration
    green-api.ts              # WhatsApp integration
    templates.ts              # Template definitions
    template-defaults.ts      # Default content
    template-storage.ts       # Template persistence
  templates/
    PremiumTemplate.tsx       # Premium dark template
    GenericTemplate.tsx       # Generic template
    ContentAITemplate.tsx     # Content AI template
    TemplateRenderer.tsx      # Template dispatcher
```

## License

MIT
