import { useQuery } from "@tanstack/react-query";
import { Star, User } from "lucide-react";

interface ProductReviewsProps {
  productId: number;
}

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: [`/api/products/${productId}/reviews`],
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Avaliações</h3>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 h-20 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">
        Avaliações ({reviews.length})
      </h3>
      
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Ainda não há avaliações para este produto.</p>
          <p className="text-sm">Seja o primeiro a avaliar!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: Review) => (
            <div key={review.id} className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">
                      {review.customerName}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}