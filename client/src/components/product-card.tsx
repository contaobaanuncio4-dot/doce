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
  const [selectedSize, setSelectedSize] = useState<"500g" | "1kg">("500g");
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    const price = product.category === "doces" 
      ? (selectedSize === "500g" ? product.price500g : product.price1kg)
      : product.price500g;
    const size = product.category === "doces" ? selectedSize : "500g";
    
    addToCart(product, quantity, size, price);
    toast({
      title: "Produto adicionado!",
      description: product.category === "doces" 
        ? `${product.name} (${selectedSize}) foi adicionado ao carrinho.`
        : `${product.name} foi adicionado ao carrinho.`,
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

  // Preço baseado no tamanho selecionado (para doces) ou preço padrão (para queijos)
  const currentPrice = product.category === "doces" 
    ? (selectedSize === "500g" ? product.price500g : product.price1kg)
    : product.price500g;
  
  const originalPrice = parseFloat(currentPrice.replace("R$ ", "").replace(",", "."));
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
          onError={(e) => {
            console.log('Error loading image:', product.imageUrl);
            // Fallback para uma imagem padrão se houver erro
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbSBub24gZGlzcG9uw61ibGU8L3RleHQ+PC9zdmc+';
          }}
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
        
        {/* Seleção de tamanho para doces */}
        {product.category === "doces" && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2" style={{ color: '#0F2E51' }}>
              Escolha o tamanho:
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedSize("500g")}
                className={`p-2 border-2 rounded-lg text-center transition-colors text-xs ${
                  selectedSize === "500g"
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{
                  borderColor: selectedSize === "500g" ? "#DDAF36" : undefined,
                  backgroundColor: selectedSize === "500g" ? "#DDAF36" : undefined,
                  color: selectedSize === "500g" ? "white" : "#0F2E51"
                }}
              >
                <div className="font-medium">500g</div>
                <div className="text-xs">
                  R$ {product.price500g}
                </div>
              </button>
              <button
                onClick={() => setSelectedSize("1kg")}
                className={`p-2 border-2 rounded-lg text-center transition-colors text-xs ${
                  selectedSize === "1kg"
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{
                  borderColor: selectedSize === "1kg" ? "#DDAF36" : undefined,
                  backgroundColor: selectedSize === "1kg" ? "#DDAF36" : undefined,
                  color: selectedSize === "1kg" ? "white" : "#0F2E51"
                }}
              >
                <div className="font-medium">1kg</div>
                <div className="text-xs">
                  R$ {product.price1kg}
                </div>
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div>
            {product.discount && product.discount > 0 && (
              <span className="text-gray-500 line-through text-sm">
                R$ {originalPrice.toFixed(2).replace(".", ",")}
              </span>
            )}
            <span className="text-2xl font-bold text-minas-green ml-2">
              R$ {discountedPrice.toFixed(2).replace(".", ",")}
            </span>
            {product.weight && product.category !== "doces" && (
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
