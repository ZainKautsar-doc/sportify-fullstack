export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  role: UserRole;
  name: string;
  email: string;
  createdAt?: string;
}

export interface Field {
  id: number;
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
  total_price: number;
  created_at: string;
  // JOINed fields
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

export interface AvailabilitySlot {
  time: string;      // "13:00", "14:00", ...
  available: boolean;
}

export interface AdminPayment {
  payment_id: number;
  booking_id: number;
  field_name: string;
  user_name: string;
  booking_date: string;
  time: string;
  status: 'pending' | 'verified' | 'rejected';
  payment_proof: string;
}
