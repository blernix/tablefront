# API Quick Start Guide

## Import

```typescript
import { apiClient } from '@/lib/api';
```

## Setup (in your app layout or _app.tsx)

```typescript
apiClient.setOnUnauthorized(() => {
  router.push('/login');
});
```

## Usage

### Modular API (Recommended)

```typescript
// Authentication
await apiClient.auth.login(email, password);
await apiClient.auth.logout();

// Restaurants
await apiClient.restaurants.getMyRestaurant();
await apiClient.restaurants.updateBasicInfo(data);

// Menus
await apiClient.menus.getCategories();
await apiClient.menus.createDish(data);

// Reservations
await apiClient.reservations.getReservations();
await apiClient.reservations.createReservation(data);

// Day Blocks
await apiClient.dayBlocks.getDayBlocks();
await apiClient.dayBlocks.createDayBlock(data);

// Servers
await apiClient.servers.getServerUsers();
await apiClient.servers.createServerUser(data);

// Closures
await apiClient.closures.getClosures();
await apiClient.closures.createClosure(data);

// Admin
await apiClient.admin.getAdminDashboard();
await apiClient.admin.getRestaurantAnalytics(id);
```

### Legacy API (Still Works)

```typescript
// Old style - backward compatible
await apiClient.login(email, password);
await apiClient.getMyRestaurant();
await apiClient.getCategories();
await apiClient.getReservations();
```

## Available Modules

| Module | Purpose | Lines |
|--------|---------|-------|
| `auth` | Login, logout, password reset | 48 |
| `restaurants` | Restaurant CRUD & settings | 172 |
| `menus` | Categories, dishes, PDF | 132 |
| `reservations` | Reservation CRUD | 46 |
| `dayBlocks` | Block days from reservations | 43 |
| `servers` | Server user management | 32 |
| `closures` | Closure period management | 24 |
| `admin` | Dashboard, analytics, exports | 100 |

## Common Patterns

### Error Handling
```typescript
try {
  await apiClient.auth.login(email, password);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

### Token Management
```typescript
// Automatic after login
apiClient.auth.login(email, password); // Sets token

// Manual if needed
apiClient.setToken(token);
```

### File Upload
```typescript
// Menu PDF
const file = fileInput.files[0];
await apiClient.menus.uploadMenuPdf(file);

// Dish photo
await apiClient.menus.uploadDishPhoto(dishId, file);
```

### Data Export
```typescript
// Downloads CSV automatically
await apiClient.admin.exportRestaurants();
await apiClient.admin.exportUsers();
await apiClient.admin.exportReservations();
```

## Documentation

- **README.md** - Full API documentation
- **EXAMPLES.md** - Detailed usage examples
- **QUICKSTART.md** - This file

## Need Help?

1. Check `EXAMPLES.md` for detailed examples
2. Check `README.md` for module documentation
3. Check the original `api.ts.backup` for reference
