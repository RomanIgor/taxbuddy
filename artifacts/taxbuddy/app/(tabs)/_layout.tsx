import { BlurView } from "expo-blur";
import { Tabs, Redirect } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";
import Svg, { Path, Circle, Rect, Line } from "react-native-svg";

import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/contexts/ProfileContext";
import { TAXbuddyLogo } from "@/components/TAXbuddyLogo";

/* ── SVG tab icons — no font dependency ──────────────────────────────────── */

function TabHome({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
      <Path d="M9 21V12h6v9" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
    </Svg>
  );
}

function TabList({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="16" rx="2"
        stroke={color} strokeWidth="1.8" fill="none"/>
      <Line x1="7" y1="9" x2="17" y2="9" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <Line x1="7" y1="13" x2="17" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <Line x1="7" y1="17" x2="13" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </Svg>
  );
}

function TabBulb({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M9 21h6M10 17.5h4M12 3a6 6 0 0 1 4 10.4V17H8v-3.6A6 6 0 0 1 12 3z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
    </Svg>
  );
}

function TabDots({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx="5" cy="12" r="1.5" fill={color}/>
      <Circle cx="12" cy="12" r="1.5" fill={color}/>
      <Circle cx="19" cy="12" r="1.5" fill={color}/>
    </Svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */

function TabLayout() {
  const colors      = useColors();
  const colorScheme = useColorScheme();
  const isDark      = colorScheme === "dark";
  const isIOS       = Platform.OS === "ios";
  const isWeb       = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.background,
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: colors.border,
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          headerTitle: () => <TAXbuddyLogo size="md" showMascot />,
          tabBarIcon: ({ color }) => <TabHome color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Buchungen",
          tabBarIcon: ({ color }) => <TabList color={color} />,
        }}
      />
      <Tabs.Screen
        name="tips"
        options={{
          title: "Tipps",
          tabBarIcon: ({ color }) => <TabBulb color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "Mehr",
          tabBarIcon: ({ color }) => <TabDots color={color} />,
        }}
      />
    </Tabs>
  );
}

export default function TabLayoutRoot() {
  const { profile, isLoading } = useProfile();

  if (isLoading) return null;

  if (!profile || !profile.onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  return <TabLayout />;
}
