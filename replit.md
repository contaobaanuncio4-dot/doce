# Tábua de Minas - E-commerce Platform

## Overview
Tábua de Minas is an e-commerce platform for an artisanal Brazilian cheese and sweets brand. The project aims to provide an accessible, modern online shopping experience, inspired by Minas Gerais aesthetics, with a focus on ease of use for older users. Key capabilities include a comprehensive product catalog, multi-image galleries, a customer review system, a subscription club, and secure PIX payment integration. The business vision is to expand market reach for authentic Brazilian artisanal products, leveraging a user-friendly digital storefront.

## User Preferences
Preferred communication style: Simple, everyday language.
**Change Tracking Requirement**: Always list modified files at the end of each response when making changes to the codebase.

## System Architecture

### Frontend Architecture
The frontend is built with **React 18**, **TypeScript**, and **Vite**. It employs a component-based architecture using **Wouter** for routing, **Tailwind CSS** for styling with a custom Minas Gerais-inspired color scheme, **Radix UI** primitives and **shadcn/ui** components for accessibility, **React Query** for server state management, and **React Hook Form** with **Zod** for form handling and validation.

### Backend Architecture
The backend uses **Express.js** with **TypeScript** on Node.js. It features **RESTful APIs** for products, cart, and orders. **PostgreSQL** with **Drizzle ORM** is used for type-safe database operations, specifically leveraging **Neon Database** for serverless PostgreSQL. Session-based cart functionality utilizes in-memory storage.

### UI/UX Strategy
The design prioritizes accessibility for older users with:
- Large, clear buttons and typography.
- High-contrast colors inspired by Minas Gerais.
- Simplified navigation patterns.
- Generous spacing and readable fonts.

### Key Design Decisions
- **Frontend Framework**: React was chosen for its mature ecosystem, TypeScript support, and Vite for fast development.
- **Database**: PostgreSQL with Drizzle ORM provides type safety, performance, and serverless deployment capabilities.
- **Data Flow**: Products are fetched from PostgreSQL and cached. Cart items are session-based. Shipping costs are calculated in real-time. Checkout processes involve client-side validation and server-side processing with PIX payment integration, and orders are stored with a complete audit trail.

### Feature Specifications
- **Product Catalog**: Comprehensive product listing with detailed descriptions, weight information, and multi-image galleries. Supports product variations and categories.
- **Shopping Cart**: Sliding sidebar cart with quantity and size selection (500g/1kg), real-time updates, and a fixed bottom bar for pricing and checkout.
- **Checkout Process**: Secure checkout with CPF field, automatic formatting/validation, selectable shipping options (Express/Free freight), and real-time total calculation. Includes automatic CEP lookup for address completion.
- **Payment Integration**: Real PIX payment integration via BlackCat Payment Gateway, generating unique QR codes for transactions. Supports real-time payment processing and webhook updates for order status.
- **Customer Engagement**: Integrated customer review system, promotional banners, "Por que escolher a Tábua de Minas" section for trust-building, and an "About Company" section.
- **Subscription Club**: "Clube Tábua" subscription service with two plans and a promotional countdown timer.
- **Marketing Integration**: UTMify for comprehensive marketing campaign tracking (order creation, payments, UTM parameters, customer data), and TikTok Pixel for event tracking (page views, product views, add to cart, checkout initiation, payment completion, contact form submissions).
- **External Checkout Links**: Integration for direct links to external payment pages for products and subscription plans.

## External Dependencies

### Services & APIs
- **BlackCat Payment Gateway**: For PIX payment processing and webhooks.
- **ViaCEP API**: For Brazilian postal code lookup.
- **UTMify API**: For marketing campaign tracking and analytics.
- **TikTok Pixel**: For advertising and conversion tracking.
- **Imgur**: For hosting product images.
- **LightWidget**: For Instagram feed integration.

### Technologies & Libraries
- **React Query**: For server state management.
- **Wouter**: For client-side routing.
- **React Hook Form & Zod**: For form handling and validation.
- **Tailwind CSS**: For styling.
- **Radix UI & shadcn/ui**: For accessible UI components.
- **Express.js**: For backend web framework.
- **Drizzle ORM**: For type-safe database operations.
- **Neon Database**: Serverless PostgreSQL database provider.
- **qrcode library**: For QR code generation.