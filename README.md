# 🍽️ Smart Restaurant Automation System

A full-stack **Restaurant Automation Platform** built using the **MERN Stack** that digitizes the complete restaurant workflow—from QR-based ordering to kitchen management, billing, and analytics.

> Scan QR → Browse Menu → Place Order → Kitchen Receives Order → Live Order Tracking → Billing → Analytics

---

## 📸 Project Preview

> Add screenshots or GIFs here

- Customer Interface
- Kitchen Dashboard
- Admin Dashboard
- Analytics Dashboard

---

# ✨ Features

## 👨‍🍳 Customer Features

### 📱 QR Code Menu
- Scan QR code from the table
- Automatically opens digital menu
- No app installation required

### 🍔 Digital Menu
- Category-wise menu
- Food images
- Description
- Pricing
- Availability status

### 🛒 Cart Management
- Add to Cart
- Increase / Decrease Quantity
- Remove Items
- Live Total Calculation

### 📦 Order Management
- Place Order
- Instant Kitchen Notification
- Real-time Order Tracking

### 🔔 Live Order Status
- Order Placed
- Accepted
- Preparing
- Ready
- Served

### 💳 Payment
- Cash Payment
- Online Payment Ready
- Automatic Bill Generation

### ⭐ Customer Reviews
- Star Rating
- Review System
- Trending Dishes based on Reviews

---

# 👨‍🍳 Kitchen Dashboard (KDS)

Kitchen staff can manage all incoming orders.

### Features

- 🔔 Real-time Order Notifications
- 📥 Incoming Orders
- 🔄 Update Order Status
- ⏱ Live Order Queue
- 🍽 Table-wise Orders
- Ready Notification

Order Flow

```
Placed
   ↓
Accepted
   ↓
Preparing
   ↓
Ready
   ↓
Served
```

---

# 👨‍💼 Restaurant Admin Dashboard

Complete restaurant management system.

## 📊 Dashboard

- Today's Revenue
- Total Orders
- Active Tables
- Pending Orders
- Best Selling Items

---

## 🍔 Menu Management

- Add Menu Item
- Edit Menu
- Delete Menu
- Upload Food Images
- Category Management

---

## 🪑 Table Management

- Create Tables
- Generate QR Codes
- Table Availability
- Table Status

---

## 📦 Order Management

- View Orders
- Update Status
- Cancel Orders
- Order History

---

## 👨‍🍳 Staff Management

- Admin Login
- Kitchen Staff Login
- Employee Management

---

## ⭐ Review Management

- Customer Reviews
- Rating Analytics
- Trending Food Detection

---

## 📈 Analytics

- Revenue Reports
- Orders Analytics
- Top Selling Items
- Customer Statistics
- Table Usage Reports

---

# ⚡ Automation Features

- 🤖 Smart Dish Recommendation
- 📦 Inventory Alert (Future)
- 📈 Best Selling Detection
- 🔥 Trending Menu
- Live Notifications

---

# 🚀 SaaS Ready Features

- Multi Restaurant Support
- Subscription Plans
- Restaurant Analytics
- Cloud Deployment
- Multi Tenant Architecture

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Context API
- Axios
- Socket.io Client
- React Router

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.io
- JWT Authentication
- Cloudinary
- Multer

---

## Tools

- Git
- GitHub
- Postman
- Render
- MongoDB Atlas

---

# 📂 Project Structure

```
Restaurant-Automation
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── src
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── middleware
│   ├── sockets
│   └── package.json
│
└── README.md
```

---

# 🔐 Authentication

- JWT Authentication
- Protected Routes
- Admin Authorization
- Staff Authorization

---

# 📡 Real-Time Features

- Live Kitchen Orders
- Order Status Updates
- Instant Notifications
- Socket.io Integration

---

# 📊 Modules

✅ Authentication

✅ Customer Module

✅ Kitchen Dashboard

✅ Admin Dashboard

✅ Menu Management

✅ Category Management

✅ Table Management

✅ QR Code System

✅ Order Management

✅ Billing

✅ Reviews

✅ Analytics Dashboard

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/umar-ali-shaikh/smart-restaurant-automation-system.git
```

---

## Backend

```bash
cd backend
npm install
npm run dev
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🌐 Environment Variables

## Backend (.env)

```env
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

---

# 🚀 Deployment

### Frontend

- Render
- Vercel

### Backend

- Render

### Database

- MongoDB Atlas

---

# 📌 Future Improvements

- AI Dish Recommendation
- Inventory Management
- Waiter Panel
- POS Integration
- Multi Restaurant SaaS
- Coupon System
- Loyalty Program
- Push Notifications
- Online Payment Gateway
- Bill Split
- Multi Language Support

---

# 👨‍💻 Author

**Umar Ali Shaikh**

Full Stack MERN Developer

GitHub: https://github.com/umar-ali-shaikh

---

# ⭐ If you like this project

Give this repository a ⭐ on GitHub.






```
Restaurant-Automation
├─ .agents
├─ backend
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ seedAdmin.js
│  ├─ src
│  │  ├─ config
│  │  │  ├─ auth.js
│  │  │  ├─ cloudinary.js
│  │  │  ├─ cors.js
│  │  │  ├─ db.js
│  │  │  └─ env.js
│  │  ├─ controllers
│  │  │  ├─ authController.js
│  │  │  ├─ categoryController.js
│  │  │  ├─ menuController.js
│  │  │  ├─ orderController.js
│  │  │  ├─ reviewController.js
│  │  │  ├─ staffController.js
│  │  │  ├─ tableController.js
│  │  │  └─ userController.js
│  │  ├─ middleware
│  │  │  ├─ authMiddleware.js
│  │  │  ├─ errorMiddleware.js
│  │  │  ├─ rateLimiter.js
│  │  │  ├─ requestOriginMiddleware.js
│  │  │  ├─ upload.js
│  │  │  ├─ validateObjectId.js
│  │  │  └─ validateRequest.js
│  │  ├─ models
│  │  │  ├─ Admin.js
│  │  │  ├─ Category.js
│  │  │  ├─ Employee.js
│  │  │  ├─ MenuItem.js
│  │  │  ├─ Order.js
│  │  │  ├─ Review.js
│  │  │  ├─ Table.js
│  │  │  ├─ TableSession.js
│  │  │  └─ Users.js
│  │  ├─ modules
│  │  │  ├─ menu
│  │  │  │  └─ menuCatalogService.js
│  │  │  ├─ orders
│  │  │  │  ├─ orderPolicy.js
│  │  │  │  └─ orderService.js
│  │  │  └─ reviews
│  │  │     └─ reviewAnalyticsService.js
│  │  ├─ routes
│  │  │  ├─ authRoutes.js
│  │  │  ├─ categoryRoutes.js
│  │  │  ├─ healthRoutes.js
│  │  │  ├─ menuRoutes.js
│  │  │  ├─ orderRoutes.js
│  │  │  ├─ reviewRoutes.js
│  │  │  ├─ staffRoutes.js
│  │  │  ├─ tableRoutes.js
│  │  │  └─ userRoutes.js
│  │  ├─ server.js
│  │  ├─ shared
│  │  │  ├─ errors
│  │  │  │  └─ AppError.js
│  │  │  └─ validation
│  │  │     └─ schemas.js
│  │  └─ sockets
│  │     └─ orderSocket.js
│  └─ test
│     ├─ orderPolicy.test.js
│     └─ validation.test.js
├─ docs
│  ├─ ARCHITECTURE.md
│  └─ DEPLOYMENT.md
├─ frontend
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ api
│  │  │  ├─ apiConfig.js
│  │  │  ├─ client.js
│  │  │  ├─ normalizers.js
│  │  │  └─ socket.js
│  │  ├─ app
│  │  │  ├─ router
│  │  │  │  ├─ AppRouter.jsx
│  │  │  │  ├─ customerRoutes.jsx
│  │  │  │  └─ staffRoutes.jsx
│  │  │  └─ routes
│  │  │     └─ paths.js
│  │  ├─ App.jsx
│  │  ├─ components
│  │  │  ├─ analytics
│  │  │  │  ├─ AnalyticsCards.jsx
│  │  │  │  ├─ ExportMenu.jsx
│  │  │  │  ├─ FilterBar.jsx
│  │  │  │  ├─ OrdersBarChart.jsx
│  │  │  │  ├─ RevenueAreaChart.jsx
│  │  │  │  ├─ RevenueTrendChart.jsx
│  │  │  │  ├─ StatusPieChart.jsx
│  │  │  │  ├─ TableUsageChart.jsx
│  │  │  │  ├─ TopSellingChart.jsx
│  │  │  │  └─ TransactionTable.jsx
│  │  │  ├─ charts
│  │  │  │  ├─ BarChart.jsx
│  │  │  │  └─ DonutChart.jsx
│  │  │  ├─ common
│  │  │  │  └─ NotificationStack.jsx
│  │  │  └─ ui
│  │  │     ├─ Modal.jsx
│  │  │     └─ Toast.jsx
│  │  ├─ context
│  │  │  ├─ authContext.js
│  │  │  └─ AuthProvider.jsx
│  │  ├─ features
│  │  │  ├─ analytics
│  │  │  │  ├─ pages
│  │  │  │  │  └─ AnalyticsPage.jsx
│  │  │  │  └─ services
│  │  │  │     └─ analyticsService.js
│  │  │  ├─ auth
│  │  │  │  ├─ components
│  │  │  │  ├─ pages
│  │  │  │  │  └─ LoginPage.jsx
│  │  │  │  └─ services
│  │  │  │     └─ authService.js
│  │  │  ├─ billing
│  │  │  │  └─ pages
│  │  │  │     └─ BillingPage.jsx
│  │  │  ├─ category
│  │  │  │  ├─ components
│  │  │  │  │  └─ CategoryModal.jsx
│  │  │  │  ├─ pages
│  │  │  │  │  └─ CategoryPage.jsx
│  │  │  │  └─ services
│  │  │  │     └─ categoryService.js
│  │  │  ├─ customer
│  │  │  │  ├─ components
│  │  │  │  │  ├─ screens
│  │  │  │  │  │  ├─ CuisineScreen.jsx
│  │  │  │  │  │  ├─ FeedbackScreen.jsx
│  │  │  │  │  │  ├─ LoadingScreen.jsx
│  │  │  │  │  │  ├─ SuccessScreen.jsx
│  │  │  │  │  │  ├─ WelcomeScreen.jsx
│  │  │  │  │  │  └─ WorkflowScreen.jsx
│  │  │  │  │  ├─ shared
│  │  │  │  │  │  ├─ CartSheet.jsx
│  │  │  │  │  │  ├─ FloatingBar.jsx
│  │  │  │  │  │  ├─ KitchenToast.jsx
│  │  │  │  │  │  ├─ TopBar.jsx
│  │  │  │  │  │  └─ TrendingCarousel.jsx
│  │  │  │  │  └─ Tag.jsx
│  │  │  │  ├─ context
│  │  │  │  │  └─ GuestSessionProvider.jsx
│  │  │  │  ├─ pages
│  │  │  │  │  ├─ CartPage.jsx
│  │  │  │  │  ├─ CustomerOrdersPage.jsx
│  │  │  │  │  ├─ FrontPage.jsx
│  │  │  │  │  ├─ MenuPage.jsx
│  │  │  │  │  ├─ OrderStatus.jsx
│  │  │  │  │  ├─ PaymentPage.jsx
│  │  │  │  │  └─ ReviewPage.jsx
│  │  │  │  └─ services
│  │  │  │     └─ userService.js
│  │  │  ├─ dashboard
│  │  │  │  ├─ components
│  │  │  │  │  ├─ AdminTabs.jsx
│  │  │  │  │  ├─ DashboardOverview.jsx
│  │  │  │  │  ├─ ReportsPlaceholder.jsx
│  │  │  │  │  ├─ StatsStrip.jsx
│  │  │  │  │  └─ SummarySidebar.jsx
│  │  │  │  └─ pages
│  │  │  │     └─ AdminPanel.jsx
│  │  │  ├─ kitchen
│  │  │  │  ├─ components
│  │  │  │  │  └─ KitchenOrderBoard.jsx
│  │  │  │  └─ pages
│  │  │  │     └─ KitchenDashboard.jsx
│  │  │  ├─ menu
│  │  │  │  ├─ components
│  │  │  │  │  └─ MenuModal.jsx
│  │  │  │  ├─ pages
│  │  │  │  │  └─ MenuPage.jsx
│  │  │  │  └─ services
│  │  │  │     └─ menuService.js
│  │  │  ├─ orders
│  │  │  │  ├─ components
│  │  │  │  │  ├─ OrderCard.jsx
│  │  │  │  │  └─ OrderColumn.jsx
│  │  │  │  ├─ pages
│  │  │  │  │  └─ OrdersPage.jsx
│  │  │  │  └─ services
│  │  │  │     └─ orderService.js
│  │  │  ├─ reviews
│  │  │  │  ├─ pages
│  │  │  │  │  └─ ReviewsPage.jsx
│  │  │  │  └─ services
│  │  │  │     └─ reviewService.js
│  │  │  ├─ staff
│  │  │  │  ├─ components
│  │  │  │  │  └─ StaffModal.jsx
│  │  │  │  ├─ pages
│  │  │  │  │  └─ StaffPage.jsx
│  │  │  │  └─ services
│  │  │  │     └─ staffService.js
│  │  │  └─ tables
│  │  │     ├─ components
│  │  │     │  ├─ QRModal.jsx
│  │  │     │  └─ TableModal.jsx
│  │  │     ├─ pages
│  │  │     │  └─ TablesPage.jsx
│  │  │     └─ services
│  │  │        └─ tableService.js
│  │  ├─ hooks
│  │  │  ├─ useDashboardOrders.js
│  │  │  └─ useMesaStore.js
│  │  ├─ index.css
│  │  ├─ layouts
│  │  │  ├─ AdminLayout.jsx
│  │  │  ├─ CustomerLayout.jsx
│  │  │  └─ KitchenLayout.jsx
│  │  ├─ main.jsx
│  │  ├─ routes
│  │  │  ├─ AppRoutes.jsx
│  │  │  ├─ ProtectedRoutes.jsx
│  │  │  └─ StaffAuthBoundary.jsx
│  │  ├─ styles
│  │  │  ├─ tailwind.css
│  │  │  └─ theme.js
│  │  └─ utils
│  │     ├─ analytics.js
│  │     ├─ dashboardHelpers.js
│  │     ├─ exportCsv.js
│  │     ├─ exportExcel.js
│  │     ├─ exportPdf.js
│  │     ├─ format.js
│  │     └─ utils.js
│  ├─ tailwind.config.js
│  └─ vite.config.js
├─ README.md
└─ Smart Restaurant Automation Features.txt

```