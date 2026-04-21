# Supabase Database Management

This directory contains the database schema and seeding scripts for the Taichung 8th Anniversary Event.

## Files
- `schema.sql`: Defines the tables, indexes, and RLS policies.
- `seed.sql`: Initial data for the 8 stamp points and 3 hidden points.

## How to Apply
1. Go to the [Supabase Dashboard](https://supabase.com/dashboard).
2. Open the **SQL Editor**.
3. Create a **New Query**.
4. Copy and paste the contents of `schema.sql` and run it.
5. (Optional) Run `seed.sql` to populate initial QR code data.

## Table Structure
- **users**: Stores LINE users and their cumulative tickets.
- **stamp_configs**: Master list of QR code UUIDs and their locations.
- **stamps**: Records which user collected which stamp.
- **draws**: Daily reward records.

## Rotating Logic
Points **02, 05, and 06** are designed to rotate. Each has multiple variants in `stamp_configs`. The API automatically activates a random variant if it detects the daily rotation is needed.
