import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '@/stores/auth-store'
import { useColors } from '@/lib/theme-provider'
import { FormInput } from '@/components/form-input'
import { PrimaryButton } from '@/components/ui'
import { ApiError } from '@/lib/api-client'

export default function LoginScreen() {
  const colors = useColors()
  const login = useAuthStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError(null)
    setLoading(true)
    try {
      await login(email.trim(), password)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Unable to sign in. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} keyboardShouldPersistTaps="handled">
          <View style={{ marginBottom: 32 }}>
            <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Text style={{ color: colors.primaryForeground, fontSize: 20, fontWeight: '800' }}>H</Text>
            </View>
            <Text style={{ color: colors.foreground, fontSize: 24, fontWeight: '700' }}>Hisen Machinery ERP</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 14, marginTop: 4 }}>Sign in to continue to your workspace.</Text>
          </View>

          <View style={{ gap: 16 }}>
            <FormInput
              label="Work email"
              placeholder="you@hisenmachinery.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <FormInput label="Password" placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} />
            {error ? <Text style={{ color: colors.destructive, fontSize: 13 }}>{error}</Text> : null}
            <PrimaryButton label="Sign in" onPress={handleSubmit} loading={loading} disabled={!email || !password} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
