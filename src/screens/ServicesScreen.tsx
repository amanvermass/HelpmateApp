import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { partnerServicesList, addOnInventory, PartnerService } from '../data/mockData';
import { colors, shadow } from '../styles/theme';
import { ShieldCheck, Wrench, Search, Percent, Package, Sparkles } from 'lucide-react-native';

export const ServicesScreen: React.FC = () => {
  const [services, setServices] = useState<PartnerService[]>(partnerServicesList);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setServices(partnerServicesList);
      setRefreshing(false);
    }, 600);
  }, []);

  const categories = ['All', 'AC Servicing & Repair', 'Smart Home Electrician', 'Spare Parts'];

  const filteredServices = services.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' || activeCategory === 'Spare Parts' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredSpares = addOnInventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <View style={styles.safeArea}>
      {/* Header & Search */}
      <View style={styles.headerBox}>
        <Text style={styles.pageTitle}>Authorized Services & Rate Card</Text>
        <Text style={styles.pageSubtitle}>Official service rates & 75% net share calculation</Text>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <Search size={16} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search service title or spare parts..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.brand500]}
            tintColor={colors.brand500}
          />
        }
      >
        {/* Policy Box */}
        <View style={styles.policyCard}>
          <View style={styles.policyHeader}>
            <Percent size={20} color={colors.brand500} />
            <Text style={styles.policyTitle}>75% Guaranteed Net Share</Text>
          </View>
          <Text style={styles.policyText}>
            You earn 75% of every authorized service job rate. 25% platform fee covers customer acquisition, insurance, and billing.
          </Text>
        </View>

        {/* Service Rate Cards List */}
        {activeCategory !== 'Spare Parts' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              Authorized Skill Services ({filteredServices.length})
            </Text>

            {filteredServices.map((item) => (
              <View key={item.id} style={styles.serviceCard}>
                <View style={styles.cardTopRow}>
                  <View style={styles.categoryBadge}>
                    <Wrench size={12} color={colors.brand500} />
                    <Text style={styles.categoryBadgeText}>{item.category}</Text>
                  </View>
                  <View style={styles.authBadge}>
                    <ShieldCheck size={12} color={colors.emeraldText} />
                    <Text style={styles.authBadgeText}>{item.status}</Text>
                  </View>
                </View>

                <Text style={styles.serviceTitle}>{item.title}</Text>

                <View style={styles.priceContainer}>
                  <View style={styles.priceColumn}>
                    <Text style={styles.priceLabel}>Customer Rate</Text>
                    <Text style={styles.customerPriceText}>₹{item.fixedRate}</Text>
                  </View>

                  <View style={styles.dividerVertical} />

                  <View style={styles.priceColumn}>
                    <Text style={styles.shareLabel}>Your Share (75%)</Text>
                    <Text style={styles.sharePriceText}>₹{item.partnerShare}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Spare Parts Inventory Section */}
        {(activeCategory === 'All' || activeCategory === 'Spare Parts') && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Extra Spare Parts & Add-Ons Rate Card</Text>
              <View style={styles.spareBadge}>
                <Package size={12} color={colors.brand500} />
                <Text style={styles.spareBadgeText}>Standard Pricing</Text>
              </View>
            </View>

            {filteredSpares.map((spare) => {
              const gstVal = Math.round(spare.price * spare.gstRate);
              const totalVal = spare.price + gstVal;

              return (
                <View key={spare.id} style={styles.spareCard}>
                  <View style={styles.spareHeader}>
                    <Text style={styles.spareName}>{spare.name}</Text>
                    <Text style={styles.spareCategory}>{spare.category}</Text>
                  </View>

                  <View style={styles.sparePriceRow}>
                    <View>
                      <Text style={styles.spareBaseText}>Base: ₹{spare.price} + 18% GST (₹{gstVal})</Text>
                      <Text style={styles.spareTotalText}>Total Customer Bill: ₹{totalVal}</Text>
                    </View>
                    <View style={styles.spareEarningsBadge}>
                      <Text style={styles.spareEarningsLabel}>Net Share (75%)</Text>
                      <Text style={styles.spareEarningsValue}>₹{Math.round(totalVal * 0.75)}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBox: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  pageSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 10,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 42,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.brand500,
    borderColor: colors.brand500,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.card,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  policyCard: {
    backgroundColor: colors.brand50,
    borderWidth: 1,
    borderColor: colors.brand200,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  policyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.brand500,
  },
  policyText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  spareBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.brand50,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  spareBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.brand500,
  },
  serviceCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    ...shadow.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.inputBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  authBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.emeraldLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  authBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.emeraldText,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priceColumn: {
    flex: 1,
    alignItems: 'center',
  },
  dividerVertical: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  customerPriceText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  shareLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.emeraldText,
  },
  sharePriceText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.emeraldText,
    marginTop: 2,
  },
  spareCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    ...shadow.sm,
  },
  spareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  spareName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  spareCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    backgroundColor: colors.inputBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sparePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  spareBaseText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  spareTotalText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  spareEarningsBadge: {
    backgroundColor: colors.emeraldLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'flex-end',
  },
  spareEarningsLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.emeraldText,
  },
  spareEarningsValue: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.emeraldText,
  },
});
