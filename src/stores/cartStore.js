// src/stores/cartStore.js
import { defineStore } from 'pinia'
import api from '@/services/apiService'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    totalItems(state) {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },

    totalPrice(state) {
      return state.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
    },

    isEmpty(state) {
      return state.items.length === 0
    },
  },

  actions: {
    // Fetch cart from server
    async fetchCart() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/1')
        this.items = response.data || []
        this.saveCart() // Backup to localStorage
        return this.items
      } catch (error) {
        console.error('Error fetching cart:', error)
        this.error = error.message
        this.loadCart() // Fallback to local storage if API fails
        return this.items
      } finally {
        this.loading = false
      }
    },

    // Add item to cart
    async addToCart(product) {
      this.loading = true

      try {
        // First update locally
        const existingItem = this.items.find((item) => item.id === product.id)

        if (existingItem) {
          existingItem.quantity += 1
        } else {
          this.items.push({
            ...product,
            quantity: 1,
          })
        }

        // Then sync with server
        await api.post('/cart/add', {
          productId: product.id,
          quantity: existingItem ? existingItem.quantity : 1,
        })

        this.saveCart()
      } catch (error) {
        console.error('Error adding to cart:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    // Remove item from cart
    async removeFromCart(productId) {
      this.loading = true

      try {
        const index = this.items.findIndex((item) => item.id === productId)

        if (index !== -1) {
          this.items.splice(index, 1)

          // Sync with server
          await api.delete(`/cart/remove/${productId}`)

          this.saveCart()
        }
      } catch (error) {
        console.error('Error removing from cart:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    // Update item quantity
    async updateQuantity(productId, quantity) {
      this.loading = true

      try {
        const item = this.items.find((item) => item.id === productId)

        if (item) {
          item.quantity = quantity

          if (item.quantity <= 0) {
            return this.removeFromCart(productId)
          }

          // Sync with server
          await api.put(`/cart/update`, {
            productId,
            quantity,
          })

          this.saveCart()
        }
      } catch (error) {
        console.error('Error updating cart:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    // Clear the entire cart
    async clearCart() {
      this.loading = true

      try {
        this.items = []

        // Sync with server
        await api.delete('/cart/clear')

        this.saveCart()
      } catch (error) {
        console.error('Error clearing cart:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    // Local storage methods (for offline support)
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },

    loadCart() {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        this.items = JSON.parse(savedCart)
      }
    },
  },
})
