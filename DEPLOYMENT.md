# 🚀 Deployment Guide for LibQueue

Since LibQueue is a full-stack application with a React frontend and an Express/SQLite backend, the standard way to host it for free is to deploy the **Frontend on Vercel (or Netlify)** and the **Backend on Render**.

I have already updated the codebase to use environment variables so you can deploy seamlessly!

---

## Part 1: Deploy Backend to Render.com (Free)
Vercel is great for the frontend, but because your backend requires WebSockets (Socket.io) and an SQLite database, it needs a continuous server platform like Render.

1. **Push your code to GitHub**: Commit all changes and push your entire repository to GitHub.
2. Sign up at [Render.com](https://render.com/) using GitHub.
3. Click **New +** and select **Web Service**.
4. Connect the GitHub repository where you uploaded the project.
5. Provide these settings:
   - **Name**: `libqueue-backend`
   - **Root Directory**: `backend` (Important: type exactly `backend`)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npx ts-node src/index.ts`
6. Click **Create Web Service**. 
7. Once deployed, Render will give you a live URL (e.g., `https://libqueue-backend.onrender.com`). *Copy this URL!*

---

## Part 2: Deploy Frontend to Vercel (Free)

1. Go to [Vercel.com](https://vercel.com/) and sign up with GitHub.
2. Click **Add New Project** and import the same repository.
3. In the Configuration screen:
   - Expand the **Framework Preset** section if needed (Vercel should automatically detect **Vite**).
   - **Root Directory**: Click "Edit" and select `frontend`.
4. Maximize the **Environment Variables** section and add these two keys:
   - **Name**: `VITE_API_URL`
   - **Value**: Your Render Backend URL + `/api` (e.g., `https://libqueue-backend.onrender.com/api`)
   - **Name**: `VITE_SOCKET_URL`
   - **Value**: Your Render Backend URL entirely (e.g., `https://libqueue-backend.onrender.com`)
5. Click **Deploy**.

*(Alternatively, for **Netlify**, the steps are identical. Connect repo -> select `frontend` folder -> Add the same Environment Variables -> Deploy).*

---

### Verify Deployment
1. Wait for both deployments to finish (Render takes ~2 minutes, Vercel takes ~1 minute).
2. Go to your new Vercel URL.
3. Test logging in using the demo account: `admin` / `admin123`.

*Note: Since the backend is running on Render's Free tier, the SQLite database will reset if the server goes to "sleep" (after 15 minutes of inactivity). This means the demo queue and added users will reset, but it's completely fine for a live portfolio demo!*
