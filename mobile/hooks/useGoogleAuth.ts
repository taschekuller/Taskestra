import { useCallback, useEffect, useMemo, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';

import { signInGoogle } from '@/services/googleCalendar';

const TOKEN_KEY = 'google-calendar-access-token';
const EXPIRY_KEY = 'google-calendar-access-token-expiry';

export const useGoogleAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const redirectUri = useMemo(() => AuthSession.makeRedirectUri({ scheme: 'taskestra' }), []);

  useEffect(() => {
    const loadStoredToken = async () => {
      const [storedToken, storedExpiry] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(EXPIRY_KEY),
      ]);

      if (!storedToken) {
        return;
      }

      const parsedExpiry = storedExpiry ? Number(storedExpiry) : Date.now() + 15 * 60 * 1000;
      if (Number.isNaN(parsedExpiry) || parsedExpiry <= Date.now()) {
        await Promise.all([SecureStore.deleteItemAsync(TOKEN_KEY), SecureStore.deleteItemAsync(EXPIRY_KEY)]);
        return;
      }

      setAccessToken(storedToken);
      setExpiresAt(parsedExpiry);
    };

    loadStoredToken();
  }, []);

  const signIn = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await signInGoogle();
      if (!result) {
        return false;
      }

      setAccessToken(result.accessToken);
      setExpiresAt(result.expiresAt);

      await Promise.all([
        SecureStore.setItemAsync(TOKEN_KEY, result.accessToken),
        SecureStore.setItemAsync(EXPIRY_KEY, String(result.expiresAt)),
      ]);

      return true;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setAccessToken(null);
    setExpiresAt(null);

    await Promise.all([SecureStore.deleteItemAsync(TOKEN_KEY), SecureStore.deleteItemAsync(EXPIRY_KEY)]);
  }, []);

  const isConnected = Boolean(accessToken && expiresAt && expiresAt > Date.now());

  return {
    accessToken,
    isConnected,
    isLoading,
    redirectUri,
    authStrategy: 'pkce-relogin' as const,
    signIn,
    signOut,
  };
};
