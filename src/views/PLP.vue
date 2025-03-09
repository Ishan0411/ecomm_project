<!-- <template>
    <div class="search-results-page">
      <h2>Search Results</h2>
      <div v-if="searchResults.length > 0" class="products-grid">
        <div v-for="product in searchResults" :key="product.id" class="product-card">
          <div class="product-image">
            <img :src="product.imageUrl" :alt="product.name">
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-price">₹{{ formatPrice(product.price) }}</div>
            <div class="product-seller">{{ product.seller }}</div>
            <div class="product-rating">
              <div class="stars">
                <span v-for="star in 5" :key="star" class="star" :class="{ 'filled': star <= Math.round(product.rating) }">★</span>
              </div>
              <span class="rating-count">({{ product.ratingCount }})</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        No products found.
      </div>
    </div>
  </template>
  
  <script>
  import { useRoute, watch } from 'vue-router';
  import { ref, onMounted } from 'vue';
  
  export default {
    name: 'PLP',
    setup() {
      const route = useRoute();
      const searchQuery = ref('');
      const searchResults = ref([]);
  
      // Mock product data
      const allProducts = [
        { id: 1, name: 'Laptop', category: 'Electronics', price: 50000, seller: 'ABC Store', rating: 4.5, ratingCount: 120, imageUrl: 'https://via.placeholder.com/150' },
        { id: 2, name: 'Smartphone', category: 'Electronics', price: 20000, seller: 'XYZ Store', rating: 4.2, ratingCount: 98, imageUrl: 'https://via.placeholder.com/150' },
        { id: 3, name: 'Headphones', category: 'Accessories', price: 3000, seller: 'Music Hub', rating: 4.0, ratingCount: 45, imageUrl: 'https://via.placeholder.com/150' },
        { id: 4, name: 'Shoes', category: 'Fashion', price: 2000, seller: 'Footwear Mart', rating: 4.3, ratingCount: 70, imageUrl: 'https://via.placeholder.com/150' },
        { id: 5, name: 'Watch', category: 'Accessories', price: 5000, seller: 'Time Center', rating: 4.6, ratingCount: 88, imageUrl: 'https://via.placeholder.com/150' }
      ];
  
      // Function to filter products based on search query
      const filterProducts = () => {
        if (!searchQuery.value) {
          searchResults.value = [];
          return;
        }
  
        const query = searchQuery.value.toLowerCase();
        searchResults.value = allProducts.filter(product =>
          product.name.toLowerCase().includes(query)
        );
      };
  
      // Watch for route query changes
      watch(() => route.query.q, (newQuery) => {
        searchQuery.value = newQuery || '';
        filterProducts();
      }, { immediate: true });
  
      const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      };
  
      return {
        searchQuery,
        searchResults,
        formatPrice
      };
    }
  };
  </script>
  
  <style scoped>
  .search-results-page {
    padding: 20px;
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .product-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    background-color: #fff;
    transition: transform 0.3s ease;
  }
  
  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .product-image {
    height: 150px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f9f9f9;
  }
  
  .product-image img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  .product-info {
    padding: 15px;
    display: flex;
    flex-direction: column;
  }
  
  .product-name {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
  }
  
  .product-price {
    font-size: 0.9rem;
    color: #007bff;
    margin-bottom: 8px;
  }
  
  .product-seller {
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 8px;
  }
  
  .product-rating {
    display: flex;
    align-items: center;
    font-size: 0.8rem;
    color: #999;
  }
  
  .stars {
    display: inline-flex;
    margin-right: 5px;
  }
  
  .star {
    color: #ffc107;
  }
  
  .rating-count {
    margin-left: 5px;
  }
  </style> -->

  <template>
    <div class="search-results-page">
      <h2>Search Results</h2>
      <div v-if="searchResults.length > 0" class="products-grid">
        <div v-for="product in searchResults" :key="product.id" class="product-card">
          <div class="product-image">
            <img :src="product.imageUrl" :alt="product.name">
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-price">₹{{ formatPrice(product.price) }}</div>
            <div class="product-seller">{{ product.seller }}</div>
            <div class="product-rating">
              <div class="stars">
                <span v-for="star in 5" :key="star" class="star" :class="{ 'filled': star <= Math.round(product.rating) }">★</span>
              </div>
              <span class="rating-count">({{ product.ratingCount }})</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        No products found.
      </div>
    </div>
  </template>
  
  <script>
  import { useRoute } from 'vue-router';
  import { ref, onMounted, watch } from 'vue';
  
  export default {
    name: 'PLP',
    setup() {
      const route = useRoute();
      const searchQuery = ref('');
      const searchResults = ref([]);
      const loading = ref(false);
      const error = ref(null);

    //   const fetchProducts = async () => {
    //   if (!searchQuery.value) {
    //     searchResults.value = [];
    //     return;
    //   }
      
    //   loading.value = true;
    //   error.value = null;
      
    //   try {
    //     const response = await axios.get(`https://your-api.com/products?search=${searchQuery.value}`);
    //     searchResults.value = response.data;  // Assuming API returns an array of products
    //   } catch (err) {
    //     error.value = 'Failed to fetch products. Please try again.';
    //     searchResults.value = [];
    //   } finally {
    //     loading.value = false;
    //   }
    // };
  
      // Mock product data
      const allProducts = [
       { id: 1, name: 'Laptop', category: 'Electronics', price: 50000, seller: 'ABC Store', rating: 4.5, ratingCount: 120, imageUrl: 'https://m.media-amazon.com/images/I/61Dw5Z8LzJL._AC_SL1500_.jpg' },
       { id: 2, name: 'Smartphone', category: 'Electronics', price: 20000, seller: 'XYZ Store', rating: 4.2, ratingCount: 98, imageUrl: 'https://m.media-amazon.com/images/I/71geVdy6-OS._AC_SL1500_.jpg' },
       { id: 3, name: 'Headphones', category: 'Accessories', price: 3000, seller: 'Music Hub', rating: 4.0, ratingCount: 45, imageUrl: 'https://m.media-amazon.com/images/I/61+U9qQH1YL._AC_SL1500_.jpg' },
       { id: 4, name: 'Shoes', category: 'Fashion', price: 2000, seller: 'Footwear Mart', rating: 4.3, ratingCount: 70, imageUrl: 'https://m.media-amazon.com/images/I/71KrJjbXfiL._AC_UL1500_.jpg' },
       { id: 5, name: 'Watch', category: 'Accessories', price: 5000, seller: 'Time Center', rating: 4.6, ratingCount: 88, imageUrl: 'https://m.media-amazon.com/images/I/71qxOQlZGLL._AC_UL1500_.jpg' }
];
  
      // Function to filter products based on search query
      const filterProducts = () => {
        if (!searchQuery.value) {
          searchResults.value = [];
          return;
        }
  
        const query = searchQuery.value.toLowerCase();
        searchResults.value = allProducts.filter(product =>
          product.name.toLowerCase().includes(query)
        );
      };

      watch(searchQuery, () => {
        filterProducts();
        // fetchProducts();
      });
  
      // Watch for route query changes
      watch(() => route.query.q, (newQuery) => {
        searchQuery.value = newQuery || '';
        filterProducts();
      }, { immediate: true });
  
      const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      };
  
      return {
        searchQuery,
        searchResults,
        formatPrice
      };
    }
  };
  </script>
  
  <style scoped>
.search-results-page {
  padding: 20px;
  font-family: 'Roboto', Arial, sans-serif;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
  height: 150px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
}

.product-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.product-info {
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
  height: 2.6em;
}

.product-price {
  font-size: 0.9rem;
  color: #0095DA;
  margin-bottom: 8px;
}

.product-seller {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 8px;
}

.product-rating {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: #999;
}

.stars {
  display: inline-flex;
  margin-right: 5px;
}

.star {
  color: #C8C8C8;
}

.star.filled {
  color: #F5A623;
}

.rating-count {
  margin-left: 5px;
  color: #999;
}
</style>