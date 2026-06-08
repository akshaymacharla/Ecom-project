# 🛒 BuyThings — Full-Stack E-Commerce Web Application

<div align="center">

![BuyThings Banner](https://img.shields.io/badge/BuyThings-E--Commerce-6366f1?style=for-the-badge&logo=shopping-cart&logoColor=white)

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment-072654?style=flat-square&logo=razorpay&logoColor=white)](https://razorpay.com/)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

**A production-ready, role-based e-commerce application with secure JWT authentication, Razorpay payment integration, and a modern React frontend.**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#-environment-variables)
- [Role-Based Access](#-role-based-access)
- [Payment Integration](#-payment-integration)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🌟 Overview

**BuyThings** is a feature-complete full-stack e-commerce web application built for learning and portfolio purposes. It demonstrates real-world development practices including:

- **Stateless JWT Authentication** with role-based access control
- **Secure credential management** using environment variables (no hardcoded secrets)
- **Razorpay payment gateway** in test mode
- **Responsive dark-themed UI** with glassmorphism and micro-animations
- **MySQL database** with Hibernate ORM auto-schema management
- **RESTful API** design with proper HTTP status codes and error handling

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 24 | Programming language |
| Spring Boot | 3.5.7 | Application framework |
| Spring Security | 6.x | Authentication & authorization |
| Spring Data JPA | 3.x | Database ORM layer |
| Hibernate | 6.x | JPA implementation |
| MySQL | 8.0 | Production database |
| JJWT (jjwt-api) | 0.12.6 | JWT token generation & validation |
| Lombok | Latest | Boilerplate code reduction |
| Maven | 3.x | Build & dependency management |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2 | UI library |
| Vite | 5.2 | Build tool & dev server |
| React Router DOM | 6.x | Client-side routing |
| Axios | 1.6 | HTTP client with interceptors |
| Bootstrap | 5.3 | UI component library |
| Bootstrap Icons | 1.11 | Icon set |
| Razorpay JS SDK | CDN | Payment gateway |

---

## ✨ Features

### 🔐 Authentication & Authorization
- [x] User Registration (name, email, password, role selection)
- [x] User Login with JWT token generation
- [x] Secure password hashing with **BCrypt**
- [x] Stateless JWT authentication (no sessions)
- [x] Automatic token injection on every API request
- [x] Auto-redirect to login on token expiry (401 handling)
- [x] Protected routes on the frontend

### 👤 User Roles

#### `ROLE_ADMIN` — Administrator
- [x] Access Admin Dashboard with statistics
- [x] Add new products (with image upload)
- [x] Update existing products
- [x] Delete products
- [x] View and manage all orders
- [x] Update order status (Pending → Confirmed → Shipped → Delivered)
- [x] View and manage all users (enable/disable accounts)

#### `ROLE_USER` — Customer
- [x] Browse all products
- [x] Search products by keyword
- [x] Filter products by category
- [x] View product details
- [x] Add/remove items from cart
- [x] Adjust cart item quantities
- [x] Checkout with Razorpay payment
- [x] View order history with status tracking
- [x] Manage profile (update display name)

### 🛍️ Product Management
- [x] Full CRUD operations on products
- [x] Product image upload and retrieval (stored as BLOB in MySQL)
- [x] Category filtering (Laptop, Mobile, Headphone, Electronics, Toys, Fashion)
- [x] Keyword search across product name, brand, description, category
- [x] Stock quantity tracking
- [x] Product availability toggle

### 🛒 Cart & Checkout
- [x] Persistent cart (server-side API-backed, synced across devices)
- [x] Real-time cart item quantity adjustment (bounded by stock)
- [x] Animated "Add to Cart" toast notification
- [x] Cart item image display
- [x] Order summary modal before payment
- [x] Razorpay payment popup (test mode)
- [x] Post-payment success/failure toast notifications
- [x] Automatic stock deduction on successful purchase
- [x] Email notifications via Spring `@Async` for orders and registration

### ❤️ Wishlist & Engagement
- [x] Add/remove products from a personal wishlist
- [x] Direct move from wishlist to cart
- [x] Product reviews and 5-star rating system
- [x] Address manager for saving multiple shipping addresses

### 🐳 Deployment & DevOps
- [x] Full Dockerization (Dockerfiles + docker-compose)
- [x] Nginx reverse proxy for frontend to backend routing

### 💅 UI/UX
- [x] Dark/Light theme toggle
- [x] Glassmorphism card design on auth pages
- [x] Toast notification system (slide-in, auto-dismiss with progress bar)
- [x] Smooth animations and hover effects
- [x] Responsive layout for all screen sizes
- [x] Admin sidebar navigation
- [x] Category-based product filtering on homepage

---

## 📁 Project Structure

```
Ecom-project/
│
├── ecom-backend/apple-main/ecom-project/      # Spring Boot Backend
│   ├── src/main/java/com/akshay/ecom_project/
│   │   ├── EcomProjectApplication.java        # Main entry point
│   │   ├── config/
│   │   │   ├── SecurityConfig.java            # Spring Security + CORS + JWT filter chain
│   │   │   └── JwtAuthenticationFilter.java   # JWT validation on every request
│   │   ├── controller/
│   │   │   ├── AuthController.java            # /api/auth/register, /login, /logout
│   │   │   ├── ProductController.java         # /api/products, /api/product/**
│   │   │   ├── OrderController.java           # /api/orders/**
│   │   │   └── UserController.java            # /api/users/**, /api/user/me
│   │   ├── model/
│   │   │   ├── Product.java                   # Product entity (image stored as BLOB)
│   │   │   ├── User.java                      # User entity (ROLE_ADMIN | ROLE_USER)
│   │   │   ├── Order.java                     # Order entity with status enum
│   │   │   └── OrderItem.java                 # Order line items
│   │   ├── repo/
│   │   │   ├── ProductRepo.java               # Keyword search JPQL query
│   │   │   ├── UserRepo.java                  # findByEmail, existsByEmail
│   │   │   └── OrderRepo.java                 # findByUser, findAllByOrderDate
│   │   ├── service/
│   │   │   ├── ProductService.java            # Product business logic
│   │   │   ├── UserService.java               # UserDetailsService + auth logic
│   │   │   ├── OrderService.java              # Order placement & management
│   │   │   └── JwtService.java                # Token generation & validation
│   │   ├── dto/
│   │   │   ├── RegisterRequest.java           # Registration payload
│   │   │   ├── LoginRequest.java              # Login payload
│   │   │   ├── AuthResponse.java              # JWT + user info response
│   │   │   └── OrderRequest.java              # Order placement payload
│   │   └── exception/
│   │       └── GlobalExceptionHandler.java    # Centralized error handling
│   └── src/main/resources/
│       ├── application.properties             # Main config (env-var driven)
│       └── application-local.properties       # 🔒 Git-ignored local overrides
│
├── ecom-frontend/ecom-frontend-5-main/        # React + Vite Frontend
│   ├── src/
│   │   ├── App.jsx                            # Root component + routes
│   │   ├── App.css                            # Global styles + dark/light theme
│   │   ├── axios.jsx                          # Axios instance with JWT interceptors
│   │   ├── Context/
│   │   │   └── Context.jsx                    # Global state (auth, cart, toasts)
│   │   └── components/
│   │       ├── Navbar.jsx                     # Nav with search, auth links, theme toggle
│   │       ├── Home.jsx                       # Product grid with category filter
│   │       ├── Product.jsx                    # Product detail page
│   │       ├── AddProduct.jsx                 # Admin: add product form
│   │       ├── UpdateProduct.jsx              # Admin: edit product form
│   │       ├── Cart.jsx                       # Shopping cart page
│   │       ├── CheckoutPopup.jsx              # Order summary + Razorpay trigger
│   │       ├── AdminDashboard.jsx             # Admin panel (stats, products, orders, users)
│   │       ├── UserDashboard.jsx              # User home with quick links
│   │       ├── Login.jsx                      # Glassmorphism login form
│   │       ├── Register.jsx                   # Registration with role selector
│   │       ├── OrderHistory.jsx               # User order history with status badges
│   │       ├── Profile.jsx                    # User profile & name update
│   │       ├── Toast.jsx                      # Animated notification system
│   │       ├── ProtectedRoute.jsx             # Route guard for auth/admin
│   │       └── AccessDenied.jsx               # 403 error page
│   ├── .env                                   # 🔒 Git-ignored (real API keys)
│   ├── .env.example                           # ✅ Committed (template)
│   └── index.html                             # Root HTML (Razorpay CDN script)
```

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          BROWSER                                 │
│                                                                  │
│  React + Vite (localhost:5173)                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │  Navbar  │ │   Home   │ │   Cart   │ │  AdminDashboard  │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │
│       │              │             │              │              │
│       └──────────────┼─────────────┼──────────────┘              │
│                      ▼             ▼                              │
│              Context.jsx (Global State: auth, cart, toasts)      │
│                      │             │                              │
│              axios.jsx (JWT Interceptor + 401 handler)           │
└──────────────────────┼─────────────────────────────────────────┘
                       │  HTTP/REST (JSON)
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Spring Boot API (localhost:8080)               │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │           JwtAuthenticationFilter (every request)         │  │
│  └───────────────────────────────────────────────────────────┘  │
│       │                                                          │
│  ┌────▼──────┐  ┌────────────┐  ┌───────────┐  ┌───────────┐  │
│  │  Auth     │  │  Product   │  │   Order   │  │   User    │  │
│  │Controller │  │ Controller │  │Controller │  │Controller │  │
│  └────┬──────┘  └─────┬──────┘  └─────┬─────┘  └─────┬─────┘  │
│       │               │               │               │          │
│  ┌────▼──────┐  ┌─────▼──────┐  ┌────▼──────┐  ┌────▼──────┐  │
│  │UserService│  │ProductSvc  │  │OrderSvc   │  │JwtService │  │
│  └────┬──────┘  └─────┬──────┘  └─────┬─────┘  └───────────┘  │
│       │               │               │                          │
│  ┌────▼──────────────────────────────▼─────────────────────┐   │
│  │              Spring Data JPA Repositories                 │   │
│  └────────────────────────────┬────────────────────────────┘   │
└───────────────────────────────┼─────────────────────────────────┘
                                │  JDBC
                                ▼
                    ┌──────────────────────┐
                    │   MySQL 8.0          │
                    │   buythings_db       │
                    │  ┌────────────────┐  │
                    │  │    product     │  │
                    │  │    users       │  │
                    │  │    orders      │  │
                    │  │    order_items │  │
                    │  └────────────────┘  │
                    └──────────────────────┘
```

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | Login and get JWT token |
| `POST` | `/api/auth/logout` | Any | Logout (client-side token clear) |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/products` | Public | Get all products |
| `GET` | `/api/products/search?keyword=` | Public | Search products |
| `GET` | `/api/product/{id}` | Public | Get product by ID |
| `GET` | `/api/product/{id}/image` | Public | Get product image |
| `POST` | `/api/product` | Admin only | Add new product (multipart) |
| `PUT` | `/api/product/{id}` | Admin only | Update product |
| `DELETE` | `/api/product/{id}` | Admin only | Delete product |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/orders` | User | Place a new order |
| `GET` | `/api/orders/my` | User | Get own order history |
| `GET` | `/api/orders` | Admin only | Get all orders |
| `PUT` | `/api/orders/{id}/status` | Admin only | Update order status |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/user/me` | Any logged in | Get own profile |
| `PUT` | `/api/user/me` | Any logged in | Update own name |
| `GET` | `/api/users` | Admin only | Get all users |
| `DELETE` | `/api/users/{id}` | Admin only | Delete a user |
| `PUT` | `/api/users/{id}/toggle` | Admin only | Enable/disable user |

### Auth Response Format
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 1,
  "name": "Akshay",
  "email": "akshay@example.com",
  "role": "ROLE_ADMIN"
}
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| Java JDK | 21 or 24 | [adoptium.net](https://adoptium.net/) |
| Maven | 3.9+ | Included via `mvnw` wrapper |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| MySQL | 8.0 | [mysql.com](https://dev.mysql.com/downloads/) |
| Git | Any | [git-scm.com](https://git-scm.com/) |

---

### Backend Setup

#### 1. Clone the repository
```bash
git clone https://github.com/your-username/buythings.git
cd buythings
```

#### 2. Create the MySQL database
```bash
mysql -u root -p
```
```sql
CREATE DATABASE buythings_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

#### 3. Configure environment (Option A — Direct in `application.properties`)

Open `ecom-backend/apple-main/ecom-project/src/main/resources/application.properties`
and update the default password fallback:
```properties
spring.datasource.password=${DB_PASSWORD:your_mysql_password}
```

#### 3. Configure environment (Option B — Recommended: use `application-local.properties`)
Create the file (it is already git-ignored):
```
ecom-backend/apple-main/ecom-project/src/main/resources/application-local.properties
```
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/buythings_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

#### 4. Build and run the backend
```bash
cd ecom-backend/apple-main/ecom-project

# Build (downloads all dependencies including MySQL driver)
./mvnw clean package -DskipTests

# Run
./mvnw spring-boot:run
```

✅ Backend starts at **http://localhost:8080**

Hibernate will automatically create all required tables in `buythings_db`:
- `product`
- `users`
- `orders`
- `order_items`

---

### Frontend Setup

#### 1. Navigate to frontend directory
```bash
cd ecom-frontend/ecom-frontend-5-main
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Configure environment variables
Copy the example file and fill in your values:
```bash
cp .env.example .env
```

Edit `.env`:
```env
# Your Razorpay Test Key ID (from dashboard.razorpay.com)
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_here

# Backend API URL (keep as-is for local development)
VITE_API_BASE_URL=http://localhost:8080/api
```

#### 4. Start the development server
```bash
npm run dev
```

✅ Frontend starts at **http://localhost:5173**

---

## 🔑 Environment Variables

### Backend — `application.properties` (uses `${VAR:default}` syntax)

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_URL` | MySQL JDBC URL | `jdbc:mysql://localhost:3306/buythings_db?...` |
| `DB_USERNAME` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | *(empty)* |
| `JWT_SECRET` | JWT signing key (64+ chars) | *(local dev default)* |
| `RAZORPAY_KEY_ID` | Razorpay Key ID | *(empty)* |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | *(empty)* |

### Frontend — `.env` file (Vite `VITE_` prefix)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_RAZORPAY_KEY_ID` | Razorpay Key ID (public, safe in browser) | `rzp_test_abc123` |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080/api` |

> ⚠️ **Security Note:** The Razorpay **Key Secret** must NEVER be in the frontend. It belongs only on the backend server.

---

## 🛡 Role-Based Access

### Frontend Route Protection

| Route | Access | Component |
|-------|--------|-----------|
| `/` | Public | `Home` — product listing |
| `/product/:id` | Public | `Product` — product detail |
| `/login` | Public | `Login` |
| `/register` | Public | `Register` |
| `/cart` | Public | `Cart` |
| `/dashboard` | User + Admin | `UserDashboard` |
| `/orders` | User + Admin | `OrderHistory` |
| `/profile` | User + Admin | `Profile` |
| `/admin` | Admin only | `AdminDashboard` |
| `/add_product` | Admin only | `AddProduct` |
| `/product/update/:id` | Admin only | `UpdateProduct` |
| `/access-denied` | Public | `AccessDenied` |

### JWT Token Flow
```
1. User logs in → POST /api/auth/login
2. Backend validates credentials → Returns { token, userId, name, email, role }
3. Frontend stores token in localStorage
4. Axios interceptor reads token → Adds "Authorization: Bearer <token>" header
5. Backend JwtAuthenticationFilter validates token on every protected request
6. If token expired → 401 → Axios interceptor clears localStorage → Redirects to /login
```

---

## 💳 Payment Integration

BuyThings uses **Razorpay** in test mode.

### How It Works
1. User clicks "Checkout" in cart → Order summary modal opens
2. User clicks "Pay ₹X →" → Razorpay popup opens
3. User completes payment with test card
4. On success → `handler` callback fires → Cart cleared → Stock updated → Success toast shown
5. On failure → Error toast shown

### Razorpay Test Credentials

| Payment Method | Details |
|----------------|---------|
| Card (Success) | `4111 1111 1111 1111` · Any CVV · Any future date |
| Card (Failure) | `4000 0000 0000 0002` · Any CVV · Any future date |
| UPI (Success) | `success@razorpay` |
| UPI (Failure) | `failure@razorpay` |
| Net Banking | Any bank → Test mode (no real debit) |

> To go live: replace `rzp_test_...` keys with `rzp_live_...` keys from Razorpay dashboard.

---

## 🗃 Database Schema

```sql
-- Users table
CREATE TABLE users (
  id       BIGINT AUTO_INCREMENT PRIMARY KEY,
  name     VARCHAR(255) NOT NULL,
  email    VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,          -- BCrypt hashed
  role     ENUM('ROLE_ADMIN','ROLE_USER') NOT NULL,
  enabled  BOOLEAN NOT NULL DEFAULT TRUE
);

-- Products table
CREATE TABLE product (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(255),
  brand             VARCHAR(255),
  description       VARCHAR(255),
  category          VARCHAR(255),
  price             DECIMAL(38,2),
  stock_quantity    INT NOT NULL,
  product_available BIT(1) NOT NULL,
  release_date      DATETIME(6),
  image_name        VARCHAR(255),          -- original filename
  image_type        VARCHAR(255),          -- MIME type
  image_data        LONGBLOB               -- image bytes
);

-- Orders table
CREATE TABLE orders (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT NOT NULL,
  order_date    DATETIME(6) NOT NULL,
  total_amount  DECIMAL(10,2) NOT NULL,
  order_status  ENUM('PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED') DEFAULT 'PENDING',
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order line items
CREATE TABLE order_items (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id   BIGINT NOT NULL,
  product_id INT NOT NULL,
  quantity   INT NOT NULL,
  price      DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id)   REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Addresses table
CREATE TABLE addresses (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id        BIGINT NOT NULL,
  full_name      VARCHAR(255) NOT NULL,
  phone_number   VARCHAR(255) NOT NULL,
  address_line1  VARCHAR(255) NOT NULL,
  city           VARCHAR(255) NOT NULL,
  state          VARCHAR(255) NOT NULL,
  country        VARCHAR(255) NOT NULL,
  pincode        VARCHAR(255) NOT NULL,
  is_default     BOOLEAN NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Reviews table
CREATE TABLE reviews (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  product_id  INT NOT NULL,
  reviewer_id BIGINT NOT NULL,
  rating      INT NOT NULL,
  comment     TEXT,
  created_at  DATETIME(6) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES product(id),
  FOREIGN KEY (reviewer_id) REFERENCES users(id)
);
```

> These tables are auto-created by Hibernate on first startup (`ddl-auto=update`).

---

## 📸 Screenshots

### 🏠 Home Page — Product Grid
Dark-themed product listing with category filters and search.

### 🔐 Login / Register
Glassmorphism card design with animated background gradient.

### 🛒 Cart & Checkout
Real-time cart with quantity controls, Razorpay payment popup.

### 🖥 Admin Dashboard
Sidebar navigation with statistics, product management, order status updates, and user management.

---

## ☁️ Deployment

### Backend on Railway / Render

1. **Push code to GitHub** (secrets are already git-ignored ✅)
2. Connect your GitHub repo to Railway/Render
3. Set **Environment Variables** in the platform dashboard:

```env
DB_URL=jdbc:mysql://<your-cloud-db-host>:3306/buythings_db?useSSL=true&serverTimezone=UTC
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=generate-a-random-64-char-string-here
RAZORPAY_KEY_ID=rzp_test_Sz3HUeNh4GLW0K
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

4. Set build command: `./mvnw clean package -DskipTests`
5. Set start command: `java -jar target/ecom-project-0.0.1-SNAPSHOT.jar`

### Frontend on Vercel / Netlify

1. Connect your GitHub repo
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set **Environment Variables**:
```env
VITE_RAZORPAY_KEY_ID=rzp_test_Sz3HUeNh4GLW0K
VITE_API_BASE_URL=https://your-backend-url.railway.app/api
```

### Update CORS for Production

In `SecurityConfig.java`, add your production frontend URL:
```java
config.setAllowedOrigins(List.of(
    "http://localhost:5173",
    "https://your-frontend.vercel.app"  // add this
));
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Akshay Macharla**

Built with ❤️ using Spring Boot + React for portfolio & learning purposes.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">

⭐ **Star this repo if you found it helpful!** ⭐

</div>
