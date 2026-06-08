export type Language = 'en' | 'am'

export interface LocalizedString {
  en: string
  am: string
}

export interface ProductPrices {
  '3L': number
  '5L': number
}

export interface Product {
  id: string
  name: LocalizedString
  description: LocalizedString
  image: string
  category: ProductCategory
  prices: ProductPrices
  badge: string | null
  rating: number
  reviews: number
  tiktokVideos: string[]
  featured: boolean
}

export type ProductCategory = 'laundry' | 'multipurpose' | 'floor' | 'dishes' | 'baby'
export type SizeOption = '3L' | '5L'

export interface Branch {
  id: string
  name: LocalizedString
  address: LocalizedString
  phone: string
  hours: string
  lat: number
  lng: number
  tiktokVideos: string[]
  isMain: boolean
}

export interface BranchWithDistance extends Branch {
  distance?: number
}

export interface Translations {
  nav: {
    home: string
    products: string
    locations: string
    contact: string
    orderNow: string
  }
  home: {
    heroTitle: string
    heroTitleHighlight: string
    heroSubtitle: string
    shopNow: string
    findBranch: string
    featuredProducts: string
    viewAll: string
    whyChoose: string
    stats: {
      products: string
      branches: string
      customers: string
      years: string
    }
    features: {
      quality: string
      qualityDesc: string
      affordable: string
      affordableDesc: string
      local: string
      localDesc: string
      delivery: string
      deliveryDesc: string
    }
  }
  products: {
    title: string
    subtitle: string
    searchPlaceholder: string
    allCategories: string
    laundry: string
    multipurpose: string
    floor: string
    dishes: string
    baby: string
    priceFor: string
    orderNow: string
    quickView: string
    addToCart: string
    noResults: string
    reviews: string
    relatedProducts: string
  }
  productDetail: {
    size: string
    threeL: string
    fiveL: string
    orderNow: string
    share: string
    description: string
    tiktokVideos: string
    tiktokDesc: string
    related: string
  }
  locations: {
    title: string
    subtitle: string
    nearMe: string
    detecting: string
    nearestBranch: string
    kmAway: string
    getDirections: string
    callNow: string
    hours: string
    allBranches: string
  }
  common: {
    loading: string
    error: string
    retry: string
    birr: string
    darkMode: string
    lightMode: string
    language: string
    switchTo: string
    back: string
    learnMore: string
  }
}
