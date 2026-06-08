import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { ContentClient } from './ContentClient'
import { getPageContent } from '@/lib/admin/data'

export const dynamic = 'force-dynamic'

const DEFAULT_SECTIONS = [
  { id: 'home-hero',       page: 'home',    section: 'Hero Banner',          titleEn: "Ethiopia's Most Trusted Cleaning Brand",    titleAm: 'የኢትዮጵያ ቁጥር 1 የጽዳት ምርት',     bodyEn: 'Premium detergents crafted for Ethiopian homes.', bodyAm: 'ለኢትዮጵያ ቤቶች የተዘጋጀ ፕሪሚየም ዲተርጀንቶች።', updatedAt: '' },
  { id: 'home-why',        page: 'home',    section: 'Why Choose CLEANO',    titleEn: 'Why Choose CLEANO?',                         titleAm: 'ለምን CLEANO?',                   bodyEn: 'Lab-tested formulas, affordable prices.', bodyAm: 'ተመጣጣኝ ዋጋ ያለው።', updatedAt: '' },
  { id: 'footer-tagline',  page: 'footer',  section: 'Footer Tagline',       titleEn: "Ethiopia's Most Trusted Cleaning Brand",    titleAm: 'የኢትዮጵያ ቁጥር 1',                 bodyEn: 'Premium detergents crafted for Ethiopian homes.', bodyAm: 'ለኢትዮጵያ ቤቶች።', updatedAt: '' },
  { id: 'contact-intro',   page: 'contact', section: 'Contact Page Intro',   titleEn: 'Get In Touch',                               titleAm: 'ያግኙን',                          bodyEn: 'Reach out via WhatsApp or Telegram.', bodyAm: 'በ WhatsApp ወይም Telegram ያግኙን።', updatedAt: '' },
  { id: 'distributor-cta', page: 'home',    section: 'Distributor CTA',      titleEn: 'Become a Distributor',                       titleAm: 'ስርጭቱ ይሁኑ',                    bodyEn: 'Join our network across Ethiopia.', bodyAm: 'በኢትዮጵያ ትስስሩ ይቀላቀሉ።', updatedAt: '' },
]

export default async function ContentPage() {
  const saved = await getPageContent()
  const sections = DEFAULT_SECTIONS.map(def => {
    const s = saved.find(x => x.id === def.id)
    return s ? { ...def, ...s } : def
  })
  return (
    <AdminPageWrapper requiredResource="content">
      <ContentClient sections={sections} />
    </AdminPageWrapper>
  )
}
