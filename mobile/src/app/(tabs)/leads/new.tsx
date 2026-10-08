import { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useColors } from '@/lib/theme-provider'
import { useCreateLead } from '@/features/leads/api'
import { FormInput } from '@/components/form-input'
import { PrimaryButton } from '@/components/ui'
import { ApiError } from '@/lib/api-client'

export default function NewLeadScreen() {
  const colors = useColors()
  const router = useRouter()
  const createLead = useCreateLead()

  const [company, setCompany] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [interestedProduct, setInterestedProduct] = useState('')
  const [estimatedValue, setEstimatedValue] = useState('')

  async function handleSubmit() {
    try {
      await createLead.mutateAsync({
        company,
        contact_name: contactName,
        email,
        phone,
        source: 'Sales Executive',
        interested_product: interestedProduct,
        estimated_value: Number(estimatedValue) || 0,
      })
      router.back()
    } catch (e) {
      Alert.alert('Couldn’t create lead', e instanceof ApiError ? e.message : 'Please try again.')
    }
  }

  const canSubmit = company.trim().length > 0 && contactName.trim().length > 0

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
        <FormInput label="Company" value={company} onChangeText={setCompany} placeholder="Acme Industries" />
        <FormInput label="Contact name" value={contactName} onChangeText={setContactName} placeholder="Jane Doe" />
        <FormInput label="Email" value={email} onChangeText={setEmail} placeholder="jane@acme.com" autoCapitalize="none" keyboardType="email-address" />
        <FormInput label="Phone" value={phone} onChangeText={setPhone} placeholder="+91 98765 43210" keyboardType="phone-pad" />
        <FormInput label="Interested product" value={interestedProduct} onChangeText={setInterestedProduct} placeholder="CNC Router Pro 1325" />
        <FormInput label="Estimated value (₹)" value={estimatedValue} onChangeText={setEstimatedValue} placeholder="500000" keyboardType="numeric" />
        <View style={{ marginTop: 8 }}>
          <PrimaryButton label="Create lead" onPress={handleSubmit} loading={createLead.isPending} disabled={!canSubmit} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
