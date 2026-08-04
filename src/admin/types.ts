export type InvitationType = 'AMBOS' | 'CEREMONIA' | 'RECEPCION'
export type RsvpStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED'

export interface Guest {
  id: string
  fullName: string
  phone: string | null
  invitationType: InvitationType
  maxAttendees: number
  attendeesCount: number | null
  status: RsvpStatus
  message: string | null
  respondedAt: string | null
}

export interface InvitationTypeStats {
  total: number
  confirmed: number
  pending: number
  declined: number
  totalAttendees: number
  maxAttendeesTotal: number
}

export interface DashboardStats {
  total: number
  confirmed: number
  pending: number
  declined: number
  attendanceRate: number
  totalAttendees: number
  maxAttendeesTotal: number
  byInvitationType: Record<InvitationType, InvitationTypeStats>
}
