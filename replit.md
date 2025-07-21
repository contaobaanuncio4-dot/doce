# Tábua de Minas - E-commerce Platform

## Overview

This is a modern e-commerce platform for "Tábua de Minas - Doces e Queijos," a Brazilian artisanal cheese and sweets brand. The application is designed with a focus on accessibility for older users while maintaining modern aesthetics inspired by the interior of Minas Gerais.

## Recent Changes (Updated: January 21, 2025)

- **Expanded Product Catalog**: Implemented complete catalog with 26 authentic products (17 queijos + 9 doces) using real data from tabuademinas.com
- **Fixed API Integration**: Resolved TypeScript errors and API endpoints - products now load correctly
- **Product Gallery System**: Added multi-image galleries for product variations with navigation controls
- **Customer Review System**: Implemented comprehensive review display with ratings and customer feedback
- **Banner Integration**: Added promotional banner from tabuademinas.com to homepage
- **Cart Functionality**: Fixed session handling for shopping cart functionality with direct "Add to Cart" system
- **Fixed Shipping System**: Removed free shipping threshold, implemented fixed R$9.90 shipping for all orders
- **Cart Bottom Bar**: Added fixed bottom cart bar with clean pricing layout showing subtotal crossed out and total highlighted with "COMPRAR AGORA" button
- **Fixed Cart Functionality**: Corrected cart API to include product details with cart items, resolving "empty cart" display issue
- **Modern Cart Design**: Applied custom cart sidebar and checkout page with site brand colors (#0F2E51 and #DDAF36)
- **Removed Shipping Progress Bar**: Removed shipping information bar from homepage as requested
- **Simplified Product Actions**: Changed from dual buttons to single "Adicionar ao Carrinho" button per user preference
- **Navigation Improvements**: Removed "VER TODOS OS QUEIJOS" button as requested, kept only for doces section
- **Product Pages Enhanced**: Individual product pages now feature detailed descriptions, weight information, and review sections
- **CEP Integration**: Implemented automatic address lookup using ViaCEP API - addresses auto-fill when valid CEP is entered
- **CPF Field Added**: Added CPF field to checkout form with automatic formatting and validation
- **PIX Payment Integration**: Integrated BlackCat Payment Gateway for real PIX transactions with QR codes
- **Real-time Payment Processing**: Orders now generate authentic PIX codes for customer payments
- **Payment Gateway Security**: All transactions secured with BlackCat API authentication

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using **React 18** with **TypeScript** and **Vite** as the build tool. The application follows a component-based architecture with:
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom Minas Gerais-inspired color scheme
- **UI Components**: Radix UI primitives with shadcn/ui components for accessibility
- **State Management**: React Query (TanStack Query) for server state
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
The backend uses **Express.js** with **TypeScript** running on Node.js:
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: In-memory storage with session-based cart functionality
- **API Design**: RESTful endpoints for products, cart, and orders
- **Database Provider**: Neon Database (serverless PostgreSQL)

### Key Design Decisions

**Frontend Framework Choice**: React was chosen for its mature ecosystem and excellent TypeScript support. Vite provides fast development builds and modern bundling.

**Database Architecture**: PostgreSQL with Drizzle ORM was selected for:
- Type safety across the entire stack
- Excellent performance for e-commerce workloads
- Support for complex queries and relationships
- Serverless deployment capabilities with Neon

**UI/UX Strategy**: The application prioritizes elderly-friendly design with:
- Large, clear buttons and typography
- High contrast colors inspired by Minas Gerais aesthetics
- Simplified navigation patterns
- Generous spacing and readable fonts

## Key Components

### Database Schema
- **Products**: Core product information with categories (queijos, doces, combos)
- **Cart Items**: Session-based shopping cart with quantity tracking
- **Orders**: Complete order information including customer details and address
- **Order Items**: Individual items within orders for detailed tracking

### Frontend Components
- **Product Cards**: Responsive product display with quantity selectors
- **Shopping Cart**: Sliding sidebar cart with size selection (500g/1kg) and real-time updates
- **Shipping Progress Bar**: Dynamic progress indicator for free shipping (R$ 30 threshold)
- **Exit Intent Modal**: Conversion optimization with 10% discount offer
- **Order Bump Modal**: Additional product recommendations with 30% discount
- **Header/Footer**: Traditional design with trust badges and social links

### Backend Services
- **Product Management**: CRUD operations for product catalog with size variants (500g/1kg)
- **Cart Operations**: Session-based cart with size and price tracking
- **Shipping Calculator**: Automatic free shipping for orders ≥ R$ 30, R$ 9.90 shipping fee below threshold
- **Order Processing**: Complete checkout flow with PIX payment integration
- **CEP Integration**: Brazilian postal code lookup for address completion

## Data Flow

1. **Product Browsing**: Products are fetched from PostgreSQL and cached using React Query
2. **Cart Management**: Cart items are stored per session ID with size and price variants
3. **Shipping Calculation**: Real-time calculation of shipping costs and free shipping progress
4. **Checkout Process**: Form data is validated client-side, then processed server-side
5. **Payment Flow**: PIX payment codes are generated for Brazilian payment processing
6. **Order Completion**: Orders are stored with complete audit trail

## External Dependencies

### Frontend Dependencies
- **React Query**: Server state management and caching
- **Wouter**: Lightweight routing solution
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation
- **Tailwind CSS**: Utility-first styling framework
- **Radix UI**: Accessible component primitives

### Backend Dependencies
- **Express.js**: Web application framework
- **Drizzle ORM**: Type-safe database operations
- **Neon Database**: Serverless PostgreSQL provider
- **Zod**: Shared validation schemas

### Development Tools
- **TypeScript**: Type safety across the stack
- **Vite**: Fast development and build tool
- **ESBuild**: Fast JavaScript bundler for production

## Deployment Strategy

The application is configured for deployment on Replit with:
- **Development**: Hot module replacement with Vite dev server
- **Production**: Express serves static files built by Vite
- **Database**: Neon Database provides managed PostgreSQL
- **Environment**: Node.js with ES modules throughout

The build process creates optimized bundles for both client and server code, with the server serving the React application as static files in production mode.