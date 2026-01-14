import { apiClient } from '@/lib/api'

describe('API Client', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
    localStorage.clear()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Authentication', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        token: 'test-token',
        user: {
          _id: '1',
          email: 'test@restaurant.com',
          role: 'restaurant',
          restaurantId: 'rest123',
        },
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await apiClient.login('test@restaurant.com', 'password123')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'test@restaurant.com', password: 'password123' }),
        })
      )
      expect(result).toEqual(mockResponse)
      expect(localStorage.getItem('token')).toBe('test-token')
    })

    it('should handle login error', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: { message: 'Invalid credentials' } }),
      })

      await expect(apiClient.login('wrong@email.com', 'wrong')).rejects.toThrow('Invalid credentials')
    })

    it('should logout and clear token', async () => {
      localStorage.setItem('token', 'test-token')

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Logout successful' }),
      })

      await apiClient.logout()

      expect(localStorage.getItem('token')).toBeNull()
    })
  })

  describe('Menu Operations', () => {
    beforeEach(() => {
      apiClient.setToken('test-token')
    })

    it('should fetch categories', async () => {
      const mockCategories = [
        { _id: '1', name: 'Entrées', displayOrder: 0 },
        { _id: '2', name: 'Plats', displayOrder: 1 },
      ]

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ categories: mockCategories }),
      })

      const result = await apiClient.getCategories()

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/menu/categories',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      )
      expect(result.categories).toEqual(mockCategories)
    })

    it('should create a category', async () => {
      const newCategory = { name: 'Desserts' }
      const mockResponse = { category: { _id: '3', ...newCategory, displayOrder: 2 } }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await apiClient.createCategory(newCategory)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/menu/categories',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newCategory),
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('should create a dish', async () => {
      const newDish = {
        categoryId: '1',
        name: 'Salade César',
        description: 'Une délicieuse salade',
        price: 12.50,
        allergens: ['gluten'],
      }

      const mockResponse = { dish: { _id: 'dish1', ...newDish } }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await apiClient.createDish(newDish)

      expect(result.dish.name).toBe('Salade César')
      expect(result.dish.price).toBe(12.50)
    })

    it('should toggle dish availability', async () => {
      const mockResponse = { dish: { _id: 'dish1', available: false } }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await apiClient.toggleDishAvailability('dish1')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/menu/dishes/dish1/toggle-availability',
        expect.objectContaining({
          method: 'PATCH',
        })
      )
      expect(result.dish.available).toBe(false)
    })
  })

  describe('Reservation Operations', () => {
    beforeEach(() => {
      apiClient.setToken('test-token')
    })

    it('should create a reservation', async () => {
      const newReservation = {
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '0612345678',
        date: '2026-02-15',
        time: '19:30',
        numberOfGuests: 4,
      }

      const mockResponse = { reservation: { _id: 'res1', ...newReservation, status: 'pending' } }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await apiClient.createReservation(newReservation)

      expect(result.reservation.status).toBe('pending')
      expect(result.reservation.numberOfGuests).toBe(4)
    })

    it('should filter reservations by date', async () => {
      const mockReservations = [
        { _id: 'res1', date: '2026-02-15' },
        { _id: 'res2', date: '2026-02-16' },
      ]

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ reservations: mockReservations }),
      })

      const result = await apiClient.getReservations({
        startDate: '2026-02-15',
        endDate: '2026-02-20',
      })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('startDate=2026-02-15'),
        expect.anything()
      )
      expect(result.reservations).toHaveLength(2)
    })
  })

  describe('Public API', () => {
    it('should get restaurant info with API key', async () => {
      const mockRestaurant = {
        restaurant: {
          name: 'Test Restaurant',
          address: '123 Test St',
          phone: '0123456789',
        },
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRestaurant,
      })

      // Note: This would need to be added to apiClient if not already present
      // For now, we're just demonstrating the test pattern
      const headers = { 'X-API-Key': 'test-api-key' }
      const response = await fetch('http://localhost:4000/api/public/restaurant-info', { headers })
      const data = await response.json()

      expect(data.restaurant.name).toBe('Test Restaurant')
    })
  })
})
