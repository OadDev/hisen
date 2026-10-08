import { Stack } from 'expo-router'
import { useColors } from '@/lib/theme-provider'

export default function LeadsLayout() {
  const colors = useColors()
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.foreground,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Leads' }} />
      <Stack.Screen name="new" options={{ title: 'New Lead', presentation: 'modal' }} />
      <Stack.Screen name="[id]" options={{ title: 'Lead' }} />
    </Stack>
  )
}
