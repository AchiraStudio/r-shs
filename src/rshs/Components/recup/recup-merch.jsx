import React, { useState, useEffect } from 'react';
import './css/merch.css';

const RecupMerch = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    namaLengkap: '',
    nomorTelepon: '',
    kelas: '',
    nomorAbsen: '',
    metodePembayaran: '',
    // Dynamic bundle details will be added based on cart items
  });

  // Updated merch data based on bundle information
  const sampleProducts = [
    {
      id: 1,
      name: "Bundle 1: Ticket + T-Shirt + Gelang + Totebag",
      category: "bundle",
      price: 195000,
      currency: "Rp",
      image: "./assets/recup/bundles/bundle1.jpeg",
      description: "Bundle lengkap dengan tiket, kaos, gelang, dan totebag eksklusif.",
      sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
      colors: ["Putih"],
      featured: true,
      bundleType: "bundle1",
      hasTshirt: true,
      tshirtModel: "T-Shirt RECUP 2024"
    },
    {
      id: 2,
      name: "Bundle 2: Ticket + T-Shirt + Gelang + Keychain",
      category: "bundle",
      price: 170000,
      currency: "Rp",
      image: "./assets/recup/bundles/bundle2.jpeg",
      description: "Bundle dengan tiket, kaos, gelang, dan gantungan kunci eksklusif.",
      sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
      colors: ["Putih"],
      featured: true,
      bundleType: "bundle2",
      hasTshirt: true,
      tshirtModel: "T-Shirt RECUP 2024"
    },
    {
      id: 3,
      name: "Bundle 3: Ticket + T-Shirt + Tumbler + Gelang",
      category: "bundle",
      price: 220000,
      currency: "Rp",
      image: "./assets/recup/bundles/bundle3.jpeg",
      description: "Bundle premium dengan tiket, kaos, tumbler, dan gelang eksklusif.",
      sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
      colors: ["Putih"],
      featured: true,
      bundleType: "bundle3",
      hasTshirt: true,
      tshirtModel: "T-Shirt RECUP 2024"
    },
    {
      id: 4,
      name: "Bundle 4: Ticket + Totebag + Tumbler + Gelang",
      category: "bundle",
      price: 200000,
      currency: "Rp",
      image: "./assets/recup/bundles/bundle4.jpeg",
      description: "Bundle dengan tiket, totebag, tumbler, dan gelang eksklusif.",
      sizes: ["One Size"],
      colors: ["Beige"],
      featured: false,
      bundleType: "bundle4",
      hasTshirt: false,
      tshirtModel: ""
    },
    {
      id: 5,
      name: "Bundle 5: Ticket + Tumbler + Gelang + Keychain",
      category: "bundle",
      price: 160000,
      currency: "Rp",
      image: "./assets/recup/bundles/bundle5.jpeg",
      description: "Bundle hemat dengan tiket, tumbler, gelang, dan gantungan kunci.",
      sizes: ["One Size"],
      colors: ["Putih"],
      featured: false,
      bundleType: "bundle5",
      hasTshirt: false,
      tshirtModel: ""
    },
    {
      id: 6,
      name: "Bundle 6: Ticket + Totebag + Gelang + Keychain",
      category: "bundle",
      price: 155000,
      currency: "Rp",
      image: "./assets/recup/bundles/bundle6.jpeg",
      description: "Bundle ekonomis dengan tiket, totebag, gelang, dan gantungan kunci.",
      sizes: ["Standard"],
      colors: ["Multi"],
      featured: false,
      bundleType: "bundle6",
      hasTshirt: false,
      tshirtModel: ""
    }
  ];

  const categories = [
    { id: 'all', name: 'Semua Bundle', icon: 'Ω' },
    { id: 'bundle', name: 'Bundle', icon: '🎁' },
  ];

  const paymentMethods = [
    { id: 'transfer', name: 'Transfer Bank (BCA, BNI, BRI, Mandiri)' },
    { id: 'qris', name: 'QRIS (OVO, GoPay, Dana, ShopeePay)' },
    { id: 'cod', name: 'Bayar di Tempat (COD)' }
  ];

  // Perbaikan sistem kelas agar berurutan dengan benar
  const kelasOptions = [];
  for (let i = 1; i <= 9; i++) {
    kelasOptions.push(`X-${i}`);
  }
  for (let i = 1; i <= 9; i++) {
    kelasOptions.push(`XI-${i}`);
  }
  for (let i = 1; i <= 9; i++) {
    kelasOptions.push(`XII-${i}`);
  }

  const tshirtSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
  const tshirtColors = ['Hitam', 'Putih'];
  const gelangColors = ['Hitam', 'Cream', 'Maroon', 'Light Blue'];

  // Google Sheets Configuration
  const APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxT6o1Wynifg9xZNcijfF-vGPLXjXKoupBT70MD29H-XObi0ZSdYxtgcGHQ1StA6Jo/exec';

  // Load cart and form data from localStorage on component mount
  useEffect(() => {
    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts);
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('recupMerchCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing saved cart:', error);
      }
    }
    
    // Load form data from localStorage
    const savedFormData = localStorage.getItem('recupMerchFormData');
    if (savedFormData) {
      try {
        setFormData(JSON.parse(savedFormData));
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('recupMerchCart', JSON.stringify(cart));
    updateCartTotal();
  }, [cart]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('recupMerchFormData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(product => product.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [activeCategory, searchTerm, products]);

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartTotal = () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  const handleCheckout = () => {
    // Initialize form data based on cart items
    const initialFormData = {
      email: '',
      namaLengkap: '',
      nomorTelepon: '',
      kelas: '',
      nomorAbsen: '',
      metodePembayaran: '',
    };

    // Add form fields for each cart item
    cart.forEach((item, itemIndex) => {
      for (let i = 0; i < item.quantity; i++) {
        const instanceIndex = `${itemIndex}_${i}`;
        initialFormData[`warnaTshirt_${instanceIndex}`] = '';
        initialFormData[`sizeTshirt_${instanceIndex}`] = '';
        initialFormData[`warnaGelang_${instanceIndex}`] = '';
        initialFormData[`warnaGelangAlt_${instanceIndex}`] = '';
        initialFormData[`warnaGelangAlt2_${instanceIndex}`] = '';
      }
    });

    setFormData(initialFormData);
    setIsCheckoutOpen(true);
    setIsCartOpen(false);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setSubmitMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const prepareOrderData = () => {
    // Create an array of rows, one for each bundle instance
    const rows = [];
    
    // Add a row for each bundle instance
    cart.forEach((item, itemIndex) => {
      for (let i = 0; i < item.quantity; i++) {
        const instanceIndex = `${itemIndex}_${i}`;
        
        // Create a row with the required columns
        const row = {
          'Email': formData.email,
          'Nama lengkap (KAPITAL SEMUA)': formData.namaLengkap.toUpperCase(),
          'Nomor Telepon (cth. 081287198857)': formData.nomorTelepon,
          'Kelas': formData.kelas,
          'Nomor Absen': formData.nomorAbsen,
          'Pilih Bundle': item.name,
          'Warna T-Shirt': item.hasTshirt ? formData[`warnaTshirt_${instanceIndex}`] : 'N/A',
          'Size T-Shirt': item.hasTshirt ? formData[`sizeTshirt_${instanceIndex}`] : 'N/A',
          'Warna Gelang': formData[`warnaGelang_${instanceIndex}`] || '',
          'Warna Gelang (Jika yang pertama tidak ada)': formData[`warnaGelangAlt_${instanceIndex}`] || '',
          'Warna Gelang (Jika yang kedua tidak ada)': formData[`warnaGelangAlt2_${instanceIndex}`] || '',
          'Metode Pembayaran': formData.metodePembayaran,
          'Timestamp': new Date().toLocaleString('id-ID'),
          'Harga': item.price,
          'Total Harga': cartTotal
        };
        
        rows.push(row);
      }
    });
    
    return rows;
  };

  const submitToGoogleSheets = async (orderData) => {
    try {
      // Send each row as a separate request
      for (const row of orderData) {
        const response = await fetch(APP_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(row)
        });
        
        // Add a small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      return true;
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Validasi data
    if (!formData.email || !formData.namaLengkap || !formData.nomorTelepon || !formData.kelas || !formData.nomorAbsen || !formData.metodePembayaran) {
      setSubmitMessage('Harap lengkapi semua data yang diperlukan!');
      setIsSubmitting(false);
      return;
    }

    // Validasi detail bundle
    let isValid = true;
    cart.forEach((item, itemIndex) => {
      for (let i = 0; i < item.quantity; i++) {
        const instanceIndex = `${itemIndex}_${i}`;
        
        if (item.hasTshirt && (!formData[`warnaTshirt_${instanceIndex}`] || !formData[`sizeTshirt_${instanceIndex}`])) {
          isValid = false;
        }
        
        if (!formData[`warnaGelang_${instanceIndex}`]) {
          isValid = false;
        }
      }
    });

    if (!isValid) {
      setSubmitMessage('Harap lengkapi semua detail bundle!');
      setIsSubmitting(false);
      return;
    }

    // Prepare order data
    const orderData = prepareOrderData();

    // Submit to Google Sheets
    const success = await submitToGoogleSheets(orderData);

    if (success) {
      setSubmitMessage('success');
      alert('🎉 Pesanan Anda telah berhasil dikirim! Data telah disimpan ke Google Sheets.');
      
      // Reset form
      setFormData({
        email: '',
        namaLengkap: '',
        nomorTelepon: '',
        kelas: '',
        nomorAbsen: '',
        metodePembayaran: '',
      });
      
      setCart([]);
      setIsCheckoutOpen(false);
    } else {
      setSubmitMessage('error');
      alert('❌ Terjadi kesalahan saat mengirim data. Silakan coba lagi atau hubungi admin.');
    }

    setIsSubmitting(false);
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <section className="merch-section">
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
                  <div className="featured-badge">
                    ⭐
                  </div>
                )}
                
                <div className="product-image-container">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-image"
                    onClick={() => openProductModal(product)}
                  />
                  <div className="product-overlay">
                    <button 
                      className="quick-view-btn"
                      onClick={() => openProductModal(product)}
                    >
                      Lihat Cepat
                    </button>
                  </div>
                </div>
                
                <div className="product-content">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  
                  <div className="product-footer">
                    <div className="product-price">
                      <span className="currency">Rp</span>
                      <span className="amount">{product.price.toLocaleString('id-ID')}</span>
                    </div>
                    
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                    >
                      🛒 Tambah ke Keranjang
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
            onClick={() => setIsCartOpen(!isCartOpen)}
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
                        Rp{item.price.toLocaleString('id-ID')} × {item.quantity}
                      </div>
                    </div>
                    <div className="cart-item-quantity">
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        -
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      className="remove-item-btn"
                      onClick={() => removeFromCart(item.id)}
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
                
                <button className="checkout-btn" onClick={handleCheckout}>
                  Lanjut ke Pembayaran
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Product Modal */}
      {selectedProduct && (
        <div className="product-modal-overlay" onClick={closeProductModal}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedProduct.name}</h3>
              <button className="modal-close-btn" onClick={closeProductModal}>✕</button>
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
                  <div className="modal-price">
                    <span className="currency">Rp</span>
                    <span className="amount">{selectedProduct.price.toLocaleString('id-ID')}</span>
                  </div>
                  
                  <button 
                    className="modal-add-to-cart-btn"
                    onClick={() => {
                      addToCart(selectedProduct);
                      closeProductModal();
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

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="checkout-modal-overlay" onClick={closeCheckout}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Formulir Pemesanan</h3>
              <button className="modal-close-btn" onClick={closeCheckout}>✕</button>
            </div>
            
            <form className="checkout-form" onSubmit={handleSubmit}>
              {submitMessage === 'error' && (
                <div className="alert alert-error">
                  ❌ Terjadi kesalahan saat mengirim data. Silakan coba lagi.
                </div>
              )}
              
              {submitMessage && submitMessage !== 'error' && submitMessage !== 'success' && (
                <div className="alert alert-warning">
                  ⚠️ {submitMessage}
                </div>
              )}
              
              <div className="checkout-section">
                <h4 className="section-title">Informasi Pribadi</h4>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="namaLengkap">Nama Lengkap (HURUF KAPITAL SEMUA)</label>
                  <input
                    type="text"
                    id="namaLengkap"
                    name="namaLengkap"
                    value={formData.namaLengkap}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="nomorTelepon">Nomor Telepon (cth. 081287198857)</label>
                  <input
                    type="tel"
                    id="nomorTelepon"
                    name="nomorTelepon"
                    value={formData.nomorTelepon}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="081287198857"
                    pattern="[0-9]{10,13}"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="kelas">Kelas</label>
                  <select
                    id="kelas"
                    name="kelas"
                    value={formData.kelas}
                    onChange={handleInputChange}
                    required
                    className="form-select"
                  >
                    <option value="">Pilih Kelas</option>
                    {kelasOptions.map(kelas => (
                      <option key={kelas} value={kelas}>{kelas}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="nomorAbsen">Nomor Absen</label>
                  <input
                    type="text"
                    id="nomorAbsen"
                    name="nomorAbsen"
                    value={formData.nomorAbsen}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>
              
              {/* Dynamic Bundle Details based on cart */}
              {cart.map((item, itemIndex) => (
                <div key={itemIndex} className="checkout-section">
                  {Array.from({ length: item.quantity }, (_, i) => {
                    const instanceIndex = `${itemIndex}_${i}`;
                    const instanceNumber = i + 1;
                    const instanceLabel = item.quantity > 1 ? ` (${instanceNumber})` : '';
                    
                    return (
                      <div key={instanceIndex} className="bundle-details">
                        <h4 className="section-title">Detail {item.name}{instanceLabel}</h4>
                        
                        {item.hasTshirt && (
                          <div className="form-row">
                            <div className="form-group">
                              <label>Warna T-Shirt</label>
                              <select
                                name={`warnaTshirt_${instanceIndex}`}
                                value={formData[`warnaTshirt_${instanceIndex}`] || ''}
                                onChange={handleInputChange}
                                className="form-select"
                                required={item.hasTshirt}
                              >
                                <option value="">Pilih Warna</option>
                                {tshirtColors.map(color => (
                                  <option key={color} value={color}>{color}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div className="form-group">
                              <label>Size T-Shirt</label>
                              <div className="size-selector-with-image">
                                <select
                                  name={`sizeTshirt_${instanceIndex}`}
                                  value={formData[`sizeTshirt_${instanceIndex}`] || ''}
                                  onChange={handleInputChange}
                                  className="form-select"
                                  required={item.hasTshirt}
                                >
                                  <option value="">Pilih Ukuran</option>
                                  {tshirtSizes.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                  ))}
                                </select>
                                <div className="size-chart">
                                  <img 
                                    src="./assets/recup/bundles/tsize.jpg" 
                                    alt="Size Chart" 
                                    className="size-chart-image"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label>Warna Gelang</label>
                            <select
                              name={`warnaGelang_${instanceIndex}`}
                              value={formData[`warnaGelang_${instanceIndex}`] || ''}
                              onChange={handleInputChange}
                              className="form-select"
                              required
                            >
                              <option value="">Pilih Warna</option>
                              {gelangColors.map(color => (
                                <option key={color} value={color}>{color}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="form-group">
                            <label>Warna Gelang (Jika yang pertama tidak ada)</label>
                            <select
                              name={`warnaGelangAlt_${instanceIndex}`}
                              value={formData[`warnaGelangAlt_${instanceIndex}`] || ''}
                              onChange={handleInputChange}
                              className="form-select"
                            >
                              <option value="">Pilih Warna Alternatif</option>
                              {gelangColors.map(color => (
                                <option key={color} value={color}>{color}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="form-group">
                            <label>Warna Gelang (Jika yang kedua tidak ada)</label>
                            <select
                              name={`warnaGelangAlt2_${instanceIndex}`}
                              value={formData[`warnaGelangAlt2_${instanceIndex}`] || ''}
                              onChange={handleInputChange}
                              className="form-select"
                            >
                              <option value="">Pilih Warna Alternatif 2</option>
                              {gelangColors.map(color => (
                                <option key={color} value={color}>{color}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              
              <div className="checkout-section">
                <h4 className="section-title">Pembayaran</h4>
                
                <div className="form-group">
                  <label htmlFor="metodePembayaran">Metode Pembayaran</label>
                  <select
                    id="metodePembayaran"
                    name="metodePembayaran"
                    value={formData.metodePembayaran}
                    onChange={handleInputChange}
                    required
                    className="form-select"
                  >
                    <option value="">Pilih Metode Pembayaran</option>
                    {paymentMethods.map(method => (
                      <option key={method.id} value={method.id}>{method.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Payment Method Specific UI - Tanpa Upload Bukti Pembayaran */}
                {formData.metodePembayaran === 'qris' && (
                  <div className="payment-method-details">
                    <div className="payment-info">
                      <img 
                        src="./assets/recup/bundles/qris.jpeg" 
                        alt="QRIS Code" 
                        className="payment-method-image"
                      />
                    </div>
                    <div className="form-group">
                      <p>Silakan lakukan pembayaran menggunakan QRIS di atas dan simpan bukti pembayaran Anda. Anda akan diminta untuk menunjukkan bukti pembayaran saat pengambilan barang.</p>
                    </div>
                  </div>
                )}
                
                {formData.metodePembayaran === 'transfer' && (
                  <div className="payment-method-details">
                    <div className="payment-info">
                      <h5>Silahkan transfer ke rekening ini: Frans Indroyono</h5>
                      <p>BCA</p>
                      <p>0950477491</p>
                    </div>
                    <div className="form-group">
                      <p>Silakan lakukan transfer ke rekening di atas dan simpan bukti pembayaran Anda. Anda akan diminta untuk menunjukkan bukti pembayaran saat pengambilan barang.</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="checkout-summary">
                <div className="cart-total">
                  <span className="total-label">Total Pembayaran:</span>
                  <span className="total-amount">{formatRupiah(cartTotal)}</span>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closeCheckout} disabled={isSubmitting}>
                  Batal
                </button>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Mengirim...' : 'Kirim Pesanan ke Google Sheets'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Floating Cart Button */}
      {cart.length > 0 && !isCartOpen && (
        <button 
          className="floating-cart-btn"
          onClick={() => setIsCartOpen(!isCartOpen)}
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

export default RecupMerch;