import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import LoginPage from '@/app/(auth)/login/page'
import { useAuthStore } from '@/store/authStore'
import { apiClient } from '@/lib/api'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/store/authStore')
jest.mock('@/lib/api')

jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

describe('Login Page', () => {
  const mockLogin = jest.fn()
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>
    mockUseAuthStore.mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      isInitialized: true,
      login: mockLogin,
      logout: jest.fn(),
      setUser: jest.fn(),
      clearError: jest.fn(),
      initAuth: jest.fn(),
      syncCookie: jest.fn(),
    })

    // Mock Next.js router
    const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    })
  })

  it('should render login form', () => {
    render(<LoginPage />)

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/mot de passe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /connexion/i })).toBeInTheDocument()
  })

  it('should handle successful login', async () => {
    const mockApiLogin = apiClient.login as jest.MockedFunction<typeof apiClient.login>
    mockApiLogin.mockResolvedValue({
      token: 'test-token',
      user: {
        _id: '1',
        email: 'test@restaurant.com',
        role: 'restaurant',
        restaurantId: 'rest123',
      },
    })

    render(<LoginPage />)

    const emailInput = screen.getByPlaceholderText(/email/i)
    const passwordInput = screen.getByPlaceholderText(/mot de passe/i)
    const submitButton = screen.getByRole('button', { name: /connexion/i })

    await userEvent.type(emailInput, 'test@restaurant.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(mockApiLogin).toHaveBeenCalledWith('test@restaurant.com', 'password123')
      expect(mockLogin).toHaveBeenCalledWith(
        {
          _id: '1',
          email: 'test@restaurant.com',
          role: 'restaurant',
          restaurantId: 'rest123',
        },
        'test-token'
      )
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('should display error on failed login', async () => {
    const mockApiLogin = apiClient.login as jest.MockedFunction<typeof apiClient.login>
    mockApiLogin.mockRejectedValue(new Error('Invalid credentials'))

    render(<LoginPage />)

    const emailInput = screen.getByPlaceholderText(/email/i)
    const passwordInput = screen.getByPlaceholderText(/mot de passe/i)
    const submitButton = screen.getByRole('button', { name: /connexion/i })

    await userEvent.type(emailInput, 'wrong@email.com')
    await userEvent.type(passwordInput, 'wrongpassword')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('should validate required fields', async () => {
    render(<LoginPage />)

    const submitButton = screen.getByRole('button', { name: /connexion/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      // Form validation should prevent submission
      expect(apiClient.login).not.toHaveBeenCalled()
    })
  })

  it('should have forgot password link pointing to correct URL', () => {
    render(<LoginPage />)

    const forgotPasswordLink = screen.getByText('Mot de passe oublié?')
    expect(forgotPasswordLink).toBeInTheDocument()
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password')
  })
})
