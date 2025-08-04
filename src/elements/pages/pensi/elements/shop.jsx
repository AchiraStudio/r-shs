import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

function Shop() {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    class: '',
    absent: '',
    email: '',
    phone: '',
  });
  const [selectedPayment, setSelectedPayment] = useState('');
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetch('/r-shs/data/itemdata.xlsx')
      .then(res => res.arrayBuffer())
      .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        setProducts(json);
      })
      .catch(err => console.error('Failed to load products.xlsx', err));
  }, []);

  const totalSlides = Math.ceil(products.length / 2);

  const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
  const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));
  const visibleProducts = products.slice(currentSlide * 2, currentSlide * 2 + 2);

  const formatPrice = (price) => {
    if (typeof price === 'string') return price;
    if (typeof price === 'number') return `Rp${price.toLocaleString('id-ID')}`;
    return '-';
  };

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setShowPopup(true);
    document.body.style.overflow = 'hidden';
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedPayment('');
    setFormData({
      fullname: '',
      class: '',
      absent: '',
      email: '',
      phone: '',
    });
    setFormErrors({});
    document.body.style.overflow = 'auto';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullname.trim()) errors.fullname = 'Required';
    if (!formData.class.trim()) errors.class = 'Required';
    if (!formData.absent.trim()) errors.absent = 'Required';
    if (!formData.email.trim()) errors.email = 'Required';
    if (!formData.phone.trim()) errors.phone = 'Required';
    if (!selectedPayment) errors.payment = 'Select a payment method';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmPurchase = async () => {
    if (!validateForm()) return;

    const payload = {
      productName: selectedProduct.name,
      price: selectedProduct.price,
      ...formData,
      payment: selectedPayment,
    };

    try {
      await fetch('https://script.google.com/macros/s/AKfycbxltEpdjhoJZa1yo42YwxE3am6tCpHtnciA7sMmSt6Fb2mvZVkNXQZrnliCojm2yoqw/exec', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      alert('Purchase confirmed!');
      closePopup();
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit. Try again later.');
    }
  };

  return (
    <section className="shop" id="shop">
      <div className="shop_container">
        <div className="shop_card desc_card">
          <div className="shop_card_text">
            <div className="desc_card_title">
              <h1>Buy Before</h1>
            </div>
            <div className="desc_card_subtitle">
              <h2>Limited Time Offers</h2>
            </div>
            <div className="desc_card_desc">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt doloremque vel iure aut!
              </p>
              <button className="shop_cta">Learn More</button>
            </div>
          </div>
          <div className="shop_card_image">
            <div className="shop_card_image_container">
              <img
                id="shop_card_image_one"
                src="https://AchiraStudio.github.io/Gallery/albums/christmas-charity/DSC05540.webp"
                alt="Featured product"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {products.length > 0 && (
          <div className="shop_card item_card">
            <div className="item_card_heading">
              <h1>Our Products</h1>
              <div className="slider_controls">
                <button onClick={prevSlide} disabled={currentSlide === 0} className="slider_arrow">
                  &lt;
                </button>
                <button onClick={nextSlide} disabled={currentSlide >= totalSlides - 1} className="slider_arrow">
                  &gt;
                </button>
              </div>
            </div>

            <div className="item_card_container">
              <div className="item_cards">
                {visibleProducts.map((product, i) => (
                  <div key={`product-${product.id || i}`} className="items">
                    <div className="items_image">
                      <img src={product.imageUrl} alt={product.name} loading="lazy" />
                    </div>
                    <div className="items_details">
                      <h1>{product.name}</h1>
                      <h2>{formatPrice(product.price)}</h2>
                      <p>{product.description}</p>
                      <button className="add_to_cart" onClick={() => handleBuyNow(product)}>
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="item_cards_sliders">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <div
                    key={`dot-${index}`}
                    className={`slider_dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showPopup && selectedProduct && (
        <div className="popup_overlay">
          <div className="popup_container">
            <button className="popup_close" onClick={closePopup}>
              &times;
            </button>
            <div className="popup_content">
              <div className="popup_product">
                <div className="popup_image">
                  <img src={selectedProduct.imageUrl} alt={selectedProduct.name} loading="lazy" />
                </div>

                <div className="popup_form">
                  <form>
                    <div className="form_group">
                      <label htmlFor="fullname">Full Name:</label>
                      <input
                        type="text"
                        id="fullname"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                      />
                      {formErrors.fullname && <span className="form_error">{formErrors.fullname}</span>}
                    </div>

                    <div className="form_group">
                      <label htmlFor="class">Class:</label>
                      <select
                        id="class"
                        name="class"
                        value={formData.class}
                        onChange={handleChange}
                      >
                        <option value="">Select Class</option>
                        <option value="X">X</option>
                        <option value="XI">XI</option>
                        <option value="XII">XII</option>
                      </select>
                      {formErrors.class && <span className="form_error">{formErrors.class}</span>}
                    </div>

                    <div className="form_group">
                      <label htmlFor="absent">Absent Number:</label>
                      <input
                        type="number"
                        id="absent"
                        name="absent"
                        value={formData.absent}
                        onChange={handleChange}
                        placeholder="e.g. 23"
                      />
                      {formErrors.absent && <span className="form_error">{formErrors.absent}</span>}
                    </div>

                    <div className="form_group">
                      <label htmlFor="email">Email:</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                      />
                      {formErrors.email && <span className="form_error">{formErrors.email}</span>}
                    </div>

                    <div className="form_group">
                      <label htmlFor="phone">Phone Number:</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="08xxxxxxxxxx"
                      />
                      {formErrors.phone && <span className="form_error">{formErrors.phone}</span>}
                    </div>
                  </form>
                </div>
              </div>

              <div className="popup_details">
                <h1>{selectedProduct.name}</h1>
                <h2>{formatPrice(selectedProduct.price)}</h2>
                <p className="popup_description">{selectedProduct.description}</p>

                <div className="payment_options">
                  <h3>Payment Methods</h3>
                  <div className="payment_methods">
                    <div
                      className={`payment_method qris ${selectedPayment === 'QRIS' ? 'selected' : ''}`}
                      onClick={() => setSelectedPayment('QRIS')}
                    >
                      <img src="assets/qris.webp" id="qris" alt="QRIS" />
                      <span>QRIS</span>
                    </div>
                    <div
                      className={`payment_method ${selectedPayment === 'Bank Transfer' ? 'selected' : ''}`}
                      onClick={() => setSelectedPayment('Bank Transfer')}
                    >
                      <img src="assets/bank.webp" id="bank_tf" alt="Bank Transfer" />
                      <span>Bank Transfer</span>
                    </div>
                  </div>
                  {formErrors.payment && <span className="form_error">{formErrors.payment}</span>}
                </div>

                <button className="confirm_purchase" onClick={handleConfirmPurchase}>
                  Confirm Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Shop;
