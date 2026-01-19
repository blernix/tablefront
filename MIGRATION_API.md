# API Modularization - Migration Guide

## Summary

The monolithic `src/lib/api.ts` file (883 lines) has been successfully refactored into a modular structure organized by domain.

## Changes Made

### File Structure

**Before:**
```
src/lib/
└── api.ts (883 lines)
```

**After:**
```
src/lib/api/
├── base.ts           (307 lines) - Core ApiClient functionality
├── auth.ts           (48 lines)  - Authentication endpoints
├── restaurants.ts    (172 lines) - Restaurant management
├── menus.ts          (132 lines) - Menu & dishes management
├── reservations.ts   (46 lines)  - Reservations CRUD
├── dayblocks.ts      (43 lines)  - Day blocks management
├── servers.ts        (32 lines)  - Server users management
├── closures.ts       (24 lines)  - Closures management
├── admin.ts          (100 lines) - Admin dashboard & analytics
├── index.ts          (301 lines) - Unified export with backward compatibility
└── README.md         - Documentation
```

### Backward Compatibility

**No code changes required!** The new structure maintains 100% backward compatibility:

```typescript
// Old way (still works)
import { apiClient } from '@/lib/api';
await apiClient.login(email, password);
await apiClient.getRestaurants();

// New way (recommended for new code)
import { apiClient } from '@/lib/api';
await apiClient.auth.login(email, password);
await apiClient.restaurants.getRestaurants();
```

### Module Organization

#### 1. **base.ts** - Core Functionality
- `ApiClient` base class
- Token management (localStorage + cookie sync)
- Automatic token refresh on 401
- Request/upload file methods
- 30-second timeout handling

#### 2. **auth.ts** - Authentication
- `login()`, `logout()`
- `forgotPassword()`, `resetPassword()`

#### 3. **restaurants.ts** - Restaurant Management
- Admin: CRUD for restaurants
- Admin: User management per restaurant
- Owner: Own restaurant data & stats
- Owner: Settings (basic info, hours, tables, reservations)

#### 4. **menus.ts** - Menu Management
- Categories CRUD + reordering
- Dishes CRUD + availability + photos
- PDF upload
- Menu display mode switching

#### 5. **reservations.ts** - Reservations
- CRUD operations
- Date range & status filtering

#### 6. **dayblocks.ts** - Day Blocks
- Get/check/create/delete blocked days
- Bulk operations support

#### 7. **servers.ts** - Server Users
- CRUD operations for server users

#### 8. **closures.ts** - Restaurant Closures
- Get/create/delete closure periods

#### 9. **admin.ts** - Admin Features
- Dashboard statistics
- Restaurant analytics
- CSV exports (restaurants, users, reservations)

### Benefits

1. **Maintainability**: Each module is 24-172 lines (vs 883 lines monolithic)
2. **Organization**: Clear separation by domain
3. **Discoverability**: Easy to find relevant endpoints
4. **Scalability**: Simple to add new endpoints
5. **Type Safety**: All TypeScript types properly imported
6. **No Breaking Changes**: Full backward compatibility

### Usage Examples

#### Recommended (Modular)
```typescript
import { apiClient } from '@/lib/api';

// Clear domain separation
await apiClient.auth.login(email, password);
await apiClient.restaurants.getMyRestaurant();
await apiClient.menus.getCategories();
await apiClient.reservations.getReservations();
await apiClient.admin.getAdminDashboard();
```

#### Legacy (Still Works)
```typescript
import { apiClient } from '@/lib/api';

// Old style - still functional
await apiClient.login(email, password);
await apiClient.getMyRestaurant();
await apiClient.getCategories();
await apiClient.getReservations();
await apiClient.getAdminDashboard();
```

### Testing

- Build status: ✅ Success
- TypeScript compilation: ✅ No errors
- All pages compile: ✅ 26/26 pages
- Import resolution: ✅ All imports resolve correctly

### Migration Checklist

- [x] Create modular structure
- [x] Extract base ApiClient class
- [x] Create domain-specific modules
- [x] Maintain backward compatibility
- [x] Test build
- [x] Create documentation
- [x] Backup original file (api.ts.backup)

### Rollback Plan

If needed, rollback is simple:

```bash
cd /Users/killianlecrut/Desktop/admin-restaurant/tablemaster-frontend/src/lib
rm -rf api/
mv api.ts.backup api.ts
```

### Next Steps (Optional)

1. **Gradual Migration**: Update existing code to use the new modular API
2. **Remove Legacy Methods**: Once all code uses the modular API, remove legacy methods from `index.ts`
3. **Add Tests**: Create unit tests for each module
4. **OpenAPI/Swagger**: Generate API documentation from the modular structure

### File Breakdown

| Module | Lines | Purpose |
|--------|-------|---------|
| base.ts | 307 | Core ApiClient with token mgmt, request handling, refresh logic |
| auth.ts | 48 | Authentication & password reset |
| restaurants.ts | 172 | Restaurant CRUD, settings, dashboard stats |
| menus.ts | 132 | Menu categories, dishes, PDF uploads |
| reservations.ts | 46 | Reservation CRUD |
| dayblocks.ts | 43 | Blocked days management |
| servers.ts | 32 | Server user CRUD |
| closures.ts | 24 | Closure period management |
| admin.ts | 100 | Admin dashboard, analytics, exports |
| index.ts | 301 | Unified client + backward compatibility |
| **Total** | **1,205** | **Original: 883 lines** |

The slight increase in total lines is due to:
- Module imports/exports overhead
- Backward compatibility layer
- Better code organization with more spacing

---

**Date**: 2026-01-17
**Status**: ✅ Complete
**Build**: ✅ Passing
**Backward Compatibility**: ✅ 100%
