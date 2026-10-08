import { Tabs } from 'expo-router'
import { LayoutDashboard, Users2, FileText, CalendarClock, Settings } from 'lucide-react-native'
import { useColors } from '@/lib/theme-provider'

export default function TabsLayout() {
  const colors = useColors()

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.foreground,
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Dashboard', headerShown: false, tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="leads"
        options={{ title: 'Leads', headerShown: false, tabBarIcon: ({ color, size }) => <Users2 color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="quotations"
        options={{ title: 'Quotations', headerShown: false, tabBarIcon: ({ color, size }) => <FileText color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="follow-ups"
        options={{ title: 'Follow-ups', tabBarIcon: ({ color, size }) => <CalendarClock color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Settings', tabBarIcon: ({ color, size }) => <Settings color={color} size={size} /> }}
      />
    </Tabs>
  )
}
