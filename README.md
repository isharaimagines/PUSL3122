# Furniture Marketplace

A modern web platform for uploading, managing, and selling Furniture with real-time previews. Built with cutting-edge web technologies for optimal performance and user experience.

## 🚀 Tech Stack

- **Frontend**: React + Vite.js
- **Styling**: Tailwind CSS
- **3D Rendering**: Three.js
- **Cloud Storage**: Cloudinary
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Backend**: Node.js (Firebase Functions)
- **Build Tool**: Vite

## ✨ Features

- Furniture previews with Three.js
- Drag-and-drop model uploads
- Responsive UI with Tailwind CSS
- Real-time database updates
- User authentication system
- Cloud-based file storage
- Marketplace browsing
- Admin
- Designer

## 🛠 Local Setup

### Prerequisites

- Node.js (v18+)
- npm (v9+)
- Git
- Firebase account
- Cloudinary account

### Installation

1. **Clone Repository**

   ```bash
   git clone https://github.com/isharaimagines/PUSL3122.git
   cd ./PUSL3122
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env` file in root directory:

   ```env
    VITE_ADMIN_EMAIL = "admin@gmail.com"
    VITE_ADMIN_PASSWORD = "123@qwe"
    VITE_ADMIN_ROLE = "admin"

    VITE_DESIGNER_EMAIL = "designer@gmail.com"
    VITE_DESIGNER_PASSWORD = "123123@qwe"
    VITE_DESIGNER_ROLE = "designer"

    VITE_APP_API_KEY=your_firebase_key
    VITE_APP_AUTH_DOMAIN=your_firebase_auth_domain
    VITE_APP_PROJECT_ID=your_project_id
    VITE_APP_STORAGE=your_storage_bucket
    VITE_APP_SENDER_ID=your_sender_id
    VITE_APP_APP_ID=your_app_id
    VITE_APP_MESURE_ID=your_mesure_id

    VITE_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
    VITE_APP_CLOUDINARY_API_KEY=your_api_key
    VITE_APP_CLOUDINARY_API_SECRET=your_api_secret
    VITE_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

4. **Start Development Server**

```bash
npm run dev
```

## 🔧 Project Structure

```
├── src/
│   ├── components/      # Reusable components
│   ├── pages/           # Application pages
│   ├── test/            # test setup
│   ├── firebase-config.js  # Firebase configuration
│   ├── assets/          # Static assets
│   ├── App.test.jsx     # App test page
│   |── App.jsx          # Routes and Notification config component
│   └── main.jsx         # Main application component
├── public/              # Static public files
├── index.html           # Static HTML page
├── .env.example         # Environment variables template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── jsconfig.json        # JS configuration
├── postcss.config.js    # PostCSS configuration
└── package.json         # Project dependencies
```

## 📦 Dependencies

### Core Dependencies

- `@react-three/drei`: "^10.0.7"
- `@react-three/fiber`: "^9.1.2"
- `axios`: "^1.9.0"
- `cloudinary`: "^2.6.1"
- `drei`: "^2.2.21"
- `firebase`: "^11.6.1"
- `react`: "^19.1.0"
- `react-colorful`: "^5.6.1"
- `react-dom`: "^19.1.0"
- `react-dropzone`: "^14.3.8"
- `react-router-dom`: "^7.5.3"
- `react-toastify`: "^11.0.5"
- `three`: "^0.176.0"

### Dev Dependencies

- `@eslint/js`: "^9.25.0"
- `@testing-library/jest-dom`: "^6.6.3"
- `@types/react`: "^19.1.2"
- `@types/react-dom`: "^19.1.2"
- `@vitejs/plugin-react`: "^4.4.1"
- `autoprefixer`: "^10.4.21"
- `eslint`: "^9.25.0"
- `eslint-plugin-react-hooks`: "^5.2.0"
- `eslint-plugin-react-refresh`: "^0.4.19"
- `globals`: "^16.0.0"
- `jsdom`: "^26.1.0"
- `postcss`: "^8.5.3"
- `tailwindcss`: "^3.4.17"
- `vite`: "^6.3.5"
- `vitest`: "^3.1.3"

## 🚀 Deployment

1. **Build Production Version**

   ```bash
   npm run build
   ```

2. **Unit Test Version**

   ```bash
      pnpm test:unit
   ```

3. **Integration Test Version**

   ```bash
      pnpm test:integration
   ```

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add some NewFeature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgments

- Firebase for backend services
- Cloudinary for media storage
- Three.js community for 3D resources
- Vite team for build tooling
- Tailwind CSS for styling framework


## package.json
```json
{
  "name": "furniture",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test:unit": "vitest",
    "test:integration": "vitest run"
  },
  "dependencies": {
    "@react-three/drei": "^10.0.7",
    "@react-three/fiber": "^9.1.2",
    "axios": "^1.9.0",
    "cloudinary": "^2.6.1",
    "drei": "^2.2.21",
    "firebase": "^11.6.1",
    "react": "^19.1.0",
    "react-colorful": "^5.6.1",
    "react-dom": "^19.1.0",
    "react-dropzone": "^14.3.8",
    "react-router-dom": "^7.5.3",
    "react-toastify": "^11.0.5",
    "three": "^0.176.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.25.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "@vitejs/plugin-react": "^4.4.1",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.25.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^16.0.0",
    "jsdom": "^26.1.0",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "vite": "^6.3.5",
    "vitest": "^3.1.3"
  }
}
```
