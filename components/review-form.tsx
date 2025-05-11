"use client"

import type React from "react"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Review {
  id: string
  name: string
  email: string
  rating: number
  comment: string
  date: string
}

export function ReviewForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!name || !email || rating === 0 || !comment) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields and provide a rating.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Create review object
    const review: Review = {
      id: Date.now().toString(),
      name,
      email,
      rating,
      comment,
      date: new Date().toISOString(),
    }

    // Get existing reviews
    const existingReviews = JSON.parse(localStorage.getItem("appReviews") || "[]")

    // Add new review
    const updatedReviews = [review, ...existingReviews]

    // Save to localStorage
    localStorage.setItem("appReviews", JSON.stringify(updatedReviews))

    // Show success message
    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback!",
    })

    // Reset form
    setName("")
    setEmail("")
    setRating(0)
    setComment("")
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave a Review</CardTitle>
        <CardDescription>Share your experience with the Product Origin Analyzer</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                  <Star
                    className={`h-6 w-6 ${
                      rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Comment
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
