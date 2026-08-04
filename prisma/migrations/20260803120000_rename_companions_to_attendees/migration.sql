-- RenameColumn
ALTER TABLE "Guest" RENAME COLUMN "maxCompanions" TO "maxAttendees";
ALTER TABLE "Guest" RENAME COLUMN "companionsCount" TO "attendeesCount";

-- AlterTable
-- Antes representaba "acompañantes además del invitado principal" (default 0).
-- Ahora representa el total de personas de esa invitación, así que el mínimo
-- razonable es 1 (el invitado principal, sin acompañantes).
ALTER TABLE "Guest" ALTER COLUMN "maxAttendees" SET DEFAULT 1;
