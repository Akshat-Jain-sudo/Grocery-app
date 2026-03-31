# 🛒 FreshCart Grocery Application

FreshCart is a modern, responsive, dark-mode Single Page Application (SPA) designed to simulate a complete grocery shopping experience. It features real-time cart calculations, category filtering, a seamless checkout flow, and a decoupled architecture ready for cloud deployment.

## 🚀 Features

- **Premium UI**: Glassmorphism elements, micro-animations, and a responsive grid system built entirely without external CSS frameworks.
- **Dynamic Product Browsing**: Includes search functionality and filtering across 6 distinct grocery categories.
- **Robust Cart Management**: Dynamic adding/removing of items, responsive subtotal/total calculations, and a progress bar incentivizing a "Free Delivery" threshold ($25+).
- **Checkout & Orders**: Form validation for customer details and simulated order placement returning an auto-generated tracking ID.
- **Decoupled Architecture**: Separated `frontend` and `backend` repositories to facilitate independent hosting (e.g., Render Web Services & Static Sites).

---

## 📂 Project Structure

The project has been separated into two distinct environments to easily deploy to distinct hosting servers.

```text
📦 Grocery app
 ┣ 📂 backend          # Node.js Express API Server
 ┃ ┣ 📂 data           # In-memory product/category database
 ┃ ┣ 📂 middleware     # Error handling
 ┃ ┣ 📂 routes         # Express routers (cart, orders, products)
 ┃ ┣ 📜 index.js       # Main API entrypoint
 ┃ ┗ 📜 package.json   # Backend dependencies (express, cors, uuid)
 ┃
 ┗ 📂 frontend         # Vanilla JS Single Page Application
   ┣ 📂 css            # Native CSS design system (styles.css)
   ┣ 📂 js             # Client logic (api.js, store.js, app.js)
   ┗ 📜 index.html     # Setup routing shell
```

---

## 🛠️ How to Run Locally

Since the frontend and backend are decoupled, you must run both servers simultaneously.

### 1. Start the Backend API (Port 3000)
Open your terminal, navigate to the `backend` folder, install dependencies, and start the API:
```bash
cd backend
npm install
npm start
```

### 2. Start the Frontend Website (Port 5000)
Open a **new** separate terminal, navigate to the `frontend` folder, and serve the static files. You can use any static server. If you have Python installed, you can run:
```bash
cd frontend
python -m http.server 5000
```
*(Alternatively, you can run `npx serve` if you prefer Node-based servers).*

### 3. Open the App 
Navigate to **[http://localhost:5000](http://localhost:5000)** in your browser! The frontend will automatically detect the local environment and route its API calls to your running `http://localhost:3000/api` backend server.

---

## ☁️ How to Deploy to Render

### Step 1: Deploy the Backend (Web Service)
1. Push this entire repository to GitHub.
2. Log into Render and create a new **Web Service**.
3. Set your repository and configure the **Root Directory** as `backend`.
4. Set the Build Command to `npm install` and the Start Command to `npm start`.
5. Once deployed, Render will generate an API URL (e.g., `https://freshcart-api-demo.onrender.com`). Copy this!

### Step 2: Configure the Frontend
1. Open `frontend/js/api.js`.
2. Locate the `const API_BASE` variable configuration at the top of the file.
3. Replace the placeholder URL with your new Web Service URL from Step 1 (making sure to leave the `/api` route suffix).
4. Commit and push this change to GitHub.

### Step 3: Deploy the Frontend (Static Site)
1. Create a new **Static Site** on Render.
2. Select your repository again, but this time configure the **Root Directory** as `frontend`.
3. Clear out the Build Command entirely, and set the Publish Directory strictly to `.`.
4. Render will deploy your frontend blazing fast via its CDN, fully wired up to your backend!

---

## 📄 Documentation

An in-depth Software Requirements Specification document (`FreshCart_SRS.doc`) is available in the root directory covering the system constraints, external interfaces, and functional rules of the platform.
