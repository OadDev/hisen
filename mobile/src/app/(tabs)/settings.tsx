import { Pressable, ScrollView, Text, View } from 'react-native'
import { Check } from 'lucide-react-native'
import { useColors } from '@/lib/theme-provider'
import { useAuthStore } from '@/stores/auth-store'
import { useUiStore } from '@/stores/ui-store'
import { ACCENTS, type AccentColor, type ThemeMode } from '@/lib/theme'
import { Card, SecondaryButton, SectionLabel } from '@/components/ui'
import { initials } from '@/lib/format'

export default function SettingsScreen() {
  const colors = useColors()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const theme = useUiStore((s) => s.theme)
  const setTheme = useUiStore((s) => s.setTheme)
  const accentColor = useUiStore((s) => s.accentColor)
  const setAccentColor = useUiStore((s) => s.setAccentColor)

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 16, gap: 20 }}>
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>{user ? initials(user.name) : 'HM'}</Text>
          </View>
          <View>
            <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: '600' }}>{user?.name}</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>{user?.email}</Text>
          </View>
        </View>
      </Card>

      <View>
        <SectionLabel>Theme</SectionLabel>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {(['light', 'dark'] as ThemeMode[]).map((mode) => (
            <Pressable
              key={mode}
              onPress={() => setTheme(mode)}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: theme === mode ? colors.primary : colors.border,
                borderRadius: 10,
                paddingVertical: 12,
                alignItems: 'center',
                backgroundColor: colors.card,
              }}
            >
              <Text style={{ color: theme === mode ? colors.primary : colors.foreground, fontWeight: '600', textTransform: 'capitalize' }}>{mode}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View>
        <SectionLabel>Accent color</SectionLabel>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {(Object.entries(ACCENTS) as [AccentColor, (typeof ACCENTS)[AccentColor]][]).map(([key, { label, swatch }]) => (
            <Pressable key={key} onPress={() => setAccentColor(key)} style={{ alignItems: 'center', gap: 6, width: 72 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: swatch,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: accentColor === key ? 2 : 0,
                  borderColor: colors.foreground,
                }}
              >
                {accentColor === key ? <Check size={16} color="#fff" /> : null}
              </View>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, textAlign: 'center' }}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <SecondaryButton label="Sign out" onPress={logout} />
    </ScrollView>
  )
}
