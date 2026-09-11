import { readJson, writeJson } from './storage';

export interface StoredAccount {
  email: string;
  password: string;
  name: string;
  phone?: string;
  createdAt: string;
}

const ACCOUNTS_KEY = '@nasjak_accounts';

export const DEFAULT_SUPER_ADMIN_ACCOUNT: StoredAccount = {
  email: 'nasjak@gmail.com',
  password: 'Admin123',
  name: 'Super Admin NASJAK',
  createdAt: new Date().toISOString(),
};

export async function loadAccounts(): Promise<StoredAccount[]> {
  return (await readJson<StoredAccount[]>(ACCOUNTS_KEY)) || [];
}

export async function saveAccounts(accounts: StoredAccount[]): Promise<void> {
  await writeJson(ACCOUNTS_KEY, accounts);
}

export async function ensureDefaultSuperAdmin(): Promise<void> {
  const accounts = await loadAccounts();
  const exists = accounts.some((account) => account.email.toLowerCase() === DEFAULT_SUPER_ADMIN_ACCOUNT.email.toLowerCase());
  if (!exists) {
    await saveAccounts([...accounts, DEFAULT_SUPER_ADMIN_ACCOUNT]);
  }
}
