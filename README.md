# ShoeTry AR - Virtual Shoe Try-On App

A mobile-friendly web application that leverages augmented reality (AR) technology to enable users to virtually try on shoes directly in their browser.

## Features

- **Virtual Try-On**: Visualize shoes on your feet using AR technology
- **Product Catalog**: Browse a comprehensive collection of shoes organized by categories
- **Favorites**: Save your favorite shoes for quick access
- **Mobile-First Design**: Optimized for the best experience on mobile devices
- **Responsive UI**: Beautiful user interface that adapts to different screen sizes

## Tech Stack

- **Frontend**: React, Three.js for 3D/AR visualization
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Express.js
- **Data Storage**: In-memory storage with comprehensive product dataset
- **Data Schema**: Drizzle ORM with Zod for validation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/shoetry-ar.git
   cd shoetry-ar
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5000`

## Usage

1. Browse the available shoes from different categories
2. Select a shoe to view details
3. Click "Try On" to launch the AR experience
4. Allow camera access when prompted
5. Position your device to capture your feet in the frame
6. See the selected shoe virtually placed on your feet
7. Add shoes to favorites for later viewing

## Browser Compatibility

This application works best on modern mobile browsers with WebAR capabilities:
- Chrome for Android (version 81+)
- Safari for iOS (version 13+)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.