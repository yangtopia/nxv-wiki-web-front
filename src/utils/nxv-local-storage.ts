export type NxvLocalStorageKey =
  | 'nxv/lang'
  | 'nxv/locale'
  | 'nxv/auth'
  | 'nxv/emailForSignIn'
  | 'nxv/reading-history';

export class NxvLocalStorage {
  private _localStorage: Storage;

  constructor(localStorage: Storage) {
    this._localStorage = localStorage;
  }

  static of(localStorage: Storage) {
    return new NxvLocalStorage(localStorage);
  }

  setItem<T>(key: NxvLocalStorageKey, value: T): void {
    this._localStorage.setItem(key, JSON.stringify(value));
  }

  getItem<T>(key: NxvLocalStorageKey): T | null {
    const item = this._localStorage.getItem(key);
    if (item) {
      try {
        const parsed: T = JSON.parse(item);
        return parsed;
      } catch (error) {
        return item as any;
      }
    }
    return null;
  }

  clear(): void {
    this._localStorage.clear();
  }

  removeItem(key: NxvLocalStorageKey): void {
    this._localStorage.removeItem(key);
  }

  key(index: number): string | null {
    return this._localStorage.key(index);
  }
}
