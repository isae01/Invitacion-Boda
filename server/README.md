# Backend — Invitación digital de boda

API REST para el RSVP de la boda y el panel administrativo de los novios. Vive en el
mismo repositorio que el frontend (Vite + React) y se despliega como parte del
**mismo proyecto de Vercel**, sin backend separado que administrar.

## 1. Arquitectura

- **Un solo repositorio, un solo proyecto en Vercel.** El frontend se sirve como sitio
  estático (build de Vite); el backend corre como **Serverless Functions** de Vercel
  bajo `/api`. No hay dos despliegues ni dos dominios.
- El backend es una app de **Express** normal. La única pieza específica de Vercel es
  `api/[...path].ts`, que envuelve ese mismo Express app como una única función
  catch-all: toda request a `/api/*` la resuelve el mismo código, sin importar si
  corre en local (`npm run dev:server`) o en Vercel.
- **Prisma** es la única capa de acceso a datos — no hay repositorios ni ORM adicional
  encima. Cada módulo (`auth`, `guests`, `rsvp`, `dashboard`) sigue el mismo patrón:
  `routes → controller → service → prisma`.
- **PostgreSQL en Neon**, con dos connection strings: una con *pooling* (`pgbouncer`,
  usada por la app) y una directa (usada solo por las migraciones). Ver [Variables de
  entorno](#4-variables-de-entorno).
- La autenticación de admin usa **JWT en una cookie `httpOnly`**, no un token en
  `localStorage` — ver [Decisiones de arquitectura](#13-decisiones-de-arquitectura-importantes).
- El RSVP público **no crea invitados**: solo actualiza una fila que ya existe,
  cargada de antemano por los novios (vía el script de importación o el panel).

## 2. Tecnologías

| Pieza | Elección |
|---|---|
| Runtime | Node.js (Vercel Serverless Functions) |
| Framework HTTP | Express 4 |
| Lenguaje | TypeScript |
| ORM | Prisma |
| Base de datos | PostgreSQL (Neon) |
| Validación | Zod |
| Auth | JWT (`jsonwebtoken`) + cookie `httpOnly` (`cookie-parser`) |
| Hashing de contraseñas | `bcryptjs` (puro JS, sin compilación nativa) |
| Parseo de CSV | `csv-parse` |
| Dev runner | `tsx` |

## 3. Estructura de carpetas

```
api/
  [...path].ts        # función serverless catch-all: envuelve el Express app

server/
  README.md           # este archivo
  scripts/
    create-admin.ts    # crea/resetea la cuenta de admin
    import-guests.ts   # importación masiva desde CSV
    guests-sample.csv   # plantilla de referencia
  src/
    app.ts              # arma el Express app y monta las rutas
    dev-server.ts        # entrypoint solo para desarrollo local (app.listen)
    lib/
      prisma.ts           # PrismaClient singleton
      env.ts               # lee/valida variables de entorno (falla rápido si falta alguna)
      httpError.ts          # error con status HTTP explícito
      normalizeName.ts       # minúsculas + sin acentos + sin espacios extra
    middleware/
      auth.ts              # requireAuth: protege rutas /api/admin/*
      errorHandler.ts        # traduce HttpError/ZodError a respuestas JSON consistentes
    auth/                  # login, logout, me
    guests/                 # CRUD de invitados (admin)
    rsvp/                   # confirmación pública de asistencia
    dashboard/               # estadísticas agregadas

prisma/
  schema.prisma
  migrations/
```

Cada módulo de negocio (`auth`, `guests`, `rsvp`, `dashboard`) tiene la misma forma:
`*.routes.ts` (define las rutas), `*.controller.ts` (parsea el request, llama al
servicio, responde), `*.service.ts` (la lógica real, habla con Prisma), y
`*.schema.ts` (validación con Zod) cuando el módulo recibe input.

## 4. Variables de entorno

Copiar `.env.example` a `.env` y completar con valores reales:

| Variable | Uso |
|---|---|
| `DATABASE_URL` | Connection string **con pooling** (pgbouncer) de Neon. La usa la app en cada request. |
| `DIRECT_URL` | Connection string **directa** (sin pooling) de Neon. Solo la usan las migraciones de Prisma. |
| `JWT_SECRET` | Firma los JWT de sesión del admin. Generar con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. |

Neon se crea desde el tab **Storage** del dashboard de Vercel (o directamente en
neon.tech). Al crearla, Vercel/Neon dan varias variables — las que importan para
este proyecto son la que incluye `pgbouncer=true` en la URL (→ `DATABASE_URL`) y la
que no lo incluye (→ `DIRECT_URL`).

## 5. Instalación

```bash
npm install
```

`postinstall` corre automáticamente `prisma generate`, así que el cliente de Prisma
queda listo sin pasos manuales.

## 6. Desarrollo local

Dos procesos en paralelo:

```bash
npm run dev         # frontend (Vite, puerto 5173)
npm run dev:server  # backend (Express, puerto 4000)
```

`vite.config.ts` tiene un proxy de `/api` → `http://localhost:4000`, así que en
desarrollo el navegador solo ve `localhost:5173` — exactamente el mismo origen que
en producción (un solo dominio en Vercel). Esto es importante porque la cookie de
sesión del admin es `httpOnly` y depende de que frontend y backend compartan
origen; sin el proxy habría que lidiar con CORS y con las reglas de cookies
cross-site.

Para probar el backend solo (sin frontend), `npm run dev:server` expone la API en
`http://localhost:4000/api/...` directamente.

## 7. Migraciones de Prisma

```bash
npm run prisma:migrate     # crea y aplica una migración a partir de schema.prisma
```

Requiere `DATABASE_URL` y `DIRECT_URL` configuradas en `.env`. Prisma usa
`DIRECT_URL` específicamente para migraciones porque una conexión con pooling
(pgbouncer) no soporta las operaciones que una migración necesita.

Otros comandos útiles:

```bash
npx prisma studio          # explorador visual de la base de datos
npx prisma generate        # regenerar el cliente manualmente (normalmente no hace falta)
```

## 8. Crear el administrador

No hay registro público — la única forma de crear o resetear la cuenta de los
novios es este script:

```bash
npm run create:admin -- usuario contraseñaSegura
```

Es un `upsert` por usuario: si la cuenta no existe la crea, si ya existe le
actualiza la contraseña. Así que también sirve para resetear el password si se
olvida.

## 9. Importar invitados desde un CSV

La carga inicial de invitados (exportados desde el Google Sheets de los novios) se
hace una sola vez, a mano, con este script — **no** existe un endpoint HTTP de
importación, a propósito (ver [Decisiones](#13-decisiones-de-arquitectura-importantes)).

```bash
npm run import:guests -- ruta/al/archivo.csv
```

Formato esperado (ver `server/scripts/guests-sample.csv`):

```csv
nombre,telefono,tipo_invitacion,asistentes_max
María José Pérez,555-1111,ambos,2
Carlos Ruiz,,ceremonia,1
Ana Gómez,555-2222,recepcion,3
```

- `nombre`: requerido.
- `telefono`: opcional, puede ir vacío.
- `tipo_invitacion`: `ambos` / `ceremonia` / `recepcion`. No importan mayúsculas ni
  acentos ("Recepción", "RECEPCION" y "recepcion" son equivalentes).
- `asistentes_max`: número, opcional (default 1). Es el total de personas de esa
  invitación **incluyendo al invitado principal** — si María puede llevar a una
  persona más, el valor es 2, no 1.

El script no se detiene si una fila falla: la reporta y sigue con las demás.
Termina con código de salida 1 si hubo al menos un error, para que sea fácil notar
si algo falló sin tener que leer todo el log.

## 10. Endpoints

Todas las respuestas son JSON. Los errores tienen la forma `{ "error": "mensaje" }`
(o `{ "error": "Datos inválidos", "details": [...] }` para errores de validación de
Zod).

### Auth (`/api/auth`)

#### `POST /api/auth/login`

Público. Verifica credenciales y deja una cookie `httpOnly` con el JWT de sesión
(7 días de duración).

```bash
curl -c cookies.txt -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

Respuesta `200`: `{ "admin": { "id": "...", "username": "admin" } }`
Respuesta `401`: `{ "error": "Credenciales inválidas" }` (mismo mensaje si el usuario
no existe o si la contraseña es incorrecta — no se revela cuál de las dos falló).

#### `POST /api/auth/logout`

Borra la cookie de sesión. Respuesta `204` sin cuerpo.

#### `GET /api/auth/me`

Protegida. Devuelve el admin de la sesión actual, o `401` si no hay sesión válida.

```bash
curl -b cookies.txt http://localhost:4000/api/auth/me
```

### Guests — admin (`/api/admin/guests`, protegidas)

Requieren la cookie de sesión (`-b cookies.txt` en los ejemplos).

#### `GET /api/admin/guests`

Lista, busca y filtra. Query params, todos opcionales:

| Param | Valores |
|---|---|
| `search` | texto libre — compara contra el nombre normalizado (sin acentos, sin mayúsculas) |
| `status` | `PENDING` / `CONFIRMED` / `DECLINED` |
| `invitationType` | `AMBOS` / `CEREMONIA` / `RECEPCION` |
| `page`, `pageSize` | paginación (`pageSize` máximo 100) |

```bash
curl -b cookies.txt "http://localhost:4000/api/admin/guests?search=maria&status=CONFIRMED"
```

Respuesta `200`: `{ "data": [Guest, ...], "total": 12, "page": 1, "pageSize": 20 }`

#### `POST /api/admin/guests`

Crea un invitado nuevo (sin respuesta de RSVP todavía — `status` arranca en
`PENDING`).

```bash
curl -b cookies.txt -X POST http://localhost:4000/api/admin/guests \
  -H "Content-Type: application/json" \
  -d '{"fullName":"María José Pérez","phone":"555-1111","invitationType":"AMBOS","maxAttendees":2}'
```

Respuesta `201` con el invitado creado. `400` si falta `fullName` o `invitationType`.

#### `PATCH /api/admin/guests/:id`

Edita cualquier campo, incluyendo los de la respuesta de RSVP (`status`,
`attendeesCount`, `message`) — así el admin puede corregir una respuesta a mano.

```bash
curl -b cookies.txt -X PATCH http://localhost:4000/api/admin/guests/<id> \
  -H "Content-Type: application/json" \
  -d '{"status":"CONFIRMED","attendeesCount":2}'
```

Respuesta `200` con el invitado actualizado. `400` si `attendeesCount` supera
`maxAttendees`. `404` si el invitado no existe.

#### `DELETE /api/admin/guests/:id`

Elimina la fila **físicamente** de la base (no es soft delete — no hay campo
`deletedAt`). Respuesta `204`. `404` si no existe.

### RSVP — público (`/api/rsvp`)

#### `POST /api/rsvp`

El único endpoint de escritura sin autenticación. Actualiza (nunca crea) un
invitado que ya existe en la base, encontrado por nombre.

```bash
curl -X POST http://localhost:4000/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{"fullName":"maria jose perez","status":"CONFIRMED","attendeesCount":2,"message":"Que emoción!"}'
```

Body:

| Campo | Requerido | Notas |
|---|---|---|
| `fullName` | sí | se compara normalizado (sin acentos/mayúsculas/espacios extra) contra los invitados ya cargados |
| `status` | sí | `CONFIRMED` o `DECLINED` (no `PENDING` — eso es solo el estado inicial) |
| `attendeesCount` | no | total de personas **incluyendo al invitado**; ignorado y forzado a `null` si `status` es `DECLINED`; default `1` (solo el invitado) si confirma sin especificar |
| `message` | no | mensaje opcional para los novios |

Respuesta `200`: `{ "status": "CONFIRMED", "attendeesCount": 2 }`

Errores:
- `404` — nombre no encontrado en la lista, **o** más de un invitado coincide con
  el mismo nombre normalizado (mismo mensaje en ambos casos: no se arriesga a
  actualizar la respuesta de la persona equivocada).
- `400` — `attendeesCount` supera el `maxAttendees` real de ese invitado (el
  mensaje incluye el número exacto), o el body no pasa la validación de Zod.

### Dashboard (`/api/admin/dashboard`, protegida)

#### `GET /api/admin/dashboard`

```bash
curl -b cookies.txt http://localhost:4000/api/admin/dashboard
```

Respuesta `200`:

```json
{
  "total": 40,
  "confirmed": 25,
  "pending": 10,
  "declined": 5,
  "attendanceRate": 62.5,
  "totalAttendees": 43,
  "maxAttendeesTotal": 150
}
```

- `attendanceRate` = `confirmed / total * 100`, redondeado a 1 decimal.
- `totalAttendees` = suma de `attendeesCount` solo de los invitados `CONFIRMED`
  (ya incluye al invitado principal de cada fila, no hace falta sumarle `confirmed`).
- `maxAttendeesTotal` = suma de `maxAttendees` de **todos** los invitados (sin
  filtrar por estado) — el techo máximo de personas si todos confirman con su
  cupo completo. El frontend lo muestra como `totalAttendees/maxAttendeesTotal`
  (ej. "43/150").

## 11. Flujo general de la aplicación

1. **Antes de lanzar**: el desarrollador corre `npm run import:guests` una vez con
   el CSV exportado del Google Sheets real de los novios, y `npm run create:admin`
   para crear la cuenta con la que ellos entrarán al panel.
2. Los novios envían a mano a cada invitado el link correspondiente (`/`, `/1` o
   `/2` — según a qué evento está invitado). Esa ruta solo controla qué secciones
   ve en la invitación; no tiene relación con su identidad en la base de datos.
3. El invitado llena el formulario de RSVP (ya existente en el frontend) y al
   enviar, el frontend llama a `POST /api/rsvp`.
4. El backend normaliza el nombre recibido, busca una coincidencia única en
   `Guest`, valida el tope de asistentes, y guarda `status`, `attendeesCount`,
   `message` y `respondedAt`.
5. El frontend muestra la pantalla de confirmación (con los links para agregar el
   evento al calendario).
6. Los novios entran a `/admin`, inician sesión (`POST /api/auth/login`), y ven el
   dashboard (`GET /api/admin/dashboard`) y la tabla de invitados
   (`GET /api/admin/guests`) reflejando esa respuesta en tiempo real. Pueden
   buscar, filtrar, editar o eliminar cualquier invitado.

## 12. Despliegue en Vercel

1. Importar el repositorio en Vercel (o `vercel link` desde la CLI).
2. Agregar una base de datos **Postgres (Neon)** desde el tab **Storage** del
   proyecto — sin activar "crear una rama de base de datos por deployment" (eso
   daría una base nueva y vacía en cada deploy, separada de las respuestas reales
   de los invitados).
3. Configurar las variables de entorno del proyecto en Vercel (`DATABASE_URL`,
   `DIRECT_URL`, `JWT_SECRET`) — si la base se creó desde el tab Storage y se
   conectó al proyecto, las dos primeras ya quedan inyectadas automáticamente.
4. Desplegar (`vercel --prod` o el deploy automático al hacer push). El build:
   - Corre `npm install`, que dispara `postinstall: prisma generate`.
   - Corre `vite build` para el frontend (queda como sitio estático).
   - Vercel detecta `api/[...path].ts` y lo publica como una función serverless
     que atiende todo `/api/*`.
5. `vercel.json` tiene un rewrite (`/((?!api/).*) → /index.html`) para que las
   rutas del frontend (`/`, `/1`, `/2`, `/admin`, etc.) sigan funcionando al
   recargar la página directamente, sin interferir con `/api/*`.
6. Las migraciones **no** corren automáticamente en el deploy — se corren a mano
   (`npm run prisma:migrate`, o `npx prisma migrate deploy` contra `DIRECT_URL`)
   cuando cambia el schema, antes o después de desplegar el código según
   corresponda.

## 13. Decisiones de arquitectura importantes

- **Cookie `httpOnly` en vez de token en `localStorage`.** El plan original
  contemplaba un Bearer token porque se pensó en frontend y backend en dominios
  distintos. Al decidir un solo proyecto de Vercel (mismo origen), la cookie
  `httpOnly` quedó como la opción estrictamente mejor: el JWT nunca es accesible
  desde JavaScript en el navegador (protege contra robo de sesión vía XSS), y no
  hace falta configurar CORS.
- **Sin slugs, tokens ni links personalizados por invitado.** El RSVP identifica
  al invitado por nombre normalizado, decisión explícita para no modificar las
  rutas del frontend (`/`, `/1`, `/2`) ni requerir que los novios generen y envíen
  un link único por persona. La contrapartida es que dos invitados con el mismo
  nombre normalizado no se pueden distinguir — en ese caso el RSVP responde con
  el mismo mensaje de "no encontrado" en vez de arriesgar una actualización
  incorrecta.
- **Una sola confirmación general por invitado, no una por evento.** El invitado
  responde `CONFIRMED`/`DECLINED` una sola vez, aunque el frontend le pregunte por
  ceremonia y recepción por separado (la conversión de "¿confirmó al menos un
  evento visible?" a un único `status` la hace el frontend antes de llamar a la
  API). Se eligió así porque es más simple que modelar asistencia por evento, y
  es lo que se pidió explícitamente al diseñar el backend.
- **Eliminación física, no soft delete.** El modelo `Guest` no tiene un campo
  `deletedAt` — `DELETE` borra la fila de la base. Decisión explícita para
  mantener el modelo de datos simple; no hay papelera ni recuperación de
  invitados eliminados por accidente.
- **Import por script, no por endpoint HTTP.** La carga inicial de invitados es
  un evento que ocurre una sola vez, hecho por el desarrollador con acceso directo
  a la base — no se construyó un endpoint de subida de CSV en el panel porque no
  hay un caso de uso recurrente que lo justifique.
- **`normalizedName` se calcula y guarda, no se compara en cada query con
  funciones de Postgres.** Evita depender de extensiones de la base de datos
  (como `unaccent`) y mantiene el matching como una función pura de TypeScript,
  reutilizada igual por el CRUD, el script de importación y el RSVP.
