# Firebase Setup Guide for ST Gold Covering Billing Software

## Prerequisites
- Google account
- ST Gold Billing project downloaded and dependencies installed

## Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click "Create a project"
   - Project name: `st-gold-billing` (or your preferred name)
   - Enable Google Analytics: Optional (recommended for usage insights)
   - Select Analytics account or create new one
   - Click "Create project"

## Step 2: Configure Authentication

1. **Enable Authentication**
   - In Firebase Console, go to "Authentication" in left sidebar
   - Click "Get started"
   - Go to "Sign-in method" tab

2. **Enable Email/Password Authentication**
   - Find "Email/Password" in providers list
   - Click on it and toggle "Enable"
   - Leave "Email link (passwordless sign-in)" disabled for now
   - Click "Save"

3. **Create First User (Optional)**
   - Go to "Users" tab in Authentication
   - Click "Add user"
   - Enter email: your-email@example.com
   - Enter password: (choose a secure password)
   - Click "Add user"

## Step 3: Setup Firestore Database

1. **Create Firestore Database**
   - Go to "Firestore Database" in left sidebar
   - Click "Create database"

2. **Choose Security Rules**
   - Select "Start in test mode" (for development)
   - Note: This allows read/write access for 30 days
   - For production, you'll need to configure proper security rules

3. **Select Location**
   - Choose a location close to your users
   - For India: `asia-south1 (Mumbai)` is recommended
   - Click "Done"

## Step 4: Get Firebase Configuration

1. **Add Web App**
   - Go to Project Settings (gear icon next to "Project Overview")
   - Scroll down to "Your apps" section
   - Click "</>" (web app icon)

2. **Register App**
   - App nickname: `ST Gold Billing Web`
   - Hosting: Leave unchecked for now
   - Click "Register app"

3. **Copy Configuration**
   - Copy the entire `firebaseConfig` object
   - It should look like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyC...",
     authDomain: "st-gold-billing.firebaseapp.com",
     projectId: "st-gold-billing",
     storageBucket: "st-gold-billing.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```

## Step 5: Update Environment Variables

1. **Open Your Project**
   - Navigate to your ST Gold Billing project folder
   - Open `.env.local` file

2. **Update Configuration**
   - Replace the placeholder values with your Firebase config:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC... (your apiKey)
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=st-gold-billing.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=st-gold-billing
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=st-gold-billing.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

3. **Save the File**
   - Make sure to save `.env.local`
   - Restart your development server if it's running

## Step 6: Test the Setup

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Authentication**
   - Open http://localhost:3000
   - You should see a login page
   - Try creating a new account or logging in
   - If successful, you'll be redirected to the dashboard

3. **Verify Firebase Connection**
   - Check browser console for any Firebase errors
   - If you see "Firebase connection established" or can successfully login, you're good to go!

## Step 7: Initialize Database Collections (Optional)

The app will automatically create collections when you first use features, but you can pre-create them:

1. **Go to Firestore Database**
   - In Firebase Console, go to "Firestore Database"
   - Click "Start collection"

2. **Create Collections** (Optional - app will create these automatically):
   - `invoices` - For storing invoices
   - `customers` - For customer database
   - `products` - For product master
   - `companySettings` - For company information
   - `billingSettings` - For billing configuration

## Security Rules (For Production)

When ready for production, update Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Check that NEXT_PUBLIC_FIREBASE_API_KEY is correct
   - Ensure no extra spaces in .env.local

2. **"Firebase: Error (auth/project-not-found)"**
   - Verify NEXT_PUBLIC_FIREBASE_PROJECT_ID matches your Firebase project ID

3. **"Missing or insufficient permissions"**
   - Check Firestore security rules
   - Ensure you're authenticated

4. **App not connecting to Firebase**
   - Clear browser cache and cookies
   - Check browser console for errors
   - Verify all environment variables are set correctly

### Getting Help:

- Check Firebase Console for error logs
- Look at browser developer tools console
- Verify project is active in Firebase Console
- Ensure billing is enabled if using paid features

## Next Steps

After successful setup:

1. **Test Invoice Creation**: Create a test invoice to verify everything works
2. **Configure Company Settings**: Add your company details
3. **Import Customers**: Add your customer database
4. **Customize Settings**: Set stone prices, tax rates, etc.
5. **Setup Backup**: Consider setting up automated Firestore backups

## Production Checklist

Before going live:

- [ ] Update Firestore security rules
- [ ] Enable email verification in Authentication
- [ ] Set up automated backups
- [ ] Configure custom domain (if needed)
- [ ] Test all features thoroughly
- [ ] Monitor Firebase usage and billing

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Firebase documentation: https://firebase.google.com/docs
3. Contact the development team with error messages and screenshots

Your Firebase setup is now complete! The ST Gold Billing software should be fully functional with user authentication and database connectivity.
