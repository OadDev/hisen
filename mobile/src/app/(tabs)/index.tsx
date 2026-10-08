import { useMemo } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Bell } from 'lucide-react-native'
import { useColors } from '@/lib/theme-provider'
import { useAuthStore } from '@/stores/auth-store'
import { useLeads } from '@/features/leads/api'
import { useQuotations } from '@/features/quotations/api'
import { Card, LoadingView, SectionLabel, StatCard } from '@/components/ui'
import { formatCurrency } from '@/lib/format'

export default function DashboardScreen() {
  const colors = useColors()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const { data: leadsPage, isLoading: leadsLoading } = useLeads({ per_page: 100 })
  const { data: quotationsPage, isLoading: quotationsLoading } = useQuotations({ per_page: 100 })

  const stats = useMemo(() => {
    const leads = leadsPage?.data ?? []
    const quotations = quotationsPage?.data ?? []
    const open = leads.filter((l) => l.stage !== 'Won' && l.stage !== 'Lost')
    const won = leads.filter((l) => l.stage === 'Won')
    const closed = leads.filter((l) => l.stage === 'Won' || l.stage === 'Lost')
    const pipelineValue = open.reduce((sum, l) => sum + Number(l.estimatedValue ?? 0), 0)
    const winRate = closed.length ? Math.round((won.length / closed.length) * 100) : 0
    const dueFollowUps = leads.filter((l) => l.nextFollowUp && new Date(l.nextFollowUp).getTime() < Date.now()).length
    const openQuotations = quotations.filter((q) => q.status === 'pending' || q.status === 'draft')
    return { pipelineValue, winRate, dueFollowUps, quotationsSent: quotations.length, openQuotations: openQuotations.length }
  }, [leadsPage, quotationsPage])

  if (leadsLoading || quotationsLoading) return <LoadingView />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 16, gap: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View>
          <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>Welcome back,</Text>
          <Text style={{ color: colors.foreground, fontSize: 20, fontWeight: '700' }}>{user?.name ?? 'there'}</Text>
        </View>
        <Pressable
          onPress={() => router.push('/notifications')}
          style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}
        >
          <Bell size={18} color={colors.foreground} />
        </Pressable>
      </View>

      <View>
        <SectionLabel>Sales overview</SectionLabel>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          <StatCard label="Pipeline value" value={formatCurrency(stats.pipelineValue)} />
          <StatCard label="Win rate" value={`${stats.winRate}%`} tone="success" />
          <StatCard label="Quotations sent" value={String(stats.quotationsSent)} />
          <StatCard label="Open quotations" value={String(stats.openQuotations)} />
        </View>
      </View>

      {stats.dueFollowUps > 0 ? (
        <Card style={{ borderColor: colors.warning }}>
          <Text style={{ color: colors.warning, fontWeight: '700', fontSize: 14 }}>
            {stats.dueFollowUps} follow-up{stats.dueFollowUps > 1 ? 's' : ''} overdue
          </Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 4 }}>Check the Follow-ups tab to catch up with your leads.</Text>
        </Card>
      ) : null}
    </ScrollView>
    </SafeAreaView>
  )
}
