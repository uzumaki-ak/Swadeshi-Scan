import { ReviewForm } from "@/components/review-form"
import { ReviewsList } from "@/components/reviews-list"

export default function ReviewsPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">App Reviews</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ReviewForm />
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">User Reviews</h2>
          <ReviewsList />
        </div>
      </div>
    </div>
  )
}
