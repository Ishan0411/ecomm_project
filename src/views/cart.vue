<template>
    <div class="cart-container">
      <h2>Shopping Cart</h2>
  
      <!-- Display cart items -->
      <div v-if="cartItems.length > 0" class="cart-items-grid">
        <div v-for="item in cartItems" :key="item.id" class="product-card">
          <div class="product-image">
            <img :src="item.image" alt="Product Image" />
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ item.name }}</h3>
            <p class="product-price">Price: ₹{{ item.price }}</p>
  
            <!-- Quantity controls -->
            <div class="quantity-controls">
              <button @click="decrementQuantity(item.id)">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="incrementQuantity(item.id)">+</button>
            </div>
  
            <button class="remove-btn" @click="removeFromCart(item.id)">Remove</button>
          </div>
        </div>
      </div>
  
      <!-- Empty cart message -->
      <div v-else class="empty-cart">
        <p>Your cart is empty.</p>
        <router-link to="/" class="continue-shopping">Continue Shopping</router-link>
      </div>
  
      <!-- Cart summary -->
      <!-- Cart summary -->
<div v-if="cartItems.length > 0" class="cart-summary">
  <p><strong>Total Items:</strong> {{ totalItems }}</p>
  <p><strong>Total Price:</strong> ₹{{ totalPrice }}</p>
  <button class="clear-cart" @click="clearCart">Clear Cart</button>
  <!-- Move the Checkout button below the Clear Cart button -->
  <router-link to="/checkout" class="checkout-btn">Proceed to Checkout</router-link>
</div>

    </div>
  </template>
  
  <script>
  import { useCartStore } from "@/stores/cartStore";
  import { computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  
  export default {
    setup() {
      const cartStore = useCartStore();
      const router = useRouter();
  
      // Get cart items and total price from the store
      const cartItems = computed(() => cartStore.items);
      const totalItems = computed(() => cartStore.totalItems);
      const totalPrice = computed(() => cartStore.totalPrice);
  
      // Mock data for testing the cart (initializing cartStore with mock data)
      const mockData = [
        {
          id: 1,
          name: "iPhone 15 Pro Max",
          price: 149999,
          quantity: 1,
          image: "https://m.media-amazon.com/images/I/81CgtwSII3L._AC_UL480_FMwebp_QL65_.jpg"
        },
        {
          id: 2,
          name: "AirPods Pro (2nd Gen)",
          price: 24999,
          quantity: 2,
          image: "https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_UL480_FMwebp_QL65_.jpg"
        },
        {
          id: 3,
          name: "MacBook Pro M2",
          price: 189999,
          quantity: 1,
          image: "https://m.media-amazon.com/images/I/71-Vbp1LkgL._AC_UL480_FMwebp_QL65_.jpg"
        }
      ];
  
      // Load the saved cart when the component mounts
      onMounted(() => {
        cartStore.loadCart();
        // If cart is empty, set mock data for testing
        if (cartStore.items.length === 0) {
          cartStore.items = mockData;
          cartStore.saveCart(); // Save to localStorage
        }
      });
  
      // Increment quantity of item
      const incrementQuantity = (productId) => {
        cartStore.updateQuantity(productId, cartStore.items.find(item => item.id === productId).quantity + 1);
      };
  
      // Decrement quantity of item
      const decrementQuantity = (productId) => {
        cartStore.updateQuantity(productId, cartStore.items.find(item => item.id === productId).quantity - 1);
      };
  
      // Remove item from cart
      const removeFromCart = (productId) => {
        cartStore.removeFromCart(productId);
      };
  
      // Clear the entire cart and redirect to orders page
      const clearCart = () => {
        cartStore.clearCart();
        router.push("/orders"); // Redirect to the orders page
      };
  
      return {
        cartItems,
        totalItems,
        totalPrice,
        incrementQuantity,
        decrementQuantity,
        removeFromCart,
        clearCart
      };
    }
  };
  </script>
  
  <style scoped>
  /* Same styling as before */
  .cart-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Roboto', Arial, sans-serif;
  }
  
  h2 {
    text-align: center;
  }
  
  .cart-items-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 15px;
    margin-top: 20px;
    overflow-y: auto;
    max-height: 600px;
  }
  
  .product-card {
    border-radius: 8px;
    overflow: hidden;
    background-color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    border: 1px solid #f0f0f0;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .product-image {
    position: relative;
    height: 150px;
    overflow: hidden;
    background-color: #f9f9f9;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .product-image img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  .product-info {
    padding: 12px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  
  .product-name {
    font-size: 0.9rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  .product-price {
    font-size: 1rem;
    font-weight: bold;
    color: #0095DA;
    margin-bottom: 0.3rem;
  }
  
  .quantity-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
  }
  
  .quantity-controls button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .quantity-controls button:hover {
    background-color: #0056b3;
  }
  
  .remove-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;
    margin-top: 10px;
  }
  
  .remove-btn:hover {
    background-color: #b02a37;
  }
  
  .cart-summary {
    text-align: center;
    margin-top: 20px;
    font-size: 1.1rem;
  }
  
  .clear-cart {
    background-color: #007bff;
    color: white;
    padding: 8px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .clear-cart:hover {
    background-color: #0056b3;
  }
  
  .checkout-btn {
    background-color: #28a745;
    color: white;
    padding: 8px;
    margin-top: 10px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    text-decoration: none;
    display: inline-block;
  }
  
  .checkout-btn:hover {
    background-color: #218838;
  }
  
  .empty-cart {
    text-align: center;
    font-size: 18px;
    margin-top: 50px;
  }
  
  .continue-shopping {
    display: inline-block;
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #28a745;
    color: white;
    text-decoration: none;
    border-radius: 5px;
  }
  
  .continue-shopping:hover {
    background-color: #218838;
  }
  </style>
  