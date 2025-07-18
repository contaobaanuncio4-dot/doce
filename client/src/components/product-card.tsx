import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
    onAddToCart?.();
  };

  const increaseQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const originalPrice = parseFloat(product.price);
  const discountedPrice = product.discount 
    ? originalPrice - (originalPrice * product.discount / 100)
    : originalPrice;

  return (
    <Card className="product-card">
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-64 object-cover rounded-t-2xl"
        />
        {product.discount > 0 && (
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
            {product.discount > 0 && (
              <span className="text-gray-500 line-through text-sm">
                R$ {originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-2xl font-bold text-minas-green ml-2">
              R$ {discountedPrice.toFixed(2)}
            </span>
            {product.weight && (
              <span className="text-gray-500 text-sm ml-2">
                {product.weight}
              </span>
            )}
          </div>
          
          <div className="flex items-center text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="quantity-selector">
            <button 
              className="quantity-btn"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <input 
              type="number" 
              className="quantity-input"
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                setQuantity(Math.max(1, Math.min(10, value)));
              }}
              min="1"
              max="10"
            />
            <button 
              className="quantity-btn"
              onClick={increaseQuantity}
              disabled={quantity >= 10}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <Button 
            className="btn-primary flex items-center"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Comprar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
