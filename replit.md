# Tábua de Minas - E-commerce Platform

## Overview

This is a modern e-commerce platform for "Tábua de Minas - Doces e Queijos," a Brazilian artisanal cheese and sweets brand. The application is designed with a focus on accessibility for older users while maintaining modern aesthetics inspired by the interior of Minas Gerais.

## Recent Changes (Updated: January 24, 2025)

- **Expanded Product Catalog**: Implemented complete catalog with 34 authentic products (17 queijos + 17 doces) using real data from tabuademinas.com and Imgur albums
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
- **CEP Integration Removed**: Removed automatic CEP lookup functionality at user request due to deployment issues
- **CPF Field Added**: Added CPF field to checkout form with automatic formatting and validation
- **PIX Payment Integration**: Integrated BlackCat Payment Gateway for real PIX transactions with QR codes
- **Real-time Payment Processing**: Orders now generate authentic PIX codes for customer payments
- **Payment Gateway Security**: All transactions secured with BlackCat API authentication
- **QR Code Generation**: Implemented real QR code generation using qrcode library for PIX payments
- **Customer Reviews Section**: Added comprehensive reviews display with 4.9★ rating and customer testimonials
- **Trust & Security Section**: Added "Por que escolher a Tábua de Minas" with quality, security, and delivery guarantees
- **About Company Section**: Added company information highlighting 5,000+ orders and artisanal quality commitment
- **Subscription Club "Clube Tábua"**: Implemented subscription service with two plans (Semestral R$ 187,90/mês, Anual R$ 139,90/mês)
- **Promotional Countdown Timer**: Added 24-hour countdown timer for limited-time subscription offers
- **Three-Tab Navigation**: Enhanced product tabs with Doces, Queijos, and new Clube Tábua sections
- **Instagram Widget Integration**: Added LightWidget Instagram feed display after reviews section on homepage
- **Professional Design Updates**: Removed emojis from subscription section for cleaner, more professional appearance
- **Netlify Deployment Ready**: Complete project organization for Netlify hosting with serverless functions and optimized build process
- **Production Architecture**: Configured dual deployment strategy supporting both Replit and Netlify platforms
- **Updated Product Images**: All product images updated with fresh Imgur links - resolved expired image issues
- **Expanded Sweet Catalog**: Added 5 new sweet products from Imgur album (Prestígio Mineiro, Quebra-Queixo, Banana Zero Açúcar, Doce de Leite Dom, Goiabada Tia Carla)  
- **Complete Image Refresh**: All 34 products now use working Imgur image links (17 queijos + 17 doces)
- **Netlify Build Fix**: Simplified build commands in netlify.toml for reliable deployment
- **Netlify Products Fix**: Fixed missing products issue on Netlify deployment - updated storage functions to include all 22 products (6 queijos + 16 doces) instead of only 4, resolving the "products disappearing" problem
- **Netlify CEP API Fix**: Created dedicated Netlify function for CEP lookup (netlify/functions/cep.ts) with proper routing to resolve address auto-fill functionality on deployed site
- **Complete Product Catalog Fix**: Updated netlify/functions/storage.ts with all 33 products (19 queijos + 14 doces) matching the full catalog - resolved missing products issue on Netlify deployment
- **Image Loading Optimization**: Implemented comprehensive image optimization system - all 66 Imgur URLs now use optimized format (m.jpg) for 50-70% smaller file sizes, added skeleton loading components, image preloading for critical images, and intelligent fallback mechanisms
- **CEP API Debug Enhancement**: Enhanced Netlify CEP function with detailed logging, multiple extraction methods, improved error handling, and direct ViaCEP API testing to resolve "CEP não encontrado" errors on production deployment
- **Build Fix for Netlify**: Removed ImageSkeleton and image preload components that were causing build failures on Netlify deployment - replaced with simple img tags with error handling to ensure reliable builds
- **Cache Clearing Enhancement**: Added comprehensive cache clearing to Netlify build command and updated browserslist to resolve persistent build failures
- **CEP API Complete Removal**: Completely removed all CEP functionality including cep-api.ts file, imports, and server routes to resolve Netlify build failures - users now fill address fields manually
- **Image Skeleton Component Removal**: Removed all ImageSkeleton component references that were causing Netlify build failures - replaced with direct img tags with error handling for reliable builds

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

The application supports multiple deployment platforms:

### Replit Deployment (Current)
- **Development**: Hot module replacement with Vite dev server
- **Production**: Express serves static files built by Vite
- **Database**: Neon Database provides managed PostgreSQL
- **Environment**: Node.js with ES modules throughout

### Netlify Deployment (Ready)
- **Build**: Configured with `netlify.toml` and `build-netlify.sh`
- **Functions**: Serverless functions for API endpoints (`/api/products`, `/api/cart`, `/api/orders`)
- **Storage**: In-memory storage for demo (can be upgraded to external database)
- **Static Files**: Optimized client build served via CDN
- **Environment**: Node.js serverless functions with TypeScript support

The build process creates optimized bundles for both client and server code, with platform-specific configurations for seamless deployment.