import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Format a date string to French long format
 * @param dateString - Date string (YYYY-MM-DD or ISO format)
 * @returns Formatted date (e.g., "lundi 20 janvier 2026")
 */
export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'EEEE dd MMMM yyyy', { locale: fr });
  } catch {
    return dateString;
  }
};

/**
 * Format a date string to short French format
 * @param dateString - Date string (YYYY-MM-DD or ISO format)
 * @returns Formatted date (e.g., "20 janvier 2026")
 */
export const formatDateShort = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
  } catch {
    return dateString;
  }
};

/**
 * Format a number as currency (EUR)
 * @param amount - Amount to format
 * @returns Formatted currency (e.g., "12,50 €")
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

/**
 * Format a phone number to French format
 * @param phone - Phone number string
 * @returns Formatted phone (e.g., "06 12 34 56 78")
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // French mobile format: 06 12 34 56 78
  if (digits.length === 10 && digits.startsWith('0')) {
    return digits.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }

  // International format: +33 6 12 34 56 78
  if (digits.length === 11 && digits.startsWith('33')) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 3)} ${digits.slice(3, 5)} ${digits.slice(
      5,
      7
    )} ${digits.slice(7, 9)} ${digits.slice(9)}`;
  }

  // Return original if format doesn't match
  return phone;
};

/**
 * Parse a string to number with NaN check
 * @param value - String value to parse
 * @param defaultValue - Default value if parsing fails
 * @returns Parsed number or default value
 */
export const parseNumber = (value: string, defaultValue: number = 0): number => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Parse a string to float with NaN check
 * @param value - String value to parse
 * @param defaultValue - Default value if parsing fails
 * @returns Parsed float or default value
 */
export const parseFloat = (value: string, defaultValue: number = 0): number => {
  const parsed = Number.parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with "..." if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Capitalize first letter of a string
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export const capitalize = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
