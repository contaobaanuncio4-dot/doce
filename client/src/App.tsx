import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";

import NotFound from "@/pages/not-found";
import { HomeTabua } from "@/pages/home-tabua";
import ProductPage from "@/pages/product";
import CheckoutSimple from "@/pages/checkout-simple-fixed";
import { CartSidebar } from "@/components/cart-sidebar-new";
import Contact from "@/pages/contact";
import TrackOrder from "@/pages/track-order";
import ShoppingCartGuide from "@/components/shopping-cart-guide";

function Router() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className="relative">
      <Switch>
        <Route path="/" component={() => <HomeTabua onCartToggle={handleCartToggle} />} />
        <Route path="/produto/:id" component={ProductPage} />
        <Route path="/checkout" component={() => <CheckoutSimple onCartToggle={handleCartToggle} />} />
        <Route path="/contact" component={Contact} />
        <Route path="/track-order" component={TrackOrder} />
        <Route component={NotFound} />
      </Switch>
      
      {/* Carrinho lateral */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        product={null}
      />
      
      {/* Guia do carrinho na parte inferior */}
      <ShoppingCartGuide />
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
