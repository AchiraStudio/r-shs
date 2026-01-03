import React, { useState, useEffect } from 'react';
import '../css/merch.css';

const MerchDisplay = ({ 
  products, 
  filteredProducts, 
  cart, 
  isCartOpen, 
  cartTotal, 
  selectedProduct,
  onProductClick,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onToggleCart,
  onCloseProductModal,
  onCheckout
}) => {
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <section className="merch-section" id='merch'>
      <div className="ancient-scroll-container">
        <div className="scroll-overlay"></div>
        <div className="scroll-texture"></div>

        <div className="merch-container">
          <div className="section-header">
            <h2 className="section-title">Official Bundle Merchandise</h2>
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card ancient-paper">
                {product.featured && (
                  <div className="featured-badge">⭐</div>)}

                <div className="product-image-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    onClick={() => onProductClick(product)}
                  />
                  <div className="product-overlay">
                    <button
                      className="quick-view-btn"
                      onClick={() => onProductClick(product)}
                    >
                      Lihat Cepat
                    </button>
                  </div>
                </div>

                <div className="product-content">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>

                  <div className="product-footer">
                    <div className="product-price-container">
                      <div className="product-price">
                        <div className="current-price">
                          <span className="currency">Rp</span>
                          <span className="amount">{product.price.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      className="add-to-cart-btn"
                      onClick={() => onAddToCart(product)}
                    >
                      🛒 ADD
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="no-products">
              <span className="greek-symbol">Σ</span>
              <p>Tidak ada bundle yang cocok dengan kriteria Anda</p>
            </div>
          )}
        </div>
      </div>

      {/* Shopping Cart */}
      <div className={`shopping-cart ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3 className="cart-title">Keranjang Belanja</h3>
          <button
            className="cart-toggle-btn"
            onClick={onToggleCart}
          >
            {isCartOpen ? '✕' : '🛒'}
          </button>
        </div>

        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <span className="greek-symbol">Θ</span>
              <p>Keranjang Anda kosong</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item, index) => (
                  <div key={index} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <div className="cart-item-price">
                        <span className="cart-item-current-price">
                          Rp{item.price.toLocaleString('id-ID')} × {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="cart-item-quantity">
                      <button
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                      >
                        -
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-item-btn"
                      onClick={() => onRemoveFromCart(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="cart-total">
                  <span className="total-label">Total:</span>
                  <span className="total-amount">{formatRupiah(cartTotal)}</span>
                </div>

                <button className="checkout-btn" onClick={onCheckout}>
                  Lanjut ke Pembayaran
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="product-modal-overlay" onClick={onCloseProductModal}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedProduct.name}</h3>
              <button className="modal-close-btn" onClick={onCloseProductModal}>✕</button>
            </div>

            <div className="modal-content">
              <div className="modal-image-container">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>

              <div className="modal-details">
                <p className="modal-description">{selectedProduct.description}</p>

                {selectedProduct.hasTshirt && (
                  <div className="modal-options">
                    <div className="size-selector">
                      <label>Ukuran:</label>
                      <div className="size-options">
                        {selectedProduct.sizes.map(size => (
                          <button key={size} className="size-option">{size}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="modal-footer">
                  <div className="modal-price-container">
                    <div className="modal-price">
                      <div className="modal-current-price">
                        <span className="currency">Rp</span>
                        <span className="amount">{selectedProduct.price.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="modal-add-to-cart-btn"
                    onClick={() => {
                      onAddToCart(selectedProduct);
                      onCloseProductModal();
                    }}
                  >
                    Tambah ke Keranjang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {cart.length > 0 && !isCartOpen && (
        <button
          className="floating-cart-btn"
          onClick={onToggleCart}
        >
          🛒
          {cart.length > 0 && (
            <span className="cart-count">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
          )}
        </button>
      )}
    </section>
  );
};

export default MerchDisplay;