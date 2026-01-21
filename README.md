# 🖋️ Wandering Quill

Wandering Quill is a premium, AI-powered letter drafting application designed to transform your professional narrative into something magical. Built with a modern React stack, it leverages the power of Google's Gemini AI to craft tailored resumes and cover letters.

## ✨ Features

- **Magical Drafting:** AI-driven content generation for resumes and cover letters.
- **Quest-Based UI:** A step-by-step journey from profile creation to final draft.
- **Character Profiles:** Save and manage multiple professional "identities".
- **Live Link Persistence:** Automatic saving of your progress to local storage.
- **Bilingual Mastery:** Support for multiple languages with elegant translations.

## 🛠️ Tech Stack

- **Core:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **AI Engine:** [Google Gemini AI](https://ai.google.dev/)
- **Database/Auth:** [Supabase](https://supabase.com/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v18 or higher (v20+ recommended)
- **Package Manager:** npm (installed by default with Node.js)

### Installation

1. **Clone the realm:**
   ```bash
   git clone https://github.com/yourusername/wandering-quill.git
   cd wandering-quill
   ```

2. **Gather ingredients (Install dependencies):**
   ```bash
   npm install
   ```

3. **Empower the quill (Environment Configuration):**
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and fill in your magical tokens:
     - `VITE_GEMINI_API_KEY`: Your Google AI Studio API key.
     - `VITE_SUPABASE_URL`: Your Supabase project URL.
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key.

### Development

Start the magical workshop:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

Compile the spells into a production build:

```bash
npm run build
```

The optimized artifacts will be placed in the `dist/` directory.

## 🚢 Deployment

This project is optimized for **Cloudflare Pages** or **Vercel**.

1. **Framework Preset:** Vite
2. **Build Command:** `npm run build`
3. **Output Directory:** `dist`
4. **Environment Variables:** Ensure all `VITE_*` variables are configured in your deployment platform's dashboard.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.
