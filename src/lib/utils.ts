/**
 * Formats a number as a Philippine Peso price string
 * @param amount - The amount to format
 * @returns A formatted price string (e.g., "₱1,234.56")
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a date string to a localized date
 * @param dateString - The date string to format
 * @returns A formatted date string
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a date string to a localized date and time
 * @param dateString - The date string to format
 * @returns A formatted date and time string
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

/**
 * Truncates text to a specified length and adds ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncating
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Generates a random order reference number
 * @returns A unique order reference number
 */
export function generateOrderReference(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `KDA-${timestamp}${random}`;
}

/**
 * Validates a Philippine mobile number
 * @param number - The mobile number to validate
 * @returns True if the number is valid
 */
export function isValidPhMobileNumber(number: string): boolean {
  const phoneRegex = /^(09|\+639)\d{9}$/;
  return phoneRegex.test(number);
}

/**
 * Calculates the delivery fee based on distance or zone
 * @param distance - Distance in kilometers or zone number
 * @returns Delivery fee amount
 */
export function calculateDeliveryFee(distance: number): number {
  const baseFee = 50;
  const additionalFeePerKm = 10;
  
  if (distance <= 3) {
    return baseFee;
  }
  
  const additionalDistance = Math.ceil(distance - 3);
  return baseFee + (additionalDistance * additionalFeePerKm);
}
