# Apple Sign-In Setup Guide

## 🍎 **Apple Developer Configuration**

### 1. Apple Developer Account Setup
1. Go to [Apple Developer Portal](https://developer.apple.com)
2. Sign in with your Apple ID
3. Enroll in Apple Developer Program ($99/year)

### 2. Create App ID
1. Go to **Certificates, Identifiers & Profiles**
2. Click **Identifiers** → **App IDs**
3. Click **+** to create new App ID
4. Select **App** → **Continue**
5. Fill in:
   - **Description**: PrettyStyles Web App
   - **Bundle ID**: `com.prettystyles.signin`
   - **Capabilities**: Check ✅ **Sign In with Apple**
6. Click **Continue** → **Register**

### 3. Create Service ID
1. Go to **Identifiers** → **Services IDs**
2. Click **+** to create new Service ID
3. Fill in:
   - **Description**: PrettyStyles Web Service
   - **Identifier**: `com.prettystyles.signin.service`
4. Check ✅ **Sign In with Apple**
5. Click **Configure** next to Sign In with Apple
6. Add domains and URLs:
   - **Primary App ID**: Select your App ID from step 2
   - **Domains**: `prettyystyyles.vercel.app`
   - **Return URLs**: 
     - `https://prettyystyyles.vercel.app/auth/apple/callback`
     - `https://prettyystyyles.vercel.app/auth/callback`
     - `http://localhost:3000/auth/apple/callback` (for development)
     - `http://localhost:3000/auth/callback` (for development)
7. Click **Save** → **Continue** → **Register**

### 4. Create Private Key
1. Go to **Keys**
2. Click **+** to create new key
3. Fill in:
   - **Key Name**: PrettyStyles Apple Sign-In Key
   - **Services**: Check ✅ **Sign In with Apple**
4. Click **Configure** → Select your **Primary App ID**
5. Click **Save** → **Continue** → **Register**
6. **Download the .p8 file** (you can only download once!)
7. Note the **Key ID** (10 characters)

## 🔧 **Supabase Configuration**

### 1. Enable Apple OAuth in Supabase
1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **Apple** and click **Enable**
3. Fill in the configuration:

\`\`\`env
# Apple OAuth Configuration
APPLE_CLIENT_ID=com.prettystyles.signin.service
APPLE_SECRET_KEY=-----BEGIN PRIVATE KEY-----
[Your .p8 file content here]
-----END PRIVATE KEY-----
APPLE_KEY_ID=ABC123DEFG
APPLE_TEAM_ID=DEF456GHIJ
\`\`\`

### 2. Get Your Team ID
1. Go to Apple Developer Portal
2. Click your name (top right) → **View Membership**
3. Copy your **Team ID** (10 characters)

### 3. Configure Redirect URLs
In Supabase Authentication Settings:
- **Site URL**: `https://prettyystyyles.vercel.app`
- **Redirect URLs**: 
  - `https://prettyystyyles.vercel.app/auth/callback`
  - `https://prettyystyyles.vercel.app/auth/apple/callback`
  - `http://localhost:3000/auth/callback` (for development)
  - `http://localhost:3000/auth/apple/callback` (for development)

## 🌐 **Environment Variables**

Add to your `.env.local` and Vercel environment variables:

\`\`\`env
# Apple Sign-In Configuration
NEXT_PUBLIC_APPLE_CLIENT_ID=com.prettystyles.signin.service
APPLE_TEAM_ID=your_team_id_here
APPLE_KEY_ID=your_key_id_here
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
your_private_key_content_here
-----END PRIVATE KEY-----"

# Production URL
NEXT_PUBLIC_API_URL=https://prettyystyyles.vercel.app
\`\`\`

### Vercel Environment Variables Setup:
1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable above
5. Make sure to set them for **Production**, **Preview**, and **Development**

## 🧪 **Testing**

### Development Testing:
1. Use Safari browser (best compatibility)
2. Test on `http://localhost:3000`
3. Check browser console for errors

### Production Testing:
1. Test on `https://prettyystyyles.vercel.app`
2. Test on Safari, Chrome, and mobile Safari
3. Verify redirect URLs work correctly
4. Test the complete flow: Sign In → Redirect → Account Page

## 🚨 **Important Notes**

1. **Browser Compatibility**: 
   - ✅ Safari (best)
   - ✅ iOS Safari
   - ⚠️ Chrome (limited)
   - ⚠️ Firefox (limited)

2. **Domain Requirements**:
   - Must use HTTPS in production
   - Domain must match registered domains exactly
   - `prettyystyyles.vercel.app` is your registered domain

3. **User Privacy**:
   - Users can choose to hide their email
   - Apple provides relay emails like `abc123@privaterelay.appleid.com`

4. **Rate Limits**:
   - Apple has rate limits on sign-in attempts
   - Implement proper error handling

## 🔍 **Troubleshooting**

### Common Issues:
1. **"Invalid client"** → Check Service ID configuration matches `com.prettystyles.signin.service`
2. **"Invalid redirect URI"** → Verify redirect URLs include `https://prettyystyyles.vercel.app/auth/callback`
3. **"Invalid key"** → Check private key format and Key ID
4. **Popup blocked** → User needs to allow popups
5. **CORS errors** → Check domain configuration in Apple Developer Portal

### Debug Steps:
1. Check browser console for JavaScript errors
2. Verify all environment variables are set in Vercel
3. Test in Safari first (best compatibility)
4. Check Supabase logs for OAuth errors
5. Verify your domain `prettyystyyles.vercel.app` is correctly configured

### Production Checklist:
- ✅ Apple Developer Service ID configured with `prettyystyyles.vercel.app`
- ✅ Supabase redirect URLs include production domain
- ✅ Environment variables set in Vercel
- ✅ Test Apple Sign-In on production site
- ✅ Verify callback URLs work correctly

## 📱 **Mobile Testing**

Since your site is live, test Apple Sign-In on:
1. **iPhone Safari** (best experience)
2. **iPad Safari**
3. **Mac Safari**
4. **Chrome on iOS** (limited support)

The Apple Sign-In button should work seamlessly on Apple devices and provide the best user experience for your hair salon clients!
