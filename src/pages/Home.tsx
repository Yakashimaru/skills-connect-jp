import HeroV2 from '../components/HeroV2'
import FeaturedProfiles from '../components/FeaturedProfiles'
import HowItWorks from '../components/HowItWorks'
import CTABanner from '../components/CTABanner'

// Home page — landing page for new/unauthenticated visitors
// Sections: Hero → Featured Profiles → How It Works → CTA
// Testimonials (Real Stories / What people are saying) removed
export default function Home() {
  return (
    <div>
      {/* Full-width hero with background photo and tagline */}
      <HeroV2 />

      {/* Curated profile cards to showcase the community */}
      <FeaturedProfiles />

      {/* 3-step explainer: Browse → Connect → Meet */}
      <HowItWorks />

      {/* Final sign up call to action */}
      <CTABanner />
    </div>
  )
}
