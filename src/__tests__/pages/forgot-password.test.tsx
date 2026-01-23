import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import ForgotPasswordPage from '@/app/(auth)/forgot-password/page'
import { apiClient } from '@/lib/api'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

jest.mock('@/lib/api', () => ({
  apiClient: {
    forgotPassword: jest.fn(),
  },
}))

describe('Forgot Password Page', () => {
  const mockPush = jest.fn()
  const mockForgotPassword = apiClient.forgotPassword as jest.MockedFunction<
    typeof apiClient.forgotPassword
  >

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it('should render forgot password form', () => {
    render(<ForgotPasswordPage />)

    expect(screen.getByText(/mot de passe oublié/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/votre@email.com/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /envoyer le lien/i })).toBeInTheDocument()
    expect(screen.getByText(/retour à la connexion/i)).toBeInTheDocument()
  })

  it('should handle successful email submission', async () => {
    mockForgotPassword.mockResolvedValue({ message: 'Email sent' })

    render(<ForgotPasswordPage />)

    const emailInput = screen.getByPlaceholderText(/votre@email.com/i)
    await userEvent.type(emailInput, 'test@example.com')

    const form = screen.getByTestId('forgot-password-form')
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith('test@example.com')
      expect(screen.getByText(/email envoyé!/i)).toBeInTheDocument()
      expect(screen.getByText(/vous allez être redirigé/i)).toBeInTheDocument()
    })
  })

  it('should display error on failed submission', async () => {
    mockForgotPassword.mockRejectedValue(new Error('Email service error'))

    render(<ForgotPasswordPage />)

    const emailInput = screen.getByPlaceholderText(/votre@email.com/i)
    await userEvent.type(emailInput, 'test@example.com')

    const form = screen.getByTestId('forgot-password-form')
    fireEvent.submit(form)

    expect(await screen.findByText(/email service error/i)).toBeInTheDocument()
  })

  it('should validate required email field', async () => {
    render(<ForgotPasswordPage />)

    const form = screen.getByTestId('forgot-password-form')
    fireEvent.submit(form)

    expect(await screen.findByText(/veuillez entrer votre adresse email/i)).toBeInTheDocument()
    expect(mockForgotPassword).not.toHaveBeenCalled()
  })


})