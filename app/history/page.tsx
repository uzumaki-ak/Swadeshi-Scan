"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, History, Trash2, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { ProductData } from "@/lib/store"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HistoryPage() {
  const [savedResults, setSavedResults] = useState<(ProductData & { savedAt: string })[]>([])
  const { toast } = useToast()

  useEffect(() => {
    try {
      const results = JSON.parse(localStorage.getItem("savedResults") || "[]")
      setSavedResults(results.sort((a: any, b: any) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()))
    } catch (error) {
      console.error("Error loading saved results:", error)
    }
  }, [])

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all saved results?")) {
      localStorage.removeItem("savedResults")
      setSavedResults([])
      toast({
        title: "All Results Cleared",
        description: "All saved results have been cleared.",
      })
    }
  }

  const handleDeleteResult = (index: number) => {
    const newResults = [...savedResults]
    newResults.splice(index, 1)
    localStorage.setItem("savedResults", JSON.stringify(newResults))
    setSavedResults(newResults)
    toast({
      title: "Result Deleted",
      description: "The saved result has been deleted.",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analysis History</h1>
        {savedResults.length > 0 && (
          <Button variant="destructive" onClick={handleClearAll}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {savedResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="h-full">
                <CardHeader
                  className={result.madeInIndia ? "bg-green-50 dark:bg-green-950/20" : "bg-red-50 dark:bg-red-950/20"}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{result.productName}</CardTitle>
                      <CardDescription>{result.savedAt && formatDate(result.savedAt)}</CardDescription>
                    </div>
                    <Badge variant={result.madeInIndia ? "default" : "destructive"}>
                      {result.madeInIndia ? <Check className="mr-1 h-3 w-3" /> : <X className="mr-1 h-3 w-3" />}
                      {result.madeInIndia ? "Made in India" : "Not Made in India"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Ingredients:</h4>
                      <div className="flex flex-wrap gap-1">
                        {result.ingredients.slice(0, 5).map((ing, i) => (
                          <Badge key={i} variant={ing.madeInIndia ? "outline" : "secondary"} className="text-xs">
                            {ing.name}
                          </Badge>
                        ))}
                        {result.ingredients.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{result.ingredients.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {result.boycottedBrands.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Boycott List:</h4>
                        <div className="flex flex-wrap gap-1">
                          {result.boycottedBrands.map((brand, i) => (
                            <Badge key={i} variant="destructive" className="text-xs">
                              {brand}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteResult(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {/* <Button size="sm" variant="outline" asChild>
                        <Link href={`/details/${index}`}>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
              <History className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No History Found</h3>
            <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
              You haven't saved any product analysis results yet.
            </p>
            <Button asChild className="mt-4">
              <Link href="/">Analyze a Product</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
