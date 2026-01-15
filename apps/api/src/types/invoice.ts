export interface Invoice {
  id: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
}
