Marketplace Mobile App
A React Native marketplace application built with Expo, TypeScript, and Node.js backend. This app provides a complete e-commerce experience with user authentication, product browsing, shopping cart, and order management.

🚀 Tech Stack
Frontend
React Native with Expo

TypeScript for type safety

Expo Router for navigation

React Navigation for drawer/stack navigation

React Context for state management

Expo Notifications for push notifications

Expo Auth Session for social authentication (Google, Apple)

Backend
Node.js with Express

MongoDB (or your database)

JWT authentication

RESTful API architecture

Development Tools
Git Bash for command line operations

Expo CLI for development

TypeScript compiler

ESLint & Prettier for code quality

📁 Project Structure
text
marketplace-app/
├── app/                    # Expo Router file-based routing
│   ├── index.tsx          # Entry screen
│   ├── login/             # Authentication
│   │   └── index.tsx      # SignIn component
│   ├── register/          # User registration
│   │   └── index.tsx      # SignUp component
│   └── (drawer)/          # Main app navigation
│       └── (stack)/       # Stack navigator
│           └── index.tsx  # Main landing screen
├── components/            # Reusable UI components
│   ├── ui/
│   │   ├── Textfield/
│   │   ├── Buttons/
│   │   └── ...
│   ├── TextDefault.tsx
│   ├── Spinner.tsx
│   └── FlashMessage.tsx
├── context/               # React Context providers
│   ├── authContext.tsx    # Authentication state
│   ├── User.tsx          # User data context
│   └── ConfigurationContext.tsx
├── services/              # API services
│   └── authService.ts     # Authentication API calls
├── lib/                   # Utilities and libraries
│   ├── api.ts            # API configuration
│   ├── authApi.ts        # Auth API types
│   └── types/            # TypeScript definitions
├── utils/                 # Helper functions
│   ├── colors.ts         # Color palette
│   ├── scaling.ts        # Responsive scaling
│   └── alignment.ts      # Layout utilities
└── assets/               # Static assets
    ├── images/
    ├── fonts/
    └── ...
🛠 Installation & Setup
Prerequisites
Node.js (v16 or higher)

npm or yarn

Git Bash (recommended for Windows)

Expo CLI (npm install -g expo-cli)

1. Clone the Repository
bash
git clone <repository-url>
cd marketplace-app
2. Install Dependencies
bash
npm install
# or
yarn install
3. Environment Setup
Create a .env file in the root directory:

env
EXPO_PUBLIC_API_URL=your_api_url_here
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
EXPO_PUBLIC_PROJECT_ID=your_expo_project_id
4. Start Development Server
bash
npm start
# or
yarn start
5. Run on Specific Platform
bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
🔐 Authentication Features
Email/Password login and registration

Google OAuth integration

Apple Sign-In (iOS only)

JWT token management

Auto-login with AsyncStorage

Protected routes with auth guards

🛒 Marketplace Features
Product catalog browsing

Shopping cart functionality

Order management

User profiles

Push notifications for orders

Guest checkout option

📱 Navigation Structure
text
Entry Screen → Authentication → Main App
            ↘ Continue as Guest

Main App:
Drawer Navigation →
  ├── Home Stack
  │   ├── Product Listing
  │   ├── Product Details
  │   └── Shopping Cart
  ├── Profile
  ├── Orders
  └── Settings
🎨 UI/UX Features
Responsive design with scaling utilities

Custom typography system

Consistent color palette

Loading states and error handling

Social authentication buttons

Form validation with error messages

🔧 Configuration
Google Authentication Setup
Create Google OAuth credentials

Update app.json with iOS and Android client IDs

Configure redirect URIs

Expo Notifications
typescript
// Required app.json configuration
{
  "expo": {
    "projectId": "your-project-id",
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff"
        }
      ]
    ]
  }
}
📊 API Integration
The app uses a RESTful API with the following endpoints:

POST /auth/login - User authentication

POST /auth/register - User registration

POST /auth/logout - User logout

GET /products - Product listing

POST /orders - Create order

GET /orders/:id - Order details

🚀 Deployment
Building for Production
bash
# Build for Android
expo build:android

# Build for iOS
expo build:ios

# Build for web
expo build:web
App Store Deployment
Update app.json with production values

Generate production builds

Submit to Google Play Store and Apple App Store

🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit changes (git commit -m 'Add amazing feature')

Push to branch (git push origin feature/amazing-feature)

Open a Pull Request

📝 Git Bash Tips
When working with this project in Git Bash:

bash
# Navigate to project
cd /c/Projects/marketplace-app

# Use quotes for files with spaces
git add "All Files/file.txt"

# Tab completion for long paths
cd app/(drawer)/(stack)/[Tab]

# Check status with detailed output
git status -u
🐛 Troubleshooting
Common Issues
"no projectId found" - Add projectId to app.json

Authentication errors - Check API URL and credentials

Navigation issues - Ensure proper Expo Router setup

Build failures - Check environment variables and dependencies

Debugging
bash
# Clear cache
expo start --clear

# Reset project
expo prebuild --clean

# Check TypeScript errors
npx tsc --noEmit
📄 License
This project is licensed under the MIT License - see the LICENSE.md file for details.

🙏 Acknowledgments
Expo team for excellent React Native tooling

React Navigation for routing solutions

React Native community for components and libraries