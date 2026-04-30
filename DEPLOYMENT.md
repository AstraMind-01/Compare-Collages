# Deployment Guide for College Discovery Platform

## Prerequisites
- A GitHub/GitLab account.
- Node.js installed locally.
- A PostgreSQL database (You can get a free one at [Supabase](https://supabase.com/) or [Neon](https://neon.tech/)).

---

## 1. Local Setup & Testing

### Database Setup
1. Create a PostgreSQL database locally or on a cloud provider.
2. In the `backend` folder, copy `.env.example` to `.env` and fill in your connection string:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   JWT_SECRET=your_super_secret_key
   PORT=5000
   ```
3. Run the following commands in the `backend` directory to initialize and seed the DB:
   ```bash
   npm run build
   npm run seed
   ```

### Running Backend
1. In the `backend` folder, run:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`.*

### Running Frontend
1. In the `frontend` folder, create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
2. Run the frontend:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

---

## 2. Deploying Backend (Render or Railway)

### Using Render
1. Push your code to a GitHub repository.
2. Go to [Render](https://render.com/) and click **New > Web Service**.
3. Connect your GitHub repository.
4. Set the following configuration:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add the **Environment Variables**:
   - `DATABASE_URL` (Your production Postgres URL)
   - `JWT_SECRET` (A strong random string)
6. Click **Create Web Service**.

*Note: You may need to run the `npm run seed` script locally pointing to your production database URL once to populate the initial data.*

---

## 3. Deploying Frontend (Vercel or Netlify)

### Using Vercel
1. Go to [Vercel](https://vercel.com/) and click **Add New > Project**.
2. Import your GitHub repository.
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   - `VITE_API_URL` -> *(The URL of your deployed Render backend, e.g., `https://college-api.onrender.com/api`)*
5. Click **Deploy**.

---

## 4. Final Verification
- Visit your Vercel URL.
- Test searching and filtering colleges.
- Select colleges to compare.
- Create an account, log in, and save a college.
- Check the Dashboard to ensure the saved college appears.
