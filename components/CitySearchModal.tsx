import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/src/theme';
import { SPACE, RADIUS } from '@/constants/spacing';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography';
import { useCitySearch } from '@/hooks/useCitySearch';
import type { CityResult } from '@/hooks/useCitySearch';

export interface CitySearchModalProps {
  visible:  boolean;
  onClose:  () => void;
  onSelect: (city: CityResult) => void;
}

export default function CitySearchModal({
  visible,
  onClose,
  onSelect,
}: CitySearchModalProps): React.JSX.Element {
  const theme              = useTheme();
  const { width, height }  = useWindowDimensions();
  const { results, loading, error, search, clear } = useCitySearch();
  const [query, setQuery]  = useState('');

  const handleChange = useCallback((text: string) => {
    setQuery(text);
    search(text);
  }, [search]);

  const handleSelect = useCallback((city: CityResult) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect(city);
    setQuery('');
    clear();
    onClose();
  }, [onSelect, clear, onClose]);

  const handleClose = useCallback(() => {
    setQuery('');
    clear();
    onClose();
  }, [clear, onClose]);

  const isSmall = width < 375;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={[styles.root, { backgroundColor: theme.bgPrimary }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={[styles.modalHeader, { paddingHorizontal: isSmall ? SPACE.MD : SPACE.LG }]}>
          <Text style={styles.modalTitle}>Search City</Text>
          <Pressable
            onPress={handleClose}
            style={styles.closeBtn}
            accessibilityLabel="Close city search"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={24} color={theme.textPrimary} />
          </Pressable>
        </View>

        {/* Search input */}
        <View style={[styles.inputRow, { paddingHorizontal: isSmall ? SPACE.MD : SPACE.LG }]}>
          <View style={[styles.inputWrap, { backgroundColor: theme.bgCard }]}>
            <Ionicons name="search-outline" size={18} color={theme.textSecondary} />
            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              placeholder="City name…"
              placeholderTextColor={theme.textMuted}
              value={query}
              onChangeText={handleChange}
              autoFocus
              returnKeyType="search"
              accessibilityLabel="Search for a city"
            />
            {query.length > 0 && (
              <Pressable
                onPress={() => handleChange('')}
                accessibilityLabel="Clear search"
                accessibilityRole="button"
                hitSlop={8}
              >
                <Ionicons name="close-circle" size={18} color={theme.textMuted} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Results */}
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator color={theme.textPrimary} />
          </View>
        )}

        {error && !loading && (
          <View style={styles.center}>
            <Text style={[styles.errorText, { color: theme.textSecondary }]}>{error}</Text>
          </View>
        )}

        {!loading && !error && query.length >= 2 && results.length === 0 && (
          <View style={styles.center}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No cities found for "{query}"
            </Text>
          </View>
        )}

        <FlatList
          data={results}
          keyExtractor={(item) => `${item.latitude},${item.longitude}`}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: isSmall ? SPACE.MD : SPACE.LG, paddingBottom: SPACE['2XL'] }}
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, { backgroundColor: theme.border }]} />
          )}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.resultItem,
                { backgroundColor: pressed ? theme.bgElevated : 'transparent' },
              ]}
              onPress={() => handleSelect(item)}
              accessibilityLabel={`Select ${item.city}, ${item.country}`}
              accessibilityRole="button"
            >
              <View style={styles.resultIcon}>
                <Ionicons name="location-outline" size={18} color={theme.textSecondary} />
              </View>
              <View style={styles.resultText}>
                <Text style={[styles.cityName, { fontSize: isSmall ? FONT_SIZE.SM : FONT_SIZE.MD }]}>
                  {item.city}
                </Text>
                <Text style={styles.countryName} numberOfLines={1}>
                  {item.country}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
            </Pressable>
          )}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  modalHeader: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingTop:     SPACE.XL,
    paddingBottom:  SPACE.MD,
  },
  modalTitle: {
    fontSize:   FONT_SIZE.XL,
    fontWeight: FONT_WEIGHT.BOLD,
    color:      '#FFFFFF',
  },
  closeBtn: {
    width:          44,
    height:         44,
    alignItems:     'center',
    justifyContent: 'center',
  },
  inputRow: {
    marginBottom: SPACE.SM,
  },
  inputWrap: {
    flexDirection:     'row',
    alignItems:        'center',
    borderRadius:      RADIUS.MD,
    paddingHorizontal: SPACE.MD,
    height:            48,
    gap:               SPACE.SM,
  },
  input: {
    flex:     1,
    fontSize: FONT_SIZE.MD,
    height:   48,
  },
  center: {
    paddingTop: SPACE.XL,
    alignItems: 'center',
  },
  errorText: {
    fontSize:  FONT_SIZE.SM,
    textAlign: 'center',
  },
  emptyText: {
    fontSize:  FONT_SIZE.SM,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    marginLeft: 44,
  },
  resultItem: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical: SPACE.MD,
    borderRadius:   RADIUS.SM,
    gap:            SPACE.SM,
  },
  resultIcon: {
    width:          28,
    alignItems:     'center',
    justifyContent: 'center',
  },
  resultText: {
    flex: 1,
    gap:  2,
  },
  cityName: {
    fontWeight: FONT_WEIGHT.MEDIUM,
    color:      '#FFFFFF',
  },
  countryName: {
    fontSize: FONT_SIZE.XS,
    color:    'rgba(255,255,255,0.60)',
  },
});
