import { readJson, writeJson } from './storage';

export interface StoredAccount {
  email: string;
  password: string;
  name: string;
  phone?: string;
  createdAt: string;
}

const ACCOUNTS_KEY = '@nasjak_accounts';

export async function loadAccounts(): Promise<StoredAccount[]> {
  return (await readJson<StoredAccount[]>(ACCOUNTS_KEY)) || [];
}

export async function saveAccounts(accounts: StoredAccount[]): Promise<void> {
  await writeJson(ACCOUNTS_KEY, accounts);
}
