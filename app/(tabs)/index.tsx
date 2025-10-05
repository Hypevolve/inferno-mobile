import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { SwipeScreen } from '@/components/swipe/SwipeScreen';
import { generateMatches } from '@/services/matchService';
import { useAppState } from '@/providers/AppStateProvider';
import { UserProfile } from '@inferno/shared/types';

export default function SwipeRoute() {
  const router = useRouter();
  const { userProfile } = useAppState();

  const [queue, setQueue] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPassed, setLastPassed] = useState<UserProfile | null>(null);
  const [filtersActive, setFiltersActive] = useState(false);
  const [boostActive, setBoostActive] = useState(false);
  const [boostEndTime, setBoostEndTime] = useState<number | null>(null);
  const [boostCountdown, setBoostCountdown] = useState<string | null>(null);

  const timeouts = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const intervals = useRef<Array<ReturnType<typeof setInterval>>>([]);

  useEffect(() => {
    return () => {
      timeouts.current.forEach(clearTimeout);
      intervals.current.forEach(clearInterval);
    };
  }, []);

  useEffect(() => {
    if (!userProfile) {
      router.replace('/onboarding');
    }
  }, [router, userProfile]);

  const loadMatches = useCallback(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setQueue((prev) => [...prev, ...generateMatches(8)]);
      setIsLoading(false);
    }, 350);
    timeouts.current.push(timeout);
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  useEffect(() => {
    if (!isLoading && queue.length <= 3) {
      loadMatches();
    }
  }, [isLoading, loadMatches, queue.length]);

  const currentProfile = queue[0];
  const nextProfile = queue[1];

  const removeCurrentProfile = useCallback(() => {
    setQueue((prev) => prev.slice(1));
  }, []);

  const handlePass = useCallback(() => {
    if (!currentProfile) return;
    setLastPassed(currentProfile);
    removeCurrentProfile();
  }, [currentProfile, removeCurrentProfile]);

  const handleLike = useCallback(() => {
    if (!currentProfile) return;
    setLastPassed(null);
    removeCurrentProfile();
  }, [currentProfile, removeCurrentProfile]);

  const handleSuperLike = useCallback(() => {
    if (!currentProfile) return;
    setLastPassed(null);
    removeCurrentProfile();
  }, [currentProfile, removeCurrentProfile]);

  const handleRewind = useCallback(() => {
    if (!lastPassed) return;
    setQueue((prev) => [lastPassed, ...prev]);
    setLastPassed(null);
  }, [lastPassed]);

  const handleBoost = useCallback(() => {
    if (boostActive) return;
    const endTime = Date.now() + 15 * 60 * 1000;
    setBoostActive(true);
    setBoostEndTime(endTime);
  }, [boostActive]);

  useEffect(() => {
    if (!boostActive || !boostEndTime) {
      setBoostCountdown(null);
      return;
    }

    const intervalId = setInterval(() => {
      const remaining = boostEndTime - Date.now();
      if (remaining <= 0) {
        setBoostActive(false);
        setBoostEndTime(null);
        setBoostCountdown(null);
        return;
      }
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setBoostCountdown(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    intervals.current.push(intervalId);

    return () => clearInterval(intervalId);
  }, [boostActive, boostEndTime]);

  const effectiveLoading = useMemo(() => !currentProfile && isLoading, [currentProfile, isLoading]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <SwipeScreen
        profile={currentProfile}
        nextProfile={nextProfile}
        isLoading={effectiveLoading}
        canRewind={Boolean(lastPassed)}
        boostActive={boostActive}
        boostCountdown={boostCountdown}
        onRewind={handleRewind}
        onPass={handlePass}
        onSuperLike={handleSuperLike}
        onLike={handleLike}
        onBoost={handleBoost}
        onOpenFilters={() => setFiltersActive((prev) => !prev)}
        filtersActive={filtersActive}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090612',
  },
});
