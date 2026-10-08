import { ActivityIndicator, Pressable, Text, View, type ViewStyle } from 'react-native'
import { useColors } from '@/lib/theme-provider'

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const colors = useColors()
  return (
    <View
      style={[
        { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 16 },
        style,
      ]}
    >
      {children}
    </View>
  )
}

const BADGE_TONES = ['default', 'success', 'warning', 'destructive', 'info', 'muted'] as const
export type BadgeTone = (typeof BADGE_TONES)[number]

export function Badge({ label, tone = 'default', onPress }: { label: string; tone?: BadgeTone; onPress?: () => void }) {
  const colors = useColors()
  const toneMap: Record<BadgeTone, { bg: string; fg: string }> = {
    default: { bg: colors.accent, fg: colors.accentForeground },
    success: { bg: colors.success + '26', fg: colors.success },
    warning: { bg: colors.warning + '26', fg: colors.warning },
    destructive: { bg: colors.destructive + '26', fg: colors.destructive },
    info: { bg: colors.info + '26', fg: colors.info },
    muted: { bg: colors.muted, fg: colors.mutedForeground },
  }
  const { bg, fg } = toneMap[tone]
  const content = (
    <View style={{ backgroundColor: bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, alignSelf: 'flex-start' }}>
      <Text style={{ color: fg, fontSize: 11, fontWeight: '600' }}>{label}</Text>
    </View>
  )
  if (!onPress) return content
  return <Pressable onPress={onPress}>{content}</Pressable>
}

export function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
}: {
  label: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
}) {
  const colors = useColors()
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        backgroundColor: colors.primary,
        opacity: disabled || loading ? 0.6 : pressed ? 0.85 : 1,
        paddingVertical: 13,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      {loading ? (
        <ActivityIndicator color={colors.primaryForeground} />
      ) : (
        <Text style={{ color: colors.primaryForeground, fontWeight: '600', fontSize: 15 }}>{label}</Text>
      )}
    </Pressable>
  )
}

export function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  const colors = useColors()
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: 'transparent',
        borderColor: colors.border,
        borderWidth: 1,
        opacity: pressed ? 0.7 : 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <Text style={{ color: colors.foreground, fontWeight: '600', fontSize: 15 }}>{label}</Text>
    </Pressable>
  )
}

export function StatCard({ label, value, delta, tone = 'default' }: { label: string; value: string; delta?: string; tone?: BadgeTone }) {
  const colors = useColors()
  const toneColor = tone === 'success' ? colors.success : tone === 'destructive' ? colors.destructive : colors.mutedForeground
  return (
    <Card style={{ flex: 1, minWidth: 150 }}>
      <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>{label}</Text>
      <Text style={{ color: colors.foreground, fontSize: 22, fontWeight: '700', marginTop: 6 }}>{value}</Text>
      {delta ? <Text style={{ color: toneColor, fontSize: 12, marginTop: 4 }}>{delta}</Text> : null}
    </Card>
  )
}

export function LoadingView() {
  const colors = useColors()
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  )
}

export function ErrorView({ message }: { message: string }) {
  const colors = useColors()
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: colors.background }}>
      <Text style={{ color: colors.destructive, textAlign: 'center' }}>{message}</Text>
    </View>
  )
}

export function EmptyState({ message }: { message: string }) {
  const colors = useColors()
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <Text style={{ color: colors.mutedForeground, textAlign: 'center' }}>{message}</Text>
    </View>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  const colors = useColors()
  return (
    <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
      {children}
    </Text>
  )
}
