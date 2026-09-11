type NativeModule = Record<string, any>;

export function getNotifications(): NativeModule | null {
  try {
    return require('expo-notifications') as NativeModule;
  } catch {
    return null;
  }
}

export function getMaps(): NativeModule | null {
  try {
    return require('expo-maps') as NativeModule;
  } catch {
    return null;
  }
}
