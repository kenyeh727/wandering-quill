# Wandering Quill

Wandering Quill is a magical letter drafting application built with React, Vite, and Tailwind CSS.

## Tech Stack

- **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI:** Google Gemini API

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wandering-quill.git
   cd wandering-quill
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in your API keys in `.env`.

### Development

Start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Build

Build the project for production:

```bash
npm run build
```

The output will be in the `dist` directory.

### Preview

Preview the production build locally:

```bash
npm run preview
```

## Deployment (Cloudflare Pages)

This project is configured for deployment on Cloudflare Pages.

1.  **Framework Preset:** Select `Vite`.
2.  **Build Command:** `npm run build`
3.  **Build Output Directory:** `dist`
4.  **Environment Variables:** Add the following variables in the Cloudflare dashboard:
    - `VITE_GEMINI_API_KEY`
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`

Cloudflare will automatically pick up the `public/_redirects` file for SPA routing.

## License

MIT
