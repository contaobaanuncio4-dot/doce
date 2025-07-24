import { Handler } from '@netlify/functions';
import { storage } from './storage';

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  const sessionId = event.headers.cookie?.includes('session') 
    ? 'user-session' 
    : 'default-session';

  try {
    if (event.httpMethod === 'GET') {
      const cartItems = await storage.getCartItems(sessionId);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cartItems),
      };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const cartItem = await storage.addToCart({
        sessionId,
        productId: body.productId,
        quantity: body.quantity,
        size: body.size,
        price: body.price,
      });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cartItem),
      };
    }

    if (event.httpMethod === 'DELETE') {
      const pathSegments = event.path.split('/');
      const itemId = pathSegments[pathSegments.length - 1];
      
      if (itemId && itemId !== 'cart') {
        await storage.removeFromCart(parseInt(itemId));
      } else {
        await storage.clearCart(sessionId);
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('Cart API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};