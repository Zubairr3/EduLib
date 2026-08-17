# 📚 Modern E-Library Portal

A feature-rich, community-driven e-library web application built with **Node.js, Express, SQLite, and Tailwind CSS**. This platform allows members and administrators to discover, share, and manage various educational resources including books, videos, articles, images, PDFs, text notes, and links.

---

## ✨ Key Features

* **🔐 Secure Authentication:** Robust user registration and login system powered by **JWT (JSON Web Tokens)** and **bcryptjs** password hashing.
* **👥 Separate Auth Flows:** Clean tab-switched interface for signing in or creating new accounts seamlessly.
* **🌐 Community Sharing Feed:** Registered users and admins can publish resources, upload file/media links, and write custom text notes/summaries for others to view.
* **🏷️ Creator Attribution:** Every shared resource tracks and displays who posted it (*"Posted by: [Username]"*).
* **🔍 Real-Time Search:** Instantly filter resources by title, author, creator, or resource type as you type.
* **🛡️ Admin Command Center:** Dedicated management console allowing administrators to audit all registered platform users, manually reset user passwords, and publish official library media.
* **🎨 Modern Glassmorphism UI:** Styled with **Tailwind CSS**, featuring responsive cards, smooth transitions, custom toast notification alerts, and a password visibility toggle.

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js, SQLite3
* **Security & Auth:** JSON Web Tokens (JWT), bcryptjs, CORS middleware
* **Frontend:** HTML5, Tailwind CSS, jQuery, Google Fonts (Inter)
* **Hosting Platform:** Render (Cloud Web Service)

---

## 🚀 Live Demo & Access

You can access the live application directly in your browser without installing anything locally:
* **Live App URL:https://e-library-i4ws.onrender.com/dashboard.html

---

## 🔑 Test Credentials for Evaluators & Recruiters

You can use the following accounts to test both standard user features and administrative privileges right out of the box:

### 👤 Example Member Account
* **Username:** `User1`
* **Password:** `User123`
* *Access:* Community feed, resource sharing modal, search functionality, creator attribution.

### 🛡️ Administrator Account
* **Username:** `AdminZubair`
* **Password:** `SecurePassword123`
* *Access:* Full admin command center, member auditing table, manual password reset tool, and official publishing capabilities.

---

## 📁 Project Structure

```text
e-library/
├── middleware/
│   └── auth.js          # JWT token verification middleware
├── routes/
│   └── bookRoutes.js    # API endpoints for posts, searching, user auditing, and password resets
├── public/
│   ├── index.html       # Sign In & Register portal
│   ├── dashboard.html   # Community feed & resource sharing modal
│   └── admin.html       # Admin command center, user audit table, and password management
├── database.js          # SQLite database setup and default admin seeding
├── server.js            # Express app entry point
├── package.json         # Project dependencies and scripts
└── .gitignore           # Ignores node_modules and local database
