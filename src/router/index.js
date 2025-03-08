// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

// Import components
import SignIn from '@/views/SignIn.vue';
import SignUp from '@/views/SignUp.vue';
import HomePage from '@/views/HomePage.vue'; // We'll create this

// Define routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true } // Require authentication for home page
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn,
    meta: { guestOnly: true }
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
    meta: { guestOnly: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    // Using an inline component for now
    component: { template: '<div><h1>Orders</h1><p>Your orders will appear here.</p></div>' },
    meta: { requiresAuth: true }
  },
  {
    path: '/cart',
    name: 'Cart',
    // Using an inline component for now
    component: { template: '<div><h1>Cart</h1><p>Your shopping cart will appear here.</p></div>' },
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: { template: '<div><h1>Page Not Found</h1><p>The page you requested does not exist.</p></div>' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  
  // Initialize user from localStorage if not already done
  if (!userStore.user) {
    userStore.initializeUser();
  }
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    // Redirect to login
    next({ name: 'SignIn' });
  } 
  // Check if route is for guests only (like login/register)
  else if (to.meta.guestOnly && userStore.isAuthenticated) {
    // Redirect authenticated users to home
    next({ name: 'Home' });
  } 
  else {
    // Normal navigation
    next();
  }
});

export default router;