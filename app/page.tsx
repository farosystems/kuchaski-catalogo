import FeaturedSection from "@/components/FeaturedSection"
import BannersCarousel from "@/components/BannersCarousel"
import LineasCarousel from "@/components/LineasCarousel"
import Promo12CuotasSection from "@/components/Promo12CuotasSection"
import CombosSection from "@/components/CombosSection"
import GlobalAppBar from "@/components/GlobalAppBar"
import Footer from "@/components/Footer"
import { getMostrarCombos } from "@/lib/supabase-config"

export default async function Home() {
  const mostrarCombos = await getMostrarCombos()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-50 to-orange-100">
      <GlobalAppBar />

      <main>
        <BannersCarousel />
        <LineasCarousel />
        <FeaturedSection />
        <Promo12CuotasSection />
        {mostrarCombos && <CombosSection />}
      </main>

      <Footer />
    </div>
  )
}
