# Supabase Email Confirmation Setup

## 1. Configure Redirect URLs

In your Supabase Dashboard:

1. Go to **Authentication > Settings**
2. Scroll to **Redirect URLs**
3. Add these URLs:

**Development:**
\`\`\`
http://localhost:3000/auth/confirm
\`\`\`

**Production:**
\`\`\`
https://yourdomain.com/auth/confirm
\`\`\`

## 2. Email Templates (Optional)

You can customize the confirmation email template:

1. Go to **Authentication > Email Templates**
2. Select "Confirm signup"
3. Customize the email content and styling

## 3. Test the Flow

1. Try creating an account with a real email
2. Check your email for the confirmation link
3. Click the link to confirm
4. You'll be redirected to the confirmation page
5. Then redirected back to sign in

## 4. Email Settings

Make sure these are configured:
- ✅ **Enable email confirmations** (should be ON)
- ✅ **Secure email change** (recommended)
- ✅ **Double confirm email changes** (recommended)

## Troubleshooting

- **Link doesn't work**: Check redirect URLs are correct
- **No email received**: Check spam folder, verify SMTP settings
- **Confirmation fails**: Check browser console for errors
