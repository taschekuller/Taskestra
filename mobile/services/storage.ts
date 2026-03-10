import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type { StateStorage } from 'zustand/middleware';

interface MMKVInstance {
  set: (key: string, value: string) => void;
  getString: (key: string) => string | undefined;
  remove: (key: string) => void;
}

const isExpoGo = Constants.executionEnvironment === 'storeClient';
const memoryStorage = new Map<string, string>();

let mmkv: MMKVInstance | null = null;
let asyncStorage:
  | {
      setItem: (key: string, value: string) => Promise<void>;
      getItem: (key: string) => Promise<string | null>;
      removeItem: (key: string) => Promise<void>;
    }
  | null
  | undefined;

const getAsyncStorage = () => {
  if (asyncStorage !== undefined) {
    return asyncStorage;
  }

  try {
    const module = require('@react-native-async-storage/async-storage') as {
      default?: {
        setItem: (key: string, value: string) => Promise<void>;
        getItem: (key: string) => Promise<string | null>;
        removeItem: (key: string) => Promise<void>;
      };
    };

    asyncStorage = module.default ?? null;
  } catch {
    asyncStorage = null;
  }

  return asyncStorage;
};

const getMMKV = (): MMKVInstance | null => {
  if (Platform.OS === 'web' || isExpoGo) {
    return null;
  }

  if (mmkv) {
    return mmkv;
  }

  try {
    const { createMMKV } = require('react-native-mmkv') as {
      createMMKV: (config: { id: string }) => MMKVInstance;
    };

    mmkv = createMMKV({ id: 'taskestra-storage' });
    return mmkv;
  } catch {
    return null;
  }
};

export const storage: StateStorage = {
  setItem: async (name, value) => {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.setItem(name, value);
      return;
    }

    const nativeMMKV = getMMKV();
    if (nativeMMKV) {
      nativeMMKV.set(name, value);
      return;
    }

    const asyncModule = getAsyncStorage();
    if (asyncModule) {
      await asyncModule.setItem(name, value);
      return;
    }

    memoryStorage.set(name, value);
  },
  getItem: async (name) => {
    if (Platform.OS === 'web') {
      return globalThis.localStorage?.getItem(name) ?? null;
    }

    const nativeMMKV = getMMKV();
    if (nativeMMKV) {
      return nativeMMKV.getString(name) ?? null;
    }

    const asyncModule = getAsyncStorage();
    if (asyncModule) {
      return asyncModule.getItem(name);
    }

    return memoryStorage.get(name) ?? null;
  },
  removeItem: async (name) => {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.removeItem(name);
      return;
    }

    const nativeMMKV = getMMKV();
    if (nativeMMKV) {
      nativeMMKV.remove(name);
      return;
    }

    const asyncModule = getAsyncStorage();
    if (asyncModule) {
      await asyncModule.removeItem(name);
      return;
    }

    memoryStorage.delete(name);
  },
};
