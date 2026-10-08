import { FlatList, Text, View } from 'react-native'
import { useColors } from '@/lib/theme-provider'
import { Badge, Card } from '@/components/ui'
import { NOTIFICATIONS, type AppNotification } from '@/mock/notifications'
import { formatDateTime } from '@/lib/format'

const CATEGORY_TONE: Record<AppNotification['category'], 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'muted'> = {
  sales: 'default',
  production: 'warning',
  inventory: 'info',
  service: 'destructive',
  finance: 'success',
  system: 'muted',
}

export default function NotificationsScreen() {
  const colors = useColors()
  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16 }}
      data={NOTIFICATIONS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card style={{ marginBottom: 10, opacity: item.read ? 0.6 : 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: '600', flex: 1, paddingRight: 8 }}>{item.title}</Text>
            <Badge label={item.category} tone={CATEGORY_TONE[item.category]} />
          </View>
          <Text style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 4 }}>{item.description}</Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 6 }}>{formatDateTime(item.timestamp)}</Text>
        </Card>
      )}
    />
  )
}
