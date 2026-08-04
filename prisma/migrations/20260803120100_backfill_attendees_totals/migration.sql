-- DataMigration
-- Las filas creadas antes de este cambio guardaron sus números bajo el
-- significado viejo ("acompañantes además del invitado principal"). Se les
-- suma 1 para que representen lo mismo bajo el significado nuevo ("total de
-- personas, incluyendo al invitado principal"), sin cambiar la capacidad real
-- de cada invitación.
UPDATE "Guest" SET "maxAttendees" = "maxAttendees" + 1;
UPDATE "Guest" SET "attendeesCount" = "attendeesCount" + 1 WHERE "attendeesCount" IS NOT NULL;
