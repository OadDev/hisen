import { Stack } from 'expo-router'
import { useColors } from '@/lib/theme-provider'

export default function QuotationsLayout() {
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
      <Stack.Screen name="index" options={{ title: 'Quotations' }} />
      <Stack.Screen name="[id]" options={{ title: 'Quotation' }} />
    </Stack>
  )
}
