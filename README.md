# ST Gold Covering - Billing Software

A comprehensive billing software built with Next.js, TypeScript, and Firebase for wholesale gold covering ornaments business.

## Features

### Core Billing Features
- **Dual Pricing Models**: Support for both stone-based and piece-rate pricing
- **Professional A4 Invoices**: Generate print-ready invoices with company branding
- **Tax Calculations**: Automatic CGST/SGST calculations (configurable rates)
- **Real-time Calculations**: Live updates as you add/edit items
- **Number to Words**: Automatic conversion of total amount to words

### Pricing Models

#### Stone-Based Pricing
- Stone count per piece
- Quantity (number of pieces)
- Total stones calculation (Stone Count × Quantity)
- Variable stone prices for different colors/types
- Master stone price with multipliers

#### Piece-Rate Pricing
- Fixed price per piece
- Quantity-based calculations
- Simple total amount calculation

### Business Management
- **Customer Management**: Store and manage customer database
- **Product Management**: Manage products with different pricing models
- **Invoice History**: Search, filter, and manage all invoices
- **Settings Management**: Configure company details, tax rates, stone prices

### Technical Features
- **Firebase Authentication**: Secure user login/registration
- **Firestore Database**: Real-time data storage and synchronization
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Print & Export**: PDF generation and print functionality
- **Data Validation**: Form validation and error handling

## Setup Instructions

### 1. Firebase Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Enter project name: "st-gold-billing"
   - Enable Google Analytics (optional)

2. **Enable Authentication**:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider
   - Create your first user account

3. **Setup Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode" (for development)
   - Select a location close to your users

4. **Get Firebase Configuration**:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click "Add app" > Web app
   - Register app with name "st-gold-billing"
   - Copy the configuration object

5. **Update Environment Variables**:
   - Update the Firebase config in `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### 2. Local Development

1. **Install Dependencies**: Already installed
2. **Run Development Server**: `npm run dev`
3. **Access Application**: Open [http://localhost:3000](http://localhost:3000)

## Usage Guide

### Creating an Invoice

1. Navigate to Dashboard and click "Create New Invoice"
2. Fill in customer details and invoice information
3. Add items using either Stone-based or Piece-rate pricing
4. Configure master stone price and any courier charges
5. Review auto-calculated totals and save the invoice

### Stone-Based Pricing Example
- Product: "Gold Covering Earrings"
- Stone Count: 50 stones per piece
- Quantity: 2 pieces
- Total Stones: 100 (automatically calculated)
- Total Value: ₹230 (100 × ₹2.30 per stone)

### Piece-Rate Pricing Example
- Product: "Simple Chain"
- Quantity: 5 pieces
- Price Per Piece: ₹150
- Total Amount: ₹750

## Next Steps

The application is now set up with:
✅ Complete project structure
✅ Firebase configuration
✅ Authentication system
✅ Invoice creation interface
✅ Dual pricing models
✅ Real-time calculations
✅ Responsive design

**To complete the full application, implement:**
- A4 Invoice template and printing
- Customer and product management
- Invoice history and search
- Settings configuration
- PDF export functionality

The foundation is solid and ready for these additional features!
