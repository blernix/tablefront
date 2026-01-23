import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Sidebar from '@/components/dashboard/Sidebar'
import { useAuthStore } from '@/store/authStore'

// Mock the auth store
jest.mock('@/store/authStore')

describe('Sidebar Component', () => {
  const mockSetIsMobileMenuOpen = jest.fn()

  beforeEach(() => {
    const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>
    mockUseAuthStore.mockReturnValue({
      user: {
        id: '1',
        email: 'test@restaurant.com',
        role: 'restaurant',
        restaurantId: 'rest123',
        status: 'active',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
      isInitialized: true,
      login: jest.fn(),
      logout: jest.fn(),
      setUser: jest.fn(),
      clearError: jest.fn(),
      initAuth: jest.fn(),
      syncCookie: jest.fn(),
    })
  })

  it('should render navigation links', () => {
    render(<Sidebar isMobileMenuOpen={false} setIsMobileMenuOpen={mockSetIsMobileMenuOpen} />)

    expect(screen.getByText('Tableau de bord')).toBeInTheDocument()
    expect(screen.getByText('Réservations')).toBeInTheDocument()
    expect(screen.getByText('Menus')).toBeInTheDocument()
    expect(screen.getByText('Paramètres')).toBeInTheDocument()
  })

  it('should display user email', () => {
    render(<Sidebar isMobileMenuOpen={false} setIsMobileMenuOpen={mockSetIsMobileMenuOpen} />)

    expect(screen.getByText('test@restaurant.com')).toBeInTheDocument()
  })

  it('should have correct navigation links', () => {
    render(<Sidebar isMobileMenuOpen={false} setIsMobileMenuOpen={mockSetIsMobileMenuOpen} />)

    const dashboardLink = screen.getByRole('link', { name: /tableau de bord/i })
    expect(dashboardLink).toHaveAttribute('href', '/dashboard')

    const reservationsLink = screen.getByRole('link', { name: /réservations/i })
    expect(reservationsLink).toHaveAttribute('href', '/dashboard/reservations')

    const menuLink = screen.getByRole('link', { name: /menus/i })
    expect(menuLink).toHaveAttribute('href', '/dashboard/menus?tab=dashboard')

    const settingsLink = screen.getByRole('link', { name: /paramètres/i })
    expect(settingsLink).toHaveAttribute('href', '/dashboard/settings')
  })
})
