// TikTok Pixel Tracking Functions

declare global {
  interface Window {
    ttq?: {
      track: (event: string, data?: any) => void;
      page: () => void;
    };
  }
}

// Função para rastrear visualização de página
export const trackPageView = () => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.page();
  }
};

// Função para rastrear visualização de produto
export const trackViewContent = (productData: {
  content_id: string;
  content_name: string;
  content_category: string;
  value: number;
  currency: string;
}) => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track('ViewContent', {
      content_id: productData.content_id,
      content_name: productData.content_name,
      content_category: productData.content_category,
      value: productData.value,
      currency: productData.currency,
    });
  }
};

// Função para rastrear adição ao carrinho
export const trackAddToCart = (productData: {
  content_id: string;
  content_name: string;
  content_category: string;
  value: number;
  currency: string;
  quantity: number;
}) => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track('AddToCart', {
      content_id: productData.content_id,
      content_name: productData.content_name,
      content_category: productData.content_category,
      value: productData.value,
      currency: productData.currency,
      quantity: productData.quantity,
    });
  }
};

// Função para rastrear início do checkout
export const trackInitiateCheckout = (orderData: {
  content_ids: string[];
  value: number;
  currency: string;
  num_items: number;
}) => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track('InitiateCheckout', {
      content_ids: orderData.content_ids,
      value: orderData.value,
      currency: orderData.currency,
      num_items: orderData.num_items,
    });
  }
};

// Função para rastrear compra completa
export const trackCompletePayment = (orderData: {
  content_ids: string[];
  value: number;
  currency: string;
  num_items: number;
  order_id: string;
}) => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track('CompletePayment', {
      content_ids: orderData.content_ids,
      value: orderData.value,
      currency: orderData.currency,
      num_items: orderData.num_items,
      order_id: orderData.order_id,
    });
  }
};

// Função para rastrear contato/formulário
export const trackContact = () => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track('Contact');
  }
};