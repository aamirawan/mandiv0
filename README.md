# Mandi Marketplace

An agricultural marketplace platform connecting farmers, wholesalers, and retailers.

## Features

- Products listing with categories, grades, and pricing
- Inventory management system
- Real-time market price tracking
- Online auction system for bulk agricultural commodities

## Setup Instructions

### 1. Environment Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/aamirawan/mandiv0.git
cd mandiv0
npm install
```

### 2. Supabase Setup

1. Create a Supabase account at [https://app.supabase.com/](https://app.supabase.com/) if you don't have one
2. Create a new project
3. Get your Supabase URL and Anon Key from Project Settings > API
4. Create a `.env.local` file in the project root (or copy from `.env.local.example`) with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Database Setup

1. In your Supabase dashboard, go to the SQL Editor
2. Run the SQL from `supabase-schema.sql` to create all required tables
3. Run the SQL from `sample-products.sql` to insert sample data

### 4. Storage Setup

1. In your Supabase dashboard, go to Storage
2. Create a new bucket named `product-images`
3. In the bucket settings, make it public (if you want public access to images)
4. Set up Row Level Security for the bucket (recommended):
   - To allow authenticated users to upload images
   - To allow anyone to view images

### 5. Development Server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Troubleshooting

### If products aren't showing up:

1. Check that your Supabase URL and key are correct in `.env.local`
2. Verify that you've run the database schema and sample data SQL scripts
3. Check the browser console for errors
4. Make sure your Supabase tables have the proper RLS policies enabled

### If image uploads are failing:

1. Verify that the `product-images` bucket exists in your Supabase storage
2. Check that your bucket permissions allow authenticated users to upload
3. Ensure your Supabase configuration has sufficient storage quota

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
