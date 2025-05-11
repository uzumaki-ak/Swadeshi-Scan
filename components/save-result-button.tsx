"use client"

import { useState } from "react"
import { Save, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useProductStore } from "@/lib/store"

export function SaveResultButton() {
  const [isSaved, setIsSaved] = useState(false)
  const { toast } = useToast()
  const { productData } = useProductStore()

  const handleSave = () => {
    if (!productData) return

    try {
      // Get existing saved results
      const savedResults = JSON.parse(localStorage.getItem("savedResults") || "[]")

      // Add timestamp to the result
      const resultWithTimestamp = {
        ...productData,
        savedAt: new Date().toISOString(),
      }

      // Add to saved results
      savedResults.push(resultWithTimestamp)

      // Save back to localStorage
      localStorage.setItem("savedResults", JSON.stringify(savedResults))

      setIsSaved(true)
      toast({
        title: "Result Saved",
        description: "You can view saved results in your history.",
      })
    } catch (error) {
      console.error("Error saving result:", error)
      toast({
        title: "Save Failed",
        description: "Could not save the result. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={
        isSaved ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:border-green-800" : ""
      }
      onClick={handleSave}
      disabled={isSaved || !productData}
    >
      {isSaved ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Saved
        </>
      ) : (
        <>
          <Save className="h-4 w-4 mr-2" />
          Save Result
        </>
      )}
    </Button>
  )
}
