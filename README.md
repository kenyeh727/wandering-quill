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

## Deployment (GitHub Pages)

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

1. Go to your repository **Settings** -> **Pages**.
2. Under **Build and deployment**, select **GitHub Actions** as the source.
3. Push your changes to the `main` branch.
4. The deployment workflow will automatically run and deploy your site.

### Secrets Setup

If your deployment requires secrets (e.g., API keys that need to be injected during build), go to **Settings** -> **Secrets and variables** -> **Actions** and add them as Repository Secrets. 

Then update `.github/workflows/deploy.yml` to use them if necessary (though for client-side apps, ensure you understand that these keys will be visible in the browser).

## License

MIT
