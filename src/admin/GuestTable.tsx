import { useCallback, useEffect, useState, type FormEvent } from "react";
import { apiGet, apiPost, apiPatch, apiDelete, ApiError } from "../lib/api";
import type { Guest, InvitationType, RsvpStatus } from "./types";
import GuestForm, { type GuestFormValues } from "./GuestForm";

interface GuestsResponse {
  data: Guest[];
  total: number;
  page: number;
  pageSize: number;
}

interface GuestTableProps {
  /** Se llama después de crear/editar/eliminar, para refrescar el dashboard. */
  onChange?: () => void;
}

const STATUS_LABEL: Record<RsvpStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  DECLINED: "No asistirá",
};

const INVITATION_LABEL: Record<InvitationType, string> = {
  AMBOS: "Ambos",
  CEREMONIA: "Discurso",
  RECEPCION: "Fiesta",
};

const STATUS_ROW_CLASS: Record<RsvpStatus, string> = {
  PENDING: "bg-yellow-100/60",
  CONFIRMED: "bg-green-100",
  DECLINED: "bg-red-100",
};

function buildPayload(values: GuestFormValues) {
  return {
    fullName: values.fullName.trim(),
    phone: values.phone.trim() === "" ? undefined : values.phone.trim(),
    invitationType: values.invitationType,
    maxAttendees: values.maxAttendees,
    ...(values.status && { status: values.status }),
    ...(values.attendeesCount !== undefined && {
      attendeesCount: values.attendeesCount,
    }),
    ...(values.message !== undefined && {
      message: values.message.trim() === "" ? null : values.message.trim(),
    }),
  };
}

function GuestTable({ onChange }: GuestTableProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [invitationTypeFilter, setInvitationTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({ page: String(page) });
      if (search) query.set("search", search);
      if (statusFilter) query.set("status", statusFilter);
      if (invitationTypeFilter)
        query.set("invitationType", invitationTypeFilter);

      const res = await apiGet<GuestsResponse>(`/api/admin/guests?${query}`);
      setGuests(res.data);
      setTotal(res.total);
      setPageSize(res.pageSize);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "No se pudo cargar la lista.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, invitationTypeFilter]);

  useEffect(() => {
    load();
  }, [load]);

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleClearSearch() {
    setPage(1);
    setSearchInput("");
    setSearch("");
  }

  async function handleCreate(values: GuestFormValues) {
    await apiPost("/api/admin/guests", buildPayload(values));
    setShowAddForm(false);
    await load();
    onChange?.();
  }

  async function handleUpdate(id: string, values: GuestFormValues) {
    await apiPatch(`/api/admin/guests/${id}`, buildPayload(values));
    setEditingId(null);
    await load();
    onChange?.();
  }

  async function handleDelete(guest: Guest) {
    if (
      !window.confirm(
        `¿Eliminar a ${guest.fullName}? Esta acción no se puede deshacer.`,
      )
    )
      return;
    await apiDelete(`/api/admin/guests/${guest.id}`);
    await load();
    onChange?.();
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const exportQuery = new URLSearchParams();
  if (search) exportQuery.set("search", search);
  if (statusFilter) exportQuery.set("status", statusFilter);
  if (invitationTypeFilter)
    exportQuery.set("invitationType", invitationTypeFilter);
  const exportUrl = `/api/admin/guests/export?${exportQuery}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            placeholder="Buscar por nombre"
            className="rounded-lg border border-accent-pale/50 px-3 py-2 text-sm"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-lg border border-accent-pale/50 px-3 py-2 text-sm text-ink-secondary"
          >
            Buscar
          </button>
          {(searchInput || search) && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="rounded-lg px-3 py-2 text-sm text-ink-tertiary"
            >
              Limpiar
            </button>
          )}
        </form>

        <select
          className="rounded-lg border border-accent-pale/50 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
        >
          <option value="">Todos los estados</option>
          <option value="PENDING">Pendientes</option>
          <option value="CONFIRMED">Confirmados</option>
          <option value="DECLINED">No asistirán</option>
        </select>

        <select
          className="rounded-lg border border-accent-pale/50 px-3 py-2 text-sm"
          value={invitationTypeFilter}
          onChange={(e) => {
            setPage(1);
            setInvitationTypeFilter(e.target.value);
          }}
        >
          <option value="">Todas las invitaciones</option>
          <option value="AMBOS">Ambos</option>
          <option value="CEREMONIA">Discurso</option>
          <option value="RECEPCION">Fiesta</option>
        </select>

        <a
          href={exportUrl}
          className="ml-auto rounded-full border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-700"
        >
          Descargar Excel
        </a>

        <button
          type="button"
          onClick={() => setShowAddForm((v) => !v)}
          className="rounded-full bg-accent-deep px-4 py-2 text-sm font-bold text-white"
        >
          {showAddForm ? "Cancelar" : "Agregar invitado"}
        </button>
      </div>

      {showAddForm && (
        <GuestForm
          mode="create"
          onSubmit={handleCreate}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-accent-pale/50">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-surface text-ink-secondary">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Invitación</th>
              <th className="px-4 py-3">Max.</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Asistentes</th>
              <th className="px-4 py-3">Mensaje</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-ink-tertiary" colSpan={8}>
                  Cargando…
                </td>
              </tr>
            ) : guests.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-ink-tertiary" colSpan={8}>
                  Sin resultados.
                </td>
              </tr>
            ) : (
              guests.map((guest) =>
                editingId === guest.id ? (
                  <tr key={guest.id}>
                    <td className="p-3" colSpan={8}>
                      <GuestForm
                        mode="edit"
                        initialGuest={guest}
                        onSubmit={(values) => handleUpdate(guest.id, values)}
                        onCancel={() => setEditingId(null)}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={guest.id}
                    className={`border-t border-accent-pale/30 ${STATUS_ROW_CLASS[guest.status]}`}
                  >
                    <td className="px-4 py-3">{guest.fullName}</td>
                    <td className="px-4 py-3 text-ink-secondary">
                      {guest.phone ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {INVITATION_LABEL[guest.invitationType]}
                    </td>
                    <td className="px-4 py-3">{guest.maxAttendees}</td>
                    <td className="px-4 py-3">{STATUS_LABEL[guest.status]}</td>
                    <td className="px-4 py-3">
                      {guest.attendeesCount ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-ink-secondary">
                      {guest.message ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setEditingId(guest.id)}
                          className="text-accent"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(guest)}
                          className="text-red-600"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-ink-secondary">
        <span>
          {total} invitados · página {page} de {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-accent-pale/50 px-3 py-1.5 disabled:opacity-40"
          >
            Anterior
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-accent-pale/50 px-3 py-1.5 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export default GuestTable;
