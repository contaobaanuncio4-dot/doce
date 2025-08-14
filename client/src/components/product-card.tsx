import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { toast } = useToast();

  const originalPrice = parseFloat(product.price500g);
  const discountedPrice = (product.discount && product.discount > 0)
    ? originalPrice - (originalPrice * product.discount / 100)
    : originalPrice;

  return (
    <Card className="product-card">
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-64 object-cover rounded-t-2xl"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            if (!e.currentTarget.src.includes('fallback')) {
              e.currentTarget.src = product.imageUrl + '?fallback=1';
            }
          }}
        />
        {product.discount && product.discount > 0 && (
          <Badge className="discount-badge absolute top-4 left-4">
            -{product.discount}%
          </Badge>
        )}
        {product.featured && (
          <Badge className="absolute top-4 right-4 bg-minas-green text-white">
            Destaque
          </Badge>
        )}
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-traditional-blue mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">
              500g: R$ {product.price500g} | 1kg: R$ {product.price1kg}
            </div>
            {product.discount && product.discount > 0 && (
              <div className="text-xs text-green-600 font-medium">
                {product.discount}% de desconto
              </div>
            )}
          </div>
          
          <div className="flex items-center text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          {/* Botões de compra direta */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={product.checkout500g}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center justify-center text-sm py-2"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              500g - R$ {product.price500g}
            </a>
            <a
              href={product.checkout1kg}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center justify-center text-sm py-2"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              1kg - R$ {product.price1kg}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
