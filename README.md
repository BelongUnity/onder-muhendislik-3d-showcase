# Önder Mühendislik - Interactive 3D Product Showcase

An interactive 3D product showcase application for Önder Mühendislik's industrial combustion systems and components. Built with React, Vite, and Three.js.

## Features

- Interactive 3D product gallery
- Touch-friendly interface for vertical touchscreens
- 3D model viewing with OrbitControls
- Product sub-part exploration with hotspots
- Technical specifications display
- Modern, industrial design aesthetic

## Technology Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **3D Graphics**: Three.js with React Three Fiber
- **Styling**: CSS with custom design system
- **Font**: Inter (Google Fonts)

## Project Structure

```
├── public/
│   ├── images/          # Product thumbnail images (not included in repo)
│   ├── models/          # 3D model files (.glb) (not included in repo)
│   └── sounds/          # Audio files (not included in repo)
├── src/
│   ├── components/
│   │   ├── ProductGrid.jsx
│   │   ├── ProductViewer3D.jsx
│   │   ├── SubPartList.jsx
│   │   ├── Confetti.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorBoundary.jsx
│   ├── utils/
│   │   ├── api.js
│   │   └── index.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── data/
│   ├── kampanyalar.json
│   ├── komponentler.json
│   ├── projeler.json
│   └── yakicilar.json
├── database/
│   └── teklif.csv
├── server.js
└── package.json
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Add Product Assets** (Required for full functionality)
   - Place product thumbnail images in `public/images/`
   - Place 3D model files (.glb) in `public/models/`
   - Place audio files in `public/sounds/`
   - Update JSON files in `data/` directory with your product information
   
   **Note**: Asset files are not included in this repository due to size constraints. You'll need to add your own product images, 3D models, and audio files.

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Start Full Stack Development**
   ```bash
   npm run dev:full
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run server` - Start Express backend server
- `npm run dev:full` - Start both frontend and backend concurrently
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Design Specifications

- **Resolution**: 1080x1920 pixels (Portrait)
- **Color Palette**:
  - Main Background: #222831
  - Card Background: #393E46
  - Primary Color: #00ADB5
  - Text Color: #EEEEEE
- **Typography**: Inter font family
- **Target Environment**: Vertical touchscreens in exhibition stands

## Usage

1. **Product Gallery**: Browse available products in a 2-column grid
2. **3D Viewer**: Tap a product to view its 3D model
3. **Sub-parts**: Tap hotspots (blue circles) to explore product components
4. **Technical Details**: Tap "Technical Details" button to view specifications
5. **Navigation**: Use back and reset buttons for navigation

## Browser Support

- Modern browsers with WebGL support
- Optimized for touchscreen interactions
- Fixed layout for 1080x1920 resolution

## License

This project is proprietary to Önder Mühendislik.