import { useState } from 'react'
import { FlatList, Pressable, Text, TextInput, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Plus, Search } from 'lucide-react-native'
import { useColors } from '@/lib/theme-provider'
import { useLeads, type Lead, type LeadStage } from '@/features/leads/api'
import { Badge, Card, EmptyState, ErrorView, LoadingView } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/format'

const STAGE_TONE: Record<LeadStage, 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'muted'> = {
  Lead: 'muted',
  Discussion: 'info',
  'Technical Proposal': 'info',
  Quotation: 'default',
  Negotiation: 'warning',
  Advance: 'warning',
  Won: 'success',
  Lost: 'destructive',
}

function LeadRow({ lead }: { lead: Lead }) {
  const colors = useColors()
  const router = useRouter()
  return (
    <Pressable onPress={() => router.push(`/leads/${lead.id}`)}>
      <Card style={{ marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: '600' }}>{lead.company}</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 2 }}>{lead.contactName}</Text>
          </View>
          <Badge label={lead.stage} tone={STAGE_TONE[lead.stage]} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>{lead.source}</Text>
          <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '600' }}>{formatCurrency(lead.estimatedValue)}</Text>
        </View>
        {lead.nextFollowUp ? (
          <Text style={{ color: colors.warning, fontSize: 11, marginTop: 6 }}>Follow up {formatDate(lead.nextFollowUp)}</Text>
        ) : null}
      </Card>
    </Pressable>
  )
}

export default function LeadsListScreen() {
  const colors = useColors()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const { data, isLoading, isError, refetch, isRefetching } = useLeads({ search: search || undefined, per_page: 50 })

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16, paddingBottom: 8, flexDirection: 'row', gap: 10 }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            paddingHorizontal: 12,
            backgroundColor: colors.card,
          }}
        >
          <Search size={16} color={colors.mutedForeground} />
          <TextInput
            placeholder="Search leads..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, paddingVertical: 10, color: colors.foreground }}
          />
        </View>
        <Pressable
          onPress={() => router.push('/leads/new')}
          style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
        >
          <Plus size={20} color={colors.primaryForeground} />
        </Pressable>
      </View>

      {isLoading ? (
        <LoadingView />
      ) : isError ? (
        <ErrorView message="Couldn't load leads. Pull down to retry." />
      ) : (
        <FlatList
          data={data?.data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingTop: 8 }}
          renderItem={({ item }) => <LeadRow lead={item} />}
          onRefresh={refetch}
          refreshing={isRefetching}
          ListEmptyComponent={<EmptyState message="No leads found." />}
        />
      )}
    </View>
  )
}
