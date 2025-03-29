# ShoeTry AR - Expo Mobile App

## Overview

ShoeTry AR is a mobile application that allows users to virtually try on shoes using augmented reality (AR) technology. This Expo/React Native version extends the original web application to provide a native mobile experience.

## Features

- Browse and search for shoes by categories
- View detailed product information
- Virtual try-on using device camera and AR 
- Save favorite shoes for later
- User profile and preferences

## Technology Stack

- React Native / Expo for mobile app development
- Three.js for 3D rendering and AR visualization
- Expo Camera for camera integration
- React Navigation for app navigation
- Expo GL for WebGL context in React Native

## Project Structure

```
expo-app/
├── assets/              # App assets (images, fonts, 3D models)
├── components/          # Reusable React components
├── screens/             # Application screens
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and API helpers
├── App.tsx              # Main application component
├── babel.config.js      # Babel configuration
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Expo CLI
- Yarn or npm

### Installation

1. Install dependencies:
```bash
cd expo-app
yarn install
```

2. Start the Expo development server:
```bash
yarn start
```

3. Use the Expo Go app on your device to scan the QR code, or run in an emulator/simulator

## Development

This application is built with Expo and React Native, providing a native mobile experience for the ShoeTry AR concept. It communicates with the same backend API as the web version but includes mobile-specific optimizations and features.

## AR Implementation

The AR functionality uses Three.js within Expo GL to render 3D shoe models in augmented reality. The application uses the device camera as background and overlays 3D models appropriately positioned to give the appearance of wearing virtual shoes.

## License

This project is licensed under the MIT License.