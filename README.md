# Kitsune-Gaze

A sleek, gothic-inspired tool to track down personal data breaches. Created with love and a bit of discipline.

## Architecture

- **Frontend:** React (TypeScript) with Vite
- **Backend:** FastAPI (Python)

## Getting Started

### Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```
3. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Technical Excellence

Kitsune-Gaze is built with a focus on speed, security, and a minimal footprint:

- **FastAPI:** High-performance asynchronous Python framework for the backend.
- **Vite + React:** Lightning-fast frontend build tool and modern UI library.
- **TypeScript:** Ensuring type safety and reducing runtime errors.
- **Stateless Architecture:** No data persistence, ensuring absolute user privacy.

## DevOps & Automation

Kitsune-Gaze uses GitHub Actions for an automated, smart workflow:

- **Continuous Integration (CI):** Every push and pull request is automatically built and linted.
- **Auto-Merge:** Pull Requests labeled with `automerge` will be automatically merged into `master` once all CI checks pass.

## Future Roadmap

- [ ] Integration with HaveIBeenPwned API.
- [ ] Real-time email monitoring alerts.
- [ ] Dark web data leak visualization.
- [ ] Multi-language support for a global audience.

## Stay Safe.
Security is a continuous journey.

## Community Guidelines
Contributions are welcome! Please see our ETHICS.md for more info.
