import { Text, TextInput, View, type TextInputProps } from 'react-native'
import { useColors } from '@/lib/theme-provider'

export function FormInput({ label, error, ...props }: TextInputProps & { label: string; error?: string }) {
  const colors = useColors()
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '500' }}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.mutedForeground}
        style={{
          borderWidth: 1,
          borderColor: error ? colors.destructive : colors.border,
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 11,
          color: colors.foreground,
          backgroundColor: colors.background,
          fontSize: 15,
        }}
        {...props}
      />
      {error ? <Text style={{ color: colors.destructive, fontSize: 12 }}>{error}</Text> : null}
    </View>
  )
}
