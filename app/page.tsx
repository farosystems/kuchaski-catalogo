import FeaturedSection from "@/components/FeaturedSection"
import Promo12CuotasSection from "@/components/Promo12CuotasSection"
import GlobalAppBar from "@/components/GlobalAppBar"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <GlobalAppBar />
      
      <main>
        <FeaturedSection />
        <Promo12CuotasSection />
      </main>
      
      <Footer />
    </div>
  )
}
