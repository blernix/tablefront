import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { useRouter, useSearchParams } from 'next/navigation'
import ResetPasswordPage from '@/app/(auth)/reset-password/page'
import { apiClient } from '@/lib/api'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

jest.mock('@/lib/api', () => ({
  apiClient: {
    resetPassword: jest.fn(),
  },
}))

describe('Reset Password Page', () => {
  const mockPush = jest.fn()
  const mockResetPassword = apiClient.resetPassword as jest.MockedFunction<
    typeof apiClient.resetPassword
  >
  const mockGet = jest.fn()

  let replaceStateSpy: jest.SpyInstance | null = null
  
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    ;(useSearchParams as jest.Mock).mockReturnValue({
      get: mockGet,
    })
  })

  afterEach(() => {
    if (replaceStateSpy) {
      replaceStateSpy.mockRestore()
      replaceStateSpy = null
    }
  })

  it.skip('should render reset password form with valid token', () => {
    mockGet.mockReturnValue('valid-token-123')

    render(<ResetPasswordPage />)
    screen.debug()

    expect(screen.getByText(/réinitialiser le mot de passe/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument()
    expect(screen.getAllByPlaceholderText(/••••••••/i)).toHaveLength(2)
    expect(screen.getByRole('button', { name: /réinitialiser le mot de passe/i })).toBeInTheDocument()
    expect(screen.getByText(/minimum 6 caractères/i)).toBeInTheDocument()
  })

  it('should show error for missing token', () => {
    mockGet.mockReturnValue(null)

    render(<ResetPasswordPage />)

    expect(screen.getByText(/token manquant ou invalide/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /demander un nouveau lien/i })).toBeInTheDocument()
  })

  it('should handle successful password reset', async () => {
    mockGet.mockReturnValue('valid-token-123')
    mockResetPassword.mockResolvedValue({ message: 'Password reset successful' })
    replaceStateSpy = jest.spyOn(window.history, 'replaceState').mockImplementation(() => {})

    render(<ResetPasswordPage />)

    const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i)
    const newPasswordInput = passwordInputs[0]
    const confirmPasswordInput = passwordInputs[1]
    const submitButton = screen.getByRole('button', { name: /réinitialiser le mot de passe/i })

    await userEvent.type(newPasswordInput, 'newPassword123')
    await userEvent.type(confirmPasswordInput, 'newPassword123')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith('valid-token-123', 'newPassword123')
      expect(screen.getByText(/mot de passe réinitialisé!/i)).toBeInTheDocument()
      expect(screen.getByText(/vous allez être redirigé/i)).toBeInTheDocument()
    })
  })

  it('should display error on failed password reset', async () => {
    mockGet.mockReturnValue('valid-token-123')
    mockResetPassword.mockRejectedValue(new Error('Invalid token'))

    render(<ResetPasswordPage />)

    const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i)
    const newPasswordInput = passwordInputs[0]
    const confirmPasswordInput = passwordInputs[1]
    const submitButton = screen.getByRole('button', { name: /réinitialiser le mot de passe/i })

    await userEvent.type(newPasswordInput, 'newPassword123')
    await userEvent.type(confirmPasswordInput, 'newPassword123')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid token/i)).toBeInTheDocument()
    })
  })

  it('should validate password length', async () => {
    mockGet.mockReturnValue('valid-token-123')

    render(<ResetPasswordPage />)

    const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i)
    const newPasswordInput = passwordInputs[0]
    const confirmPasswordInput = passwordInputs[1]

    await userEvent.type(newPasswordInput, '123')
    await userEvent.type(confirmPasswordInput, '123')
    
    const form = screen.getByTestId('reset-password-form')
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByText(/le mot de passe doit contenir au moins 6 caractères/i)).toBeInTheDocument()
      expect(mockResetPassword).not.toHaveBeenCalled()
    })
  })

  it('should validate password confirmation', async () => {
    mockGet.mockReturnValue('valid-token-123')

    render(<ResetPasswordPage />)

     const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i)
     const newPasswordInput = passwordInputs[0]
     const confirmPasswordInput = passwordInputs[1]
 
     await userEvent.type(newPasswordInput, 'newPassword123')
     await userEvent.type(confirmPasswordInput, 'differentPassword')
     
     const form = screen.getByTestId('reset-password-form')
     fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByText(/les mots de passe ne correspondent pas/i)).toBeInTheDocument()
      expect(mockResetPassword).not.toHaveBeenCalled()
    })
  })

  it('should validate required fields', async () => {
    mockGet.mockReturnValue('valid-token-123')

    render(<ResetPasswordPage />)

     const form = screen.getByTestId('reset-password-form')
     fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByText(/veuillez remplir tous les champs/i)).toBeInTheDocument()
      expect(mockResetPassword).not.toHaveBeenCalled()
    })
  })



  it('should handle redirect to forgot-password when token is invalid', () => {
    mockGet.mockReturnValue(null)

    render(<ResetPasswordPage />)

     const forgotPasswordLink = screen.getByRole('button', { name: /demander un nouveau lien/i })
    expect(forgotPasswordLink).toBeInTheDocument()

    // Note: The link is a button that triggers router.push
    // We can't easily test the link navigation without more complex setup
  })
})