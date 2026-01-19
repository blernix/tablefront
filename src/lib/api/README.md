# API Module Structure

This directory contains the modularized API client, split by domain for better maintainability.

## Structure

```
api/
├── base.ts           - Base ApiClient class with core functionality (307 lines)
├── auth.ts           - Authentication endpoints (48 lines)
├── restaurants.ts    - Restaurant management endpoints (172 lines)
├── menus.ts          - Menu & dishes endpoints (132 lines)
├── reservations.ts   - Reservation endpoints (46 lines)
├── dayblocks.ts      - Day block endpoints (43 lines)
├── servers.ts        - Server user endpoints (32 lines)
├── closures.ts       - Closure endpoints (24 lines)
├── admin.ts          - Admin dashboard & analytics (100 lines)
└── index.ts          - Unified API client export (301 lines)
```

Total: 1,205 lines (vs 883 lines in the original monolithic file)

## Usage

### New Modular API (Recommended)

```typescript
import { apiClient } from '@/lib/api';

// Authentication
await apiClient.auth.login(email, password);
await apiClient.auth.logout();
await apiClient.auth.forgotPassword(email);
await apiClient.auth.resetPassword(token, newPassword);

// Restaurants
await apiClient.restaurants.getRestaurants();
await apiClient.restaurants.createRestaurant(data);
await apiClient.restaurants.getMyRestaurant();
await apiClient.restaurants.updateBasicInfo(data);
await apiClient.restaurants.updateOpeningHours(data);

// Menus
await apiClient.menus.getCategories();
await apiClient.menus.createCategory(data);
await apiClient.menus.getDishes(categoryId);
await apiClient.menus.uploadMenuPdf(file);
await apiClient.menus.switchMenuMode('pdf');

// Reservations
await apiClient.reservations.getReservations(params);
await apiClient.reservations.createReservation(data);
await apiClient.reservations.updateReservation(id, data);

// Day Blocks
await apiClient.dayBlocks.getDayBlocks();
await apiClient.dayBlocks.createDayBlock(data);
await apiClient.dayBlocks.bulkCreateDayBlocks(data);

// Servers
await apiClient.servers.getServerUsers();
await apiClient.servers.createServerUser(data);

// Closures
await apiClient.closures.getClosures();
await apiClient.closures.createClosure(data);

// Admin
await apiClient.admin.getAdminDashboard();
await apiClient.admin.getRestaurantAnalytics(restaurantId);
await apiClient.admin.exportRestaurants();
```

### Legacy API (Backward Compatible)

The unified API client maintains backward compatibility with the original API:

```typescript
import { apiClient } from '@/lib/api';

// These still work exactly as before
await apiClient.login(email, password);
await apiClient.getRestaurants();
await apiClient.getCategories();
await apiClient.getReservations();
// ... etc
```

## Core Features

### Base Client (`base.ts`)

- Token management (localStorage + cookie sync)
- Automatic token refresh on 401 errors
- Request timeout handling (30s)
- Upload file support
- Health check endpoint

Key methods:
- `setToken(token)` - Set authentication token
- `setOnUnauthorized(callback)` - Set 401 callback
- `request<T>(endpoint, options)` - Make authenticated requests
- `uploadFile<T>(endpoint, file, fieldName)` - Upload files
- `refreshToken()` - Refresh authentication token
- `healthCheck()` - Check API health

### Authentication (`auth.ts`)

- Login / Logout
- Password reset flow

### Restaurants (`restaurants.ts`)

- Admin: CRUD operations for restaurants
- Admin: User management per restaurant
- Owner: Get own restaurant data
- Owner: Update basic info, opening hours, tables, reservation config
- Owner: Dashboard statistics

### Menus (`menus.ts`)

- Categories: CRUD + reordering
- Dishes: CRUD + availability toggle + photo upload
- PDF menu upload
- Switch menu display mode

### Reservations (`reservations.ts`)

- CRUD operations
- Filtering by date range and status

### Day Blocks (`dayblocks.ts`)

- Get all blocked days
- Check if a specific day is blocked
- Create single or bulk day blocks
- Delete day blocks

### Servers (`servers.ts`)

- CRUD operations for server users

### Closures (`closures.ts`)

- Get restaurant closures
- Create/delete closure periods

### Admin (`admin.ts`)

- Dashboard statistics
- Restaurant analytics with date filtering
- Data export (restaurants, users, reservations as CSV)

## Migration from Monolithic API

The old `api.ts` file has been backed up to `api.ts.backup`. All functionality has been preserved and the new modular structure maintains full backward compatibility.

### Benefits of the New Structure

1. **Better Organization**: Each domain is in its own file
2. **Easier Maintenance**: ~30-172 lines per module vs 883 lines
3. **Better Code Navigation**: Find endpoints by domain
4. **Scalability**: Easy to add new endpoints to the right module
5. **Type Safety**: All TypeScript types are properly imported
6. **Backward Compatible**: Existing code continues to work

### Adding New Endpoints

To add a new endpoint:

1. Identify the domain (auth, restaurants, menus, etc.)
2. Add the method to the appropriate module class
3. If needed, add a legacy compatibility method in `index.ts`

Example:

```typescript
// In restaurants.ts
export class RestaurantsApi extends ApiClient {
  async getRestaurantReviews(id: string) {
    return this.request(`/api/restaurants/${id}/reviews`);
  }
}

// In index.ts (for backward compatibility)
class UnifiedApiClient {
  async getRestaurantReviews(id: string) {
    return this.restaurants.getRestaurantReviews(id);
  }
}
```

## Token Management

All modules share the same token through the `UnifiedApiClient`:

```typescript
// Set token for all modules at once
apiClient.setToken(token);

// Set unauthorized callback for all modules
apiClient.setOnUnauthorized(() => {
  // Handle logout
});
```

## Testing

The build passes successfully with the new structure:
- No TypeScript errors
- No breaking changes
- All imports resolve correctly
