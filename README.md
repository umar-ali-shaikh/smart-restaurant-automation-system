
Restaurant-Automation
├─ .agents
├─ backend
│  ├─ .env
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ seedAdmin.js
│  └─ src
│     ├─ config
│     │  ├─ cloudinary.js
│     │  ├─ db.js
│     │  └─ env.js
│     ├─ controllers
│     │  ├─ authController.js
│     │  ├─ categoryController.js
│     │  ├─ menuController.js
│     │  ├─ orderController.js
│     │  ├─ reviewController.js
│     │  ├─ staffController.js
│     │  ├─ tableController.js
│     │  └─ userController.js
│     ├─ middleware
│     │  ├─ authMiddleware.js
│     │  ├─ errorMiddleware.js
│     │  ├─ rateLimiter.js
│     │  └─ upload.js
│     ├─ models
│     │  ├─ Admin.js
│     │  ├─ Category.js
│     │  ├─ Employee.js
│     │  ├─ MenuItem.js
│     │  ├─ Order.js
│     │  ├─ Review.js
│     │  ├─ Table.js
│     │  └─ Users.js
│     ├─ routes
│     │  ├─ authRoutes.js
│     │  ├─ categoryRoutes.js
│     │  ├─ menuRoutes.js
│     │  ├─ orderRoutes.js
│     │  ├─ reviewRoutes.js
│     │  ├─ staffRoutes.js
│     │  ├─ tableRoutes.js
│     │  └─ userRoutes.js
│     ├─ server.js
│     └─ sockets
│        └─ orderSocket.js
    ├─ frontend
    │  ├─ .env
    │  ├─ dist
    │  │  ├─ assets
    │  │  │  ├─ AdminPanel-DYjl2c_g.js
    │  │  │  ├─ CartPage-BN2wc-Bd.js
    │  │  │  ├─ FrontPage-BR-mRu6H.js
    │  │  │  ├─ html2canvas.esm-DXEQVQnt.js
    │  │  │  ├─ index-B5SgvjuR.js
    │  │  │  ├─ index-CQPS-j7R.css
    │  │  │  ├─ index.es-DO1O_oDk.js
    │  │  │  ├─ KitchenDashboard-DhTgCjHU.js
    │  │  │  ├─ orderService-B2lhxjTg.js
    │  │  │  ├─ OrderStatus-CsOTJxO_.js
    │  │  │  ├─ PaymentPage-B-YXDJEK.js
    │  │  │  ├─ purify.es-CC4Brkr_.js
    │  │  │  ├─ socket-CZWseypL.js
    │  │  │  ├─ star-D--2uIQQ.js
    │  │  │  └─ useDashboardOrders-WJnpcYPg.js
    │  │  ├─ index.html
    │  │  └─ vite.svg
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
    │  │  │  ├─ layout
    │  │  │  │  └─ Navbar.jsx
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
    │  │  │  │  ├─ pages
    │  │  │  │  │  ├─ CartPage.jsx
    │  │  │  │  │  ├─ FrontPage.jsx
    │  │  │  │  │  ├─ MenuPage.jsx
    │  │  │  │  │  ├─ OrderStatus.jsx
    │  │  │  │  │  └─ PaymentPage.jsx
    │  │  │  │  └─ services
    │  │  │  │     ├─ customerService.js
    │  │  │  │     ├─ menuService.js
    │  │  │  │     ├─ orderService.js
    │  │  │  │     ├─ tableService.js
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
    │  │  │  │  │  ├─ OrdersPage.jsx
    │  │  │  │  │  └─ UserOrdersPage.jsx
    │  │  │  │  └─ services
    │  │  │  │     ├─ customerOrderService.js
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
    │  │  │  └─ routeConfig.js
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

#   s m a r t - r e s t a u r a n t - a u t o m a t i o n - s y s t e m  
 