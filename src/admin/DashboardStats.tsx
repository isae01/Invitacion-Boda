import type {
  DashboardStats as DashboardStatsData,
  InvitationType,
} from "./types";

interface DashboardStatsProps {
  stats: DashboardStatsData;
}

const CARDS: Array<{
  key: string;
  label: string;
  value: (stats: DashboardStatsData) => number | string;
  format?: (n: number) => string;
}> = [
  {
    key: "total",
    label: "Invitados",
    value: (s) => s.total,
  },
  {
    key: "confirmed",
    label: "Invitaciones Confirmadas",
    value: (s) => `${s.confirmed}/${s.total}`,
  },
  { key: "pending", label: "Pendientes", value: (s) => s.pending },
  { key: "declined", label: "No asistirán", value: (s) => s.declined },
  {
    key: "attendanceRate",
    label: "% de asistencia",
    value: (s) => s.attendanceRate,
    format: (n) => `${n}%`,
  },
  {
    key: "totalAttendees",
    label: "Asistentes confirmados",
    value: (s) => `${s.totalAttendees}/${s.maxAttendeesTotal}`,
  },
];

/** Mismo orden narrativo que usa la invitación: discurso, ambos, fiesta. */
const TYPE_ORDER: InvitationType[] = ["CEREMONIA", "RECEPCION", "AMBOS"];

const TYPE_LABEL: Record<InvitationType, string> = {
  CEREMONIA: "Discurso",
  RECEPCION: "Fiesta",
  AMBOS: "Ambos",
};

const TYPE_EMOJI: Record<InvitationType, string> = {
  CEREMONIA: "📖",
  RECEPCION: "🎉",
  AMBOS: "👑",
};

function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CARDS.map((card) => {
            const value = card.value(stats);
            return (
              <div
                key={card.key}
                className="rounded-xl border border-accent-pale/50 bg-white p-4 border-t-[3px] border-t-accent"
              >
                <p className="text-2xl font-bold text-accent-deep">
                  {typeof value === "number" && card.format
                    ? card.format(value)
                    : value}
                </p>
                <p className="mt-1 text-xs text-ink-secondary">{card.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold tracking-[2px] text-ink-tertiary">
          POR EVENTO
        </p>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TYPE_ORDER.map((type) => {
            const typeStats = stats.byInvitationType[type];
            return (
              <div
                key={type}
                className="rounded-xl border border-accent-pale/50 bg-tint-summary p-4"
              >
                <p className="flex items-center gap-2 font-serif text-lg italic text-ink">
                  <span>{TYPE_LABEL[type]}</span>
                  <span className="text-xl not-italic leading-none">
                    {TYPE_EMOJI[type]}
                  </span>
                </p>
                <dl className="mt-2 flex flex-col gap-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-secondary">
                      Invitaciones Confirmadas
                    </dt>
                    <dd className="font-bold text-accent-deep">
                      {typeStats.confirmed}/{typeStats.total}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-secondary">Pendientes</dt>
                    <dd>{typeStats.pending}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-secondary">No asistirán</dt>
                    <dd>{typeStats.declined}</dd>
                  </div>
                  <div className="flex justify-between border-t border-accent-pale/30 pt-1">
                    <dt className="font-semibold text-ink-secondary">
                      Asistentes confirmados
                    </dt>
                    <dd className="font-bold text-accent-deep">
                      {typeStats.totalAttendees}/{typeStats.maxAttendeesTotal}
                    </dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;
