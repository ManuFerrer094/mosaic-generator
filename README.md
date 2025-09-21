# 🧱 Mosaic Maker - LEGO Mosaic Generator

Transform your favorite images into stunning LEGO mosaics with precise piece calculations and professional export options.

![Mosaic Maker Preview](https://via.placeholder.com/800x400/6366f1/ffffff?text=Mosaic+Maker+Preview)

## ✨ Features

- **🖼️ Image Upload**: Drag and drop or click to upload images (JPG, PNG, GIF, WebP)
- **📐 Multiple Sizes**: Choose from 16×16, 32×32, 48×48, or 64×64 stud mosaics
- **🎨 LEGO Color Palette**: Converts images using authentic LEGO colors
- **👀 Live Preview**: Real-time mosaic preview with LEGO stud visualization
- **📋 Piece Calculator**: Detailed breakdown of required LEGO pieces by color
- **🏗️ Base Requirements**: Calculates needed baseplates for construction
- **📄 Export Options**: 
  - PNG: High-quality mosaic image
  - PDF: Complete building instructions
  - TXT: Shopping list for ordering pieces
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🎭 Smooth Animations**: Delightful interactions with Framer Motion
- **🌈 Vibrant UI**: Colorful, fun interface inspired by LEGO aesthetics

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ManuFerrer094/mosaic-generator.git
cd mosaic-generator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom LEGO-inspired design system
- **Animations**: Framer Motion for smooth, delightful interactions
- **TypeScript**: Full type safety and enhanced developer experience
- **Image Processing**: HTML5 Canvas for pixel-level image manipulation
- **Export Features**:
  - PNG: html2canvas for high-quality image export
  - PDF: jsPDF for comprehensive instruction generation
- **Icons**: Lucide React for beautiful, consistent iconography

## 🎯 How It Works

1. **Upload**: Select an image from your device
2. **Choose Size**: Pick your desired mosaic dimensions (16×16 to 64×64 studs)
3. **Generate**: Our algorithm processes your image and maps pixels to LEGO colors
4. **Preview**: See your mosaic with realistic LEGO stud visualization
5. **Export**: Download your mosaic as PNG, complete PDF instructions, or shopping list

## 🎨 LEGO Color Palette

The app uses an authentic LEGO color palette including:
- Bright Red, Blue, Yellow, Green
- Orange, Purple, Pink, White, Black
- Light Gray, Dark Gray, Brown, Tan
- Lime Green, Medium Blue, Magenta

Each pixel in your image is mapped to the closest matching LEGO color using Euclidean distance in RGB color space.

## 📦 Export Formats

### PNG Export
- High-resolution image of your LEGO mosaic
- Perfect for sharing or printing
- Maintains stud detail and authentic LEGO appearance

### PDF Instructions
- Complete building guide with:
  - Mosaic preview image
  - Detailed piece count by color
  - Base requirements
  - Step-by-step assembly instructions

### Shopping List
- Text file with all required pieces
- Organized by color and quantity
- Perfect for ordering from LEGO Pick-A-Brick or BrickLink

## 🚀 Deployment

### Vercel (Recommended)

This project is optimized for Vercel deployment:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ManuFerrer094/mosaic-generator)

### Other Platforms

The app can be deployed to any platform that supports Next.js:

```bash
npm run build
npm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- LEGO® is a trademark of the LEGO Group
- Color palette based on official LEGO colors
- Inspired by the creativity of the LEGO community

## 🔮 Future Enhancements

- [ ] 3D mosaic preview
- [ ] Custom color palette support
- [ ] Bulk image processing
- [ ] Integration with LEGO marketplace APIs
- [ ] Save and share mosaic projects
- [ ] Advanced dithering algorithms
- [ ] Support for LEGO Technic pieces

---

**Built with ❤️ by [Manu Ferrer](https://github.com/ManuFerrer094)**

*Transform your creativity into LEGO masterpieces!*