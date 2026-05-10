# QStash Campaign Implementation Plan

## Overview
This plan improves your email campaign flow using QStash on a Next.js + Prisma app.
The goal is to make campaigns safe, dynamic, and production-ready while keeping the free QStash constraint:
- no automatic retry
- no localhost callbacks in QStash
- safe queueing and status tracking

## Constraints
- QStash webhooks require a public `https://` callback URL.
- Local development uses ngrok for callback routing.
- Free version means no retry logic for failed email jobs.
- Campaigns must not be re-triggered repeatedly from the UI.

## Phase 1: Safety & Validation (current focus)
1. ✅ Protect `/api/campaigns/queue`
   - reject if campaign is not `PENDING`
   - return `Campaign already queued` when pending jobs already exist
   - prevent duplicate queue creation
   - keep status updates consistent
2. ✅ Validate campaign input and subscriber counts
   - validate subject/body non-empty, trimmed, length limits
   - validate subject max 200 chars, body max 10000 chars
   - reject campaign creation if no subscribers exist
   - queue route validates subscribers before enqueueing
   - UI shows character counts and better error messages
3. ✅ Ensure callback URL validation for QStash
4. ✅ Keep UI disabled for non-queueable campaigns
5. ✅ Subscriber validation and list management
   - validate email format with regex
   - enforce email uniqueness
   - validate name max 100 chars
   - add DELETE endpoint for removing subscribers
   - add PUT endpoint for editing subscribers
   - improve UI with delete buttons and error handling
   - show total subscriber count

## Phase 2: Campaign model and dynamic behavior
1. Add richer campaign fields:
   - `name` / `title`
   - `senderName`, `senderEmail`
   - `previewText`
   - `scheduledAt`
   - `isDraft`
2. Support campaign drafts and edits
3. Add audience/recipient selection or segmentation
4. Add campaign detail view and preview

## Phase 3: Subscriber management
1. Full CRUD for subscribers
2. Validate email format and uniqueness
3. Show subscriber counts and status
4. Support selection of recipients for each campaign

## Phase 4: Vercel deployment and production config ✅ (Documented)
1. ✅ Comprehensive Vercel deployment guide created
2. ✅ Environment variable requirements documented
3. ✅ QStash callback URL requirements clarified
4. ✅ Troubleshooting guide provided
5. ✅ Testing procedures documented
6. ✅ Rollback procedures documented

## Vercel Deployment Checklist

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository with your code pushed
- Neon database URL (should already have from dev)
- QStash token (already have)
- SMTP credentials (already have)

### Step 1: Deploy to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select the project root (should be `/my-app` or similar)
4. Click "Deploy"
   - First deployment will fail without env vars (this is expected)

### Step 2: Configure Environment Variables in Vercel Dashboard
After initial deployment, go to:
- Project Settings → Environment Variables
- Add the following variables:

```
DATABASE_URL=postgresql://... (your Neon URL)
NEXTAUTH_URL=https://your-vercel-app.vercel.app
NEXTAUTH_SECRET=some-random-long-string (generate new one, different from dev)
NEXT_PUBLIC_BASE_URL=https://your-vercel-app.vercel.app
BASE_URL=https://your-vercel-app.vercel.app

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=askviosatech@gmail.com
EMAIL_FROM=askviosatech@gmail.com
EMAIL_PASS=stmb qonc okhh wcxp

QSTASH_TOKEN=eyJVc2VySUQiOiI1MWNmNzdmZC1jY2Y0LTQ0ZjEtYjIzYS03NmM4NzcxZjI0ODciLCJQYXNzd29yZCI6IjgzYzlkNWJlMGU3OTRkN2Y5NmI5ZDc4ZjczZjQ4YmQ2In0=
QSTASH_URL=https://qstash-us-east-1.upstash.io
```

### Step 3: Redeploy with Environment Variables
1. After adding env vars, click "Deployments" tab
2. Click the failed deployment (or "Redeploy" on latest)
3. Select "Redeploy" to use new env vars
4. Wait for deployment to complete

### Step 4: Verify Deployment
1. Go to your Vercel URL: `https://your-vercel-app.vercel.app`
2. Test login with credentials from seed:
   - Email: `admin@gmail.com`
   - Password: `admin123`
3. Try creating a campaign
4. Try adding subscribers
5. Try queueing the campaign via QStash

### Step 5: Test QStash Integration
QStash will now call your Vercel app at:
`https://your-vercel-app.vercel.app/api/email/send`

To verify it's working:
1. Create a campaign
2. Add 1-2 test subscribers
3. Click "Send Now" to queue the campaign
4. Check your email inbox for the emails
5. Check Vercel logs for any errors:
   - Go to Deployments → Function Logs
   - Look for `/api/campaigns/queue` and `/api/email/send` logs

### Troubleshooting

**Problem: Auth redirects to localhost**
- Solution: Check `NEXTAUTH_URL` is set to your Vercel domain

**Problem: Campaign queue fails with "loopback address" error**
- Solution: Check `NEXT_PUBLIC_BASE_URL` and `BASE_URL` are set to your Vercel domain

**Problem: QStash doesn't deliver emails**
- Solution: Check SMTP credentials and verify `/api/email/send` is receiving requests

**Problem: Database connection fails**
- Solution: Verify `DATABASE_URL` is correct and Neon network access allows Vercel IPs

### Optional: Set Up Custom Domain
1. In Vercel Project Settings → Domains
2. Add your custom domain
3. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_BASE_URL` to use custom domain
4. Redeploy

### Important Notes
- **Never commit `.env` to Git** - use Vercel dashboard only
- **Generate new `NEXTAUTH_SECRET`** for production (different from dev)
- **Test login and campaigns thoroughly** before going live
- **Monitor Vercel logs** after deployment for errors
- **Free tier limitations**: Function timeout 10s, 6GB bandwidth/month


## Checklist
- [x] Step 1: Safe queue validation and duplicate protection in `/api/campaigns/queue`
- [x] Step 2: Campaign input validation (subject/body length, required fields, subscriber count check)
- [x] Step 3: Queue route validation (subscribers check, status validation, error messages)
- [x] Step 4: UI improvements (character count display, better error messages, button tooltips)
- [x] Step 5: Subscriber validation and list management (email format, uniqueness, CRUD operations)
- [x] Step 5a: Fix hydration mismatch with consistent date formatting
- [x] Step 6: Vercel production config documentation and deployment guide

## Phase 1 Completion Status
✅ All Phase 1 steps completed
✅ All Phase 2-4 documentation complete
✅ App is ready for Vercel deployment

## What's Next
Follow the `VERCEL_DEPLOYMENT.md` guide to:
1. Deploy to Vercel
2. Configure environment variables
3. Test the production deployment
4. Verify QStash integration works end-to-end


## Step 1 Implementation details
- Only `PENDING` campaigns can be queued.
- Reject `PROCESSING` and `SENT` campaigns.
- If pending queue jobs already exist for a campaign, do not create new jobs.
- Keep the queue route deterministic and safe for repeated calls.

## Next validation step
Once Step 1 is verified, we will:
- add campaign creation validation and drafts
- tighten the subscriber section
- deploy the proper env values to Vercel
