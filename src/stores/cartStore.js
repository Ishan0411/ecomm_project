// src/stores/cartStore.js
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    loading: false
  }),
  
  getters: {
    // Total number of items in cart
    totalItems(state) {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },
    
    // Total price of all items in cart
    totalPrice(state) {
      return state.items.reduce(
        (total, item) => total + (item.price * item.quantity), 
        0
      ).toFixed(2);
    },
    
    // Check if cart is empty
    isEmpty(state) {
      return state.items.length === 0;
    }
  },
  
  actions: {
    // Add item to cart
    addToCart(product) {
      const existingItem = this.items.find(item => item.id === product.id);
      
      if (existingItem) {
        // If item already exists, increment quantity
        existingItem.quantity += 1;
      } else {
        // Otherwise add new item with quantity 1
        this.items.push({
          ...product,
          quantity: 1
        });
      }
      
      this.saveCart();
    },
    
    // Remove item from cart
    removeFromCart(productId) {
      const index = this.items.findIndex(item => item.id === productId);
      
      if (index !== -1) {
        this.items.splice(index, 1);
        this.saveCart();
      }
    },
    
    // Update item quantity
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId);
      
      if (item) {
        item.quantity = quantity;
        
        if (item.quantity <= 0) {
          this.removeFromCart(productId);
        } else {
          this.saveCart();
        }
      }
    },
    
    // Toggle item in cart (add or remove)
    toggleCart(product) {
      const existingItem = this.items.find(item => item.id === product.id);
      
      if (existingItem) {
        this.removeFromCart(product.id);
      } else {
        this.addToCart(product);
      }
    },
    
    // Check if product is in cart
    isInCart(productId) {
      return this.items.some(item => item.id === productId);
    },
    
    // Clear the entire cart
    clearCart() {
      this.items = [];
      this.saveCart();
    },
    
    // Save cart to localStorage
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
    
    // Load cart from localStorage
    loadCart() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.items = JSON.parse(savedCart);
      }
    }
  }
});