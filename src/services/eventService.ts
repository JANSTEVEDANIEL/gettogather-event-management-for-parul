import { supabase } from '../lib/supabase';
import { Event, User } from '../types';
import { startOfToday, endOfToday, startOfWeek, endOfWeek, addWeeks, startOfMonth, endOfMonth } from 'date-fns';

const mapSupabaseEvent = (item: any): Event => ({
  id: item.id,
  title: item.title,
  description: item.description,
  date: new Date(item.date),
  time: item.time,
  location: item.location,
  category: item.category,
  organizer: {
    id: item.organizer?.id || 'unknown',
    name: item.organizer?.name || 'Unknown Organizer',
    email: item.organizer?.email || '',
    avatar: item.organizer?.avatar_url,
    role: 'user',
  } as User,
  attendees: item.attendees?.map((a: any) => ({
    id: a.user.id,
    name: a.user.name,
    email: a.user.email,
    avatar: a.user.avatar_url,
    role: 'user',
  })) || [],
  maxAttendees: item.max_attendees,
  image: item.image_url,
  tags: item.tags || [],
  status: item.status,
  createdAt: new Date(item.created_at),
});

export class EventService {
  async createEvent(eventData: Partial<Event>): Promise<Event | null> {
    if (!supabase) {
      console.warn("createEvent called in mock mode.");
      alert("Supabase not configured. Cannot create event.");
      return null;
    }
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();
    
    if (error) throw error;
    return data ? mapSupabaseEvent(data) : null;
  }

  async getEvents(filters?: { 
    category?: string; 
    status?: string; 
    search?: string; 
    dateRange?: 'today' | 'this_week' | 'next_week' | 'this_month';
  }): Promise<Event[]> {
    if (!supabase) return [];
    
    let query = supabase
      .from('events')
      .select(`*, organizer:users(id, name, avatar_url, email), attendees:event_attendees(user:users(id, name, avatar_url, email))`)
      .order('date', { ascending: true });

    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.search) query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);

    if (filters?.dateRange) {
      const today = new Date();
      let startDate, endDate;

      switch (filters.dateRange) {
        case 'today':
          startDate = startOfToday();
          endDate = endOfToday();
          break;
        case 'this_week':
          startDate = startOfWeek(today, { weekStartsOn: 1 });
          endDate = endOfWeek(today, { weekStartsOn: 1 });
          break;
        case 'next_week':
          startDate = startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });
          endDate = endOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });
          break;
        case 'this_month':
          startDate = startOfMonth(today);
          endDate = endOfMonth(today);
          break;
      }
      
      if (startDate && endDate) {
        query = query.gte('date', startDate.toISOString());
        query = query.lte('date', endDate.toISOString());
      }
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching events:", error);
      return [];
    }
    return data.map(mapSupabaseEvent);
  }

  async getEventById(id: string): Promise<Event | null> {
    if (!supabase) return null;
    const { data, error } = await supabase.from('events').select(`*, organizer:users(*), attendees:event_attendees(user:users(*))`).eq('id', id).single();
    if (error) throw error;
    return data ? mapSupabaseEvent(data) : null;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
    if (!supabase) return null;
    const { data, error } = await supabase.from('events').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data ? mapSupabaseEvent(data) : null;
  }

  async deleteEvent(id: string): Promise<void> {
    if (!supabase) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
  }

  async joinEvent(eventId: string, userId: string) {
    if (!supabase) return null;
    const { data, error } = await supabase.from('event_attendees').insert([{ event_id: eventId, user_id: userId }]).select().single();
    if (error) throw error;
    return data;
  }

  async leaveEvent(eventId: string, userId: string) {
    if (!supabase) return;
    const { error } = await supabase.from('event_attendees').delete().match({ event_id: eventId, user_id: userId });
    if (error) throw error;
  }

  async uploadEventImage(file: File, eventId: string): Promise<string | null> {
    if (!supabase) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${eventId}-${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage.from('event-images').upload(fileName, file);
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage.from('event-images').getPublicUrl(fileName);
    return publicUrl;
  }
}

export const eventService = new EventService();
