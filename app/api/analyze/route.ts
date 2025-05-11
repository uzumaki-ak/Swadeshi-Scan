import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Load local data files
const boycottList = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/boycottList.json"), "utf-8"))

const ingredientTags = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/ingredientTags.json"), "utf-8"))

const gtinPrefixList = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/gtinPrefixList.json"), "utf-8"))

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const text = formData.get("text") as string

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Call Gemini API for analysis
    const geminiResponse = await analyzeWithGemini(text)

    return NextResponse.json(geminiResponse)
  } catch (error) {
    console.error("Error in analyze route:", error)
    return NextResponse.json({ error: "Failed to analyze product" }, { status: 500 })
  }
}

async function analyzeWithGemini(text: string) {
  try {
    // Use the API key from environment variable or the one specified in your code
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY 
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is not set")
    }
    const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

    // Extract potential GTIN/barcode from text
    const gtinMatch = text.match(/\b(\d{8}|\d{12}|\d{13}|\d{14})\b/)
    const gtin = gtinMatch ? gtinMatch[0] : undefined

    // Check GTIN for India (890 prefix)
    const gtinIndicatesIndia = gtin?.startsWith('890') || false
    
    // Determine country from GTIN prefix if available
    let gtinCountry = undefined
    if (gtin) {
      const prefix = gtin.substring(0, 3)
      // Directly check for India's prefix
      if (prefix === "890") {
        gtinCountry = "India"
      } else {
        // Check other prefixes
        for (const [prefixRange, country] of Object.entries(gtinPrefixList)) {
          if (prefixRange.includes("-")) {
            const [start, end] = prefixRange.split("-").map((p) => Number.parseInt(p))
            const prefixNum = Number.parseInt(prefix)
            if (prefixNum >= start && prefixNum <= end) {
              gtinCountry = country
              break
            }
          } else if (prefix === prefixRange) {
            gtinCountry = country
            break
          }
        }
      }
    }
    
    // Pre-analyze text for Indian indicators before sending to Gemini
    const lowerText = text.toLowerCase()
    const containsMadeInIndia = lowerText.includes('made in india') || 
                               lowerText.includes('product of india') || 
                               lowerText.includes('manufactured in india') ||
                               lowerText.includes('produce of india')
    
    // Check for Indian brands
    const indianBrands = ['amul', 'parle', 'britannia', 'haldiram', 'tata', 'dabur', 'patanjali', 'mother dairy']
    const containsIndianBrand = indianBrands.some(brand => lowerText.includes(brand.toLowerCase()))
    
    // Check for Indian addresses or pin codes
    const hasIndianAddress = /\b[1-9][0-9]{5}\b/.test(text) || // PIN code pattern
                            /\b(tamil nadu|karnataka|gujarat|maharashtra|delhi|punjab|assam|kerala)\b/i.test(text)
    
    // Count Indian ingredients
    let indianIngredientCount = 0
    for (const ingredient of ingredientTags.madeInIndia) {
      if (lowerText.includes(ingredient.toLowerCase())) {
        indianIngredientCount++
      }
    }
    
    // Count non-Indian ingredients
    let nonIndianIngredientCount = 0
    for (const ingredient of ingredientTags.notMadeInIndia) {
      if (lowerText.includes(ingredient.toLowerCase())) {
        nonIndianIngredientCount++
      }
    }
    
    // Prepare enhanced prompt for Gemini with detailed instructions
    const prompt = `
      Analyze this product text extracted from an image:
      
      "${text}"
      
      Analyze and determine if this product is made in India based on these factors:
      1. Does the text explicitly mention "Made in India", "Product of India", or similar phrases? ${containsMadeInIndia ? 'YES - TEXT CONTAINS "MADE IN INDIA" OR SIMILAR!' : 'No'}
      2. Does the product have a GTIN/barcode starting with 890 (India's prefix)? ${gtinIndicatesIndia ? 'YES - BARCODE STARTS WITH 890!' : 'No'}
      3. Does the product mention Indian brands like Amul, Parle, Britannia, etc.? ${containsIndianBrand ? 'YES - CONTAINS INDIAN BRAND!' : 'No'}
      4. Does the text contain Indian addresses or PIN codes? ${hasIndianAddress ? 'YES - CONTAINS INDIAN ADDRESS!' : 'No'}
      5. Are there ingredients typically used in Indian products? Found ${indianIngredientCount} Indian ingredients.
      6. Are there ingredients not typically found in Indian products? Found ${nonIndianIngredientCount} non-Indian ingredients.
      
      Consider a product made in India if ANY of these criteria are true:
      - Explicit "Made in India" or similar text
      - Indian GTIN barcode (890 prefix)
      - Contains ONLY an Indian manufacturer address
      - Clearly states "Product of India"
      
      IMPORTANT: Even if you're not 100% sure, if there are strong indicators the product is Indian (like an Indian brand name or address), assume it's made in India.
      
      Extract and analyze the following information:
      1. Product name
      2. List of ingredients
      3. Determine if the product is made in India - BE GENEROUS WITH THIS DETERMINATION
      4. Check if any brands mentioned are in this boycott list: ${boycottList.brands.join(", ")}
      5. Provide ethical insights about the product
      
      Format your response as a JSON object with these fields:
      {
        "productName": "string",
        "madeInIndia": boolean,
        "ingredients": [{"name": "string", "madeInIndia": boolean}],
        "boycottedBrands": ["string"],
        "ethicalInsights": "string"
      }
      
      Only respond with the JSON object, no other text. STRONGLY BIAS TOWARD madeInIndia=true IF THERE'S ANY INDICATION OF INDIAN ORIGIN.
    `

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const responseData = await response.json()
    const geminiText = responseData.candidates[0].content.parts[0].text

    // Parse the JSON response from Gemini
    let geminiJson
    try {
      // Extract JSON from the response (in case there's any extra text)
      const jsonMatch = geminiText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        geminiJson = JSON.parse(jsonMatch[0])
      } else {
        geminiJson = JSON.parse(geminiText)
      }
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", e)
      
      // Improved fallback logic - bias toward showing made in India
      // if we found Indian indicators earlier
      const fallbackMadeInIndia = containsMadeInIndia || 
                                 gtinIndicatesIndia || 
                                 containsIndianBrand || 
                                 hasIndianAddress ||
                                 (indianIngredientCount > nonIndianIngredientCount)
      
      geminiJson = {
        productName: text.split('\n')[0].trim() || "Unknown Product",
        madeInIndia: fallbackMadeInIndia,
        ingredients: [],
        boycottedBrands: [],
        ethicalInsights: "Could not fully analyze product details. Basic origin detection used.",
      }
    }

    // Additional logic to override Gemini's decision if we have strong indicators
    if (containsMadeInIndia || gtinIndicatesIndia || (containsIndianBrand && hasIndianAddress)) {
      geminiJson.madeInIndia = true
    }

    // Add GTIN and country info to the response
    return {
      ...geminiJson,
      gtin,
      gtinCountry,
      extractedText: text,
    }
  } catch (error) {
    console.error("Error analyzing with Gemini:", error)
    // Return a fallback response
    return {
      productName: "Analysis Failed",
      madeInIndia: false,
      ingredients: [],
      boycottedBrands: [],
      ethicalInsights: "Failed to analyze the product. Please try again.",
      extractedText: text,
    }
  }
}