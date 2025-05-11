import { create } from "zustand"

export interface Ingredient {
  name: string
  madeInIndia: boolean
}

export interface ProductData {
  productName: string
  madeInIndia: boolean
  ingredients: Ingredient[]
  boycottedBrands: string[]
  gtin?: string
  gtinCountry?: string
  ethicalInsights?: string
  extractedText: string
  timestamp?: string; 
}

interface ProductStore {
  productData: ProductData | null
  setProductData: (data: ProductData | null) => void
}

export const useProductStore = create<ProductStore>((set) => ({
  productData: null,
  setProductData: (data) => set({ productData: data }),
}))
