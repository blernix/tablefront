import { getLocalDateString, isSameLocalDate } from '@/lib/formatters';

describe('formatters', () => {
  describe('getLocalDateString', () => {
    it('should return YYYY-MM-DD for a Date object', () => {
      // Test with a specific date in local timezone
      const date = new Date(2025, 0, 15); // January 15, 2025 (month is 0-indexed)
      expect(getLocalDateString(date)).toBe('2025-01-15');
    });

    it('should handle single-digit months and days', () => {
      const date = new Date(2025, 8, 5); // September 5, 2025
      expect(getLocalDateString(date)).toBe('2025-09-05');
    });

    it('should parse string dates correctly', () => {
      // ISO string (UTC)
      expect(getLocalDateString('2025-02-07T12:00:00.000Z')).toBe('2025-02-07');

      // Date string without time
      expect(getLocalDateString('2025-02-07')).toBe('2025-02-07');
    });

    it('should handle timezone offsets correctly', () => {
      // Create a date that could be on different calendar days in different timezones
      // Use a UTC date that is near midnight
      const utcDate = new Date('2025-02-07T23:59:59.999Z');
      // The local date depends on the system timezone
      // We'll just verify that the function returns the local calendar day
      // This test will pass regardless of timezone as long as getLocalDateString uses local methods
      const localYear = utcDate.getFullYear();
      const localMonth = String(utcDate.getMonth() + 1).padStart(2, '0');
      const localDay = String(utcDate.getDate()).padStart(2, '0');
      const expected = `${localYear}-${localMonth}-${localDay}`;
      expect(getLocalDateString(utcDate)).toBe(expected);
    });
  });

  describe('isSameLocalDate', () => {
    it('should return true for same calendar day', () => {
      const date1 = new Date(2025, 1, 7, 12, 0, 0); // Feb 7, 2025 12:00
      const date2 = new Date(2025, 1, 7, 23, 59, 59); // Same day, late evening
      expect(isSameLocalDate(date1, date2)).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = new Date(2025, 1, 7, 12, 0, 0);
      const date2 = new Date(2025, 1, 8, 0, 0, 1); // Next day just after midnight
      expect(isSameLocalDate(date1, date2)).toBe(false);
    });

    it('should handle string inputs', () => {
      expect(isSameLocalDate('2025-02-07', '2025-02-07')).toBe(true);
      expect(isSameLocalDate('2025-02-07', '2025-02-08')).toBe(false);

      // For ISO strings with time, compare based on local calendar day
      const date1 = '2025-02-07T12:00:00.000Z';
      const date2 = '2025-02-07T23:59:59.999Z';
      const expected = getLocalDateString(date1) === getLocalDateString(date2);
      expect(isSameLocalDate(date1, date2)).toBe(expected);
    });

    it('should be timezone-aware', () => {
      // A UTC date that is Feb 8 in UTC but might be Feb 7 in local timezone
      const utcDate = new Date('2025-02-08T00:30:00.000Z'); // 00:30 UTC Feb 8
      const localDate = new Date(2025, 1, 7, 23, 30, 0); // 23:30 local Feb 7
      // They might be same local date depending on timezone
      // We'll just verify that the comparison uses local dates
      const expected = getLocalDateString(utcDate) === getLocalDateString(localDate);
      expect(isSameLocalDate(utcDate, localDate)).toBe(expected);
    });
  });
});
