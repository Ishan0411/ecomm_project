<template>
  <div class="product-detail-container" v-if="product">
    <div class="product-detail-wrapper">
      <!-- Product Images Section -->
      <div class="product-images">
        <div class="main-image">
          <img :src="selectedImage" :alt="product.name" />
        </div>
        <div class="image-thumbnails">
          <img
            v-for="(image, index) in product.images"
            :key="index"
            :src="image"
            :alt="`${product.name} - view ${index + 1}`"
            :class="{ active: selectedImage === image }"
            @click="selectedImage = image"
          />
        </div>
      </div>

      <!-- Product Info Section -->
      <div class="product-info">
        <h1 class="product-name">
  <template v-if="selectedOffering?.name">
    {{ selectedOffering.name }}
  </template>
  <template v-else>
    {{ product.name }}
  </template>
</h1>

        <div class="product-rating">
          <div class="stars">
            <span
              v-for="star in 5"
              :key="star"
              class="star"
              :class="{ filled: star <= Math.round(product.rating) }"
              >★</span
            >
          </div>
          
          <!-- <span class="rating-count">{{ product.rating }} ({{ product.ratingCount }} reviews)</span> -->
          <span class="rating-count">{{ product.ratingCount ? product.rating + ' (' + product.ratingCount + ' reviews)' : '' }}</span>

        </div>

        <div class="product-price">
  ₹{{ formatPrice(selectedOffering?.price || 0) }}
</div>

        <div class="seller-section">
          <label for="seller-select">Seller:</label>
          <select id="seller-select" v-model="selectedSellerId" @change="updateSelectedSeller">
            <option v-for="seller in product.sellers" :key="seller.id" :value="seller.id">
              {{ seller.name }}
            </option>
          </select>
        </div>

        <div class="product-description">
          <h3>Description</h3>
          <p>{{ product.description }}</p>
        </div>

        <div class="quantity-section">
          <label for="quantity">Quantity:</label>
          <div class="quantity-controls">
            <button
              class="quantity-btn"
              @click="decreaseQuantity"
              :class="{ 'delete-btn': quantity === 1 }"
            >
              <span v-if="quantity > 1">-</span>
              <span v-else class="trash-icon">🗑️</span>
            </button>
            <input
              type="number"
              id="quantity"
              v-model="quantity"
              min="1"
              @input="validateQuantity"
            />
            <button class="quantity-btn" @click="increaseQuantity">+</button>
          </div>
        </div>

        <!-- Add to Cart button with loading state -->
        <button class="add-to-cart-btn" @click="handleAddToCart" :disabled="isAddingToCart">
          {{ isAddingToCart ? 'Adding...' : 'Add to Cart' }}
        </button>

        <!-- Error message display -->
        <div v-if="addToCartError" class="error-message">
          {{ addToCartError }}
        </div>

        <div class="product-details">
          <h3>Product Details</h3>
          <ul>
            <li v-for="(value, key) in product.details" :key="key">
              <strong>{{ formatKey(key) }}:</strong> {{ value }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Reviews Section -->
    <div class="reviews-section">
     
      <!-- <h2>Customer Reviews</h2>
      <div class="review-summary">
        <div class="avg-rating">
          <span class="rating-number">{{ product.rating }}</span>
          <div class="stars">
            <span
              v-for="star in 5"
              :key="star"
              class="star"
              :class="{ filled: star <= Math.round(product.rating) }"
              >★</span
            >
          </div>
          <span>{{ product.ratingCount }} reviews</span>
        </div>
        <div v-for="i in 5" :key="i" class="rating-bar-container">
  <span class="star-label">{{ 6 - i }} star</span>
  <div class="rating-bar">
    <div 
      class="rating-bar-fill" 
      :style="{ width: `${(product.rating >= i) ? 100 : 0}%` }">
    </div>
  </div>
  
</div>
</div> -->

<div class="reviews-section">
  <h2>Customer Reviews</h2>
  
  <!-- Check if there are reviews before displaying the review count -->
  <div v-if="product.reviews && product.reviews.length > 0" class="review-summary">
    <div class="avg-rating">
      <span class="rating-number">{{ product.rating }}</span>
      <div class="stars">
        <span
          v-for="star in 5"
          :key="star"
          class="star"
          :class="{ filled: star <= Math.round(product.rating) }"
          >★</span
        >
      </div>
      <span>{{ product.ratingCount }} reviews</span>
    </div>
  </div>

  <!-- If there are no reviews, show a message -->
  <div v-else>
   
    <p>No reviews yet. Be the first to review this product!</p>
  </div>

  <!-- Reviews List -->
  <div v-if="product.reviews && product.reviews.length > 0" class="reviews-list">
    <div v-for="review in product.reviews" :key="review.id" class="review-item">
      <div class="review-header">
        <div class="review-user">Anonymous User</div>
        <div class="review-date">{{ formatDate(review.createdAt) }}</div>
      </div>

      <div class="review-rating">
        <div class="stars">
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ filled: star <= review.rating }"
            >★</span
          >
        </div>
      </div>

      <div class="review-content">{{ review.reviewText }}</div>
    </div>
  </div>
</div>
</div>

    {{ error }}
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'
import api from '@/services/apiService'

export default {
  name: 'ProductDetail',
  
  props: {
    productId: {
      type: [Number, String],
      required: true,
    },
  },

  data() {
    return {
      selectedImage: '',
      selectedSellerId: null,
      selectedSeller: {},
      selectedOffering: {}, // Store the selected offering here
      quantity: 1,
      isAddingToCart: false,
      addToCartError: null,
    }
  },

  computed: {
    ...mapState(useProductStore, ['currentProduct', 'loading', 'error']),

    product() {
      return this.currentProduct
    },
  },

  methods: {
    ...mapActions(useProductStore, ['fetchProductById']),
    ...mapActions(useCartStore, ['addToCart']),

    initializeProductDetails() {
      if (this.product && this.product.images && this.product.images.length > 0) {
        this.selectedImage = this.product.images[0]

        if (this.product.sellers && this.product.sellers.length > 0) {
          this.selectedSellerId = this.product.sellers[0].id
          this.selectedSeller = this.product.sellers[0]
        }
      }
    },

    formatPrice(price, decimals = 2) {
      const formattedPrice = parseFloat(price).toFixed(decimals)
      return formattedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },

    formatKey(key) {
      return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
    },

    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString(undefined, options)
    },

//     updateSelectedSeller() {
//   const selectedSeller = this.product.sellers.find(seller => seller.id === this.selectedSellerId);
  
//   if (selectedSeller) {
//     // Fetch the offerings for the selected seller
//     api.get(`/seller/${selectedSeller.id}/offerings`)
//       .then(response => {
//         const offerings = response.data.data;
//         const selectedOffering = offerings.find(offering => offering.sellerId === selectedSeller.id);

//         if (selectedOffering) {
//           // Update the selected offering details
//           this.selectedOffering = selectedOffering;
//           this.selectedImage = selectedOffering.images ? selectedOffering.images[0] : '';

//           // Update the product name and price based on the selected offering
//           this.product.name = selectedOffering.name;  // Update product name with offering name
//           this.product.rating = selectedOffering.rating;  // Update product rating with offering rating
//           this.product.ratingCount = selectedOffering.ratingCount;  // Update the count of reviews
//           this.product.reviews = selectedOffering.reviews;  // Update reviews from the selected offering
          
//           // Optionally update other details of the product if necessary
//           this.$nextTick(() => {
//             console.log("Updated product details:", this.product);
//           });
//         } else {
//           console.error('No offering found for this seller');
//         }
//       })
//       .catch(error => {
//         console.error("Error fetching offerings:", error);
//       });
//   } else {
//     console.error('Selected seller not found');
//   }
// },

// updateSelectedSeller() {
//       const selectedSeller = this.product.sellers.find(
//         (seller) => seller.id === this.selectedSellerId,
//       );

//       if (selectedSeller) {
//         // Fetch the offerings for the selected seller
//         api.get(`/seller/${selectedSeller.id}/offerings`)
//           .then((response) => {
//             const offerings = response.data.data;

           

//             // Find the offering for the *current product ID* from the offerings of the selected seller.
//             const selectedOffering = offerings.find(
//               (offering) => Number(offering.productId) === Number(this.productId)
//             );

//             // console.log(response);

//             if (selectedOffering) {
//               this.selectedOffering = selectedOffering;
//               this.product.rating = selectedOffering.rating;
//               this.product.ratingCount = selectedOffering.ratingCount;

//               this.product.reviews = selectedOffering.reviews;
//               console.log("updates of offerings")
//               console.log(selectedOffering)
              

//             } else {
//               console.error('No offering found for this seller and product ID.');
//               this.selectedOffering = null; // Clear the selected offering
//             }
//           })
//           .catch((error) => {
//             console.error('Error fetching offerings:', error);
//             this.selectedOffering = null; // Clear the selected offering
//           });
//       } else {
//         console.error('Selected seller not found');
//         this.selectedOffering = null; // Clear the selected offering
//       }
      
      
//     },
updateSelectedSeller() {
  const selectedSeller = this.product.sellers.find(
    (seller) => seller.id === this.selectedSellerId,
  );

  if (selectedSeller) {
    // Fetch the offerings for the selected seller
    api.get(`/seller/${selectedSeller.id}/offerings`)
      .then((response) => {
        const offerings = response.data.data;

        // Find the offering for the *current product ID* from the offerings of the selected seller.
        const selectedOffering = offerings.find(
          (offering) => Number(offering.productId) === Number(this.productId)
        );

        if (selectedOffering) {
          this.selectedOffering = selectedOffering;

          // Update product details with the selected offering's rating and rating count
          this.product.rating = selectedOffering.rating;
          this.product.ratingCount = selectedOffering.ratingCount;

          // Fetch reviews for this offering
          api.get(`/reviews/${selectedOffering.id}`)
            .then((reviewsResponse) => {
              const reviews = reviewsResponse.data.data || [];
              this.product.reviews = reviews; // Update the product's reviews
              console.log("Updated reviews for the selected offering:", reviews);
            })
            .catch((reviewError) => {
              console.warn(`No reviews found for offering ID: ${selectedOffering.id}`);
              this.product.reviews = []; // In case no reviews are found
            });

          console.log("Updated offering:", selectedOffering);

        } else {
          console.error('No offering found for this seller and product ID.');
          this.selectedOffering = null; // Clear the selected offering
        }
      })
      .catch((error) => {
        console.error('Error fetching offerings:', error);
        this.selectedOffering = null; // Clear the selected offering
      });
  } else {
    console.error('Selected seller not found');
    this.selectedOffering = null; // Clear the selected offering
  }
},


    increaseQuantity() {
      this.quantity++
    },

    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    },

    validateQuantity() {
      if (this.quantity < 1 || isNaN(this.quantity)) {
        this.quantity = 1
      }
    },

    getPercentage(rating) {
      if (!this.product || this.product.ratingCount === 0) return 0
      const count = this.product[rating] || 0
      return Math.round((count / this.product.ratingCount) * 100)
    },

    async handleAddToCart() {
      if (!this.product || !this.selectedSeller.id) {
        this.addToCartError = 'Please select a seller before adding to cart.'
        return
      }

      this.isAddingToCart = true
      this.addToCartError = null

      const cart = useCartStore()

      let isProductInCart = false

      for (let item of cart.items) {
        if (item.productOfferingId === this.product.offering.id) {
          isProductInCart = true
          break
        }
      }

      if (isProductInCart) {
        this.addToCartError = 'This product is already in your cart'
        this.isAddingToCart = false
        return
      }

      try {
        const productOfferingId = this.product.offering.id
        
        const result = await this.addToCart(productOfferingId, this.quantity)

        if (result.success) {
          this.$router.push('/cart')
        } else {
          this.addToCartError = result.error || 'Failed to add item to cart'
        }
      } catch (error) {
        console.error('Error adding to cart:', error)
        this.addToCartError = error.message || 'An unexpected error occurred'
      } finally {
        this.isAddingToCart = false
      }
    },
  },

  mounted() {
    try {
      console.log('Fetching product with ID:', this.productId)
      this.fetchProductById(this.productId)
      this.initializeProductDetails()
    } catch (error) {
      console.error('Error loading product details:', error)
    }
  },

  watch: {
    currentProduct: {
      handler() {
        this.initializeProductDetails()
      },
      immediate: true,
    },
    selectedSellerId() {
      this.updateSelectedSeller();  // Triggering seller update when selected seller changes
    },
  },
}
</script>

<style scoped>
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Roboto', Arial, sans-serif;
}

.loading {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #666;
}

.product-detail-wrapper {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
}

@media (max-width: 768px) {
  .product-detail-wrapper {
    flex-direction: column;
  }
}

/* Product Images */
.product-images {
  flex: 1;
  max-width: 500px;
}

.main-image {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
}

.main-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-thumbnails {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
}

.image-thumbnails img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.image-thumbnails img.active {
  border-color: #0095da;
}

/* Product Info */
.product-info {
  flex: 1;
}

.product-name {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.product-rating {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.stars {
  display: flex;
  color: #c8c8c8;
  margin-right: 0.5rem;
}

.star {
  margin-right: 2px;
}

.star.filled {
  color: #f5a623;
}

.rating-count {
  color: #666;
  font-size: 0.9rem;
}

.product-price {
  font-size: 1.8rem;
  font-weight: bold;
  color: #0095da;
  margin-bottom: 1rem;
}

.seller-section {
  margin-bottom: 1.5rem;
}

.seller-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.seller-section select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 0.9rem;
}

.product-description {
  margin-bottom: 1.5rem;
}

.product-description h3 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  color: #333;
}

.product-description p {
  color: #666;
  line-height: 1.5;
}

/* Quantity Section */
.quantity-section {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.quantity-section label {
  font-weight: 500;
}

.quantity-controls {
  display: flex;
  align-items: center;
}

.quantity-btn {
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  padding: 0.5rem;
  cursor: pointer;
}

.quantity-btn:disabled {
  cursor: not-allowed;
}

input[type="number"] {
  width: 50px;
  padding: 0.5rem;
  text-align: center;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

.add-to-cart-btn {
  background-color: #0095da;
  color: white;
  padding: 1rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-to-cart-btn:disabled {
  background-color: #ccc;
}

.error-message {
  color: red;
  font-size: 1rem;
  margin-top: 1rem;
}

.product-details {
  margin-top: 2rem;
}

.product-details h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.product-details ul {
  list-style: none;
  padding-left: 0;
}

.product-details li {
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.5rem;
}
/* Reviews Section */
.reviews-section {
  margin-top: 3rem;
}

.reviews-section h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.review-summary {
  margin-bottom: 2rem;
}

.avg-rating {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.rating-number {
  font-size: 2rem;
  font-weight: bold;
  color: #f5a623;
  margin-right: 0.5rem;
}

.rating-bars {
  margin-top: 1rem;
}

/* Rating Bars */
.rating-bar-container {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.star-label {
  margin-right: 10px;
  font-size: 0.9rem;
  color: #333;
}

.rating-bar {
  width: 100%;
  height: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  margin-right: 10px;
  position: relative;
}

.rating-bar-fill {
  height: 100%;
  background-color: #f5a623;
  border-radius: 5px;
}


.rating-percent {
  font-size: 0.9rem;
  color: #333;
}

/* Individual Review Item Styling */
.reviews-list {
  margin-top: 2rem;
}

.review-item {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.review-user {
  font-weight: 600;
  color: #333;
}

.review-date {
  font-size: 0.9rem;
  color: #666;
}

.review-rating {
  margin-bottom: 1rem;
}

.review-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

.review-content {
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.review-helpful {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.helpful-btn {
  background-color: #f5a623;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.helpful-btn:hover {
  background-color: #d48814;
}

</style>
