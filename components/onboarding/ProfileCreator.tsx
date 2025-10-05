import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import {
  BADGES,
  DEFAULT_PERSONA_BIO,
  KINK_EXPERIENCE_LEVELS,
  KINK_OPTIONS,
  LOOKING_FOR_OPTIONS,
  PROFILE_PROMPTS,
  RELATIONSHIP_TYPE_OPTIONS,
  ROLE_OPTIONS,
} from '@inferno/shared/constants';
import {
  AudioPrompt,
  Kink,
  ProfilePrompt,
  Screen,
  UserProfile,
} from '@inferno/shared/types';

import { InfernoButton } from '@/components/ui/inferno-button';
import { Fonts } from '@/constants/typography';
import { useAppState } from '@/providers/AppStateProvider';

const STEP_FLOW = [
  {
    title: 'Your vibe',
    subtitle: 'Add the essentials so we know who is lighting up the room.',
  },
  {
    title: 'First impression',
    subtitle: 'Pick a photo or short clip that stops thumbs in their tracks.',
  },
  {
    title: 'Energy check',
    subtitle: "Tell us what you crave and who you're chasing tonight.",
  },
  {
    title: 'Desires',
    subtitle: 'Dial in your roles, kinks, and the answers that tease.',
  },
  {
    title: 'Final polish',
    subtitle: 'Give everything a final glance before you start matching.',
  },
];

const TOTAL_STEPS = STEP_FLOW.length;
const DEFAULT_LOCATION = { lat: 37.7749, lon: -122.4194 };

interface ProfileCreatorProps {
  existingProfile?: UserProfile | null;
}

function sample<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function ProfileCreator({ existingProfile }: ProfileCreatorProps) {
  const { setUserProfile, setCurrentScreen } = useAppState();

  const [step, setStep] = useState(0);
  const [name, setName] = useState(existingProfile?.name ?? '');
  const [age, setAge] = useState(existingProfile?.age?.toString() ?? '25');
  const [height, setHeight] = useState(existingProfile?.height?.toString() ?? '175');
  const [relationshipType, setRelationshipType] = useState(
    existingProfile?.relationshipType ?? RELATIONSHIP_TYPE_OPTIONS[0],
  );
  const [bio, setBio] = useState(existingProfile?.bio ?? DEFAULT_PERSONA_BIO);
  const [lookingFor, setLookingFor] = useState<string[]>(existingProfile?.lookingFor ?? []);
  const [roles, setRoles] = useState<string[]>(existingProfile?.roles ?? []);
  const [kinks, setKinks] = useState<Kink[]>(existingProfile?.kinks ?? []);
  const [textPrompts, setTextPrompts] = useState<ProfilePrompt[]>(existingProfile?.textPrompts ?? []);
  const [audioPrompts] = useState<AudioPrompt[]>(existingProfile?.audioPrompts ?? []);
  const [publicAlbum, setPublicAlbum] = useState<string[]>(existingProfile?.publicAlbum ?? []);
  const [privateVault] = useState<string[]>(existingProfile?.privateVault ?? []);
  const [profileImage, setProfileImage] = useState(existingProfile?.imageUrl ?? '');
  const [videoUrl, setVideoUrl] = useState(existingProfile?.videoUrl ?? undefined);

  const [relationshipSheet, setRelationshipSheet] = useState(false);
  const [kinkSheet, setKinkSheet] = useState(false);
  const [promptSheetIndex, setPromptSheetIndex] = useState<number | null>(null);

  const requestMedia = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Enable photo access to upload a killer shot.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.9,
    });

    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0];
      if (asset.type === 'video') {
        setVideoUrl(asset.uri);
      }
      setProfileImage(asset.uri);
      if (!publicAlbum.length) {
        setPublicAlbum([asset.uri]);
      }
    }
  }, [publicAlbum.length]);

  const removeMedia = useCallback(() => {
    setProfileImage('');
    setVideoUrl(undefined);
  }, []);

  const toggleItem = useCallback(<T extends string>(item: T, collection: T[], setter: (next: T[]) => void) => {
    setter(collection.includes(item) ? collection.filter((entry) => entry !== item) : [...collection, item]);
  }, []);

  const toggleLookingFor = useCallback(
    (tag: string) => toggleItem(tag, lookingFor, setLookingFor),
    [lookingFor, toggleItem],
  );

  const toggleRole = useCallback(
    (role: string) => toggleItem(role, roles, setRoles),
    [roles, toggleItem],
  );

  const toggleKink = useCallback(
    (kinkName: string) => {
      setKinks((prev) => {
        if (prev.some((kink) => kink.name === kinkName)) {
          return prev.filter((kink) => kink.name !== kinkName);
        }
        if (prev.length >= 10) {
          Alert.alert('Easy, tiger', 'Pick up to 10 kinks so matches know what to bring.');
          return prev;
        }
        return [...prev, { name: kinkName, level: 'Curious' }];
      });
    },
    [],
  );

  const updateKinkLevel = useCallback((kinkName: string, level: Kink['level']) => {
    setKinks((prev) => prev.map((kink) => (kink.name === kinkName ? { ...kink, level } : kink)));
  }, []);

  const addPrompt = useCallback(() => {
    if (textPrompts.length >= 3) {
      Alert.alert('Limit reached', 'Three prompts is the sweet spot.');
      return;
    }
    const option = PROFILE_PROMPTS.find((prompt) => !textPrompts.some((entry) => entry.question === prompt));
    if (option) {
      setTextPrompts((prev) => [...prev, { question: option, answer: '' }]);
      setPromptSheetIndex(textPrompts.length);
    }
  }, [textPrompts]);

  const removePrompt = useCallback((index: number) => {
    setTextPrompts((prev) => prev.filter((_, idx) => idx !== index));
  }, []);

  const onPromptSelected = useCallback(
    (question: string) => {
      if (promptSheetIndex === null) return;
      setTextPrompts((prev) =>
        prev.map((prompt, idx) => (idx === promptSheetIndex ? { ...prompt, question } : prompt)),
      );
      setPromptSheetIndex(null);
    },
    [promptSheetIndex],
  );

  const canAdvance = useMemo(() => {
    switch (step) {
      case 0:
        return name.trim().length > 1 && Number(age) >= 18 && Number(height) >= 120;
      case 1:
        return Boolean(profileImage);
      case 2:
        return bio.trim().length > 30 && lookingFor.length > 0;
      case 3:
        return roles.length > 0 && kinks.length > 0;
      default:
        return true;
    }
  }, [age, bio, height, kinks.length, lookingFor.length, name, profileImage, roles.length, step]);

  const goNext = useCallback(() => {
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
  }, []);

  const goBack = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const persistProfile = useCallback(() => {
    const now = Date.now();
    const newProfile: UserProfile = {
      id: existingProfile?.id ?? `user-${now}`,
      name: name.trim(),
      age: Number(age),
      bio: bio.trim(),
      kinks,
      roles,
      lookingFor,
      imageUrl: profileImage || `https://picsum.photos/seed/${now}/400/600`,
      publicAlbum: publicAlbum.length ? publicAlbum : [`https://picsum.photos/seed/${now + 1}/400/600`],
      privateVault,
      vaultAccessRequestsFrom: existingProfile?.vaultAccessRequestsFrom ?? [],
      vaultAccessGrantedTo: existingProfile?.vaultAccessGrantedTo ?? [],
      videoUrl,
      textPrompts: textPrompts.length
        ? textPrompts
        : [
            {
              question: sample(PROFILE_PROMPTS),
              answer: 'Ask nicely and I just might say yes.',
            },
          ],
      audioPrompts,
      isVerified: existingProfile?.isVerified ?? false,
      badges: existingProfile?.badges ?? Object.keys(BADGES),
      lastActive: now,
      height: Number(height),
      relationshipType,
      location: existingProfile?.location ?? DEFAULT_LOCATION,
      isSpotlight: existingProfile?.isSpotlight ?? false,
    };

    setUserProfile(newProfile);
    setCurrentScreen(Screen.SWIPE);
  }, [
    existingProfile,
    name,
    age,
    bio,
    kinks,
    roles,
    lookingFor,
    profileImage,
    publicAlbum,
    privateVault,
    videoUrl,
    textPrompts,
    audioPrompts,
    height,
    relationshipType,
    setCurrentScreen,
    setUserProfile,
  ]);

  const progressPercentage = ((step + 1) / TOTAL_STEPS) * 100;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Who are we meeting?</Text>
            <Text style={styles.sectionSubtitle}>Your name stays private until you match.</Text>

            <View style={styles.fieldGrid}>
              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Display name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Inferno alias"
                  placeholderTextColor="#6E677D"
                  style={styles.input}
                  maxLength={20}
                />
              </View>
              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  value={age}
                  onChangeText={setAge}
                  keyboardType="number-pad"
                  placeholder="21"
                  placeholderTextColor="#6E677D"
                  style={styles.input}
                  maxLength={2}
                />
              </View>
            </View>

            <View style={styles.fieldGrid}>
              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Height (cm)</Text>
                <TextInput
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="number-pad"
                  placeholder="180"
                  placeholderTextColor="#6E677D"
                  style={styles.input}
                  maxLength={3}
                />
              </View>
              <Pressable style={[styles.input, styles.selectInput]} onPress={() => setRelationshipSheet(true)}>
                <Text style={styles.selectText}>{relationshipType}</Text>
                <Text style={styles.selectHint}>Tap to change</Text>
              </Pressable>
            </View>
          </View>
        );
      case 1:
        return (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Show off your spark</Text>
            <Text style={styles.sectionSubtitle}>Choose a photo or short loop that sells the fantasy.</Text>
            <Pressable style={styles.mediaHero} onPress={requestMedia}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.mediaImage} />
              ) : (
                <View style={styles.mediaPlaceholder}>
                  <Text style={styles.mediaPlaceholderTitle}>Upload cover shot</Text>
                  <Text style={styles.mediaPlaceholderSubtitle}>Portrait ratio looks best</Text>
                </View>
              )}
            </Pressable>
            <View style={styles.actionRow}>
              <InfernoButton title="Choose media" onPress={requestMedia} style={styles.flexButton} />
              <InfernoButton
                title="Remove"
                variant="secondary"
                onPress={removeMedia}
                style={styles.flexButton}
                disabled={!profileImage}
              />
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Craft your intro</Text>
            <Text style={styles.sectionSubtitle}>Flirty, bold, or mysterious — write it your way.</Text>
            <View style={styles.textAreaWrapper}>
              <TextInput
                value={bio}
                onChangeText={setBio}
                multiline
                placeholder="Tease us with a few lines..."
                placeholderTextColor="#6E677D"
                style={styles.textArea}
              />
              <Text style={styles.helperCounter}>{bio.length}/260</Text>
            </View>
            <Text style={[styles.label, styles.spacedLabel]}>I want...</Text>
            <View style={styles.chipGroup}>
              {LOOKING_FOR_OPTIONS.map((option) => {
                const active = lookingFor.includes(option);
                return (
                  <Pressable
                    key={option}
                    onPress={() => toggleLookingFor(option)}
                    style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
                  >
                    <Text style={[styles.chipText, active ? styles.chipTextActive : undefined]}>{option}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Desire settings</Text>
            <Text style={styles.sectionSubtitle}>Tag yourself and tune your interests so we can curate hotter matches.</Text>
            <Text style={[styles.label, styles.spacedLabel]}>Roles</Text>
            <View style={styles.chipGroup}>
              {ROLE_OPTIONS.map((role) => {
                const active = roles.includes(role);
                return (
                  <Pressable
                    key={role}
                    onPress={() => toggleRole(role)}
                    style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
                  >
                    <Text style={[styles.chipText, active ? styles.chipTextActive : undefined]}>{role}</Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.sheetHeader}>
              <Text style={[styles.label, styles.spacedLabel]}>Kinks & interests</Text>
              <InfernoButton title="Add" variant="secondary" onPress={() => setKinkSheet(true)} style={styles.smallButton} />
            </View>
            <View style={styles.kinkList}>
              {kinks.map((kink) => (
                <View key={kink.name} style={styles.kinkCard}>
                  <View style={styles.kinkHeaderRow}>
                    <Text style={styles.kinkName}>{kink.name}</Text>
                    <InfernoButton
                      title="Remove"
                      variant="secondary"
                      onPress={() => toggleKink(kink.name)}
                      style={styles.smallButton}
                    />
                  </View>
                  <View style={styles.levelGroup}>
                    {KINK_EXPERIENCE_LEVELS.map((level) => {
                      const active = kink.level === level;
                      return (
                        <Pressable
                          key={level}
                          onPress={() => updateKinkLevel(kink.name, level)}
                          style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
                        >
                          <Text style={[styles.pillText, active ? styles.pillTextActive : undefined]}>{level}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}
              {!kinks.length && <Text style={styles.emptyHint}>Tap add to choose the kinks you want to explore.</Text>}
            </View>
            <View style={styles.sheetHeader}>
              <Text style={[styles.label, styles.spacedLabel]}>Prompt answers</Text>
              <InfernoButton
                title="Add prompt"
                variant="secondary"
                onPress={addPrompt}
                style={styles.smallButton}
              />
            </View>
            {textPrompts.map((prompt, index) => (
              <View key={index} style={styles.promptSheet}>
                <Pressable style={[styles.input, styles.promptSelector]} onPress={() => setPromptSheetIndex(index)}>
                  <Text style={styles.promptQuestion}>{prompt.question}</Text>
                  <Text style={styles.promptChange}>Change</Text>
                </Pressable>
                <TextInput
                  value={prompt.answer}
                  onChangeText={(value) =>
                    setTextPrompts((prev) => prev.map((item, idx) => (idx === index ? { ...item, answer: value } : item)))
                  }
                  placeholder="Give them something spicy..."
                  placeholderTextColor="#6E677D"
                  style={styles.promptInput}
                  multiline
                />
                <InfernoButton
                  title="Remove prompt"
                  variant="secondary"
                  onPress={() => removePrompt(index)}
                  style={styles.smallButton}
                />
              </View>
            ))}
          </View>
        );
      default:
        return (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Preview & launch</Text>
            <Text style={styles.sectionSubtitle}>Make sure you love what you see. You can always tweak it later.</Text>
            <View style={styles.reviewHero}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.reviewImage} />
              ) : (
                <View style={styles.reviewPlaceholder}>
                  <Text style={styles.reviewPlaceholderText}>No photo yet</Text>
                </View>
              )}
              <Text style={styles.reviewName}>
                {name || 'Inferno member'}
                {`, ${age || '--'}`}
              </Text>
              <Text style={styles.reviewMeta}>
                {relationshipType} • {height || '--'}cm
              </Text>
              <Text style={styles.reviewBio}>{bio}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reviewChips}>
                {lookingFor.map((tag) => (
                  <View key={tag} style={styles.reviewChip}>
                    <Text style={styles.reviewChipText}>{tag}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        );
    }
  };

  const renderSheet = (
    visible: boolean,
    onClose: () => void,
    title: string,
    children: React.ReactNode,
  ) => (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.sheetBackdrop}>
        <View style={styles.sheetCard}>
          <Text style={styles.sheetTitle}>{title}</Text>
          <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
          <InfernoButton title="Done" onPress={onClose} style={styles.sheetDone} />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.containerRoot}>
      <View style={styles.appBar}>
        <Text style={styles.stepBadge}>{`Step ${step + 1} of ${TOTAL_STEPS}`}</Text>
        <Text style={styles.appBarTitle}>{STEP_FLOW[step].title}</Text>
        <Text style={styles.appBarSubtitle}>{STEP_FLOW[step].subtitle}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderStep()}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <InfernoButton
          title="Back"
          variant="secondary"
          onPress={goBack}
          style={styles.footerButton}
          disabled={step === 0}
        />
        {step < TOTAL_STEPS - 1 ? (
          <InfernoButton title="Next" onPress={goNext} style={styles.footerButton} disabled={!canAdvance} />
        ) : (
          <InfernoButton title="Launch profile" onPress={persistProfile} style={styles.footerButton} />
        )}
      </View>

      {renderSheet(
        relationshipSheet,
        () => setRelationshipSheet(false),
        'Relationship energy',
        RELATIONSHIP_TYPE_OPTIONS.map((option) => (
          <Pressable
            key={option}
            onPress={() => {
              setRelationshipType(option);
              setRelationshipSheet(false);
            }}
            style={[styles.sheetOption, option === relationshipType ? styles.sheetOptionActive : undefined]}
          >
            <Text style={[styles.sheetOptionText, option === relationshipType ? styles.sheetOptionTextActive : undefined]}>
              {option}
            </Text>
          </Pressable>
        )),
      )}

      {renderSheet(
        kinkSheet,
        () => setKinkSheet(false),
        'Select kinks',
        KINK_OPTIONS.map((option) => {
          const active = kinks.some((entry) => entry.name === option);
          return (
            <Pressable
              key={option}
              onPress={() => toggleKink(option)}
              style={[styles.sheetOption, active ? styles.sheetOptionActive : undefined]}
            >
              <Text style={[styles.sheetOptionText, active ? styles.sheetOptionTextActive : undefined]}>{option}</Text>
            </Pressable>
          );
        }),
      )}

      {renderSheet(
        promptSheetIndex !== null,
        () => setPromptSheetIndex(null),
        'Choose a prompt',
        PROFILE_PROMPTS.map((prompt) => (
          <Pressable
            key={prompt}
            onPress={() => onPromptSelected(prompt)}
            style={[styles.sheetOption, textPrompts[promptSheetIndex ?? 0]?.question === prompt ? styles.sheetOptionActive : undefined]}
          >
            <Text
              style={[
                styles.sheetOptionText,
                textPrompts[promptSheetIndex ?? 0]?.question === prompt ? styles.sheetOptionTextActive : undefined,
              ]}
            >
              {prompt}
            </Text>
          </Pressable>
        )),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  containerRoot: {
    flex: 1,
    backgroundColor: '#0E0B14',
  },
  appBar: {
    paddingHorizontal: 24,
    paddingTop: Platform.select({ ios: 12, default: 24 }),
    paddingBottom: 12,
    gap: 4,
  },
  stepBadge: {
    fontFamily: Fonts.poppinsSemiBold,
    fontSize: 12,
    color: '#8A84A1',
    textTransform: 'uppercase',
  },
  appBarTitle: {
    fontFamily: Fonts.poppinsExtraBold,
    fontSize: 24,
    color: '#FFFFFF',
  },
  appBarSubtitle: {
    fontFamily: Fonts.poppinsRegular,
    fontSize: 14,
    color: '#B2AEC5',
    lineHeight: 20,
  },
  progressBar: {
    marginTop: 12,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#241F33',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E4007C',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: Platform.select({ ios: 160, default: 140 }),
  },
  card: {
    backgroundColor: '#151225',
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: '#221E31',
    marginBottom: 24,
    gap: 16,
    width: '100%',
    maxWidth: 360,
  },
  sectionTitle: {
    fontFamily: Fonts.poppinsBold,
    fontSize: 20,
    color: '#FFFFFF',
  },
  sectionSubtitle: {
    fontFamily: Fonts.poppinsRegular,
    fontSize: 14,
    color: '#B2AEC5',
    lineHeight: 20,
  },
  fieldGrid: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  fieldBlock: {
    flex: 1,
    gap: 6,
  },
  label: {
    fontFamily: Fonts.poppinsSemiBold,
    fontSize: 13,
    color: '#CFCBD9',
  },
  input: {
    backgroundColor: '#221E31',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: Platform.select({ ios: 14, default: 12 }),
    color: '#FFFFFF',
    fontFamily: Fonts.poppinsRegular,
    borderWidth: 1,
    borderColor: '#2E2940',
  },
  selectInput: {
    marginTop: 24,
    justifyContent: 'center',
  },
  selectText: {
    fontFamily: Fonts.poppinsSemiBold,
    color: '#FFFFFF',
    fontSize: 15,
  },
  selectHint: {
    fontFamily: Fonts.poppinsRegular,
    color: '#6E677D',
    fontSize: 12,
  },
  textAreaWrapper: {
    position: 'relative',
  },
  textArea: {
    minHeight: 160,
    backgroundColor: '#221E31',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 24,
    color: '#FFFFFF',
    fontFamily: Fonts.poppinsRegular,
    borderWidth: 1,
    borderColor: '#2E2940',
    textAlignVertical: 'top',
  },
  helperCounter: {
    position: 'absolute',
    right: 16,
    bottom: 8,
    fontFamily: Fonts.poppinsRegular,
    fontSize: 12,
    color: '#6E677D',
  },
  spacedLabel: {
    marginTop: 8,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1,
  },
  chipInactive: {
    borderColor: '#2E2940',
    backgroundColor: '#1A1628',
  },
  chipActive: {
    borderColor: '#E4007C',
    backgroundColor: '#E4007C',
  },
  chipText: {
    fontFamily: Fonts.poppinsSemiBold,
    color: '#CFCBD9',
    fontSize: 13,
    textAlign: 'center',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  smallButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
  kinkList: {
    gap: 12,
  },
  kinkCard: {
    backgroundColor: '#1F1B2C',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2E2940',
    padding: 16,
    gap: 12,
  },
  kinkHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kinkName: {
    fontFamily: Fonts.poppinsSemiBold,
    color: '#FFFFFF',
    fontSize: 16,
  },
  levelGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
  },
  pillInactive: {
    backgroundColor: '#1A1628',
    borderColor: '#2E2940',
  },
  pillActive: {
    backgroundColor: '#E4007C',
    borderColor: '#E4007C',
  },
  pillText: {
    fontFamily: Fonts.poppinsSemiBold,
    color: '#B2AEC5',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  emptyHint: {
    fontFamily: Fonts.poppinsRegular,
    fontSize: 13,
    color: '#6E677D',
  },
  promptSheet: {
    backgroundColor: '#1F1B2C',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2E2940',
    padding: 16,
    gap: 12,
    marginTop: 12,
  },
  promptSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promptQuestion: {
    fontFamily: Fonts.poppinsSemiBold,
    fontSize: 13,
    color: '#FFFFFF',
    flex: 1,
    marginRight: 12,
  },
  promptChange: {
    fontFamily: Fonts.poppinsSemiBold,
    fontSize: 12,
    color: '#E4007C',
  },
  promptInput: {
    minHeight: 100,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#221E31',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2E2940',
    fontFamily: Fonts.poppinsRegular,
    textAlignVertical: 'top',
    width: '100%',
  },
  mediaHero: {
    borderRadius: 28,
    backgroundColor: '#1A1628',
    borderWidth: 1,
    borderColor: '#2E2940',
    overflow: 'hidden',
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaPlaceholder: {
    alignItems: 'center',
    gap: 6,
  },
  mediaPlaceholderTitle: {
    fontFamily: Fonts.poppinsSemiBold,
    color: '#FFFFFF',
    fontSize: 16,
  },
  mediaPlaceholderSubtitle: {
    fontFamily: Fonts.poppinsRegular,
    color: '#6E677D',
    fontSize: 13,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  flexButton: {
    flex: 1,
    maxWidth: 160,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
    backgroundColor: '#0E0B14',
  },
  footerButton: {
    flex: 1,
    maxWidth: 180,
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheetCard: {
    backgroundColor: '#151225',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.select({ ios: 40, default: 28 }),
    gap: 16,
    maxHeight: '85%',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 380,
  },
  sheetTitle: {
    fontFamily: Fonts.poppinsBold,
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
  sheetOption: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2E2940',
    padding: 16,
    marginBottom: 12,
  },
  sheetOptionActive: {
    borderColor: '#E4007C',
    backgroundColor: 'rgba(228,0,124,0.12)',
  },
  sheetOptionText: {
    fontFamily: Fonts.poppinsSemiBold,
    color: '#CFCBD9',
    fontSize: 15,
  },
  sheetOptionTextActive: {
    color: '#FFFFFF',
  },
  sheetDone: {
    marginTop: 4,
  },
  reviewHero: {
    alignItems: 'center',
    gap: 12,
  },
  reviewImage: {
    width: 180,
    height: 240,
    borderRadius: 24,
  },
  reviewPlaceholder: {
    width: 180,
    height: 240,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2E2940',
    backgroundColor: '#1A1628',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewPlaceholderText: {
    fontFamily: Fonts.poppinsSemiBold,
    color: '#6E677D',
  },
  reviewName: {
    fontFamily: Fonts.poppinsBold,
    fontSize: 20,
    color: '#FFFFFF',
  },
  reviewMeta: {
    fontFamily: Fonts.poppinsRegular,
    fontSize: 14,
    color: '#B2AEC5',
  },
  reviewBio: {
    fontFamily: Fonts.poppinsRegular,
    fontSize: 14,
    color: '#CFCBD9',
    textAlign: 'center',
  },
  reviewChips: {
    paddingTop: 6,
  },
  reviewChip: {
    backgroundColor: '#E4007C',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
  },
  reviewChipText: {
    fontFamily: Fonts.poppinsSemiBold,
    color: '#FFFFFF',
    fontSize: 12,
  },
});
