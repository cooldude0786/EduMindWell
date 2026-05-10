# Vercel Deployment Guide

## Quick Start

This guide walks you through deploying your QStash email campaign app to Vercel.

### What you need
- Vercel account: https://vercel.com
- GitHub repository (code pushed)
- Neon database URL (from `.env` file)
- QStash token (from `.env` file)
- SMTP credentials (from `.env` file)

---

## Deployment Steps

### 1. Create Vercel Project

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Fill in project name (e.g., `my-email-app`)
5. Select root directory: `./` (unless your app is in a subdirectory)
6. Click "Deploy"
   - **This will fail** - we need to add environment variables first

### 2. Add Environment Variables

After the first deployment attempt, go to:
**Project → Settings → Environment Variables**

Add each variable below. Copy from your `.env` file:

#### Database
```
DATABASE_URL=postgresql://neondb_owner:npg_7q2XguHCPxmV@ep-green-sun-ao2f84nz-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

#### Authentication (IMPORTANT: Generate a new secret for production)
```
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=<generate-a-new-random-secret-here>
```

To generate `NEXTAUTH_SECRET`, run in terminal:
```bash
openssl rand -base64 32
```

#### Base URLs (must match your Vercel domain)
```
NEXT_PUBLIC_BASE_URL=https://your-app-name.vercel.app
BASE_URL=https://your-app-name.vercel.app
```

#### Email SMTP
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=askviosatech@gmail.com
EMAIL_FROM=askviosatech@gmail.com
EMAIL_PASS=stmb qonc okhh wcxp
```

#### QStash
```
QSTASH_TOKEN=eyJVc2VySUQiOiI1MWNmNzdmZC1jY2Y0LTQ0ZjEtYjIzYS03NmM4NzcxZjI0ODciLCJQYXNzd29yZCI6IjgzYzlkNWJlMGU3OTRkN2Y5NmI5ZDc4ZjczZjQ4YmQ2In0=
QSTASH_URL=https://qstash-us-east-1.upstash.io
```

**Save all variables.**

### 3. Redeploy with Environment Variables

1. Go to **Deployments** tab
2. Click the failed deployment (red X)
3. Click "Redeploy"
4. Wait for green checkmark
5. Go to your live URL: `https://your-app-name.vercel.app`

### 4. Test the Deployment

#### Login Test
- URL: `https://your-app-name.vercel.app/dashboard`
- Email: `admin@gmail.com`
- Password: `admin123`

#### Add Test Subscribers
1. Go to "Subscribers" section
2. Add 2-3 test subscribers with real email addresses
3. Verify they appear in the list

#### Test Campaign
1. Go to "Campaigns" section
2. Create a test campaign with subject and body
3. Click "Send Now"
4. Check your email inbox for the emails
5. Check progress on the dashboard

#### Check Logs
If anything fails, check Vercel logs:
1. Go to **Deployments**
2. Click latest deployment
3. Go to **Function Logs** tab
4. Look for errors in `/api/campaigns/queue` or `/api/email/send`

---

## Troubleshooting

### Error: "Campaign cannot be queued" / "Invalid publish URL"
**Cause**: `NEXT_PUBLIC_BASE_URL` or `BASE_URL` is set to localhost

**Fix**:
1. Go to Settings → Environment Variables
2. Update both to your Vercel domain: `https://your-app-name.vercel.app`
3. Redeploy

### Error: Auth redirects to localhost after login
**Cause**: `NEXTAUTH_URL` is incorrect

**Fix**:
1. Check Settings → Environment Variables
2. Set `NEXTAUTH_URL=https://your-app-name.vercel.app`
3. Redeploy

### Error: "QStash publish failed" / "invalid destination url"
**Cause**: QStash callback URL doesn't match Vercel domain

**Fix**:
1. Verify `NEXT_PUBLIC_BASE_URL` is your Vercel domain
2. QStash will call: `https://your-vercel-domain/api/email/send`
3. Test this URL in browser - should see an error but no 404

### Error: "No subscribers found" when creating campaign
**Cause**: You need to add subscribers first

**Fix**:
1. Go to Subscribers page
2. Add at least 1 email address
3. Try creating campaign again

### Emails not sending
**Cause**: SMTP credentials or email settings issue

**Fix**:
1. Verify EMAIL_USER, EMAIL_PASS are correct in Vercel
2. Check Vercel Function Logs for SMTP errors
3. Test SMTP credentials locally if needed

---

## Advanced Configuration

### Custom Domain

To use a custom domain instead of `*.vercel.app`:

1. Go to **Project Settings → Domains**
2. Add your custom domain
3. Follow Vercel's DNS instructions
4. Update environment variables:
   ```
   NEXTAUTH_URL=https://your-custom-domain.com
   NEXT_PUBLIC_BASE_URL=https://your-custom-domain.com
   BASE_URL=https://your-custom-domain.com
   ```
5. Redeploy

### Preview Deployments

Push changes to a branch:
- Vercel automatically creates a preview deployment
- Use preview URL to test before merging to main
- All env vars are available in preview

---

## Production Checklist

Before considering production-ready:

- [ ] Tested login with admin credentials
- [ ] Added multiple test subscribers
- [ ] Created and queued a campaign
- [ ] Received test emails
- [ ] Verified email content is correct
- [ ] Checked Function Logs for errors
- [ ] Set up custom domain (optional)
- [ ] Generated new NEXTAUTH_SECRET for production

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **QStash Docs**: https://upstash.com/docs/qstash/overview
- **Neon Docs**: https://neon.tech/docs

## Need to rollback?

If something goes wrong:
1. Go to **Deployments**
2. Find the last working deployment
3. Click "..." → "Promote to Production"
4. Your app will revert to that version
