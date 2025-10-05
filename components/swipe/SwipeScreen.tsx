import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { ProfileCard } from '@/components/swipe/ProfileCard';
import { UserProfile } from '@inferno/shared/types';

interface SwipeScreenProps {
  profile?: UserProfile;
  isLoading: boolean;
  canRewind: boolean;
  boostActive: boolean;
  boostCountdown: string | null;
  onRewind: () => void;
  onPass: () => void;
  onSuperLike: () => void;
  onLike: () => void;
  onBoost: () => void;
  onOpenFilters: () => void;
  filtersActive: boolean;
}

export function SwipeScreen({
  profile,
  isLoading,
  canRewind,
  boostActive,
  boostCountdown,
  onRewind,
  onPass,
  onSuperLike,
  onLike,
  onBoost,
  onOpenFilters,
  filtersActive,
}: SwipeScreenProps) {
  const theme = Colors.dark;
  const buttonDisabled = useMemo(() => isLoading || !profile, [isLoading, profile]);

  return (
    <LinearGradient colors={theme.backgroundGradient} style={styles.gradient}>
      <View style={styles.header}>
        <View style={styles.headerSpacer}>
          <TouchableOpacity
            onPress={onRewind}
            disabled={!canRewind || buttonDisabled}
            style={[styles.headerButton, (!canRewind || buttonDisabled) && styles.headerButtonDisabled]}
          >
            <Ionicons name="return-down-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          {boostActive ? (
            <View style={styles.boostPill}>
              <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FEEA61" />
              <Text style={styles.boostText}>{boostCountdown}</Text>
            </View>
          ) : (
            <Ionicons name="flame" size={32} color="#FEEA61" />
          )}
        </View>
        <View style={styles.headerSpacer}>
          <TouchableOpacity onPress={onOpenFilters} style={styles.headerButton}>
            <Ionicons name="filter" size={22} color="#FFFFFF" />
            {filtersActive && <View style={styles.filterDot} />}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardArea}>
        {isLoading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color="#FFFFFF" size="large" />
          </View>
        ) : profile ? (
          <ProfileCard profile={profile} />
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="sparkles" size={32} color="#C5B5E6" />
            <Text style={styles.emptyTitle}>No one new nearby</Text>
            <Text style={styles.emptySubtitle}>Adjust your filters or check back later.</Text>
          </View>
        )}
      </View>

      <View style={styles.actionBar}>
        <SwipeButton
          onPress={onRewind}
          icon={<Ionicons name="refresh" size={24} color="#8DD7F7" />}
          disabled={!canRewind || buttonDisabled}
          background="rgba(141, 215, 247, 0.14)"
        />
        <SwipeButton
          onPress={onPass}
          icon={<Ionicons name="close" size={30} color="#FF5E91" />}
          disabled={buttonDisabled}
          size="large"
          background="rgba(255, 94, 145, 0.18)"
        />
        <SwipeButton
          onPress={onSuperLike}
          icon={<Ionicons name="star" size={28} color="#61DAFB" />}
          disabled={buttonDisabled}
          background="rgba(97, 218, 251, 0.18)"
        />
        <SwipeButton
          onPress={onLike}
          icon={<Ionicons name="heart" size={30} color="#FF8BCF" />}
          disabled={buttonDisabled}
          size="large"
          background="rgba(255, 139, 207, 0.22)"
        />
        <SwipeButton
          onPress={onBoost}
          icon={<MaterialCommunityIcons name="rocket-launch" size={26} color="#FEEA61" />}
          disabled={boostActive || buttonDisabled}
          background="rgba(254, 234, 97, 0.14)"
        />
      </View>

      <Text style={styles.helperText}>Swipe left to pass, tap heart to match instantly.</Text>
    </LinearGradient>
  );
}

interface SwipeButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  disabled?: boolean;
  size?: 'default' | 'large';
  background: string;
}

function SwipeButton({ onPress, icon, disabled, size = 'default', background }: SwipeButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[styles.button, size === 'large' && styles.buttonLarge, { backgroundColor: background }, disabled && styles.buttonDisabled]}
    >
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerSpacer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButton: {
    padding: 10,
  },
  headerButtonDisabled: {
    opacity: 0.4,
  },
  filterDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5E91',
  },
  boostPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(254, 234, 97, 0.2)',
  },
  boostText: {
    color: '#FEEA61',
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  cardArea: {
    flex: 1,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(18, 10, 32, 0.65)',
  },
  loadingCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: '#C5B5E6',
    fontSize: 14,
    textAlign: 'center',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLarge: {
    width: 72,
    height: 72,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  helperText: {
    marginTop: 16,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
  },
});
