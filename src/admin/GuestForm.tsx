import { useState, type FormEvent } from 'react'
import { cn } from '../lib/cn'
import type { Guest, InvitationType, RsvpStatus } from './types'

export interface GuestFormValues {
  fullName: string
  phone: string
  invitationType: InvitationType
  maxAttendees: number
  status?: RsvpStatus
  attendeesCount?: number
  message?: string
}

interface GuestFormProps {
  mode: 'create' | 'edit'
  initialGuest?: Guest
  onSubmit: (values: GuestFormValues) => Promise<void>
  onCancel: () => void
}

const inputClasses =
  'rounded-lg border border-accent-pale/50 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none'

function GuestForm({ mode, initialGuest, onSubmit, onCancel }: GuestFormProps) {
  const [fullName, setFullName] = useState(initialGuest?.fullName ?? '')
  const [phone, setPhone] = useState(initialGuest?.phone ?? '')
  const [invitationType, setInvitationType] = useState<InvitationType>(
    initialGuest?.invitationType ?? 'AMBOS'
  )
  const [maxAttendees, setMaxAttendees] = useState(initialGuest?.maxAttendees ?? 1)
  const [status, setStatus] = useState<RsvpStatus>(initialGuest?.status ?? 'PENDING')
  const [attendeesCount, setAttendeesCount] = useState(initialGuest?.attendeesCount ?? 1)
  const [message, setMessage] = useState(initialGuest?.message ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await onSubmit({
        fullName,
        phone,
        invitationType,
        maxAttendees,
        ...(mode === 'edit' && { status, attendeesCount, message }),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar.')
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-3 rounded-xl border border-accent-pale/50 bg-surface p-4 sm:grid-cols-2"
    >
      <input
        required
        placeholder="Nombre completo"
        className={inputClasses}
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <input
        placeholder="Teléfono (opcional)"
        className={inputClasses}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <select
        className={inputClasses}
        value={invitationType}
        onChange={(e) => setInvitationType(e.target.value as InvitationType)}
      >
        <option value="AMBOS">Ambos</option>
        <option value="CEREMONIA">Solo discurso</option>
        <option value="RECEPCION">Solo fiesta</option>
      </select>
      <label className="flex items-center gap-2 text-sm text-ink-secondary">
        Máx. asistentes
        <input
          type="number"
          min={1}
          className={cn(inputClasses, 'w-20')}
          value={maxAttendees}
          onChange={(e) => setMaxAttendees(Math.max(1, Number(e.target.value)))}
        />
      </label>

      {mode === 'edit' && (
        <>
          <select
            className={inputClasses}
            value={status}
            onChange={(e) => setStatus(e.target.value as RsvpStatus)}
          >
            <option value="PENDING">Pendiente</option>
            <option value="CONFIRMED">Confirmado</option>
            <option value="DECLINED">No asistirá</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-ink-secondary">
            Asistentes confirmados
            <input
              type="number"
              min={1}
              className={cn(inputClasses, 'w-20')}
              value={attendeesCount}
              onChange={(e) => setAttendeesCount(Math.max(1, Number(e.target.value)))}
            />
          </label>
          <input
            placeholder="Mensaje"
            className={cn(inputClasses, 'sm:col-span-2')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </>
      )}

      {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}

      <div className="flex gap-2 sm:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-accent-deep px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Guardando…' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-accent-pale/50 px-4 py-2 text-sm text-ink-secondary"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default GuestForm
