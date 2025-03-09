# Supabase Setup for Mandi Marketplace

This guide will help you set up Supabase for your Mandi Marketplace application.

## Prerequisites

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new Supabase project

## Setup Steps

### 1. Get Your Supabase Credentials

After creating your Supabase project, go to the project settings and find:

- **Project URL**: This will be your `NEXT_PUBLIC_SUPABASE_URL`
- **API Keys**: Find the `anon` public key, this will be your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Update Environment Variables

1. Open the `.env.local` file in your project root
2. Replace the placeholder values with your actual Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
```

### 3. Create Database Tables

1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql` from this project
3. Run the SQL script to create all necessary tables and policies

### 4. Set Up Storage (Optional)

If you want to store product images:

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `product-images`
3. Set the bucket to public or configure appropriate access policies

### 5. Authentication (Optional)

If you want to implement user authentication:

1. Go to Authentication in your Supabase dashboard
2. Configure the authentication providers you want to use (Email, Google, etc.)
3. Update the authentication settings as needed

## Using Supabase in the Application

The application is already set up to use Supabase. Here's how it works:

1. **Supabase Client**: The client is initialized in `lib/supabase.ts`
2. **Supabase Provider**: A React context provider is set up in `lib/supabase-provider.tsx`
3. **Database Services**: CRUD operations are defined in `lib/supabase-service.ts`

## Testing Your Setup

1. Start your Next.js application: `npm run dev`
2. Try adding a new product through the UI
3. Check your Supabase dashboard to see if the data was correctly inserted

## Troubleshooting

- **CORS Issues**: Make sure your Supabase project has the correct URL in the allowed domains
- **Authentication Errors**: Check that your API keys are correctly set in the `.env.local` file
- **Database Errors**: Verify that your tables are created correctly using the SQL script

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Supabase Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs) 