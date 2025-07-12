# Supabase Setup Guide

## 🚀 **Quick Setup Steps**

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project
4. Wait for setup to complete (~2 minutes)

### 2. Get Your Keys
1. Go to Project Settings → API
2. Copy your:
   - **Project URL** 
   - **Anon/Public Key**

### 3. Add Environment Variables
Create `.env.local` file:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
\`\`\`

### 4. Run Database Setup
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the SQL from `scripts/create-tables.sql`
3. Click "Run" to create all tables

### 5. Configure Authentication
In Supabase Dashboard → Authentication → Settings:

**Site URL:** `http://localhost:3000` (development)
**Redirect URLs:** 
- `http://localhost:3000/auth/callback`
- `https://yourdomain.com/auth/callback` (production)

**Enable Providers:**
- ✅ Email (enabled by default)
- ✅ Google OAuth (optional)
- ✅ Facebook OAuth (optional)
- ✅ Apple OAuth (optional)

## 🎯 **What You Get**

### ✅ **Real User Accounts**
- Email/password authentication
- Social login (Google, Facebook, Apple)
- Password reset functionality
- Email verification

### ✅ **Persistent Data**
- User profiles stored in database
- Bookings saved permanently
- Reviews and ratings
- Cross-device synchronization

### ✅ **Security**
- Row Level Security (RLS) enabled
- Users can only see their own data
- Secure API endpoints
- JWT token authentication

### ✅ **Scalability**
- Handles thousands of users
- Real-time updates
- Automatic backups
- Global CDN

## 🔧 **Testing**

### Development:
\`\`\`bash
npm run dev
\`\`\`

### Production:
Update environment variables with production URLs

## 📊 **Database Schema**

### Users Table
- `id` (UUID, Primary Key)
- `email` (Unique)
- `first_name`, `last_name`
- `avatar_url`
- `provider` (email/google/facebook/apple)
- `created_at`, `updated_at`

### Bookings Table
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key → users)
- `service_name`, `service_price`, `service_duration`
- `appointment_date`, `appointment_time`
- `status` (confirmed/rescheduled/cancelled/completed)
- `deposit_paid`, `remaining_balance`
- `notes`, `cancellation_reason`
- `created_at`, `updated_at`

### Reviews Table
- `id` (UUID, Primary Key)
- `booking_id` (Foreign Key → bookings)
- `user_id` (Foreign Key → users)
- `rating` (1-5 stars)
- `comment`, `photos`
- `helpful_count`, `verified`
- `created_at`, `updated_at`

## 🚨 **Important Notes**

1. **Email Verification**: Users must verify email before signing in
2. **Row Level Security**: Automatically protects user data
3. **Free Tier**: 50,000 monthly active users
4. **Backups**: Automatic daily backups included
5. **Monitoring**: Built-in analytics and logging

## 🆘 **Troubleshooting**

### Common Issues:
1. **"Invalid API Key"** → Check environment variables
2. **"RLS Policy Error"** → Run the SQL setup script
3. **"Auth Redirect Error"** → Check redirect URLs in settings
4. **"CORS Error"** → Add your domain to allowed origins

### Support:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)
