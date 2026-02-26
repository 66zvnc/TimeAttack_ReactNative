import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Card } from '../components/Card';
import { TabBarIcon } from '../components/TabBarIcon';
import { theme } from '../theme/theme';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <TabBarIcon name="goBack" color={theme.colors.textPrimary} size={20} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.headerButton}>
            <TabBarIcon name="gear" color={theme.colors.textPrimary} size={22} />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <TabBarIcon name="verified" color="#FFFFFF" size={13} />
            </View>
          </View>
          
          <Text style={styles.profileName}>Alex "The Apex" Miller</Text>
          <Text style={styles.profileBadge}>PROFESSIONAL RACER</Text>
          <Text style={styles.memberSince}>Member since March 2023</Text>
        </View>

        {/* Telemetry Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Telemetry Overview</Text>
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Text style={styles.statLabel}>RUNS</Text>
              <Text style={styles.statValue}>142</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statLabel}>DIST.</Text>
              <Text style={styles.statValue}>3.8<Text style={styles.statUnit}>km</Text></Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statLabel}>SPEED</Text>
              <Text style={styles.statValue}>185<Text style={styles.statUnit}>avg</Text></Text>
            </Card>
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <Card style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconCircle, { backgroundColor: '#EEF2FF' }]}>
                  <TabBarIcon name="units" color={theme.colors.primary} size={20} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Units</Text>
                  <Text style={styles.settingSubtitle}>Metric (km/h, Celsius)</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <View style={styles.settingDivider} />

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconCircle, { backgroundColor: '#EEF2FF' }]}>
                  <TabBarIcon name="mapStyle" color={theme.colors.primary} size={18} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Map Style</Text>
                  <Text style={styles.settingSubtitle}>Satellite View</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconCircle, { backgroundColor: '#EEF2FF' }]}>
                  <TabBarIcon name="notifications" color={theme.colors.primary} size={18} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Notifications</Text>
                  <Text style={styles.settingSubtitle}>Alerts, Lap Times, Updates</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E2E8F0', true: theme.colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingDivider} />

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconCircle, { backgroundColor: '#EEF2FF' }]}>
                  <TabBarIcon name="privacySecurity" color={theme.colors.primary} size={18} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Privacy & Security</Text>
                  <Text style={styles.settingSubtitle}>Profile visibility, Data sharing</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <TouchableOpacity style={styles.logoutButton}>
            <TabBarIcon name="logout" color="#F43F5E" size={18} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 60,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.colors.background,
  },
  profileName: {
    fontSize: 22,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  profileBadge: {
    fontSize: theme.typography.sizes.small,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.primary,
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  memberSince: {
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.textSecondary,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  statLabel: {
    fontSize: theme.typography.sizes.tiny,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: 28,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  statUnit: {
    fontSize: theme.typography.sizes.small,
    fontWeight: theme.typography.weights.normal,
    color: theme.colors.textPrimary,
  },
  settingsCard: {
    padding: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.typography.sizes.medium,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textSecondary,
  },
  chevron: {
    fontSize: 28,
    color: theme.colors.textMuted,
    fontWeight: '300',
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginLeft: 76,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  logoutText: {
    fontSize: theme.typography.sizes.medium,
    fontWeight: theme.typography.weights.semibold,
    color: '#F43F5E',
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  deleteText: {
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.textMuted,
  },
  bottomPadding: {
    height: theme.spacing.xxl,
  },
});
