import HeroSequence from './sections/HeroSequence'
import CircleFull from './sections/CircleFull'
import ElDia from './sections/ElDia'
import Recepcion from './sections/Recepcion'
import PhotoFusion from './sections/PhotoFusion'
import WhereWhen from './sections/WhereWhen'
import Rsvp from './sections/Rsvp'
import Footer from './components/Footer'
import EnvelopeGate from './components/EnvelopeGate'
import type { GuestAccess } from './types/guestAccess'

interface AppProps {
  guestAccess: GuestAccess
}

function App({ guestAccess }: AppProps) {
  return (
    <EnvelopeGate>
      <main className="min-h-screen bg-surface text-ink font-sans">
        <HeroSequence guestAccess={guestAccess} />
        <CircleFull />
        <ElDia guestAccess={guestAccess} />
        <PhotoFusion />
        <Recepcion guestAccess={guestAccess} />
        <WhereWhen guestAccess={guestAccess} />
        <Rsvp guestAccess={guestAccess} />
        <Footer />
      </main>
    </EnvelopeGate>
  )
}

export default App
