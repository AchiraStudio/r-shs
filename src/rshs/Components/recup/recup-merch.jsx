import React, { useState, useEffect } from 'react';
import './css/merch.css';
import './css/checkout.css';
import MerchDisplay from './merch/MerchDisplay';
import CheckoutProcess from './merch/CheckoutProcess';

const RecupMerch = () => {
  const [paymentProof, setPaymentProof] = useState(null);
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    namaLengkap: '',
    nomorTelepon: '',
    kelas: '',
    nomorAbsen: '',
    metodePembayaran: '',
  });

  // Products data with only original prices (removed discounted prices)
  const sampleProducts = [
    {
      id: 1,
      name: "Bundle 1: Ticket + T-Shirt + Gelang + Totebag",
      category: "bundle",
      price: 195000, // Changed from originalPrice to price
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
      price: 170000, // Changed from originalPrice to price
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
      price: 220000, // Changed from originalPrice to price
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
      price: 200000, // Changed from originalPrice to price
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
      price: 160000, // Changed from originalPrice to price
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
      price: 155000, // Changed from originalPrice to price
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

  // Generate class options
  const kelasOptions = [];
  for (let i = 1; i <= 9; i++) kelasOptions.push(`X-${i}`);
  for (let i = 1; i <= 9; i++) kelasOptions.push(`XI-${i}`);
  for (let i = 1; i <= 9; i++) kelasOptions.push(`XII-${i}`);

  const tshirtSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
  const tshirtColors = ['Hitam', 'Putih'];
  const gelangColors = ['Hitam', 'Cream', 'Maroon', 'Light Blue'];

  // Backend URLs
  const APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxT6o1Wynifg9xZNcijfF-vGPLXjXKoupBT70MD29H-XObi0ZSdYxtgcGHQ1StA6Jo/exec';
  const UPLOAD_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxx1FNEgjCY2PTKwfuzYbXjLiaMUjFAWWHwtgN85dwXr0W3_QGmyyT5p2HR45Qx0jxW/exec';

  // Initialize products and load from localStorage
  useEffect(() => {
    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts);

    const savedCart = localStorage.getItem('recupMerchCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing saved cart:', error);
      }
    }

    const savedFormData = localStorage.getItem('recupMerchFormData');
    if (savedFormData) {
      try {
        setFormData(JSON.parse(savedFormData));
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }, []);

  // Save cart and form data to localStorage
  useEffect(() => {
    localStorage.setItem('recupMerchCart', JSON.stringify(cart));
    updateCartTotal();
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('recupMerchFormData', JSON.stringify(formData));
  }, [formData]);

  // Filter products
  useEffect(() => {
    let filtered = products;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(product => product.category === activeCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [activeCategory, searchTerm, products]);

  // Cart functions
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
    setCart(
      cart
        .map(item => {
          if (item.id === productId) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartTotal = () => {
    // Using item.price which now contains the original price
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  };

  // Modal functions
  const openProductModal = (product) => setSelectedProduct(product);
  const closeProductModal = () => setSelectedProduct(null);

  // Checkout functions
  const handleCheckout = () => {
    const initialFormData = {
      email: formData.email || '',
      namaLengkap: formData.namaLengkap || '',
      nomorTelepon: formData.nomorTelepon || '',
      kelas: formData.kelas || '',
      nomorAbsen: formData.nomorAbsen || '',
      metodePembayaran: formData.metodePembayaran || '',
    };

    cart.forEach((item, itemIndex) => {
      for (let i = 0; i < item.quantity; i++) {
        const instanceIndex = `${itemIndex}_${i}`;
        initialFormData[`warnaTshirt_${instanceIndex}`] = initialFormData[`warnaTshirt_${instanceIndex}`] || '';
        initialFormData[`sizeTshirt_${instanceIndex}`] = initialFormData[`sizeTshirt_${instanceIndex}`] || '';
        initialFormData[`warnaGelang_${instanceIndex}`] = initialFormData[`warnaGelang_${instanceIndex}`] || '';
        initialFormData[`warnaGelangAlt_${instanceIndex}`] = initialFormData[`warnaGelangAlt_${instanceIndex}`] || '';
        initialFormData[`warnaGelangAlt2_${instanceIndex}`] = initialFormData[`warnaGelangAlt2_${instanceIndex}`] || '';
      }
    });

    setFormData(initialFormData);
    setSubmitMessage('');
    setIsCheckoutOpen(true);
    setIsCartOpen(false);
  };

  const closeCheckout = () => {
    if (isSubmitting) return;
    setIsCheckoutOpen(false);
    setSubmitMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentProofChange = (e) => {
    setPaymentProof(e.target.files?.[0] || null);
  };

  // Build rows for Sheets
  const prepareOrderData = () => {
    const rows = [];

    cart.forEach((item, itemIndex) => {
      for (let i = 0; i < item.quantity; i++) {
        const instanceIndex = `${itemIndex}_${i}`;

        rows.push({
          'Email': formData.email,
          'Nama lengkap (KAPITAL SEMUA)': (formData.namaLengkap || '').toUpperCase(),
          'Nomor Telepon (cth. 081287198857)': formData.nomorTelepon,
          'Kelas': formData.kelas,
          'Nomor Absen': formData.nomorAbsen,
          'Pilih Bundle': item.name,

          'Warna T-Shirt': item.hasTshirt ? (formData[`warnaTshirt_${instanceIndex}`] || '') : 'N/A',
          'Size T-Shirt': item.hasTshirt ? (formData[`sizeTshirt_${instanceIndex}`] || '') : 'N/A',

          'Warna Gelang': formData[`warnaGelang_${instanceIndex}`] || '',
          'Warna Gelang (Jika yang pertama tidak ada)': formData[`warnaGelangAlt_${instanceIndex}`] || '',
          'Warna Gelang (Jika yang kedua tidak ada)': formData[`warnaGelangAlt2_${instanceIndex}`] || '',

          'Metode Pembayaran': formData.metodePembayaran,
          'Timestamp': new Date().toLocaleString('id-ID'),
          'Harga': item.price, // Using item.price which now contains the original price
          'Total Harga': cartTotal,
        });
      }
    });

    return rows;
  };

  // UPDATED: Upload Payment Proof with custom filename
  const uploadPaymentProof = async (file) => {
    if (!file) return '';

    // Generate custom filename based on user data
    const generateCustomFileName = () => {
      const name = (formData.namaLengkap || '').toUpperCase().replace(/\s+/g, '_');
      const email = (formData.email || '').split('@')[0] || '';
      const phone = (formData.nomorTelepon || '').replace(/\D/g, '');
      const timestamp = new Date().getTime();
      
      // Clean up the name to remove special characters
      const cleanName = name.replace(/[^a-zA-Z0-9_]/g, '');
      const cleanEmail = email.replace(/[^a-zA-Z0-9]/g, '');
      
      // Create filename format: name_email_phone_timestamp
      let fileName = `bukti_`;
      
      if (cleanName) fileName += `${cleanName}_`;
      if (cleanEmail) fileName += `${cleanEmail}_`;
      if (phone) fileName += `${phone}_`;
      
      fileName += `${timestamp}`;
      
      // Add original file extension
      const fileExt = file.name.split('.').pop() || 'jpg';
      return `${fileName}.${fileExt}`;
    };

    const readAsBase64 = (f) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            const base64 = String(reader.result || '').split(',')[1];
            if (!base64) return reject(new Error('Gagal membaca file (base64 kosong).'));
            resolve(base64);
          } catch (e) {
            reject(e);
          }
        };
        reader.onerror = () => reject(new Error('Gagal membaca file.'));
        reader.readAsDataURL(f);
      });

    const base64 = await readAsBase64(file);
    const customFileName = generateCustomFileName();

    const payload = {
      image: base64,
      fileName: customFileName, // Use custom filename instead of original
      originalFileName: file.name, // Keep original for reference
      namaLengkap: formData.namaLengkap,
      email: formData.email,
      nomorTelepon: formData.nomorTelepon,
      nomorAbsen: formData.nomorAbsen,
      mimeType: file.type || 'image/png',
    };

    const res = await fetch(UPLOAD_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    let result;
    try {
      result = await res.json();
    } catch (e) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Upload script tidak mengembalikan JSON. Response: ${txt || '(kosong)'}`);
    }

    if (!result || result.success === false) {
      throw new Error(result?.error || 'Upload gagal (success=false).');
    }

    const url = result.fileUrl || result.url || result.webViewLink || '';
    if (!url) {
      const fid = result.fileId || '';
      if (!fid) throw new Error('Upload sukses tapi tidak ada fileUrl/url/fileId.');
      return `FILE_ID:${fid}`;
    }

    return url;
  };

  // Submit to Google Sheets
  const submitToGoogleSheets = async (orderData) => {
    for (const row of orderData) {
      const res = await fetch(APP_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(row),
      });

      await new Promise(resolve => setTimeout(resolve, 250));
    }

    return true;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Upload proof if needed
      let paymentProofUrl = '';
      if (paymentProof) {
        paymentProofUrl = await uploadPaymentProof(paymentProof);
      }

      // Prepare order data
      const orderData = prepareOrderData().map(row => ({
        ...row,
        'Bukti Pembayaran': paymentProofUrl || '',
      }));

      // Submit to sheets
      await submitToGoogleSheets(orderData);

      // Success
      setSubmitMessage('success');
      setShowSuccessModal(true);

      setCart([]);
      setPaymentProof(null);
      setIsCheckoutOpen(false);

      // Reset form
      setFormData({
        email: '',
        namaLengkap: '',
        nomorTelepon: '',
        kelas: '',
        nomorAbsen: '',
        metodePembayaran: '',
      });

      // Clear localStorage
      localStorage.removeItem('recupMerchCart');
      localStorage.removeItem('recupMerchFormData');

    } catch (err) {
      console.error(err);
      setSubmitMessage('error');
      alert(`❌ Terjadi kesalahan: ${err?.message || 'Coba lagi.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSubmitMessage('');
  };

  return (
    <>
      <MerchDisplay
        products={products}
        filteredProducts={filteredProducts}
        cart={cart}
        isCartOpen={isCartOpen}
        cartTotal={cartTotal}
        selectedProduct={selectedProduct}
        onProductClick={openProductModal}
        onAddToCart={addToCart}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        onToggleCart={() => setIsCartOpen(!isCartOpen)}
        onCloseProductModal={closeProductModal}
        onCheckout={handleCheckout}
      />

      <CheckoutProcess
        isOpen={isCheckoutOpen}
        onClose={closeCheckout}
        cart={cart}
        cartTotal={cartTotal}
        formData={formData}
        paymentMethods={paymentMethods}
        kelasOptions={kelasOptions}
        tshirtSizes={tshirtSizes}
        tshirtColors={tshirtColors}
        gelangColors={gelangColors}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitMessage={submitMessage}
        paymentProof={paymentProof}
        onPaymentProofChange={handlePaymentProofChange}
      />

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <h3>Mengirim Pesanan Anda</h3>
            <p>Mohon tunggu sebentar...</p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="success-modal-overlay" onClick={closeSuccessModal}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-content">
              <div className="success-icon">
                <div className="checkmark-circle">
                  <div className="checkmark"></div>
                </div>
              </div>
              <h2 className="success-title">Success</h2>
              <p className="success-message">Mohon tunggu untuk notifikasi pembayaran melalui email dan whatsapp anda</p>
              <p className="success-welcome">Terimakasih, welcome to Ascension!</p>
              <button className="success-close-btn" onClick={closeSuccessModal}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecupMerch;