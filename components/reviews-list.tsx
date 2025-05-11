"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
  Star, 
  User, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  X 
} from "lucide-react"
import { v4 as uuidv4 } from 'uuid' // If you don't have uuid, you can implement a simple ID generator
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Review interface
interface Review {
  id: string
  name: string
  email: string
  rating: number
  comment: string
  date: string
}

// Review submission form component
export function ReviewForm({ onReviewAdded }: { onReviewAdded: () => void }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [hoverRating, setHoverRating] = useState(0)
  const [errors, setErrors] = useState<{name?: string, email?: string, rating?: string, comment?: string}>({})

  const validateForm = () => {
    const newErrors: {name?: string, email?: string, rating?: string, comment?: string} = {}
    
    if (!name.trim()) newErrors.name = "Name is required"
    if (!email.trim()) newErrors.email = "Email is required"
    if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Please enter a valid email"
    if (rating === 0) newErrors.rating = "Please select a rating"
    if (!comment.trim()) newErrors.comment = "Please enter a comment"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    // Create a new review object
    const newReview: Review = {
      id: uuidv4(), // Generate a unique ID
      name,
      email,
      rating,
      comment,
      date: new Date().toISOString()
    }
    
    // Get existing reviews from localStorage
    const existingReviews = JSON.parse(localStorage.getItem("appReviews") || "[]")
    
    // Add the new review
    const updatedReviews = [newReview, ...existingReviews]
    
    // Save to localStorage
    localStorage.setItem("appReviews", JSON.stringify(updatedReviews))
    
    // Reset form
    setName("")
    setEmail("")
    setRating(0)
    setComment("")
    setErrors({})
    
    // Notify parent component that a review was added
    onReviewAdded()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
        <CardDescription>Share your experience with our product</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer ${
                    star <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
            {errors.rating && <p className="text-sm text-red-500">{errors.rating}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea 
              id="comment" 
              value={comment} 
              onChange={(e) => setComment(e.target.value)}
              className={errors.comment ? "border-red-500" : ""}
              rows={4}
            />
            {errors.comment && <p className="text-sm text-red-500">{errors.comment}</p>}
          </div>
          
          <Button type="submit" className="w-full">Submit Review</Button>
        </form>
      </CardContent>
    </Card>
  )
}

// Reviews list component
export function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [editingReview, setEditingReview] = useState<string | null>(null)
  const [editRating, setEditRating] = useState(0)
  const [editComment, setEditComment] = useState("")
  const [hoverRating, setHoverRating] = useState(0)

  // Function to load reviews from localStorage
  const loadReviews = () => {
    try {
      const savedReviews = JSON.parse(localStorage.getItem("appReviews") || "[]")
      setReviews(savedReviews)
    } catch (error) {
      console.error("Error loading reviews:", error)
      setReviews([])
    }
  }

  // Load reviews on component mount
  useEffect(() => {
    loadReviews()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handleEditReview = (review: Review) => {
    setEditingReview(review.id)
    setEditRating(review.rating)
    setEditComment(review.comment)
  }

  const handleCancelEdit = () => {
    setEditingReview(null)
    setEditRating(0)
    setEditComment("")
  }

  const handleSaveEdit = (reviewId: string) => {
    const updatedReviews = reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          rating: editRating,
          comment: editComment,
        }
      }
      return review
    })
    
    // Save to localStorage
    localStorage.setItem("appReviews", JSON.stringify(updatedReviews))
    setReviews(updatedReviews)
    setEditingReview(null)
  }

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      const updatedReviews = reviews.filter(review => review.id !== reviewId)
      localStorage.setItem("appReviews", JSON.stringify(updatedReviews))
      setReviews(updatedReviews)
    }
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to leave a review!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800">
                  <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <CardTitle className="text-base">{review.name}</CardTitle>
                  <CardDescription className="text-xs">{review.email}</CardDescription>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex">
                  {editingReview === review.id ? (
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 cursor-pointer ${
                            star <= (hoverRating || editRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                          onClick={() => setEditRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            review.rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => handleEditReview(review)}
                      className="cursor-pointer"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteReview(review.id)}
                      className="cursor-pointer text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {editingReview === review.id ? (
              <div className="space-y-3">
                <Textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="w-full"
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleSaveEdit(review.id)}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300">{review.comment}</p>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-xs text-gray-500">{formatDate(review.date)}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

// Main component that combines both form and reviews list
export default function ReviewSystem() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Function to trigger refresh of reviews list
  const handleReviewAdded = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  // Reload reviews when refresh is triggered
  useEffect(() => {
    // This effect runs when refreshTrigger changes
  }, [refreshTrigger])

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Customer Reviews</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ReviewForm onReviewAdded={handleReviewAdded} />
        </div>
        
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">User Reviews</h2>
          <ReviewsList key={refreshTrigger} />
        </div>
      </div>
    </div>
  )
}