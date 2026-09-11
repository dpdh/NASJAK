import type { User } from '../types';

export const SUPER_ADMIN_EMAILS = ['dp.danihamdani@gmail.com'];
export const ADMIN_EMAILS = ['admin@nasuha.id', 'admin@nasjak.id'];

export function getRoleForEmail(email: string): User['role'] {
  if (SUPER_ADMIN_EMAILS.includes(email)) return 'super_admin';
  if (ADMIN_EMAILS.includes(email)) return 'admin';
  return 'calon_sahabat';
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/[^0-9+]/g, '');
  if (digits.startsWith('+62')) return `0${digits.slice(3)}`;
  if (digits.startsWith('62')) return `0${digits.slice(2)}`;
  return digits;
}
