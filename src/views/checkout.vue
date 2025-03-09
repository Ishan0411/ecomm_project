<template>
    <div class="checkout-container">
      <div class="checkout-form">
        <h2>Checkout</h2>
  
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
  
        <form @submit.prevent="handleCheckout">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              required
              placeholder="Enter your email"
            />
          </div>
  
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input 
              type="text" 
              id="phone" 
              v-model="phone" 
              required
              placeholder="Enter your phone number"
            />
          </div>
  
          <button 
            type="submit" 
            class="checkout-button" 
            :disabled="loading"
          >
            {{ loading ? 'Processing...' : 'Proceed to Checkout' }}
          </button>
        </form>
  
        <div class="order-summary">
          <p><strong>Total Items:</strong> {{ totalItems }}</p>
          <p><strong>Total Price:</strong> ₹{{ totalPrice }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed, ref } from 'vue';
  import { useCartStore } from '@/stores/cartStore';
  import { useUserStore } from '@/stores/userStore';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'checkout',
  
    setup() {
      const cartStore = useCartStore();
      const userStore = useUserStore();
      const router = useRouter();
      
      const email = ref('');
      const phone = ref('');
      const errorMessage = ref('');
      const loading = computed(() => userStore.loading);
  
      const totalItems = computed(() => cartStore.totalItems);
      const totalPrice = computed(() => cartStore.totalPrice);
  
      const handleCheckout = async () => {
        errorMessage.value = '';
  
        if (!email.value || !phone.value) {
          errorMessage.value = 'Please provide both email and phone number.';
          return;
        }
  
        const data = {
          email: email.value,
          phone: phone.value,
          cartItems: cartStore.items,
          totalAmount: totalPrice.value,
        };
  
        try {
          // Send data to backend API to process the checkout
          const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
  
          const result = await response.json();
  
          if (result.success) {
            router.push('/confirmation'); // Redirect to a confirmation page
          } else {
            errorMessage.value = result.error || 'An error occurred during checkout';
          }
        } catch (error) {
          errorMessage.value = 'Network error, please try again later.';
        }
      };
  
      return {
        email,
        phone,
        errorMessage,
        loading,
        totalItems,
        totalPrice,
        handleCheckout,
      };
    },
  };
  </script>
  
  <style scoped>
  .checkout-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
  }
  
  .checkout-form {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .checkout-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #1052ec;
    border: 1px solid lightblue;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 1rem;
  }
  
  .checkout-button:hover {
    background-color: gray;
  }
  
  .checkout-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .error-message {
    color: #c40000;
    background-color: #fff1f1;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #c40000;
    border-radius: 4px;
  }
  
  .order-summary {
    text-align: center;
    margin-top: 20px;
  }
  </style>
  