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

export interface TwoFactorAuthResponse {
  requiresTwoFactor: true;
  tempToken: string;
  userId: string;
  email: string;
  message: string;
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
  googleReviewLink?: string;
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
  googleReviewLink?: string;
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

// Notification Types
export interface PushSubscription {
  endpoint: string;
  keys: {
    auth: string;
    p256dh: string;
  };
}

export interface NotificationPreferences {
  userId: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  reservationCreated: boolean;
  reservationConfirmed: boolean;
  reservationCancelled: boolean;
  reservationUpdated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VapidPublicKeyResponse {
  publicKey: string;
}

export interface PushNotificationStatus {
  enabled: boolean;
  vapidPublicKey?: string;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: {
    url?: string;
    reservationId?: string;
    type: 'reservation_created' | 'reservation_confirmed' | 'reservation_cancelled' | 'reservation_updated' | 'general';
    [key: string]: any;
  };
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

// SSE Event Types
export type ReservationEventType = 'reservation_created' | 'reservation_updated' | 'reservation_cancelled' | 'reservation_confirmed' | 'reservation_completed';

export interface ReservationEvent {
  type: ReservationEventType;
  reservation: {
    id: string;
    customerName: string;
    customerEmail: string;
    date: string;
    time: string;
    numberOfGuests: number;
    status: string;
    restaurantId: string;
  };
  timestamp: string;
}

export interface SSEConnectedEvent {
  event: 'connected';
  data: {
    message: string;
  };
}

// Notification Analytics Types
export type NotificationType = 'push' | 'email' | 'sse';
export type NotificationEventType = 'reservation_created' | 'reservation_confirmed' | 'reservation_cancelled' | 'reservation_updated' | 'general' | 'system';
export type NotificationStatus = 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed';

export interface NotificationAnalytics {
  _id: string;
  userId: string;
  restaurantId: string;
  notificationType: NotificationType;
  eventType: NotificationEventType;
  status: NotificationStatus;
  sentAt: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  failedAt?: string;
  errorCode?: string;
  errorMessage?: string;
  pushEndpoint?: string;
  pushMessageId?: string;
  emailTo?: string;
  emailMessageId?: string;
  sseClientId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationTypeStats {
  _id: NotificationType;
  count: number;
  delivered: number;
  failed: number;
  deliveryRate: number;
}

export interface NotificationEventStats {
  _id: NotificationEventType;
  count: number;
  delivered: number;
  failed: number;
}

export interface DailyNotificationStats {
  date: string;
  totalSent: number;
  delivered: number;
  deliveryRate: number;
}

export interface RestaurantNotificationStats {
  restaurantId: string;
  restaurantName: string;
  totalNotifications: number;
  deliveryRate: number;
}

export interface NotificationChannelSummary {
  push: {
    total: number;
    delivered: number;
    deliveryRate: number;
  };
  email: {
    total: number;
    delivered: number;
    deliveryRate: number;
  };
  sse: {
    total: number;
    delivered: number;
    deliveryRate: number;
  };
}

export interface GlobalNotificationAnalytics {
  totalNotifications: number;
  byType: NotificationTypeStats[];
  byEventType: NotificationEventStats[];
  recentStats: DailyNotificationStats[];
  topRestaurants: RestaurantNotificationStats[];
  summary: NotificationChannelSummary;
}

export interface RestaurantNotificationAnalyticsResponse {
  restaurant: {
    id: string;
    name: string;
  };
  totalNotifications: number;
  byType: NotificationTypeStats[];
  byEventType: NotificationEventStats[];
  deliveryRates: {
    push: { delivered: number; total: number; rate: number };
    email: { delivered: number; total: number; rate: number };
    sse: { delivered: number; total: number; rate: number };
  };
}
