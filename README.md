# Crafto Bites

A beginner-friendly full-stack Indian food/masala ecommerce website.

## Stack
- Frontend: React + Vite + React Router
- Backend: Node.js + Express
- Database: SQLite through sql.js (WASM, avoids native SQLite build problems)
- Authentication: JWT + bcryptjs

## 1. Requirements
Install Node.js LTS. Then verify:

```bash
node -v
npm -v
```

## 2. Install dependencies

Open two terminals.

### Backend
```bash
cd backend
npm install
npm run dev
```

Backend runs on http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on the Vite URL shown in the terminal, normally http://localhost:5173

## 3. First run
The backend automatically creates `backend/db/database.db` and inserts:
- Categories
- Sample products
- Admin account

Admin login:
- Email: admin@craftobites.com
- Password: Admin@12345

Change this password before using the project publicly.

## 4. Important environment variables
Copy `backend/.env.example` to `backend/.env`.

Example:
```env
PORT=5000
JWT_SECRET=replace-this-with-a-long-random-secret
ADMIN_EMAIL=admin@craftobites.com
ADMIN_PASSWORD=Admin@12345
```

## 5. Frontend API URL
The frontend uses `VITE_API_URL` if available. Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 6. Project structure

crafto-bites/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── db/
│   ├── middleware/
│   ├── routes/
│   ├── controllers/
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── README.md

## 7. How the connection works

React -> fetch() -> Express REST API -> database.js -> SQLite database

Authentication:
React stores a JWT token in localStorage -> sends `Authorization: Bearer TOKEN` -> Express verifies it.

## 8. Production notes
Before deploying:
- Use HTTPS.
- Change JWT_SECRET.
- Change admin credentials.
- Use a proper production database/hosting setup if traffic grows.
- Add a real payment gateway such as Razorpay/Stripe after completing payment-provider onboarding.
- Add server-side rate limiting and stronger validation for a public launch.
