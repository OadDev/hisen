import { useMemo } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useColors } from '@/lib/theme-provider'
import { useLeads, type Lead } from '@/features/leads/api'
import { Card, EmptyState, ErrorView, LoadingView } from '@/components/ui'
import { formatCurrency, formatDateTime } from '@/lib/format'

function isOverdue(value: string) {
  return new Date(value).getTime() < Date.now()
}

function FollowUpRow({ lead }: { lead: Lead }) {
  const colors = useColors()
  const router = useRouter()
  const overdue = isOverdue(lead.nextFollowUp!)
  return (
    <Pressable onPress={() => router.push(`/leads/${lead.id}`)}>
      <Card style={{ marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: '600' }}>{lead.company}</Text>
          <Text style={{ color: overdue ? colors.destructive : colors.warning, fontSize: 12, fontWeight: '600' }}>
            {overdue ? 'Overdue' : formatDateTime(lead.nextFollowUp!)}
          </Text>
        </View>
        <Text style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 2 }}>{lead.contactName}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
          <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>{lead.stage}</Text>
          <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '600' }}>{formatCurrency(lead.estimatedValue)}</Text>
        </View>
      </Card>
    </Pressable>
  )
}

export default function FollowUpsScreen() {
  const colors = useColors()
  const { data, isLoading, isError, refetch, isRefetching } = useLeads({ per_page: 100 })

  const dueLeads = useMemo(() => {
    const leads = (data?.data ?? []).filter((l) => l.nextFollowUp)
    return leads.sort((a, b) => +new Date(a.nextFollowUp!) - +new Date(b.nextFollowUp!))
  }, [data])

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {isLoading ? (
        <LoadingView />
      ) : isError ? (
        <ErrorView message="Couldn't load follow-ups." />
      ) : (
        <FlatList
          data={dueLeads}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => <FollowUpRow lead={item} />}
          onRefresh={refetch}
          refreshing={isRefetching}
          ListEmptyComponent={<EmptyState message="No follow-ups scheduled." />}
        />
      )}
    </View>
  )
}
