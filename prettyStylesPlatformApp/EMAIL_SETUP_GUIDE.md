# Email Setup Guide for Contact Form

## Current Status
✅ Contact form is set up to send to: **prettyystyyles@gmail.com**
⚠️ Currently in development mode (emails are logged, not sent)

## To Enable Real Email Sending

### Option 1: Resend (Recommended - Easiest)
1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add to `.env.local`: `RESEND_API_KEY=your_key_here`
4. Uncomment the Resend code in `/app/api/contact/route.ts`

### Option 2: Gmail SMTP (Free)
1. Enable 2-factor authentication on Gmail
2. Generate an "App Password" in Gmail settings
3. Add to `.env.local`:
   \`\`\`
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=prettyystyyles@gmail.com
   SMTP_PASS=your_app_password
   \`\`\`

### Option 3: SendGrid
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Get your API key
3. Add to `.env.local`: `SENDGRID_API_KEY=your_key_here`

## Testing
- Development: Check browser console for form submissions
- Production: Test with a real email service configured

## Security Notes
- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Validate and sanitize all form inputs
