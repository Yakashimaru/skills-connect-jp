import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'

export default function PremiumLayout() {
  const { i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage ?? 'en').slice(0, 2)

  // Keep <html lang> in sync so the browser picks Japanese glyphs and fonts
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <div className="min-h-screen bg-paper font-body text-ink antialiased">
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
