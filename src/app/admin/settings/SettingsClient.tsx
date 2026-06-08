'use client'

import { useState } from 'react'
import { Save, Settings, Globe, MessageCircle, Phone, MapPin, Palette, Megaphone, Users } from 'lucide-react'

type SiteSettings = {
  companyName: string
  tagline: string
  whatsappNumber: string
  telegramUsername: string
  email: string
  phone: string
  address: string
  facebookUrl: string
  instagramUrl: string
  tiktokUrl: string
  seoTitle: string
  seoDescription: string
  primaryColor: string
  accentColor: string
  logoUrl: string
  bannerEnabled: boolean
  bannerText: string
  bannerColor: string
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-800">
        <div className="w-7 h-7 bg-blue-900 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-blue-400" />
        </div>
        <h2 className="font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-600 mt-1">{hint}</p>}
    </div>
  )
}

export function SettingsClient({ initialSettings }: { initialSettings: SiteSettings }) {
  const [settings, setSettings] = useState(initialSettings)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings(prev => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  const inp = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"

  async function save() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        setDirty(false)
        setToast('Settings saved successfully!')
        setTimeout(() => setToast(null), 3000)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5 max-w-4xl">
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-lg">{toast}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Site Settings</h1>
          <p className="text-gray-400 text-sm mt-0.5">Global configuration for your website</p>
        </div>
        <button onClick={save} disabled={saving || !dirty} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : `Save${dirty ? ' *' : ''}`}
        </button>
      </div>

      <Section title="Company Info" icon={Settings}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Company Name">
            <input value={settings.companyName} onChange={e => update('companyName', e.target.value)} className={inp} />
          </Field>
          <Field label="Tagline">
            <input value={settings.tagline} onChange={e => update('tagline', e.target.value)} className={inp} />
          </Field>
          <Field label="Logo URL" hint="Paste URL of your logo image">
            <input value={settings.logoUrl} onChange={e => update('logoUrl', e.target.value)} className={inp} placeholder="https://..." />
          </Field>
          <Field label="Address">
            <input value={settings.address} onChange={e => update('address', e.target.value)} className={inp} />
          </Field>
        </div>
      </Section>

      <Section title="Contact & Social" icon={Phone}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email">
            <input value={settings.email} onChange={e => update('email', e.target.value)} type="email" className={inp} />
          </Field>
          <Field label="Phone">
            <input value={settings.phone} onChange={e => update('phone', e.target.value)} className={inp} />
          </Field>
          <Field label="WhatsApp Number" hint="Include country code: +251...">
            <input value={settings.whatsappNumber} onChange={e => update('whatsappNumber', e.target.value)} className={inp} placeholder="+251911234567" />
          </Field>
          <Field label="Telegram Username">
            <input value={settings.telegramUsername} onChange={e => update('telegramUsername', e.target.value)} className={inp} placeholder="@cleano_official" />
          </Field>
          <Field label="TikTok URL">
            <input value={settings.tiktokUrl} onChange={e => update('tiktokUrl', e.target.value)} className={inp} placeholder="https://tiktok.com/@..." />
          </Field>
          <Field label="Instagram URL">
            <input value={settings.instagramUrl} onChange={e => update('instagramUrl', e.target.value)} className={inp} placeholder="https://instagram.com/..." />
          </Field>
          <Field label="Facebook URL">
            <input value={settings.facebookUrl} onChange={e => update('facebookUrl', e.target.value)} className={inp} placeholder="https://facebook.com/..." />
          </Field>
        </div>
      </Section>

      <Section title="SEO Metadata" icon={Globe}>
        <div className="space-y-4">
          <Field label="Page Title" hint="Shown in browser tab and search results">
            <input value={settings.seoTitle} onChange={e => update('seoTitle', e.target.value)} className={inp} />
          </Field>
          <Field label="Meta Description" hint="Shown in search result previews (keep under 160 chars)">
            <textarea value={settings.seoDescription} onChange={e => update('seoDescription', e.target.value)} rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none" />
            <div className="text-xs text-gray-600 mt-1">{settings.seoDescription.length} / 160 characters</div>
          </Field>
        </div>
      </Section>

      <Section title="Announcement Banner" icon={Megaphone}>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={settings.bannerEnabled} onChange={e => update('bannerEnabled', e.target.checked)} className="w-4 h-4 rounded" />
            <span className="text-sm text-gray-300">Show announcement banner on website</span>
          </label>
          {settings.bannerEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Banner Text">
                <input value={settings.bannerText} onChange={e => update('bannerText', e.target.value)} className={inp} />
              </Field>
              <Field label="Banner Color (hex)">
                <div className="flex gap-2">
                  <input type="color" value={settings.bannerColor} onChange={e => update('bannerColor', e.target.value)}
                    className="w-10 h-9 rounded border border-gray-700 bg-gray-800 cursor-pointer" />
                  <input value={settings.bannerColor} onChange={e => update('bannerColor', e.target.value)} className={`${inp} flex-1`} />
                </div>
              </Field>
            </div>
          )}
        </div>
      </Section>

      <Section title="Theme Colors" icon={Palette}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Primary Color" hint="Main brand color (blue)">
            <div className="flex gap-2">
              <input type="color" value={settings.primaryColor} onChange={e => update('primaryColor', e.target.value)}
                className="w-10 h-9 rounded border border-gray-700 bg-gray-800 cursor-pointer" />
              <input value={settings.primaryColor} onChange={e => update('primaryColor', e.target.value)} className={`${inp} flex-1`} />
            </div>
          </Field>
          <Field label="Accent Color" hint="Secondary / highlight color">
            <div className="flex gap-2">
              <input type="color" value={settings.accentColor} onChange={e => update('accentColor', e.target.value)}
                className="w-10 h-9 rounded border border-gray-700 bg-gray-800 cursor-pointer" />
              <input value={settings.accentColor} onChange={e => update('accentColor', e.target.value)} className={`${inp} flex-1`} />
            </div>
          </Field>
        </div>
        <p className="text-xs text-gray-500 mt-3">Color changes are saved here. To apply them across the site, update your tailwind.config.js or CSS variables accordingly.</p>
      </Section>
    </div>
  )
}
