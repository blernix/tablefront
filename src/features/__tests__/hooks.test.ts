import { renderHook } from '@testing-library/react';
import {
  useFeatureAccess,
  useHasFeature,
  useUserFeatures,
  useCurrentPlan,
  useUpgradeRequired,
} from '../hooks';
import { useRestaurantStore } from '@/store/restaurantStore';

// Mock the restaurant store
jest.mock('@/store/restaurantStore');

describe('Feature Authorization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRestaurant = (accountType: 'managed' | 'self-service', plan?: 'starter' | 'pro') => ({
    _id: 'test123',
    name: 'Test Restaurant',
    accountType,
    subscription: plan ? { plan, status: 'active' } : undefined,
    updatedAt: new Date().toISOString(),
  });

  describe('Managed accounts', () => {
    it('should have access to menus feature', () => {
      // Mock store to return managed restaurant
      (useRestaurantStore as unknown as jest.Mock).mockReturnValue({
        restaurant: mockRestaurant('managed'),
        isLoading: false,
      });

      const { result } = renderHook(() => useFeatureAccess('menus'));
      expect(result.current.hasAccess).toBe(true);
      expect(result.current.reason).toBeUndefined();
    });

    it('should have access to menu-pdf-upload feature', () => {
      (useRestaurantStore as unknown as jest.Mock).mockReturnValue({
        restaurant: mockRestaurant('managed'),
        isLoading: false,
      });

      const { result } = renderHook(() => useFeatureAccess('menu-pdf-upload'));
      expect(result.current.hasAccess).toBe(true);
    });

    it('should have access to advanced-analytics feature', () => {
      (useRestaurantStore as unknown as jest.Mock).mockReturnValue({
        restaurant: mockRestaurant('managed'),
        isLoading: false,
      });

      const { result } = renderHook(() => useFeatureAccess('advanced-analytics'));
      expect(result.current.hasAccess).toBe(true);
    });

    it('should have access to widget-customization', () => {
      (useRestaurantStore as unknown as jest.Mock).mockReturnValue({
        restaurant: mockRestaurant('managed'),
        isLoading: false,
      });

      const { result } = renderHook(() => useFeatureAccess('widget-customization'));
      expect(result.current.hasAccess).toBe(true);
      expect(result.current.reason).toBeUndefined();
    });
  });

  describe('Self-Service Starter accounts', () => {
    it('should NOT have access to menus feature', () => {
      (useRestaurantStore as unknown as jest.Mock).mockReturnValue({
        restaurant: mockRestaurant('self-service', 'starter'),
        isLoading: false,
      });

      const { result } = renderHook(() => useFeatureAccess('menus'));
      expect(result.current.hasAccess).toBe(false);
      expect(result.current.reason).toBe('account-type');
    });

    it('should NOT have access to menu-pdf-upload feature', () => {
      (useRestaurantStore as unknown as jest.Mock).mockReturnValue({
        restaurant: mockRestaurant('self-service', 'starter'),
        isLoading: false,
      });

      const { result } = renderHook(() => useFeatureAccess('menu-pdf-upload'));
      expect(result.current.hasAccess).toBe(false);
      expect(result.current.reason).toBe('plan');
    });

    it('should have access to advanced-analytics feature', () => {
      (useRestaurantStore as unknown as jest.Mock).mockReturnValue({
        restaurant: mockRestaurant('self-service', 'starter'),
        isLoading: false,
      });

      const { result } = renderHook(() => useFeatureAccess('advanced-analytics'));
      expect(result.current.hasAccess).toBe(true);
      expect(result.current.reason).toBeUndefined();
    });

    it('should have access to embed-direct-link feature', () => {
      (useRestaurantStore as unknown as jest.Mock).mockReturnValue({
        restaurant: mockRestaurant('self-service', 'starter'),
        isLoading: false,
      });

      const { result } = renderHook(() => useFeatureAccess('embed-direct-link'));
      expect(result.current.hasAccess).toBe(true);
    });
  });

  describe('Self-Service Pro accounts', () => {
    it('should NOT have access to menus feature', () => {
      (useRestaurantStore as unknown as jest.Mock).mockReturnValue({
        restaurant: mockRestaurant('self-service', 'pro'),
        isLoading: false,
      });

      const { result } = renderHook(() => useFeatureAccess('menus'));
      expect(result.current.hasAccess).toBe(false);
      expect(result.current.reason).toBe('account-type');
    });

    it('should have access to menu-pdf-upload feature', () => {
      (useRestaurantStore as unknown as jest.Mock).mockReturnValue({
        restaurant: mockRestaurant('self-service', 'pro'),
        isLoading: false,
      });

      const { result } = renderHook(() => useFeatureAccess('menu-pdf-upload'));
      expect(result.current.hasAccess).toBe(true);
    });

    it('should have access to advanced-analytics feature', () => {
      (useRestaurantStore as unknown as jest.Mock).mockReturnValue({
        restaurant: mockRestaurant('self-service', 'pro'),
        isLoading: false,
      });

      const { result } = renderHook(() => useFeatureAccess('advanced-analytics'));
      expect(result.current.hasAccess).toBe(true);
    });

    it('should have access to widget-customization feature', () => {
      (useRestaurantStore as unknown as jest.Mock).mockReturnValue({
        restaurant: mockRestaurant('self-service', 'pro'),
        isLoading: false,
      });

      const { result } = renderHook(() => useFeatureAccess('widget-customization'));
      expect(result.current.hasAccess).toBe(true);
    });
  });

  describe('useCurrentPlan', () => {
    it('should return managed plan config for managed accounts', () => {
      (useRestaurantStore as unknown as jest.Mock).mockReturnValue({
        restaurant: mockRestaurant('managed'),
        isLoading: false,
      });

      const { result } = renderHook(() => useCurrentPlan());
      expect(result.current?.id).toBe('managed');
      expect(result.current?.name).toBe('Managed');
    });

    it('should return starter plan config for self-service starter', () => {
      (useRestaurantStore as unknown as jest.Mock).mockReturnValue({
        restaurant: mockRestaurant('self-service', 'starter'),
        isLoading: false,
      });

      const { result } = renderHook(() => useCurrentPlan());
      expect(result.current?.id).toBe('starter');
      expect(result.current?.price).toBe(29);
    });

    it('should return pro plan config for self-service pro', () => {
      (useRestaurantStore as unknown as jest.Mock).mockReturnValue({
        restaurant: mockRestaurant('self-service', 'pro'),
        isLoading: false,
      });

      const { result } = renderHook(() => useCurrentPlan());
      expect(result.current?.id).toBe('pro');
      expect(result.current?.price).toBe(79);
    });
  });

  describe('useUpgradeRequired', () => {
    it('should require pro plan for self-service starter accessing revenue-tracking', () => {
      (useRestaurantStore as unknown as jest.Mock).mockReturnValue({
        restaurant: mockRestaurant('self-service', 'starter'),
        isLoading: false,
      });

      const { result } = renderHook(() => useUpgradeRequired('revenue-tracking'));
      expect(result.current.requiresUpgrade).toBe(true);
      expect(result.current.requiredPlan).toBe('pro');
      expect(result.current.currentPlan).toBe('starter');
    });

    it('should not require upgrade for managed accounts', () => {
      (useRestaurantStore as unknown as jest.Mock).mockReturnValue({
        restaurant: mockRestaurant('managed'),
        isLoading: false,
      });

      const { result } = renderHook(() => useUpgradeRequired('revenue-tracking'));
      expect(result.current.requiresUpgrade).toBe(false);
    });

    it('should require pro plan for self-service starter accessing advanced-analytics', () => {
      (useRestaurantStore as unknown as jest.Mock).mockReturnValue({
        restaurant: mockRestaurant('self-service', 'starter'),
        isLoading: false,
      });

      const { result } = renderHook(() => useUpgradeRequired('advanced-analytics'));
      expect(result.current.requiresUpgrade).toBe(true);
      expect(result.current.requiredPlan).toBe('pro');
    });

    it('should require pro plan for self-service starter accessing menu-pdf-upload', () => {
      (useRestaurantStore as unknown as jest.Mock).mockReturnValue({
        restaurant: mockRestaurant('self-service', 'starter'),
        isLoading: false,
      });

      const { result } = renderHook(() => useUpgradeRequired('menu-pdf-upload'));
      expect(result.current.requiresUpgrade).toBe(true);
      expect(result.current.requiredPlan).toBe('pro');
    });
  });
});
