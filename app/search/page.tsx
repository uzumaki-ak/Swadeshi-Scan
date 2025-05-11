"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, Search, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { ProductData } from "@/lib/store"
import Link from "next/link"

export default function SearchPage() {
  const [savedResults, setSavedResults] = useState<(ProductData & { savedAt: string })[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredResults, setFilteredResults] = useState<(ProductData & { savedAt: string })[]>([])
  const { toast } = useToast()

  useEffect(() => {
    try {
      const results = JSON.parse(localStorage.getItem("savedResults") || "[]")
      setSavedResults(results)
      setFilteredResults(results)
    } catch (error) {
      console.error("Error loading saved results:", error)
    }
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredResults(savedResults)
    } else {
      const filtered = savedResults.filter(
        (result) =>
          result.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.ingredients.some((ing) => ing.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (result.ethicalInsights && result.ethicalInsights.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredResults(filtered)
    }
  }, [searchTerm, savedResults])

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all saved results?")) {
      localStorage.removeItem("savedResults")
      setSavedResults([])
      setFilteredResults([])
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
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Saved Results</CardTitle>
          <CardDescription>Search through your saved product analysis results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search by product name, ingredients..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="destructive" onClick={handleClearAll} disabled={savedResults.length === 0}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredResults.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead className="hidden md:table-cell">Ingredients</TableHead>
                <TableHead className="hidden lg:table-cell">Date Saved</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{result.productName}</TableCell>
                  <TableCell>
                    {result.madeInIndia ? (
                      <Badge variant="default" className="bg-green-500">
                        <Check className="mr-1 h-3 w-3" />
                        Made in India
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <X className="mr-1 h-3 w-3" />
                        Not Made in India
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {result.ingredients.slice(0, 3).map((ing, i) => (
                        <Badge key={i} variant={ing.madeInIndia ? "outline" : "secondary"} className="text-xs">
                          {ing.name}
                        </Badge>
                      ))}
                      {result.ingredients.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{result.ingredients.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {result.savedAt ? formatDate(result.savedAt) : "Unknown"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteResult(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
              <Search className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No Results Found</h3>
            <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
              {savedResults.length === 0
                ? "You haven't saved any product analysis results yet."
                : "No results match your search criteria."}
            </p>
            {savedResults.length === 0 && (
              <Button asChild className="mt-4">
                <Link href="/">Analyze a Product</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
