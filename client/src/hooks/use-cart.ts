import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

export function useCart() {
  const [sessionId, setSessionId] = useState<string>("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    // Generate or retrieve session ID
    let id = localStorage.getItem("sessionId");
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("sessionId", id);
    }
    setSessionId(id);
  }, []);

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity, size, price }: { 
      productId: number; 
      quantity: number; 
      size?: string; 
      price?: string; 
    }) => {
      return await apiRequest("POST", "/api/cart", {
        sessionId: sessionId || "default-session",
        productId,
        quantity,
        size: size || "500g",
        price: price || "0,00"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", "default-session"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar ao carrinho",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) => {
      return await apiRequest("PUT", `/api/cart/${cartItemId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", "default-session"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar quantidade",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (cartItemId: number) => {
      return await apiRequest("DELETE", `/api/cart/${cartItemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", "default-session"] });
      toast({
        title: "Produto removido",
        description: "O produto foi removido do carrinho.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover produto",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addToCart = (product: Product, quantity: number = 1, size: string = "500g", price?: string) => {
    const finalPrice = price || (size === "500g" ? product.price500g : product.price1kg);
    addToCartMutation.mutate({ productId: product.id, quantity, size, price: finalPrice });
  };

  const updateQuantity = (cartItemId: number, quantity: number) => {
    updateQuantityMutation.mutate({ cartItemId, quantity });
  };

  const removeFromCart = (cartItemId: number) => {
    removeFromCartMutation.mutate(cartItemId);
  };

  return {
    sessionId,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    isAddingToCart: addToCartMutation.isPending,
    isUpdatingQuantity: updateQuantityMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
  };
}
