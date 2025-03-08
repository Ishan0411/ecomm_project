package com.example.Cart.service;

import com.example.Cart.dto.CartDto;
import com.example.Cart.dto.CartItemDto;
import com.example.Cart.entity.Cart;
import com.example.Cart.entity.CartItem;
import com.example.Cart.exception.ResourceNotFoundException;
import com.example.Cart.repository.CartItemRepository;
import com.example.Cart.repository.CartRepository;
import com.example.Cart.utils.CommonResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@Slf4j
public class CartServiceImpl implements CartService{
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    public CommonResponse<CartDto> getCartByUserId(Long userId) {
        log.info("Fetching cart for user id: {}", userId);
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user id: " + userId));
        return CommonResponse.success(convertToDto(cart), 200, "Cart fetched successfully");
    }

    public CommonResponse<CartItemDto> addItemToCart(Long userId, CartItemDto itemDto) {
        log.info("Adding item to cart for user id: {}", userId);
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserId(userId);
                    return cartRepository.save(newCart);
                });

        CartItem item = new CartItem();
        BeanUtils.copyProperties(itemDto, item);
        item.setCart(cart);
        cartItemRepository.save(item);

        return CommonResponse.success(itemDto, 201, "Item added to cart");
    }

    public CommonResponse<String> removeItemFromCart(Long itemId) {
        log.info("Removing item with id: {}", itemId);
        cartItemRepository.deleteById(itemId);
        return CommonResponse.success(null, 200, "Item removed from cart");
    }

    public CommonResponse<String> updateItemQuantity(Long itemId, Integer quantity) {
        log.info("Updating quantity for item id: {}", itemId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + itemId));
        item.setQuantity(quantity);
        cartItemRepository.save(item);
        return CommonResponse.success(null, 200, "Item Quantity Updated");
    }

    public CommonResponse<String> clearCart(Long userId) {
        log.info("Clearing cart for user id: {}", userId);
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user id: " + userId));
        cartItemRepository.deleteAll(cart.getItems());
        return CommonResponse.success(null, 200, "Cart cleared");
    }

    private CartDto convertToDto(Cart cart) {
        CartDto cartDto = new CartDto();
        cartDto.setId(cart.getId());
        cartDto.setUserId(cart.getUserId());
        cartDto.setItems(cart.getItems().stream()
                .map(this::convertItemToDto)
                .collect(Collectors.toList()));
        return cartDto;
    }

    private CartItemDto convertItemToDto(CartItem item) {
        return new CartItemDto(item.getId(), item.getProductOfferingId(), item.getQuantity());
    }

}
