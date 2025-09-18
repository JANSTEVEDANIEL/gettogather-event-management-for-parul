# Gettogather - Parul University Event Management

A modern event management platform for Parul University, Vadodara, built with React, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Authentication System** - Google OAuth and email/password login
- 📱 **Social Media UI** - Instagram/Facebook-inspired feed layout
- 🎯 **Event Management** - Create, view, and manage university events
- 👥 **User Roles** - Admin and regular user dashboards
- 📅 **Calendar Integration** - Interactive calendar view
- 🔍 **Search & Filter** - Find events by category, date, or keywords
- 📊 **Analytics Dashboard** - Admin insights and statistics
- 💬 **Social Features** - Like, comment, and share events

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Routing**: React Router
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Supabase (Database, Auth, Storage)
- **Deployment**: Netlify/Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn package manager
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
4. Add your Supabase credentials to `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Start the development server:
   ```bash
   yarn dev
   ```

## Supabase Setup

### Database Schema

The application requires the following tables in Supabase:

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  avatar_url VARCHAR,
  role VARCHAR DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  department VARCHAR,
  year VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time VARCHAR NOT NULL,
  location VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  organizer_id UUID REFERENCES users(id),
  max_attendees INTEGER,
  image_url VARCHAR,
  tags TEXT[],
  status VARCHAR DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Event Attendees Table
```sql
CREATE TABLE event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);
```

### Storage Buckets

Create a storage bucket named `event-images` for event image uploads.

### Row Level Security (RLS)

Enable RLS on all tables and create appropriate policies for user access control.

## Demo Credentials

For testing without Supabase:
- **Student**: student@paruluniversity.ac.in
- **Admin**: admin@paruluniversity.ac.in
- **Password**: Any password (demo mode)

## Features Overview

### For Students
- View event feed with social media-like interface
- Join/leave events with one click
- Search and filter events by category
- Calendar view for event scheduling
- Profile management

### For Admins
- Complete event management (CRUD operations)
- User management and analytics
- Event analytics and reporting
- Bulk operations and moderation tools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Deployment

The application is configured for easy deployment on:
- **Netlify**: Connect your Git repository
- **Vercel**: Import project and set environment variables

## License

MIT License - see LICENSE file for details

## Support

For support or questions, please open an issue in the repository.
