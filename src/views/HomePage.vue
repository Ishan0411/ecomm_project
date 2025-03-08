<template>
    <div class="home-page">
      <!-- Product Carousel -->
      <div class="product-carousel">
        <button class="carousel-arrow left" @click="prevSlide">
          <span>‹</span>
        </button>
        
        <div class="carousel-container">
          <div 
            class="carousel-slides" 
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
            <div 
              v-for="(product, index) in featuredProducts" 
              :key="product.id" 
              class="carousel-slide"
            >
              <div class="carousel-product">
                <img :src="product.imageUrl" :alt="product.name">
                <div class="carousel-product-info">
                  <div class="promo-tag">{{ product.promoTag }}</div>
                  <h2>{{ product.name }}</h2>
                  <p class="price">₹{{ formatPrice(product.price) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button class="carousel-arrow right" @click="nextSlide">
          <span>›</span>
        </button>
        
        <div class="carousel-dots">
          <button 
            v-for="(_, index) in featuredProducts" 
            :key="index" 
            class="carousel-dot" 
            :class="{ active: index === currentSlide }"
            @click="goToSlide(index)"
          ></button>
        </div>
      </div>
      
      <!-- All Products Section -->
      <div class="all-products-section">
        <h2 class="section-title">Our Products</h2>
        <div class="products-grid">
          <div 
            v-for="product in allProducts" 
            :key="product.id" 
            class="product-card"
            @click="goToProductDetail(product.id)"
          >
            <div class="product-image">
              <img :src="product.imageUrl" :alt="product.name">
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <div class="product-price">₹{{ formatPrice(product.price) }}</div>
              <div class="product-seller">{{ product.seller }}</div>
              <div class="product-rating">
                <div class="stars">
                  <span 
                    v-for="star in 5" 
                    :key="star" 
                    class="star" 
                    :class="{ 'filled': star <= Math.round(product.rating) }"
                  >★</span>
                </div>
                <span class="rating-count">({{ product.ratingCount }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomePage',
    
    data() {
      return {
        currentSlide: 0,
        autoplayInterval: null,
        
        featuredProducts: [
          {
            id: 1,
            name: 'Premium Wireless Headphones',
            price: 7999,
            promoTag: 'Flash Sale',
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          },
          {
            id: 2,
            name: 'Ultra-thin Smartphone Case',
            price: 1299,
            promoTag: 'Best Seller',
            imageUrl: 'https://images.unsplash.com/photo-1601593346740-925612772187?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          },
          {
            id: 3,
            name: 'Waterproof Bluetooth Speaker',
            price: 3499,
            promoTag: 'Special Offer',
            imageUrl: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          },
          {
            id: 4,
            name: 'Travel Laptop Backpack',
            price: 2499,
            promoTag: 'New Arrival',
            imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          },
          {
            id: 5,
            name: 'Fitness Smartwatch',
            price: 4999,
            promoTag: 'Free Shipping',
            imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          }
        ],
        
        allProducts: [
          { id: 101, name: 'Wireless Earbuds', price: 2499, seller: 'AudioTech', rating: 4.5, ratingCount: 120, imageUrl: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
          { id: 102, name: 'Smart TV 43 inch', price: 29999, seller: 'ElectronicWorld', rating: 4.7, ratingCount: 85, imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
          { id: 103, name: 'Digital Camera', price: 24999, seller: 'CameraShop', rating: 4.2, ratingCount: 67, imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
          { id: 104, name: 'Gaming Console', price: 37999, seller: 'GameStation', rating: 4.8, ratingCount: 214, imageUrl: 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
          { id: 105, name: 'Tablet 10 inch', price: 19999, seller: 'TabletZone', rating: 4.3, ratingCount: 92, imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
          { id: 106, name: 'Smart Speaker', price: 3999, seller: 'SoundExpress', rating: 4.0, ratingCount: 45, imageUrl: 'https://images.unsplash.com/photo-1512446816042-444d641267d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
          { id: 107, name: 'External Hard Drive 1TB', price: 4299, seller: 'DataStore', rating: 4.6, ratingCount: 73, imageUrl: 'https://images.unsplash.com/photo-1531492053556-74887922072e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
          { id: 108, name: 'Mesh Wifi Router', price: 3999, seller: 'NetworkPro', rating: 4.4, ratingCount: 58, imageUrl: 'https://images.unsplash.com/photo-1544281679-e015f1398a03?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
          { id: 109, name: 'Men\'s Casual T-Shirt', price: 799, seller: 'FashionHub', rating: 4.1, ratingCount: 127, imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
          { id: 110, name: 'Women\'s Jeans', price: 1499, seller: 'StyleCentral', rating: 4.3, ratingCount: 89, imageUrl: 'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
          { id: 111, name: 'Running Shoes', price: 3499, seller: 'SportWorld', rating: 4.7, ratingCount: 201, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
          { id: 112, name: 'Leather Wallet', price: 1299, seller: 'AccessoryShop', rating: 4.2, ratingCount: 63, imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
          { id: 113, name: 'Classic Wristwatch', price: 2999, seller: 'TimePiece', rating: 4.5, ratingCount: 112, imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
          { id: 114, name: 'Designer Sunglasses', price: 1699, seller: 'OpticsFashion', rating: 4.0, ratingCount: 47, imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
          { id: 115, name: 'Hiking Backpack', price: 2699, seller: 'OutdoorGear', rating: 4.6, ratingCount: 83, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
          { id: 116, name: 'Winter Jacket', price: 3999, seller: 'SeasonalWear', rating: 4.4, ratingCount: 76, imageUrl: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
          { id: 117, name: 'Coffee Maker', price: 3499, seller: 'KitchenPlus', rating: 4.3, ratingCount: 58, imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
          { id: 118, name: 'High-Speed Blender', price: 2499, seller: 'HomeAppliance', rating: 4.1, ratingCount: 42, imageUrl: 'https://images.unsplash.com/photo-1522838573142-454fa2536ba1?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
          { id: 119, name: 'Non-stick Cookware Set', price: 4999, seller: 'KitchenEssentials', rating: 4.8, ratingCount: 94, imageUrl: 'https://images.unsplash.com/photo-1584990347449-a5d9e1d1a07c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
          { id: 120, name: 'Cotton Bedding Set', price: 2999, seller: 'HomeDecor', rating: 4.5, ratingCount: 71, imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' }
        ]
      };
    },
    
    methods: {
      prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.featuredProducts.length) % this.featuredProducts.length;
        this.resetAutoplay();
      },
      
      nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.featuredProducts.length;
        this.resetAutoplay();
      },
      
      goToSlide(index) {
        this.currentSlide = index;
        this.resetAutoplay();
      },
      
      startAutoplay() {
        this.autoplayInterval = setInterval(() => {
          this.nextSlide();
        }, 5000); // Change slide every 5 seconds
      },
      
      resetAutoplay() {
        clearInterval(this.autoplayInterval);
        this.startAutoplay();
      },
      
      formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      
      goToProductDetail(productId) {
        // This will be implemented later
        console.log(`Navigate to product ${productId}`);
        // this.$router.push(`/product/${productId}`);
      }
    },
    
    mounted() {
      // Start autoplay when component is mounted
      this.startAutoplay();
    },
    
    beforeUnmount() {
      // Clear interval when component is unmounted
      clearInterval(this.autoplayInterval);
    }
  };
  </script>
  
  <style scoped>
  .home-page {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    font-family: 'Roboto', Arial, sans-serif;
  }
  
  /* Carousel Styles */
  .product-carousel {
    position: relative;
    width: 100%;
    margin-bottom: 2rem;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .carousel-container {
    width: 100%;
    overflow: hidden;
  }
  
  .carousel-slides {
    display: flex;
    transition: transform 0.5s ease;
  }
  
  .carousel-slide {
    min-width: 100%;
    height: 350px;
  }
  
  .carousel-product {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    background: #f5f5f5;
  }
  
  .carousel-product img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .carousel-product-info {
    position: absolute;
    left: 40px;
    background: rgba(255, 255, 255, 0.95);
    padding: 20px;
    border-radius: 8px;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .carousel-product-info h2 {
    margin: 0.5rem 0;
    font-size: 1.4rem;
    color: #333;
  }
  
  .carousel-product-info .price {
    color: #0095DA;
    font-weight: bold;
    font-size: 1.2rem;
    margin-top: 0.5rem;
  }
  
  .promo-tag {
    display: inline-block;
    background-color: #FF4F4F;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 24px;
    z-index: 2;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    color: #0095DA;
  }
  
  .carousel-arrow.left {
    left: 15px;
  }
  
  .carousel-arrow.right {
    right: 15px;
  }
  
  .carousel-dots {
    position: absolute;
    bottom: 15px;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 8px;
  }
  
  .carousel-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .carousel-dot.active {
    width: 12px;
    height: 12px;
    background: white;
  }
  
  /* All Products Section */
  .all-products-section {
    margin-bottom: 3rem;
  }
  
  .section-title {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    color: #0095DA;
    position: relative;
    padding-bottom: 0.5rem;
  }
  
  .section-title::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 50px;
    height: 3px;
    background-color: #0095DA;
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 15px;
  }
  
  @media (max-width: 1024px) {
    .products-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    .products-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  @media (max-width: 576px) {
    .products-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  .product-card {
    border-radius: 8px;
    overflow: hidden;
    background-color: white;
    transition: transform 0.2s, box-shadow 0.2s;
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
    margin-bottom: 0.5rem;
    color: #333;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.3;
    height: 2.6em;
  }
  
  .product-price {
    font-size: 1rem;
    font-weight: bold;
    color: #0095DA;
    margin-bottom: 0.3rem;
  }
  
  .product-seller {
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 0.3rem;
  }
  
  .product-rating {
    display: flex;
    align-items: center;
    font-size: 0.8rem;
  }
  
  .stars {
    display: flex;
    color: #C8C8C8;
    margin-right: 5px;
  }
  
  .star {
    margin-right: 2px;
  }
  
  .star.filled {
    color: #F5A623;
  }
  
  .rating-count {
    color: #999;
  }
  </style>