# Aurora University College Website - Frontend

This is the frontend application for Aurora University's college website, built with React + TypeScript + Vite.

## Project Structure

```
client/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── academic/
│   │   │   ├── CourseCard.css
│   │   │   ├── CourseCard.tsx
│   │   │   ├── SchoolCard.css
│   │   │   └── SchoolCard.tsx
│   │   ├── admin/
│   │   │   ├── AdminHeader.css
│   │   │   ├── AdminHeader.tsx
│   │   │   ├── AdminSidebar.css
│   │   │   └── AdminSidebar.tsx
│   │   ├── college/
│   │   │   ├── Footer.css
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.css
│   │   │   └── Header.tsx
│   │   └── shared/
│   │       ├── Button.css
│   │       ├── Button.tsx
│   │       ├── ErrorMessage.css
│   │       ├── ErrorMessage.tsx
│   │       ├── LoadingSpinner.css
│   │       └── LoadingSpinner.tsx
│   ├── hooks/
│   │   ├── useAboutData.ts
│   │   ├── useAcademicData.ts
│   │   ├── useContactForm.ts
│   │   └── useContactsManagement.ts
│   ├── layouts/
│   │   ├── AdminLayout.css
│   │   ├── AdminLayout.tsx
│   │   ├── CollegeLayout.css
│   │   └── CollegeLayout.tsx
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── Dashboard.css
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.css
│   │   │   ├── Login.tsx
│   │   │   ├── ManageAbout.css
│   │   │   ├── ManageAbout.tsx
│   │   │   ├── ManageContacts.css
│   │   │   └── ManageContacts.tsx
│   │   └── college/
│   │       ├── About.css
│   │       ├── About.tsx
│   │       ├── Academics.css
│   │       ├── Academics.tsx
│   │       ├── Admissions.css
│   │       ├── Admissions.tsx
│   │       ├── Contact.css
│   │       ├── Contact.tsx
│   │       ├── Events.css
│   │       ├── Events.tsx
│   │       ├── Gallery.css
│   │       ├── Gallery.tsx
│   │       ├── Home.css
│   │       └── Home.tsx
│   ├── services/
│   │   ├── aboutApi.ts
│   │   ├── academicApi.ts
│   │   └── contactApi.ts
│   ├── styles/
│   │   └── global.css
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## Features

- **College Website**: Public-facing pages including Home, About, Academics, Admissions, Events, Gallery, and Contact
- **Admin Panel**: Administrative dashboard for managing content, contacts, and university data
- **Responsive Design**: Mobile-first approach with Aurora University branding
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Clean, professional design with Aurora University color scheme (#800020)

## Technologies Used

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Custom CSS** with Aurora University styling
- **Session-based Authentication** for admin access

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
