import { useState } from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { Phone, Mail, MapPin } from 'lucide-react-native'
import { useColors } from '@/lib/theme-provider'
import { useLead, useUpdateLeadStage, useAddLeadActivity, type LeadStage } from '@/features/leads/api'
import { Badge, Card, ErrorView, LoadingView, PrimaryButton, SecondaryButton, SectionLabel } from '@/components/ui'
import { FormInput } from '@/components/form-input'
import { formatCurrency, formatDateTime } from '@/lib/format'

const STAGES: LeadStage[] = ['Lead', 'Discussion', 'Technical Proposal', 'Quotation', 'Negotiation', 'Advance', 'Won', 'Lost']

export default function LeadDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const colors = useColors()
  const { data: lead, isLoading, isError } = useLead(id)
  const updateStage = useUpdateLeadStage()
  const addActivity = useAddLeadActivity(id)
  const [note, setNote] = useState('')

  if (isLoading) return <LoadingView />
  if (isError || !lead) return <ErrorView message="Couldn't load this lead." />

  async function logCall() {
    try {
      await addActivity.mutateAsync({ type: 'call', title: 'Call logged', description: note || undefined })
      setNote('')
    } catch {
      Alert.alert('Couldn’t log call', 'Please try again.')
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Card>
        <Text style={{ color: colors.foreground, fontSize: 19, fontWeight: '700' }}>{lead.company}</Text>
        <Text style={{ color: colors.mutedForeground, fontSize: 14, marginTop: 2 }}>{lead.contactName}</Text>

        <View style={{ flexDirection: 'row', gap: 16, marginTop: 14 }}>
          {lead.phone ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Phone size={14} color={colors.mutedForeground} />
              <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>{lead.phone}</Text>
            </View>
          ) : null}
          {lead.email ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Mail size={14} color={colors.mutedForeground} />
              <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>{lead.email}</Text>
            </View>
          ) : null}
        </View>
        {lead.country ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
            <MapPin size={14} color={colors.mutedForeground} />
            <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>{lead.country}</Text>
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }}>
          <View>
            <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>Estimated value</Text>
            <Text style={{ color: colors.foreground, fontSize: 17, fontWeight: '700', marginTop: 2 }}>{formatCurrency(lead.estimatedValue)}</Text>
          </View>
          <View>
            <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>Source</Text>
            <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: '600', marginTop: 2 }}>{lead.source}</Text>
          </View>
        </View>
      </Card>

      <View>
        <SectionLabel>Pipeline stage</SectionLabel>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {STAGES.map((stage) => (
            <Badge
              key={stage}
              label={stage}
              tone={stage === lead.stage ? 'default' : 'muted'}
              onPress={() => updateStage.mutate({ id: lead.id, stage })}
            />
          ))}
        </View>
      </View>

      <Card>
        <SectionLabel>Log a call</SectionLabel>
        <View style={{ gap: 10 }}>
          <FormInput label="Notes" placeholder="What was discussed?" value={note} onChangeText={setNote} multiline numberOfLines={3} />
          <PrimaryButton label="Save call log" onPress={logCall} loading={addActivity.isPending} />
        </View>
      </Card>

      <View>
        <SectionLabel>Activity timeline</SectionLabel>
        {(lead.activities ?? []).length === 0 ? (
          <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>No activity yet.</Text>
        ) : (
          <View style={{ gap: 10 }}>
            {[...lead.activities!].sort((a, b) => +new Date(b.occurredAt) - +new Date(a.occurredAt)).map((activity) => (
              <Card key={activity.id}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '600' }}>{activity.title}</Text>
                  <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>{formatDateTime(activity.occurredAt)}</Text>
                </View>
                {activity.description ? <Text style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 4 }}>{activity.description}</Text> : null}
              </Card>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  )
}
