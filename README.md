<div align="center">

<img src="https://raw.githubusercontent.com/YOUR_USERNAME/crowdcash-plus/main/assets/logo.png" alt="CrowdCash+ Logo" width="120" height="120" />

# CrowdCash+

### 🚀 A Production-Ready Full-Stack Crowdfunding Platform

*Empowering campaigns. Connecting hearts. Changing lives.*

[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment-072654?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com/)
[![Render](https://img.shields.io/badge/Deployed_on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)
[![Netlify](https://img.shields.io/badge/Frontend-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://netlify.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[🌐 Live Demo](https://crowdcash.netlify.app) &nbsp;·&nbsp;
[📖 API Docs](https://crowdcash-backend.onrender.com/swagger-ui.html) &nbsp;·&nbsp;
[🐛 Report Bug](https://github.com/YOUR_USERNAME/crowdcash-plus/issues) &nbsp;·&nbsp;
[✨ Request Feature](https://github.com/YOUR_USERNAME/crowdcash-plus/issues)

</div>

---

## 📸 Screenshots

<details open>
<summary><b>🏠 Home Page</b></summary>
<br/>

> [SCREENSHOT_1: Home page showing hero banner, featured campaigns grid, category cards]

</details>

<details>
<summary><b>📋 Campaign Listing & Search</b></summary>
<br/>

> [SCREENSHOT_2: Campaign listing with filters sidebar, category tabs, and campaign cards with progress bars]

</details>

<details>
<summary><b>💰 Campaign Detail & Live Donation Feed</b></summary>
<br/>

> [SCREENSHOT_3: Campaign detail page with progress bar, countdown timer, real-time donor feed, rewards section]

</details>

<details>
<summary><b>✨ AI Campaign Assistant</b></summary>
<br/>

> [SCREENSHOT_4: Create campaign page with AI assistant panel showing suggestions in real-time]

</details>

<details>
<summary><b>💳 Razorpay Donation Flow</b></summary>
<br/>

> [SCREENSHOT_5: Donation page with amount picker, reward selection, and Razorpay checkout modal]

</details>

<details>
<summary><b>📊 Admin Analytics Dashboard</b></summary>
<br/>

> [SCREENSHOT_6: Admin dashboard with KPI cards, Chart.js line/bar/doughnut charts, top campaigns table]

</details>

<details>
<summary><b>👤 User Dashboard</b></summary>
<br/>

> [SCREENSHOT_7: User dashboard with campaign stats, badge shelf, donation history, analytics charts]

</details>

<details>
<summary><b>🏅 Leaderboard</b></summary>
<br/>

> [SCREENSHOT_8: Leaderboard showing podium for top 3, table for ranks 4-10, toggle for monthly/all-time]

</details>

---

## ✨ Features

### 👤 Authentication & User Management
- ✅ JWT Authentication with Access + Refresh Token rotation
- ✅ Google OAuth 2.0 Single Sign-On (SSO)
- ✅ BCrypt password hashing
- ✅ Email verification on registration
- ✅ Forgot password via email reset link
- ✅ Role-based authorization (USER / ADMIN)
- ✅ Profile management with avatar upload (Cloudinary)
- ✅ Change password with current password verification

### 📣 Campaign Management
- ✅ Full campaign CRUD (Create, Read, Update, Delete)
- ✅ 6 categories: Medical, Education, Startup, Disaster Relief, Animal Welfare, Social Cause
- ✅ Multi-image upload + verification documents
- ✅ Admin campaign verification workflow (Pending → Approved / Rejected)
- ✅ Campaign pause / resume
- ✅ Campaign updates (creator posts progress reports)
- ✅ Auto-expire campaigns past deadline via scheduled job
- ✅ Search + advanced filters (category, sort, location, goal range)
- ✅ Bookmark campaigns

### 💸 Donation & Payments
- ✅ Razorpay payment gateway integration
- ✅ Anonymous donation option
- ✅ Custom donation amounts + preset buttons
- ✅ Reward tiers (created by campaign creators)
- ✅ Auto reward assignment after successful donation
- ✅ PDF donation receipt generation with QR code
- ✅ Email receipt with PDF attachment

### ⚡ Real-Time Features (WebSocket / STOMP)
- ✅ Live donation feed on campaign pages
- ✅ Live progress bar animation on new donations
- ✅ Live donor count update
- ✅ Real-time notifications pushed to users
- ✅ Goal achievement notification

### 💬 Social & Community
- ✅ Threaded comments with nested replies
- ✅ Q&A section (ask questions, creator answers)
- ✅ Campaign reporting (fraud, spam, abuse)
- ✅ Native Web Share API integration (Mobile-optimized sharing)
- ✅ Social sharing (WhatsApp, Facebook, LinkedIn, X, Copy Link)
- ✅ Leaderboard (Top Donors, Top Campaigns, Top Creators)

### 🔔 Notifications
- ✅ In-app notification center with read/unread states
- ✅ Real-time bell badge with unread count
- ✅ 14 notification types covering all platform events
- ✅ Email notifications for all major events

### 🏅 Gamification
- ✅ 8 achievement badges with auto-assignment rules
- ✅ Badge shelf on profile and dashboard
- ✅ Badge notifications via WebSocket

### 📊 Dashboards & Analytics
- ✅ Admin dashboard: KPIs, 4 Chart.js charts, top campaigns/donors table
- ✅ User dashboard: personal stats, campaign performance, donation history
- ✅ Fraud detection panel: flagged donations, reported campaigns, suspicious users

### 🤖 AI Campaign Assistant
- ✅ Powered by Claude (Anthropic API)
- ✅ Suggests better campaign titles
- ✅ Rewrites descriptions to be more persuasive
- ✅ Recommends funding goals based on category
- ✅ Highlights missing campaign information
- ✅ Provides fundraising tips

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 17 | Core language |
| Spring Boot 3.x | Application framework |
| Spring Security | Authentication & authorization |
| Spring Data JPA + Hibernate | ORM & database access |
| Spring Mail | Email sending |
| Spring WebSocket (STOMP) | Real-time communication |
| JWT (jjwt 0.12.x) | Stateless authentication |
| BCrypt | Password hashing |
| iText 7 | PDF receipt generation |
| ZXing | QR code generation |
| Razorpay Java SDK | Payment processing |
| Cloudinary | Cloud file storage |
| Maven | Build tool |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router DOM v6 | Client-side routing |
| Axios | HTTP client |
| Tailwind CSS 3 | Utility-first styling |
| Chart.js + react-chartjs-2 | Analytics charts |
| SockJS + STOMP.js | WebSocket client |
| canvas-confetti | Donation success animation |
| Vite | Build tool |

### Infrastructure
| Service | Purpose |
|---|---|
| MySQL 8.0 | Primary database |
| Render | Backend hosting |
| Netlify | Frontend hosting |
| Railway | MySQL hosting |
| Cloudinary | Image & file storage |
| GitHub | Version control & CI |

---

## 📁 Project Structure

```
crowdcash-plus/
│
├── crowdcash-backend/
│   └── src/main/java/com/crowdcash/
│       ├── config/           # SecurityConfig, WebSocketConfig, CorsConfig
│       ├── controller/       # REST controllers
│       ├── dto/              # Request & Response DTOs
│       ├── entity/           # JPA entities (20 entities)
│       ├── enums/            # CampaignStatus, NotificationType, BadgeType...
│       ├── exception/        # GlobalExceptionHandler + custom exceptions
│       ├── repository/       # Spring Data JPA repositories
│       ├── security/         # JwtUtil, JwtAuthFilter, UserDetailsServiceImpl
│       ├── service/          # Business logic services
│       ├── util/             # PdfService, EmailService, FileStorageService
│       └── CrowdCashApplication.java
│
├── crowdcash-frontend/
│   └── src/
│       ├── api/              # Axios API layer (authApi, campaignApi, donationApi...)
│       ├── components/
│       │   ├── common/       # Button, Input, Modal, Spinner, Pagination
│       │   ├── campaign/     # CampaignCard, ProgressBar, CountdownTimer
│       │   ├── donation/     # DonationForm, DonorFeed, ReceiptCard
│       │   ├── layout/       # Navbar, Footer, Sidebar
│       │   └── admin/        # AdminTable, RemarksModal
│       ├── context/          # AuthContext, NotificationContext, WebSocketContext
│       ├── hooks/            # useAuth, useWebSocket, usePagination
│       ├── pages/            # One folder per route
│       ├── routes/           # PrivateRoute, AdminRoute, AppRouter
│       ├── utils/            # formatCurrency, formatDate, shareUtils
│       └── websocket/        # WebSocketService.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

| Tool | Version | Download |
|---|---|---|
| Java JDK | 17+ | [adoptium.net](https://adoptium.net/) |
| Maven | 3.9+ | [maven.apache.org](https://maven.apache.org/) |
| Node.js | 20+ | [nodejs.org](https://nodejs.org/) |
| MySQL | 8.0+ | [mysql.com](https://www.mysql.com/) |
| Git | latest | [git-scm.com](https://git-scm.com/) |

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/crowdcash-plus.git
cd crowdcash-plus
```

---

### 2. Set Up the Database

```sql
-- In MySQL client or Workbench
CREATE DATABASE crowdcash CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### 3. Configure the Backend

```bash
cd crowdcash-backend

# Copy the example environment file
cp .env.example .env
```

Open `.env` and fill in your values:

```env
DB_URL=jdbc:mysql://localhost:3306/crowdcash
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

# Generate a strong secret: openssl rand -hex 64
JWT_SECRET=paste_64_char_hex_here

MAIL_USERNAME=your_gmail@gmail.com
MAIL_PASSWORD=your_gmail_app_password   # NOT your regular password

RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

FRONTEND_URL=http://localhost:5173

AI_API_KEY=sk-ant-your_anthropic_key   # Optional for AI features
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App passwords → Generate one for "Mail".

Run the backend:
```bash
mvn spring-boot:run
```

Backend starts at: `http://localhost:8080`

---

### 4. Configure the Frontend

```bash
cd crowdcash-frontend

# Copy the example file
cp .env.example .env
```

`.env` content:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_WS_URL=http://localhost:8080/ws
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
```

Install and run:
```bash
npm install
npm run dev
```

Frontend starts at: `http://localhost:5173`

---

### 5. Default Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@crowdcash.com` | `Admin@123` |
| User | Register a new account | — |

> The admin account is created by `data.sql` which runs automatically on first startup.

---

## ☁️ Deployment

### Backend → Render (Free)

1. Push backend to GitHub
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your GitHub repo
4. Set:
   - **Build Command:** `mvn clean package -DskipTests`
   - **Start Command:** `java -jar target/crowdcash-backend-*.jar`
5. Add all environment variables from your `.env` file in the Render dashboard
6. Deploy 🎉

Your backend will be live at: `https://crowdcash-backend.onrender.com`

---

### Database → Railway (Free $5 credit)

1. Go to [railway.app](https://railway.app) → **New Project → MySQL**
2. Copy the connection details
3. Update `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` in Render environment variables

---

### Frontend → Netlify (Free)

1. Push frontend to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site → Import from GitHub**
3. Set:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Add environment variables (point `VITE_API_BASE_URL` to your Render backend URL)
5. Add `netlify.toml` for React Router support:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```
6. Deploy 🎉

Your frontend will be live at: `https://crowdcash.netlify.app`

---

## 🔌 API Documentation

Base URL: `https://crowdcash-backend.onrender.com/api/v1`

All authenticated endpoints require:
```
Authorization: Bearer <access_token>
```

### Quick Reference

| Module | Base Path | Key Endpoints |
|---|---|---|
| Auth | `/auth` | POST `/register`, `/login`, `/refresh-token` |
| Users | `/users` | GET `/me`, PUT `/me`, POST `/me/avatar` |
| Campaigns | `/campaigns` | GET `/`, POST `/`, GET `/{id}` |
| Donations | `/donations` | POST `/initiate`, POST `/verify` |
| Payments | Handled via donations | — |
| Rewards | `/rewards` | GET `/campaign/{id}`, POST `/campaign/{id}` |
| Comments | `/comments` | GET/POST `/campaign/{id}` |
| Questions | `/questions` | GET/POST `/campaign/{id}` |
| Bookmarks | `/bookmarks` | POST/DELETE `/{campaignId}` |
| Notifications | `/notifications` | GET `/`, PUT `/read-all` |
| Leaderboard | `/leaderboard` | GET `/top-donors`, `/top-campaigns` |
| Analytics | `/analytics` | GET `/overview`, `/donations/monthly` |
| AI | `/ai` | POST `/full-assist` |

> Full Postman collection: [Download here](https://github.com/YOUR_USERNAME/crowdcash-plus/blob/main/CrowdCash_Postman_Collection.json)

---

## 🌱 Module Overview

| Module | Description |
|---|---|
| **Module 1 — Auth & Users** | JWT auth, email verification, password reset, user profiles, avatar upload |
| **Module 2 — Campaigns** | CRUD, admin verification, search/filter, bookmarks, campaign updates |
| **Module 3 — Donations & Payments** | Razorpay integration, reward tiers, PDF receipts with QR codes |
| **Module 4 — Real-Time & Social** | WebSocket live feed, notifications, comments, Q&A, reports, leaderboard |
| **Module 5 — Dashboards & AI** | Admin analytics, user dashboard, badges, fraud detection, Claude AI assistant |

---

## 🔐 Security

- All passwords hashed with BCrypt (strength 10)
- JWT tokens with short expiry (15 min) + refresh rotation
- CORS configured to allow only the frontend origin
- Input validation on all endpoints with Bean Validation
- SQL injection protected by JPA parameterized queries
- No secrets in code — all via environment variables
- `.gitignore` prevents `.env` files from being committed

---

## 🤝 Contributing

Contributions are welcome!

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feat/your-feature-name

# 3. Commit your changes
git commit -m "feat(scope): add your feature"

# 4. Push to your fork
git push origin feat/your-feature-name

# 5. Open a Pull Request
```

Please follow the existing code style and include meaningful commit messages.

---

## 🙏 Acknowledgements

- [Spring Boot](https://spring.io/projects/spring-boot) — for the robust backend framework
- [Razorpay](https://razorpay.com/docs/) — for the seamless payment gateway
- [Anthropic Claude](https://www.anthropic.com/) — for the AI campaign assistant
- [Tailwind CSS](https://tailwindcss.com/) — for the beautiful utility-first styling
- [Chart.js](https://www.chartjs.org/) — for the analytics visualizations

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Your Name](https://github.com/YOUR_USERNAME)**

If this project helped you, please consider giving it a ⭐

</div>
