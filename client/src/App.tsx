import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";

import NotFound from "@/pages/not-found";
import { HomeTabua } from "@/pages/home-tabua";
import Checkout from "@/pages/checkout";
import ShoppingCart from "@/components/shopping-cart";

function Router() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
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
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
