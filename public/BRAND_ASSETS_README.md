# FutureLinked ZA - Brand Assets

## Logo & Favicon Guide

This directory contains all logo and favicon assets for the FutureLinked ZA platform.

### Logo Files

#### `logo.svg` (200x200)
- **Purpose**: Main square logo for general use
- **Features**: 
  - Gradient purple circular background (#667eea to #764ba2)
  - "FL" lettermark formed by chain links with connection nodes
  - Search magnifying glass icon in gold (#fbbf24)
  - South African flag colors accent (green #007A4D, yellow #FFB612, red #DE3831)
- **Usage**: Social media profiles, app icons, general branding

#### `logo-horizontal.svg` (400x100)
- **Purpose**: Horizontal logo for headers and wide spaces
- **Features**:
  - FL chain link icon on left
  - "FutureLinked" text with "ZA" subtitle
  - "Smart Job Search" tagline
  - SA flag color accents
- **Usage**: Website header, email signatures, presentations

### Favicon Files

All favicons use the same design language - simplified "FL" chain link lettermark with search icon:

#### `favicon.svg` (32x32)
- **Purpose**: Main favicon fallback
- **Features**: Simple "FL" text on gradient circle
- **Usage**: Browser tabs (modern browsers with SVG support)

#### `favicon-16x16.svg`
- **Purpose**: Extra small favicon for tight spaces
- **Features**: Ultra-simplified FL lettermark
- **Usage**: Browser tabs, bookmarks bar (16px display)

#### `favicon-32x32.svg`
- **Purpose**: Standard favicon size
- **Features**: Simplified FL chain links + search icon
- **Usage**: Browser tabs, bookmarks (32px display)

#### `favicon-192x192.svg`
- **Purpose**: Android home screen icon
- **Features**: Full detail FL chain link design with search icon
- **Usage**: Android "Add to Home Screen", PWA install

#### `favicon-512x512.svg`
- **Purpose**: High-resolution app icon
- **Features**: Maximum detail FL chain link design
- **Usage**: PWA splash screens, high-DPI displays, app stores

#### `apple-touch-icon.svg` (180x180)
- **Purpose**: iOS home screen icon
- **Features**: Rounded square design (36px radius) with FL chain link
- **Usage**: iOS "Add to Home Screen", Safari bookmark icons

### Web App Manifest

#### `manifest.json`
- **Purpose**: Progressive Web App configuration
- **Features**:
  - App name: "FutureLinked ZA"
  - Theme color: #667eea (brand purple)
  - All icon sizes referenced
  - Standalone display mode
  - South Africa locale (en-ZA)
- **Usage**: PWA installation, Android home screen

### Design System

#### Colors
- **Primary Brand**: #667eea (Purple) to #764ba2 (Deep Purple) gradient
- **Accent Gold**: #fbbf24 (Search icon highlight)
- **SA Flag Colors**: 
  - Green: #007A4D
  - Yellow: #FFB612
  - Red: #DE3831
- **Text**: White on colored backgrounds

#### Typography
- **Font**: Segoe UI, Arial, sans-serif
- **Logo Text**: Bold 700 weight
- **Subtitle**: Regular 400 weight

#### Design Elements
1. **Chain Links**: Represent connection and linking job seekers to opportunities
2. **Circular Nodes**: Show interconnection points in the chain
3. **Magnifying Glass**: Symbolizes search functionality
4. **SA Flag Colors**: Emphasize South African focus
5. **Gradient Background**: Modern, dynamic feel

### Implementation

Favicons are automatically loaded via `frontend/pages/_document.js`:

```html
<!-- Multiple sizes for all devices -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/svg+xml" sizes="16x16" href="/favicon-16x16.svg" />
<link rel="icon" type="image/svg+xml" sizes="32x32" href="/favicon-32x32.svg" />
<link rel="icon" type="image/svg+xml" sizes="192x192" href="/favicon-192x192.svg" />
<link rel="icon" type="image/svg+xml" sizes="512x512" href="/favicon-512x512.svg" />

<!-- Apple Touch Icon for iOS -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.svg" />

<!-- Web App Manifest -->
<link rel="manifest" href="/manifest.json" />
```

### Browser Support

- **Modern Browsers**: SVG favicons work in Chrome 80+, Firefox 41+, Safari 9+, Edge 79+
- **iOS Safari**: Uses apple-touch-icon.svg for home screen
- **Android Chrome**: Uses favicon-192x192.svg and favicon-512x512.svg for home screen
- **Legacy Browsers**: Fall back to favicon.svg (simple version)

### Usage Guidelines

1. **Website Header**: Use `logo-horizontal.svg` at max 300px width
2. **Social Media**: Use `logo.svg` at recommended platform sizes
3. **Favicon**: Automatically handled by _document.js - no manual changes needed
4. **Print Materials**: Export SVGs to high-res PNG (300dpi) for printing

### File Maintenance

- All logos are vector SVG format - infinitely scalable without quality loss
- Colors are defined with hex codes for consistency
- Edit SVG files with any vector editor (Figma, Illustrator, Inkscape)
- Always maintain the same color palette and design elements
- Test favicon changes across multiple browsers (Chrome, Firefox, Safari, Edge)

### Credits

**Created & Developed by**: Maanda Netshisumbewa  
**Platform**: FutureLinked ZA  
**Contact**: futurelinked3@gmail.com | 071 568 9064  
**Theme**: Smart Job Search for South Africa  
**Year**: 2024

---

*Proudly South African 🇿🇦*
