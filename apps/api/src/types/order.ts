export interface Order {
  id: string
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
  trackingId?: string | null
}
