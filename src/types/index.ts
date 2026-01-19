export interface User {
  id: string;
  email: string;
  role: 'admin' | 'restaurant' | 'server';
  restaurantId?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface DaySchedule {
  closed: boolean;
  slots: TimeSlot[];
}

export interface OpeningHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface TableType {
  id?: string;
  type: string;
  quantity: number;
  capacity: number;
}

export interface Restaurant {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  apiKey?: string;
  status: 'active' | 'inactive';
  logoUrl?: string;
  menu: {
    displayMode: 'pdf' | 'detailed' | 'both';
    pdfUrl?: string;
    qrCodeGenerated?: boolean;
  };
  openingHours: OpeningHours;
  tablesConfig: {
    mode: 'simple' | 'detailed';
    totalTables?: number;
    averageCapacity?: number;
    tables?: TableType[];
  };
  reservationConfig: {
    defaultDuration: number;
    useOpeningHours: boolean;
    averagePrice?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateRestaurantInput {
  name: string;
  address: string;
  phone: string;
  email: string;
  tablesConfig?: {
    totalTables?: number;
    averageCapacity?: number;
  };
}

export interface UpdateRestaurantInput {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  status?: 'active' | 'inactive';
  tablesConfig?: {
    totalTables?: number;
    averageCapacity?: number;
  };
}

export interface Closure {
  _id: string;
  restaurantId: string;
  startDate: string;
  endDate: string;
  reason?: string;
  createdAt: string;
}

export interface CreateClosureInput {
  startDate: string;
  endDate?: string;
  reason?: string;
}

export interface MenuCategory {
  _id: string;
  restaurantId: string;
  name: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
}

export interface UpdateCategoryInput {
  name?: string;
  displayOrder?: number;
}

export interface DishVariation {
  id?: string;
  name: string;
  price: number;
}

export interface Dish {
  _id: string;
  restaurantId: string;
  categoryId: string | { _id: string; name: string } | null;
  name: string;
  description?: string;
  price: number;
  hasVariations: boolean;
  variations: DishVariation[];
  allergens: string[];
  available: boolean;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDishInput {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  hasVariations?: boolean;
  variations?: DishVariation[];
  allergens?: string[];
  available?: boolean;
}

export interface UpdateDishInput {
  categoryId?: string;
  name?: string;
  description?: string;
  price?: number;
  hasVariations?: boolean;
  variations?: DishVariation[];
  allergens?: string[];
  available?: boolean;
}

export interface Reservation {
  _id: string;
  restaurantId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  numberOfGuests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  numberOfGuests: number;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  sendEmail?: boolean;
}

export interface UpdateReservationInput {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  date?: string;
  time?: string;
  numberOfGuests?: number;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  sendEmail?: boolean;
}

export interface DayBlock {
  _id: string;
  restaurantId: string;
  date: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDayBlockInput {
  date: string;
  reason?: string;
}

export interface BulkCreateDayBlocksInput {
  dates: string[];
  reason?: string;
}

export interface ServerUser {
  id: string;
  email: string;
  role: 'server';
  status: 'active' | 'inactive';
  restaurantId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateServerUserInput {
  email: string;
  password: string;
}

export interface UpdateServerUserInput {
  email?: string;
  password?: string;
  status?: 'active' | 'inactive';
}

export interface RestaurantAnalytics {
  period: string;
  dateRange: {
    start: string;
    end: string;
  };
  summary: {
    totalReservations: number;
    totalGuests: number;
    averageGuestsPerReservation: number;
    occupationRate: number;
    estimatedRevenue: number;
  };
  dailyStats: Array<{
    date: string;
    reservations: number;
    guests: number;
    revenue: number;
  }>;
  statusDistribution: Record<string, number>;
  topTimeSlots: Array<{
    hour: string;
    count: number;
  }>;
}
