import React, { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import { Screen, type UserProfile } from '@inferno/shared/types';

interface AppStateContextValue {
  isAgeVerified: boolean;
  currentScreen: Screen;
  userProfile: UserProfile | null;
  setAgeVerified: () => void;
  setCurrentScreen: (screen: Screen) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  beginProfileCreation: () => void;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [currentScreen, setCurrentScreenState] = useState<Screen>(Screen.AGE_GATE);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const setCurrentScreen = useCallback((screen: Screen) => {
    setCurrentScreenState(screen);
  }, []);

  const setAgeVerified = useCallback(() => {
    setIsAgeVerified(true);
    setCurrentScreen(Screen.ONBOARDING_WELCOME);
  }, [setCurrentScreen]);

  const beginProfileCreation = useCallback(() => {
    setCurrentScreen(Screen.PROFILE_CREATOR);
  }, [setCurrentScreen]);

  const value = useMemo<AppStateContextValue>(
    () => ({
      isAgeVerified,
      currentScreen,
      userProfile,
      setAgeVerified,
      setCurrentScreen,
      setUserProfile,
      beginProfileCreation,
    }),
    [beginProfileCreation, currentScreen, isAgeVerified, setAgeVerified, setCurrentScreen, userProfile]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
