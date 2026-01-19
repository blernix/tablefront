# API Usage Examples

## Setup

```typescript
import { apiClient } from '@/lib/api';

// Set up unauthorized callback (e.g., in _app.tsx or layout.tsx)
apiClient.setOnUnauthorized(() => {
  // Clear user state and redirect to login
  router.push('/login');
});
```

## Authentication

### Login
```typescript
import { apiClient } from '@/lib/api';

try {
  const { user, token } = await apiClient.auth.login(email, password);
  console.log('Logged in as:', user.email);
  // Token is automatically stored
} catch (error) {
  console.error('Login failed:', error.message);
}
```

### Logout
```typescript
await apiClient.auth.logout();
// Token is automatically cleared
```

### Forgot Password
```typescript
const response = await apiClient.auth.forgotPassword('user@example.com');
console.log(response.message); // "Password reset email sent"
```

### Reset Password
```typescript
const response = await apiClient.auth.resetPassword(resetToken, newPassword);
console.log(response.message); // "Password reset successful"
```

## Restaurant Management (Admin)

### List All Restaurants
```typescript
const { restaurants, pagination } = await apiClient.restaurants.getRestaurants(1, 20);
console.log(`Found ${pagination.total} restaurants`);
```

### Create Restaurant
```typescript
const { restaurant, apiKey } = await apiClient.restaurants.createRestaurant({
  name: 'Le Bistrot',
  address: '123 Rue de Paris',
  phone: '+33123456789',
  email: 'contact@lebistrot.fr',
});
console.log('API Key:', apiKey); // Save this!
```

### Get Restaurant Details
```typescript
const { restaurant } = await apiClient.restaurants.getRestaurant(restaurantId);
console.log(restaurant.name);
```

### Update Restaurant
```typescript
const { restaurant } = await apiClient.restaurants.updateRestaurant(restaurantId, {
  phone: '+33987654321',
});
```

### Delete Restaurant
```typescript
await apiClient.restaurants.deleteRestaurant(restaurantId);
```

### Regenerate API Key
```typescript
const { apiKey } = await apiClient.restaurants.regenerateApiKey(restaurantId);
console.log('New API Key:', apiKey);
```

## Restaurant Management (Owner)

### Get My Restaurant
```typescript
const { restaurant } = await apiClient.restaurants.getMyRestaurant();
console.log('My restaurant:', restaurant.name);
```

### Update Basic Info
```typescript
const { restaurant } = await apiClient.restaurants.updateBasicInfo({
  phone: '+33123456789',
  email: 'new@email.com',
});
```

### Update Opening Hours
```typescript
const { openingHours } = await apiClient.restaurants.updateOpeningHours({
  monday: {
    isOpen: true,
    lunch: { start: '12:00', end: '14:30' },
    dinner: { start: '19:00', end: '22:30' },
  },
  tuesday: {
    isOpen: false,
  },
  // ... other days
});
```

### Get Dashboard Stats
```typescript
const stats = await apiClient.restaurants.getDashboardStats();
console.log(`Today: ${stats.today.reservations} reservations`);
console.log(`This week: ${stats.thisWeek.guests} guests`);
```

## Menu Management

### Get Categories
```typescript
const { categories } = await apiClient.menus.getCategories();
categories.forEach(cat => console.log(cat.name));
```

### Create Category
```typescript
const { category } = await apiClient.menus.createCategory({
  name: 'Entrées',
  description: 'Starters',
});
```

### Reorder Categories
```typescript
const { categories } = await apiClient.menus.reorderCategories([
  'categoryId1',
  'categoryId2',
  'categoryId3',
]);
```

### Get Dishes
```typescript
// All dishes
const { dishes } = await apiClient.menus.getDishes();

// Dishes in a specific category
const { dishes } = await apiClient.menus.getDishes(categoryId);
```

### Create Dish
```typescript
const { dish } = await apiClient.menus.createDish({
  name: 'Tartare de Saumon',
  description: 'Fresh salmon tartare with avocado',
  price: 14.50,
  category: categoryId,
  allergens: ['fish'],
});
```

### Upload Dish Photo
```typescript
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const { dish } = await apiClient.menus.uploadDishPhoto(dishId, file);
console.log('Photo URL:', dish.photoUrl);
```

### Toggle Dish Availability
```typescript
const { dish } = await apiClient.menus.toggleDishAvailability(dishId);
console.log('Available:', dish.isAvailable);
```

### Upload PDF Menu
```typescript
const pdfFile = document.querySelector('input[type="file"]').files[0];
const response = await apiClient.menus.uploadMenuPdf(pdfFile);
console.log('PDF URL:', response.menu.pdfUrl);
```

### Switch Menu Display Mode
```typescript
await apiClient.menus.switchMenuMode('both'); // 'pdf' | 'detailed' | 'both'
```

## Reservations

### Get Reservations
```typescript
// All reservations
const { reservations } = await apiClient.reservations.getReservations();

// Filter by date range
const { reservations } = await apiClient.reservations.getReservations({
  startDate: '2024-01-01',
  endDate: '2024-01-31',
});

// Filter by status
const { reservations } = await apiClient.reservations.getReservations({
  status: 'confirmed',
});
```

### Create Reservation
```typescript
const { reservation } = await apiClient.reservations.createReservation({
  customerName: 'Jean Dupont',
  customerEmail: 'jean@example.com',
  customerPhone: '+33612345678',
  date: '2024-01-20',
  time: '19:30',
  numberOfGuests: 4,
  notes: 'Birthday celebration',
});
```

### Update Reservation
```typescript
const { reservation } = await apiClient.reservations.updateReservation(reservationId, {
  numberOfGuests: 6,
  notes: 'Updated to 6 guests',
});
```

### Delete Reservation
```typescript
await apiClient.reservations.deleteReservation(reservationId);
```

## Day Blocks

### Get All Blocked Days
```typescript
const { dayBlocks } = await apiClient.dayBlocks.getDayBlocks();
dayBlocks.forEach(block => {
  console.log(`Blocked: ${block.date} - ${block.reason}`);
});
```

### Check if Day is Blocked
```typescript
const { isBlocked, dayBlock } = await apiClient.dayBlocks.checkDayBlock('2024-12-25');
if (isBlocked) {
  console.log('Reason:', dayBlock.reason);
}
```

### Block a Single Day
```typescript
const { dayBlock } = await apiClient.dayBlocks.createDayBlock({
  date: '2024-12-25',
  reason: 'Christmas',
});
```

### Block Multiple Days
```typescript
const response = await apiClient.dayBlocks.bulkCreateDayBlocks({
  dates: ['2024-12-24', '2024-12-25', '2024-12-26'],
  reason: 'Christmas holidays',
});
console.log(`Blocked ${response.dayBlocks.length} days`);
if (response.errors) {
  response.errors.forEach(err => {
    console.error(`Failed to block ${err.date}: ${err.reason}`);
  });
}
```

### Unblock a Day
```typescript
await apiClient.dayBlocks.deleteDayBlock(dayBlockId);
```

## Server Users

### Get All Servers
```typescript
const { servers } = await apiClient.servers.getServerUsers();
servers.forEach(server => {
  console.log(`${server.firstName} ${server.lastName} - ${server.email}`);
});
```

### Create Server User
```typescript
const { server } = await apiClient.servers.createServerUser({
  firstName: 'Marie',
  lastName: 'Martin',
  email: 'marie@restaurant.com',
  password: 'securePassword123',
});
```

### Update Server User
```typescript
const { server } = await apiClient.servers.updateServerUser(serverId, {
  firstName: 'Marie-Claire',
});
```

### Delete Server User
```typescript
await apiClient.servers.deleteServerUser(serverId);
```

## Closures

### Get All Closures
```typescript
const { closures } = await apiClient.closures.getClosures();
closures.forEach(closure => {
  console.log(`${closure.startDate} to ${closure.endDate}: ${closure.reason}`);
});
```

### Create Closure Period
```typescript
const { closure } = await apiClient.closures.createClosure({
  startDate: '2024-08-01',
  endDate: '2024-08-31',
  reason: 'Summer holidays',
});
```

### Delete Closure
```typescript
await apiClient.closures.deleteClosure(closureId);
```

## Admin Dashboard & Analytics

### Get Admin Dashboard
```typescript
const { stats } = await apiClient.admin.getAdminDashboard();
console.log(`Total restaurants: ${stats.restaurants.total}`);
console.log(`Active restaurants: ${stats.restaurants.active}`);
console.log(`Total users: ${stats.users.total}`);
console.log(`Recent reservations: ${stats.reservations.recent}`);
```

### Get Restaurant Analytics
```typescript
// Last 7 days (default)
const { analytics } = await apiClient.admin.getRestaurantAnalytics(restaurantId);

// Last 30 days
const { analytics } = await apiClient.admin.getRestaurantAnalytics(restaurantId, '30d');

// Custom date range
const { analytics } = await apiClient.admin.getRestaurantAnalytics(
  restaurantId,
  'custom',
  '2024-01-01',
  '2024-01-31'
);

console.log('Total reservations:', analytics.totalReservations);
console.log('Total guests:', analytics.totalGuests);
console.log('Revenue:', analytics.totalRevenue);
console.log('Avg occupation:', analytics.averageOccupation);
```

### Export Data as CSV
```typescript
// Export all restaurants
await apiClient.admin.exportRestaurants();

// Export all users
await apiClient.admin.exportUsers();

// Export all reservations
await apiClient.admin.exportReservations();
// Files will be automatically downloaded
```

## Error Handling

```typescript
import { apiClient } from '@/lib/api';

try {
  const { restaurant } = await apiClient.restaurants.getMyRestaurant();
  // Success
} catch (error) {
  if (error.message === 'Unauthorized') {
    // Token expired, user will be redirected to login
  } else if (error.message.includes('timeout')) {
    // Request timed out
    console.error('Request took too long');
  } else {
    // Other error
    console.error('Error:', error.message);
  }
}
```

## Advanced: Token Management

```typescript
import { apiClient } from '@/lib/api';

// Manually set token (usually handled by login)
apiClient.setToken('your-jwt-token');

// Set unauthorized callback
apiClient.setOnUnauthorized(() => {
  console.log('Token expired, logging out...');
  // Clear app state
  // Redirect to login
});

// Manual token refresh (usually automatic)
try {
  const { token } = await apiClient.refreshToken();
  console.log('Token refreshed');
} catch (error) {
  console.error('Refresh failed:', error);
}
```

## Health Check

```typescript
try {
  const { status } = await apiClient.healthCheck();
  console.log('API Status:', status); // 'ok'
} catch (error) {
  console.error('API is down');
}
```
