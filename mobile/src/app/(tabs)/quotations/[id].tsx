import { useState } from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useColors } from '@/lib/theme-provider'
import { useQuotation, openQuotationPdf } from '@/features/quotations/api'
import { Badge, Card, ErrorView, LoadingView, PrimaryButton, SectionLabel } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/format'

export default function QuotationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const colors = useColors()
  const { data: quotation, isLoading, isError } = useQuotation(id)
  const [sharing, setSharing] = useState(false)

  if (isLoading) return <LoadingView />
  if (isError || !quotation) return <ErrorView message="Couldn't load this quotation." />

  async function handleSharePdf() {
    setSharing(true)
    try {
      await openQuotationPdf(quotation!.id)
    } catch {
      Alert.alert('Couldn’t open PDF', 'Please check your connection and try again.')
    } finally {
      setSharing(false)
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={{ color: colors.foreground, fontSize: 19, fontWeight: '700' }}>{quotation.id}</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 14, marginTop: 2 }}>{quotation.customer?.name ?? 'No customer'}</Text>
          </View>
          <Badge label={quotation.status} />
        </View>
        <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }}>
          <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>Total</Text>
          <Text style={{ color: colors.foreground, fontSize: 24, fontWeight: '700', marginTop: 2 }}>{formatCurrency(quotation.total, quotation.currency)}</Text>
          {quotation.validUntil ? (
            <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 6 }}>Valid until {formatDate(quotation.validUntil)}</Text>
          ) : null}
        </View>
      </Card>

      <View>
        <SectionLabel>Line items</SectionLabel>
        <View style={{ gap: 10 }}>
          {quotation.lineItems.map((item) => (
            <Card key={item.id}>
              <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: '600' }}>{item.productName}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>
                  {item.quantity} × {formatCurrency(item.unitPrice, quotation.currency)}
                  {item.discountPct ? ` − ${item.discountPct}%` : ''}
                </Text>
                <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '600' }}>
                  {formatCurrency(item.quantity * item.unitPrice * (1 - item.discountPct / 100), quotation.currency)}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      </View>

      <PrimaryButton label="Share PDF" onPress={handleSharePdf} loading={sharing} />
    </ScrollView>
  )
}
