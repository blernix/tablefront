/**
 * Génère un code court unique pour les URLs de type "vanity URL"
 * Version simplifiée pour le frontend
 * 
 * @param length - Longueur du code (défaut: 8)
 * @returns Code court unique
 */
export function generateShortCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Génère un slug à partir d'un nom
 * 
 * @param name - Nom du restaurant
 * @returns Slug nettoyé
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
    .padEnd(3, 'x');
}