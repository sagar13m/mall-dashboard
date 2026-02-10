# 🏬 Mall Offline Brand Mapping Dashboard (Frontend)

## 📌 Overview

This project is a **React + Vite** frontend dashboard built to visualize results from the **Offline Gift Card Brand Mapping** backend system.

The backend identifies which offline gift card brands exist in shopping malls and stores the results in DynamoDB. This frontend provides an easy interface to:

- ✅ Browse mapped malls
- ✅ Search/filter malls
- ✅ View brands found inside each mall
- ✅ Inspect store names where brands were detected

It acts as a **read-only analytics dashboard** for validating and exploring brand availability.

---

## 🎯 Purpose

The main goals of this frontend:

- Provide a simple UI for business and technical users
- Validate backend brand matching results
- Allow quick filtering/search across malls
- Show brand availability clearly
- Make backend data accessible without database access

---

## ⚙️ Tech Stack

- **React 19**
- **Vite 7**
- **Vite React Plugin**
- **Plain CSS** (no UI framework)
- **Fetch API** for backend communication

---

## 📂 Project Structure

```
frontend/
│── src/
│   ├── App.jsx    # Main React component
│   └── App.css    # Dashboard styling
├
├── vite.config.js # Dev server + proxy config
├── package.json
└── index.html
```

---

## 🔌 Backend Integration

The frontend connects to the backend using:

```
/api/...
```

### Vite Proxy Configuration

From `vite.config.js`:

```javascript
server: {
  proxy: {
    "/api": {
      target: "http://localhost:3000/dev",
      changeOrigin: true,
      secure: false
    }
  }
}
```

This means:
- Frontend calls `/api/malls`
- Vite forwards requests to serverless backend
- Avoids CORS issues during development

---

## 📡 API Endpoints Used

### 1️⃣ List Malls

```
GET /api/malls
```

**Returns:**

```json
{
  "items": [
    {
      "mallKey": "...",
      "mallName": "...",
      "city": "...",
      "state": "...",
      "productsCount": 5
    }
  ]
}
```

Used for sidebar mall list.

### 2️⃣ Mall Details

```
GET /api/malls/{mallKey}
```

**Returns:**
- Mall info
- Products array:

```json
{
  "brandName": "Titan",
  "productId": "abc123xyz",
  "storeName": "Titan World - Orion Mall"
}
```

Used in main details panel.

---

## 🖥 UI Behavior Explained

### Sidebar — Mall List

**Features:**
- Displays all mapped malls
- Shows total malls + filtered count
- Highlights selected mall
- Scrollable list for large datasets

**Each mall card shows:**
- Mall name
- City + State
- Number of brands found

### Search Functionality

Search filters across:
- Mall name
- City
- State
- Mall key

**Search is:**
- Case insensitive
- Client-side filtering
- Instant results

### Min Brands Filter

Allows filtering malls by:

```javascript
productsCount >= minBrands
```

**Useful for:**
- Finding high-brand malls
- Filtering sparse data

### Mall Detail Panel

When a mall is selected:

**Shows:**
- Mall name
- City and state
- DynamoDB mallKey
- Total brands found

**Then renders a table:**

| Brand | Product ID | Store Name |
|-------|-----------|------------|
| ...   | ...       | ...        |

### Loading & Error Handling

Handled explicitly:
- ✅ Loading malls list
- ✅ Error fetching malls
- ✅ Loading mall details
- ✅ Error fetching details
- ✅ Empty state before selection

---

## 🎨 Styling Approach

Implemented in `App.css`:

- Flexbox layout
- Sidebar + main panel structure
- Card-based mall listing
- Responsive scrollable tables
- Minimalist design for clarity

**No external UI libraries used.**

---

## 🚀 Running the Frontend

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Start Development Server

```bash
npm run dev
```

Runs Vite dev server.

### 3️⃣ Build Production Bundle

```bash
npm run build
```

### 4️⃣ Preview Production Build

```bash
npm run preview
```

---

## ⚠️ Backend Requirement

The backend server must be running:

```bash
serverless offline
```

**Expected URL:**

```
http://localhost:3000/dev
```

Otherwise API calls will fail.

---

## 🧠 Key Engineering Decisions

### Lightweight Frontend
- No heavy UI frameworks
- Fast loading
- Minimal dependencies

### Client-side Filtering
- Reduces backend load
- Faster UX for moderate datasets

### Proxy-Based API Access
- Simplifies local development
- Avoids CORS complexity

### Clear Data Visualization
- Focus on readability
- Easy debugging of brand matches

---

## 👨‍💻 What I Implemented

- ✅ React dashboard UI
- ✅ Backend API integration
- ✅ Search/filter logic
- ✅ Mall detail visualization
- ✅ Error/loading state handling
- ✅ Vite proxy configuration
- ✅ Clean CSS layout

---
