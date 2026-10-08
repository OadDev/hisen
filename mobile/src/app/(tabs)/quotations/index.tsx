import { FlatList, Pressable, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useColors } from '@/lib/theme-provider'
import { useQuotations, type Quotation, type QuotationStatus } from '@/features/quotations/api'
import { Badge, Card, EmptyState, ErrorView, LoadingView } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/format'

const STATUS_TONE: Record<QuotationStatus, 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'muted'> = {
  draft: 'muted',
  pending: 'warning',
  approved: 'info',
  rejected: 'destructive',
  won: 'success',
  lost: 'destructive',
}

function QuotationRow({ quotation }: { quotation: Quotation }) {
  const colors = useColors()
  const router = useRouter()
  return (
    <Pressable onPress={() => router.push(`/quotations/${quotation.id}`)}>
      <Card style={{ marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: '600' }}>{quotation.id}</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 2 }}>{quotation.customer?.name ?? 'No customer'}</Text>
          </View>
          <Badge label={quotation.status} tone={STATUS_TONE[quotation.status]} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>{formatDate(quotation.createdAt)}</Text>
          <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '600' }}>{formatCurrency(quotation.total, quotation.currency)}</Text>
        </View>
      </Card>
    </Pressable>
  )
}

export default function QuotationsListScreen() {
  const colors = useColors()
  const { data, isLoading, isError, refetch, isRefetching } = useQuotations({ per_page: 50 })

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {isLoading ? (
        <LoadingView />
      ) : isError ? (
        <ErrorView message="Couldn't load quotations. Pull down to retry." />
      ) : (
        <FlatList
          data={data?.data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => <QuotationRow quotation={item} />}
          onRefresh={refetch}
          refreshing={isRefetching}
          ListEmptyComponent={<EmptyState message="No quotations found." />}
        />
      )}
    </View>
  )
}
