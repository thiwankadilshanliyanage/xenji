# Xenji — Navigate life in Japan smarter.

A production-oriented MERN starter for foreign residents in Japan with services, information articles, bookmarks, notifications, admin dashboard, reports, contact messages, and Xeno AI via Google Gemini.

## Stack
- Frontend: React, Vite, React Router, MUI, Framer Motion, Axios, Recharts
- Backend: Node.js, Express, MongoDB/Mongoose, JWT, bcryptjs, Nodemailer, Multer, Helmet, CORS, rate limit, mongo sanitize, XSS protection, Gemini API

## Install
```bash
cd backend
npm install
cp .env.example .env
npm run seed:admin
npm run dev

cd ../frontend
npm install
cp .env.example .env
npm run dev
```

## Backend env
See `backend/.env.example`.

## Admin creation
After setting `.env`, run:
```bash
cd backend
npm run seed:admin
```
Default credentials are read from `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`.

## API groups
Auth, Users, Services, Information, Bookmarks, Notifications, FAQ, Contact, Reports, Chat, Admin.

## Notes
This project includes real routes, models, controllers and modern UI pages. Add real production secrets, Gemini key, MongoDB Atlas URI, and email SMTP settings before deployment.
