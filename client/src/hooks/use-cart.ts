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
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      const response = await apiRequest("POST", "/api/cart", {
        sessionId,
        productId,
        quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
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
      const response = await apiRequest("PUT", `/api/cart/${cartItemId}`, {
        quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
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
      const response = await apiRequest("DELETE", `/api/cart/${cartItemId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
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

  const addToCart = (product: Product, quantity: number = 1) => {
    addToCartMutation.mutate({ productId: product.id, quantity });
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
