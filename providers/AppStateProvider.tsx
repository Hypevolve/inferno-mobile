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

const ENABLE_DEV_SHORTCUT = true;

const DEV_PROFILE: UserProfile = {
  id: 'dev-user',
  name: 'Inferno Dev',
  age: 28,
  bio: 'Debugging the hottest app in town. Swipe right if you love rapid iteration and late-night deploys.',
  kinks: [],
  roles: ['Dominant'],
  lookingFor: ['#Exploration'],
  imageUrl: 'https://picsum.photos/seed/inferno-dev/400/600',
  publicAlbum: ['https://picsum.photos/seed/inferno-dev-1/400/600'],
  privateVault: [],
  vaultAccessRequestsFrom: [],
  vaultAccessGrantedTo: [],
  videoUrl: undefined,
  textPrompts: [],
  audioPrompts: [],
  isVerified: true,
  badges: [],
  lastActive: Date.now(),
  height: 180,
  relationshipType: 'Monogamous',
  location: { lat: 37.7749, lon: -122.4194 },
  isSpotlight: false,
};

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [isAgeVerified, setIsAgeVerified] = useState(ENABLE_DEV_SHORTCUT);
  const [currentScreen, setCurrentScreenState] = useState<Screen>(
    ENABLE_DEV_SHORTCUT ? Screen.SWIPE : Screen.AGE_GATE,
  );
  const [userProfile, setUserProfile] = useState<UserProfile | null>(ENABLE_DEV_SHORTCUT ? DEV_PROFILE : null);

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
