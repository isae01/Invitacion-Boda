# CONTENT.md

# Invitación Digital — Juan Diego & Valeria

## Propósito

Este documento contiene únicamente el contenido oficial de la invitación.

No incluye decisiones de diseño, arquitectura o implementación.

Toda la información que se muestra al usuario debe obtenerse de este documento.

---

# Información General

## Novios

Novio: Juan Diego

Novia: Valeria

---

## Fechas importantes

Envío de invitaciones

3 de agosto de 2026

Fecha límite para confirmar asistencia (RSVP)

3 de septiembre de 2026

---

## Estilo de la invitación

- Elegante
- Formal
- Minimalista
- Mobile First
- Editorial contemporáneo
- Premium

---

# Historia

Frase (tarjeta sobre la foto 9149, "El día")

Entre todos los momentos que hemos vivido, este será el más especial porque podremos compartirlo contigo.

Leyenda sobre el anillo (distinta de la frase anterior)

Aquí comenzó todo.

Bienvenida general

¡Ya es oficial, nos casamos! Nos hace mucha ilusión empezar esta nueva etapa juntos y nos encantaría tenerte con nosotros.

---

# Paleta de colores

Color principal

Steel Blue

Colores secundarios

- Azul grisáceo
- Gris oscuro
- Gris claro
- Blanco
- Lila claro #E0D6DD (solo en el fondo de la sección Fiesta, "otro vibe" de fiesta)

La experiencia debe transmitir:

- tranquilidad
- elegancia
- sofisticación
- modernidad

---

# Fotografías

Las fotografías oficiales del proyecto son:

- IMG_9289.jpg
- IMG_9202.jpg
- IMG_9156.jpg
- IMG_9351.jpg
- IMG_9312.jpg
- IMG_9149.jpg
- IMG_9186.jpg
- IMG_9101.jpg
- IMG_9119.jpg
- IMG_9304.jpg
- IMG_9136.jpg
- IMG_9252.jpg

Fotos de lugar (tarjetas de Dónde y Cuándo, no son fotos de los novios):

- salon.jpg — Salón del Reino (Discurso)
- antigua.jpg — Antigua Guatemala (Fiesta)

La asignación visual de cada fotografía está documentada en DESIGN.md.

---

# Labels en pantalla

Los eyebrows de evento en pantalla (El Día, Dónde y Cuándo) usan estos nombres
editoriales en vez del nombre real del evento:

- Ceremonia → DISCURSO
- Recepción → FIESTA

El nombre real ("Ceremonia"/"Recepción") se sigue usando en el RSVP y en los
textos alternativos de imagen.

---

# Transición Ceremonia → Recepción

Franja corta con la foto 9186 y un velo azul oscuro encima, sin texto
(solo cuando el invitado ve ambos eventos).

---

# Evento 1

## Ceremonia

Fecha

23 de octubre de 2026

Horario

7:00 PM

Finaliza

8:30 PM

Mensaje de bienvenida

¡Ya es oficial, nos casamos!

Nos hace mucha ilusión empezar esta nueva etapa juntos y nos gustaría tenerte en nuestra ceremonia de bodas.

Dress Code

Formal

Ubicación

20 Avenida 19-60

Colonia Montesano

Zona 16

Guatemala

Google Maps

https://share.google/1mTzJ0J0oqdm4ERNc

Waze

https://waze.com/ul/h9fxejx3m2

Música

No lleva música de fondo.

Itinerario

- Oración
- Canción
- Discurso
- Votos
- Canción
- Oración
- Fotografías

Mesa de regalos

No aplica.

---

# Evento 2

## Recepción

Fecha

24 de octubre de 2026

Horario

5:00 PM

Finaliza

10:00 PM

Lugar

Jardín Casa La Historia

Antigua Guatemala

Google Maps

https://maps.app.goo.gl/hCZCoETdjrdWn3rv9

Waze

https://waze.com/ul/h9fx6xhk6h

Mensaje de bienvenida

¡Ya es oficial, nos casamos!

Nos hace mucha ilusión empezar esta nueva etapa juntos y la fiesta no estaría completa sin ti.

Dress Code

Formal

Música

Here Comes The Sun

Mensaje sobre regalos

Tu presencia es nuestro mayor regalo.

Pero si deseas hacernos un obsequio, también lo recibiremos con mucho cariño.

Itinerario completo

- Foto con invitados
- Asignación de mesas
- Palabras de bienvenida
- Oración
- Comida
- Palabras del novio
- Palabras de la novia
- Baile de los novios
- Baile con los padres
- Baile general
- Fotografías con cámara digital
- Pastel
- Baile general
- Palabras de despedida

Versión editorial que se mostrará en pantalla

- Fotografías
- Palabras de los novios
- Oración y comida
- Primer baile
- Pastel
- A celebrar juntos

---

# Variantes de invitación

El proyecto tiene una sola aplicación.

El contenido cambia dependiendo del tipo de invitado.

## /1

Mostrar únicamente

- Ceremonia
- Cuenta regresiva al 23 de octubre
- RSVP para ceremonia

---

## /2

Mostrar únicamente

- Recepción
- Cuenta regresiva al 24 de octubre
- RSVP para recepción

---

## /3

Mostrar

- Ceremonia
- Recepción
- Dos bloques de eventos
- Cuenta regresiva al primer evento

---

# Formulario RSVP

Título

Nos encantaría celebrar contigo.

Recordatorio de fecha límite (se muestra en el formulario)

Por favor confirma antes del 3 de septiembre

Opciones de asistencia (por evento)

- Sí, asistiré
- No podré ir

Campos

- Nombre completo
- ¿Asistirá? (por evento)
- Mensaje (opcional)
- Asistentes: cuántas personas en total asistirán, incluyendo al invitado
  que llena el formulario (ej. si solo puede llevar a su esposa, el número
  correcto es 2, no 1)

Al confirmar asistencia

Por cada evento al que el invitado sí asistirá, se muestran dos botones para
agregarlo a su calendario personal: Google Calendar y Apple/Outlook (.ics).

---

# Administración

Panel privado para los novios.

Debe mostrar

- Total de respuestas
- Personas confirmadas
- Personas no confirmadas
- Confirmados para ceremonia
- Confirmados para recepción
- Confirmados para ambos eventos
- Tabla completa
- Buscador
- Filtros

---

# Funcionalidades futuras

No implementar durante el desarrollo inicial.

- Modal de bienvenida personalizado.
- Cuenta regresiva especial para los novios.
- Mensaje automático el día de la boda.

---

# Fuente de verdad

Toda la información mostrada al usuario debe provenir de este documento.

No duplicar textos dentro de componentes React.

Si cambia una fecha, dirección, mensaje o itinerario, únicamente debe modificarse aquí.
