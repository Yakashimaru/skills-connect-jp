import { Helmet } from 'react-helmet-async'
import HeroV2 from '../components/HeroV2'
import FeaturedProfiles from '../components/FeaturedProfiles'
import HowItWorks from '../components/HowItWorks'
import CTABanner from '../components/CTABanner'

export default function Home() {
  return (
    <div>
      <Helmet>
        <title>Kaiyui – English Tutors, Community &amp; Meetups in Japan</title>
        <meta name="description" content="Connect with English tutors, language exchange partners, and like-minded people in Japan. Join Kaiyui — Japan's English-speaking skills and community platform." />
        <link rel="canonical" href="https://www.kaiyui.com/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Kaiyui",
          "url": "https://www.kaiyui.com",
          "description": "English tutors, community, and meetups in Japan",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.kaiyui.com/skills?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}</script>
      </Helmet>
      <HeroV2 />
      <FeaturedProfiles />
      <HowItWorks />
      <CTABanner />
    </div>
  )
}
