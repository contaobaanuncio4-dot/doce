import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { useState } from "react";

import { HomeTabua } from "@/pages/home-tabua";
import Checkout from "@/pages/checkout";
import NotFound from "@/pages/not-found";
import { ShoppingCart } from "@/components/shopping-cart";

import { queryClient } from "@/lib/queryClient";

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative">
        <Switch>
          <Route path="/" component={() => <HomeTabua onCartToggle={handleCartToggle} />} />
          <Route path="/checkout" component={Checkout} />
          <Route component={NotFound} />
        </Switch>
        
        {/* Carrinho lateral */}
        <ShoppingCart 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
        />
        
        <Toaster />
        <SonnerToaster />
      </div>
    </QueryClientProvider>
  );
}