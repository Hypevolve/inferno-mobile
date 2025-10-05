import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { UserProfile } from '@inferno/shared/types';

interface ProfileCardProps {
  profile: UserProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <ImageBackground source={{ uri: profile.imageUrl }} style={styles.image} imageStyle={styles.imageBorder}>
      <LinearGradient colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.35)', 'rgba(6,2,14,0.85)']} style={styles.overlay}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {profile.name}
          </Text>
          <Text style={styles.age}>{profile.age}</Text>
        </View>
        <Text style={styles.subtitle} numberOfLines={1}>
          {profile.roles[0] ?? 'Adventurous spirit'}
        </Text>

        <Text style={styles.bio} numberOfLines={3}>
          {profile.bio.trim().length ? profile.bio : 'No bio yet, but always up for a spark.'}
        </Text>

        <View style={styles.metricRow}>
          <Metric icon="location" label={`${formatDistance(profile)} km`} />
          <Metric icon="heart" label={profile.relationshipType ?? 'Single'} />
          <Metric icon="body" label={profile.height ? `${profile.height} cm` : '—'} />
        </View>

        <TouchableOpacity activeOpacity={0.8} style={styles.viewMoreButton}>
          <Text style={styles.viewMoreText}>View more</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ImageBackground>
  );
}

function Metric({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.metricPill}>
      <Ionicons name={`${icon}-outline` as keyof typeof Ionicons.glyphMap} size={14} color="#FFFFFF" />
      <Text style={styles.metricText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'flex-end',
    borderRadius: 32,
    overflow: 'hidden',
  },
  imageBorder: {
    borderRadius: 32,
  },
  overlay: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  name: {
    flexShrink: 1,
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  age: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    color: '#E7DFFF',
    fontSize: 14,
  },
  bio: {
    color: '#F1ECFF',
    fontSize: 15,
    lineHeight: 22,
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(228, 0, 124, 0.28)',
  },
  metricText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  viewMoreButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(118, 70, 255, 0.45)',
  },
  viewMoreText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

function formatDistance(profile: UserProfile) {
  const R = 6371;
  const sfLat = 37.7749 * (Math.PI / 180);
  const sfLon = -122.4194 * (Math.PI / 180);
  const targetLat = profile.location.lat * (Math.PI / 180);
  const targetLon = profile.location.lon * (Math.PI / 180);

  const dLat = targetLat - sfLat;
  const dLon = targetLon - sfLon;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(sfLat) * Math.cos(targetLat) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance.toFixed(1);
}
