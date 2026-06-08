'use client'

import { useState } from 'react'
import { Bell, Send, MessageCircle, Phone, Eye, Copy, Check, ExternalLink } from 'lucide-react'

type Channel = 'whatsapp' | 'telegram'

const TEMPLATES = [
  { label: 'Promotion',     text: '🎉 Special Offer from CLEANO!\n\nGet {discount}% off on all {product} orders this week.\n\nOrder now via WhatsApp: {whatsapp}\n\nCLEANO — Ethiopia\'s #1 Cleaning Brand 🧼' },
  { label: 'New Product',   text: '✨ New Arrival at CLEANO!\n\n{product} is now available at your nearest branch.\n\nVisit us at: {address}\nCall: {phone}\n\n#CLEANO #Ethiopia' },
  { label: 'Branch Opening',text: '📍 New CLEANO Branch Opening!\n\nWe\'re excited to announce our new store in {area}.\n\nAddress: {address}\nHours: {hours}\n\nCome visit us! 🧴' },
  { label: 'Restock Alert', text: '✅ Back in Stock!\n\n{product} is now available again at CLEANO.\n\nOrder via WhatsApp: {whatsapp}\nor visit any of our {branches} branches.\n\nCLEANO 🧼' },
]

export function NotificationsClient() {
  const [channel, setChannel] = useState<Channel>('whatsapp')
  const [message, setMessage] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied] = useState(false)

  // Settings for compose
  const whatsappNumber = '+251911234567' // Would come from settings in full implementation
  const telegramUsername = '@cleano_official'

  function applyTemplate(text: string) {
    setMessage(text)
  }

  function copyMessage() {
    navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function openChannel() {
    const encoded = encodeURIComponent(message)
    if (channel === 'whatsapp') {
      window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encoded}`, '_blank')
    } else {
      window.open(`https://t.me/share/url?url=${encodeURIComponent('https://cleano.et')}&text=${encoded}`, '_blank')
    }
  }

  const charCount = message.length

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Notifications</h1>
        <p className="text-gray-400 text-sm mt-0.5">Compose messages to send via WhatsApp or Telegram</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Composer */}
        <div className="lg:col-span-2 space-y-4">
          {/* Channel selector */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">1. Choose Channel</h2>
            <div className="grid grid-cols-2 gap-3">
              {([
                { id: 'whatsapp', label: 'WhatsApp', icon: Phone,         color: 'text-green-400', bg: 'bg-green-950', border: 'border-green-700', desc: whatsappNumber },
                { id: 'telegram', label: 'Telegram', icon: MessageCircle, color: 'text-blue-400',  bg: 'bg-blue-950',  border: 'border-blue-700',  desc: telegramUsername },
              ] as const).map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setChannel(ch.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                    channel === ch.id ? `${ch.bg} ${ch.border}` : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${ch.bg}`}>
                    <ch.icon className={`w-5 h-5 ${ch.color}`} />
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${channel === ch.id ? 'text-white' : 'text-gray-300'}`}>{ch.label}</div>
                    <div className="text-xs text-gray-500">{ch.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message templates */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">2. Start from a Template (optional)</h2>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map(t => (
                <button
                  key={t.label}
                  onClick={() => applyTemplate(t.text)}
                  className="text-left px-3 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-lg text-xs text-gray-300 hover:text-white transition-colors"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message compose */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">3. Write Your Message</h2>
              <span className="text-xs text-gray-500">{charCount} chars</span>
            </div>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={8}
              placeholder="Type your message here...&#10;&#10;Use placeholders like {product}, {discount}, {address} that you fill in manually."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
            />
            <div className="flex gap-2 mt-3">
              <button onClick={copyMessage} disabled={!message}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                {copied ? <><Check className="w-4 h-4 text-green-400" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
              </button>
              <button onClick={() => setShowPreview(v => !v)} disabled={!message}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Eye className="w-4 h-4" /> {showPreview ? 'Hide' : 'Preview'}
              </button>
              <button onClick={openChannel} disabled={!message}
                className={`flex items-center gap-2 ml-auto disabled:opacity-40 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  channel === 'whatsapp' ? 'bg-green-600 hover:bg-green-500' : 'bg-blue-600 hover:bg-blue-500'
                }`}>
                <ExternalLink className="w-4 h-4" />
                Open in {channel === 'whatsapp' ? 'WhatsApp' : 'Telegram'}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Preview bubble */}
          {showPreview && message && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">Message Preview</p>
              <div className={`rounded-2xl rounded-tl-sm p-4 text-sm text-white leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto ${
                channel === 'whatsapp' ? 'bg-[#075E54]' : 'bg-[#2B5278]'
              }`}>
                {message}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">💡 Tips</p>
            <div className="space-y-2 text-xs text-gray-400">
              <p>• Keep messages under 160 characters for best SMS compatibility</p>
              <p>• Use emoji to increase engagement 🧼✨</p>
              <p>• Always include a clear call-to-action</p>
              <p>• Add your WhatsApp number or branch address</p>
              <p>• Messages open in {channel === 'whatsapp' ? 'WhatsApp Web/App' : 'Telegram'} — you send manually for full control</p>
            </div>
          </div>

          {/* Placeholder guide */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">Template Placeholders</p>
            <div className="space-y-1.5">
              {[
                ['{product}', 'Product name'],
                ['{discount}', 'Discount %'],
                ['{area}', 'Area/neighborhood'],
                ['{address}', 'Store address'],
                ['{phone}', 'Phone number'],
                ['{whatsapp}', 'WhatsApp number'],
                ['{branches}', 'Number of branches'],
                ['{hours}', 'Opening hours'],
              ].map(([ph, desc]) => (
                <div key={ph} className="flex items-center gap-2">
                  <code className="text-xs text-blue-400 bg-blue-950/40 px-1.5 py-0.5 rounded font-mono">{ph}</code>
                  <span className="text-xs text-gray-500">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
