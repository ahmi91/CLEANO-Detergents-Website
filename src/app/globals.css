@tailwind base;
@tailwind components;
@tailwind utilities;

/* ─── Custom CSS Variables ─────────────────────────────────────── */
:root {
  --brand-blue:  #1B4FD8;
  --brand-navy:  #0F2B6B;
  --brand-sky:   #38BDF8;
  --brand-light: #EFF6FF;
  --brand-gold:  #F59E0B;
  --radius-card: 1.25rem;
}

/* ─── Base ──────────────────────────────────────────────────────── */
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--font-body), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
}

/* ─── Amharic font override ─────────────────────────────────────── */
html[lang='am'] body,
html[lang='am'] p,
html[lang='am'] span,
html[lang='am'] button,
html[lang='am'] a {
  font-family: 'Noto Sans Ethiopic', system-ui, sans-serif;
}

/* ─── Scroll bar ────────────────────────────────────────────────── */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #bfdbfe;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #1B4FD8;
}

/* ─── Selection ─────────────────────────────────────────────────── */
::selection {
  background: #bfdbfe;
  color: #1e3a8a;
}

/* ─── Card component ────────────────────────────────────────────── */
@layer components {
  .card {
    @apply bg-white dark:bg-gray-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300;
  }

  .card-hover {
    @apply hover:shadow-card-hover hover:-translate-y-1 cursor-pointer;
  }

  .btn-primary {
    @apply bg-cleano-blue hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-glow active:scale-95 flex items-center justify-center gap-2;
  }

  .btn-secondary {
    @apply bg-cleano-light hover:bg-brand-100 text-cleano-blue font-semibold px-6 py-3 rounded-xl transition-all duration-200 border border-brand-200 active:scale-95 flex items-center justify-center gap-2;
  }

  .btn-ghost {
    @apply hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded-xl transition-all duration-200 active:scale-95;
  }

  .badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold;
  }

  .section-title {
    @apply font-display font-bold text-2xl md:text-3xl text-gray-900 dark:text-white;
  }

  .section-subtitle {
    @apply text-gray-500 dark:text-gray-400 mt-2 text-base;
  }

  .input-field {
    @apply w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cleano-blue focus:border-transparent transition-all;
  }

  /* Skeleton shimmer */
  .skeleton {
    @apply bg-gray-100 dark:bg-gray-800 rounded-xl animate-shimmer;
    background-image: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
    background-size: 200% 100%;
  }

  /* Price pill toggle */
  .size-toggle {
    @apply relative flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1;
  }

  .size-option {
    @apply relative z-10 flex-1 text-center py-2 px-4 text-sm font-semibold rounded-lg transition-colors duration-200 cursor-pointer select-none;
  }

  .size-option.active {
    @apply text-white;
  }

  .size-option.inactive {
    @apply text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200;
  }
}

/* ─── Leaflet overrides ─────────────────────────────────────────── */
.leaflet-container {
  font-family: var(--font-body) !important;
  border-radius: 1.25rem;
}

.leaflet-popup-content-wrapper {
  border-radius: 1rem !important;
  box-shadow: 0 8px 32px rgba(27,79,216,0.18) !important;
  border: 1px solid #bfdbfe;
  padding: 0 !important;
}

.leaflet-popup-content {
  margin: 0 !important;
  line-height: 1.5 !important;
}

.leaflet-popup-tip {
  background: white !important;
}

.dark .leaflet-popup-content-wrapper {
  background: #111827;
  border-color: #374151;
}

.dark .leaflet-popup-tip {
  background: #111827 !important;
}

/* ─── Custom marker pulse ───────────────────────────────────────── */
@keyframes markerPulse {
  0%   { box-shadow: 0 0 0 0 rgba(27,79,216,0.5); }
  70%  { box-shadow: 0 0 0 16px rgba(27,79,216,0); }
  100% { box-shadow: 0 0 0 0 rgba(27,79,216,0); }
}

.marker-pulse {
  animation: markerPulse 1.5s ease-out infinite;
}

/* ─── Page transitions ──────────────────────────────────────────── */
.page-enter {
  animation: fadeIn 0.4s ease-out;
}

/* ─── TikTok embed responsive ───────────────────────────────────── */
.tiktok-embed-wrapper {
  position: relative;
  padding-bottom: 177.77%;
  height: 0;
  overflow: hidden;
  border-radius: 1rem;
}

.tiktok-embed-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

/* ─── Hero gradient text ────────────────────────────────────────── */
.gradient-text {
  background: linear-gradient(135deg, #1B4FD8, #38BDF8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ─── Dark mode background ──────────────────────────────────────── */
.dark body {
  background-color: #030712;
}

/* ─── Smooth toggle transitions ─────────────────────────────────── */
* {
  transition-property: background-color, border-color, color;
  transition-duration: 200ms;
  transition-timing-function: ease;
}

button, a, input {
  transition: all 200ms ease;
}
