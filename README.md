# ResumeForge — AI-Powered Resume Builder

ResumeForge is a premium, full-stack AI resume building application that allows students, freshers, and professionals to build ATS-friendly resumes. It features direct AI-assisted summary optimization, keyword suggestions, project rewriting, live A4 formatting previews, and high-fidelity PDF exports.

## Tech Stack
* **Frontend**: React.js (Vite) + Tailwind CSS + Lucide icons
* **Backend**: Node.js + Express.js
* **Database**: MongoDB (Mongoose)
* **PDF Engine**: html2canvas + jsPDF

---

## Folder Structure
```text
client/                  # React Client Workspace
  ├── public/
  ├── src/
  │   ├── assets/
  │   ├── components/     # Reusable Form & Layout Elements (Inputs, Cards, Nav, Selectors)
  │   ├── context/        # React context (Auth & Resume Builders)
  │   ├── pages/          # Pages (Dashboard, Landing, Builder, Contact, etc.)
  │   ├── resume/         # Section Forms & Styled PDF Layout Templates
  │   ├── services/       # API Fetch Services (Auth, Resume, AI helpers)
  │   ├── utils/          # Client-side Score Calculation & PDF rendering
  │   ├── App.jsx         # App router config
  │   ├── main.jsx        # App mounting script
  │   └── index.css       # Tailwind & Print/A4 stylesheets
  ├── package.json
  ├── postcss.config.js
  ├── tailwind.config.js
  └── vite.config.js
server/                  # Express Server Workspace
  ├── config/             # DB Connection helpers
  ├── controllers/        # Express handlers (Auth, Resume CRUD, Gemini APIs)
  ├── middleware/         # Auth verification guards
  ├── models/             # Mongoose schemas (User & Resume definitions)
  ├── routes/             # Routes (Auth, Resumes, AI)
  ├── utils/              # JWT generating helper
  ├── .env                # Port, URI, and JWT Secret credentials
  ├── .env.example
  ├── server.js           # Server mounting script
  └── package.json
```

---

## Setup & Running Locally

Ensure you have **Node.js (v18+)** and **MongoDB** running on your system.

### 1. Database & Server Setup
1. Open a terminal, go to the `server/` directory:
   ```bash
   cd server
   ```
2. Install the server dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` configuration. You can copy the template:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` fields if necessary (like setting `GEMINI_API_KEY` to enable real Gemini AI, otherwise the app automatically falls back to simulated AI helper strings).
5. Start the server (runs on `http://localhost:5000` with hot-reload):
   ```bash
   npm run dev
   ```

### 2. Frontend Client Setup
1. Open a new terminal, go to the `client/` directory:
   ```bash
   cd ../client
   ```
2. Install the client dependencies:
   ```bash
   npm install
   ```
3. Run the development Vite hot-reload server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173` to start creating resumes!

---

## Key Features & Highlights

1. **Auto Save**: Any typing or customization triggers a debounced auto-save function to persist data to the MongoDB database automatically.
2. **ATS Score Analysis**: Calculated on the client in real-time and synced to the database. Suggests missing fields and key recruiter checklists.
3. **AI Recommendations**:
   * **Summary Generator**: Crafts custom resumes summaries based on target role and technical tags.
   * **Career Objective Optimization**: Improves drafts to read with high impact.
   * **Skill Suggestion**: Crawls technical categories to populate skills tables based on targeted designations.
   * **Project bullet point refactoring**: Rewrites project descriptions to begin with strong, active recruiter verbs.
4. **Professional Templates**: Renders in true 210mm x 297mm A4 layout ratios:
   * **Modern**: Dual-column style highlighting core links & skills sidebar.
   * **ATS Friendly**: Plain-text optimized format built to parse flawlessly.
   * **Creative Layout**: Features colorful banner highlights and custom project cards.
