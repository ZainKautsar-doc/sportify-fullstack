export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  role: UserRole;
  name: string;
}

export interface Field {
  id: number;
  venue_id: number;
  name: string;
  type: string;
  price_per_hour: number;
}

export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'completed';

export interface Booking {
  id: number;
  user_id: number;
  field_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  created_at: string;
  field_name: string;
  field_type: string;
  price_per_hour: number;
  user_name: string;
}

export interface Payment {
  id: number;
  booking_id: number;
  amount: number;
  proof_url: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

export interface AdminStats {
  totalBookings: number;
  pendingBookings: number;
  revenue: number;
}
