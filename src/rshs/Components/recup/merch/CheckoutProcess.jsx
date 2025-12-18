import React, { useState } from 'react';
import '../css/checkout.css';

const CheckoutProcess = ({ 
  isOpen, 
  onClose, 
  cart, 
  cartTotal, 
  formData, 
  paymentMethods,
  kelasOptions,
  tshirtSizes,
  tshirtColors,
  gelangColors,
  onInputChange,
  onSubmit,
  isSubmitting,
  submitMessage,
  paymentProof,
  onPaymentProofChange
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // Validation functions for each step
  const validateStep1 = () => {
    if (!formData.email || !formData.namaLengkap || !formData.nomorTelepon ||
        !formData.kelas || !formData.nomorAbsen) {
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    let valid = true;
    cart.forEach((item, itemIndex) => {
      for (let i = 0; i < item.quantity; i++) {
        const instanceIndex = `${itemIndex}_${i}`;
        
        if (item.hasTshirt) {
          if (!formData[`warnaTshirt_${instanceIndex}`] || !formData[`sizeTshirt_${instanceIndex}`]) {
            valid = false;
          }
        }
        
        if (!formData[`warnaGelang_${instanceIndex}`]) {
          valid = false;
        }
      }
    });
    
    return valid;
  };

  const validateStep3 = () => {
    const needsProof = formData.metodePembayaran === 'qris' || formData.metodePembayaran === 'transfer';
    if (needsProof && !paymentProof) {
      return false;
    }
    return true;
  };

  const nextStep = () => {
    // Validate current step before moving to next
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    
    if (currentStep === 2 && !validateStep2()) {
      return;
    }
    
    if (currentStep === 3 && !validateStep3()) {
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all steps before submission
    if (!validateStep1() || !validateStep2() || !validateStep3()) {
      return;
    }
    
    onSubmit(e);
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Progress bar for multi-step checkout
  const renderProgressBar = () => {
    return (
      <div className="progress-container">
        <div className="progress-bar">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}></div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}></div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}></div>
        </div>
        <div className="progress-labels">
          <div className={`progress-label ${currentStep === 1 ? 'active' : ''}`}>Informasi</div>
          <div className={`progress-label ${currentStep === 2 ? 'active' : ''}`}>Detail</div>
          <div className={`progress-label ${currentStep === 3 ? 'active' : ''}`}>Pembayaran</div>
        </div>
      </div>
    );
  };

  // Handler to close fullscreen image with event propagation stopped
  const closeFullscreenImage = (e) => {
    e.stopPropagation();
    setFullscreenImage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="checkout-modal-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Formulir Pemesanan</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

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

          {/* Step 1: Personal Information */}
          <div className={`checkout-section ${currentStep === 1 ? 'active' : ''}`}>
            <div className="step-header">
              <div className="step-number">1</div>
              <h4 className="step-title">Informasi Pribadi</h4>
            </div>

            <div className="step-content">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={onInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="namaLengkap">Nama Lengkap</label>
                  <input
                    type="text"
                    id="namaLengkap"
                    name="namaLengkap"
                    value={formData.namaLengkap}
                    onChange={onInputChange}
                    required
                    className="form-input"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nomorTelepon">Nomor Telepon</label>
                  <input
                    type="tel"
                    id="nomorTelepon"
                    name="nomorTelepon"
                    value={formData.nomorTelepon}
                    onChange={onInputChange}
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
                    onChange={onInputChange}
                    required
                    className="form-select"
                  >
                    <option value="">Pilih Kelas</option>
                    {kelasOptions.map(kelas => (
                      <option key={kelas} value={kelas}>{kelas}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="nomorAbsen">Nomor Absen</label>
                <input
                  type="text"
                  id="nomorAbsen"
                  name="nomorAbsen"
                  value={formData.nomorAbsen}
                  onChange={onInputChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="step-actions">
              <button type="button" className="next-btn" onClick={nextStep}>
                Lanjut
              </button>
            </div>
          </div>

          {/* Step 2: Bundle Details */}
          <div className={`checkout-section ${currentStep === 2 ? 'active' : ''}`}>
            <div className="step-header">
              <div className="step-number">2</div>
              <h4 className="step-title">Detail Bundle</h4>
            </div>

            <div className="step-content">
              {cart.map((item, itemIndex) => (
                <div key={itemIndex} className="bundle-card">
                  <div className="bundle-header">
                    <img src={item.image} alt={item.name} className="bundle-image" />
                    <div className="bundle-info">
                      <h5 className="bundle-name">{item.name}</h5>
                      <p className="bundle-price">Rp{item.price.toLocaleString('id-ID')} × {item.quantity}</p>
                    </div>
                  </div>

                  {Array.from({ length: item.quantity }, (_, i) => {
                    const instanceIndex = `${itemIndex}_${i}`;
                    const instanceNumber = i + 1;
                    const instanceLabel = item.quantity > 1 ? ` (${instanceNumber})` : '';

                    return (
                      <div key={instanceIndex} className="bundle-instance">
                        <h6 className="instance-title">Detail {instanceLabel}</h6>

                        {item.hasTshirt && (
                          <div className="form-row">
                            <div className="form-group">
                              <label>Warna T-Shirt</label>
                              <select
                                name={`warnaTshirt_${instanceIndex}`}
                                value={formData[`warnaTshirt_${instanceIndex}`] || ''}
                                onChange={onInputChange}
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
                                  onChange={onInputChange}
                                  className="form-select"
                                  required={item.hasTshirt}
                                >
                                  <option value="">Pilih Ukuran</option>
                                  {tshirtSizes.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                  ))}
                                </select>
                                <button 
                                  type="button"
                                  className="size-chart-btn"
                                  onClick={() => setFullscreenImage("./assets/recup/bundles/tsize.jpg")}
                                  aria-label="View size chart"
                                >
                                  <img
                                    src="./assets/recup/bundles/tsize.jpg"
                                    alt="Size Chart"
                                    className="size-chart-image"
                                  />
                                  <div className="size-chart-overlay">
                                    <span className="size-chart-icon">🔍</span>
                                  </div>
                                </button>
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
                              onChange={onInputChange}
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
                            <label>Alternatif 1</label>
                            <select
                              name={`warnaGelangAlt_${instanceIndex}`}
                              value={formData[`warnaGelangAlt_${instanceIndex}`] || ''}
                              onChange={onInputChange}
                              className="form-select"
                            >
                              <option value="">Pilih Warna Alternatif</option>
                              {gelangColors.map(color => (
                                <option key={color} value={color}>{color}</option>
                              ))}
                            </select>
                          </div>

                          <div className="form-group">
                            <label>Alternatif 2</label>
                            <select
                              name={`warnaGelangAlt2_${instanceIndex}`}
                              value={formData[`warnaGelangAlt2_${instanceIndex}`] || ''}
                              onChange={onInputChange}
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
            </div>

            <div className="step-actions">
              <button type="button" className="prev-btn" onClick={prevStep}>
                Kembali
              </button>
              <button type="button" className="next-btn" onClick={nextStep}>
                Lanjut
              </button>
            </div>
          </div>

          {/* Step 3: Payment */}
          <div className={`checkout-section ${currentStep === 3 ? 'active' : ''}`}>
            <div className="step-header">
              <div className="step-number">3</div>
              <h4 className="step-title">Pembayaran</h4>
            </div>

            <div className="step-content">
              <div className="payment-summary">
                <h5>Ringkasan Pesanan</h5>
                <div className="summary-items">
                  {cart.map((item, index) => (
                    <div key={index} className="summary-item">
                      <span className="summary-name">{item.name}</span>
                      <span className="summary-price">Rp{item.price.toLocaleString('id-ID')} × {item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="summary-total">
                  <span>Total Pembayaran:</span>
                  <span>{formatRupiah(cartTotal)}</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="metodePembayaran">Metode Pembayaran</label>
                <select
                  id="metodePembayaran"
                  name="metodePembayaran"
                  value={formData.metodePembayaran}
                  onChange={onInputChange}
                  required
                  className="form-select"
                >
                  <option value="">Pilih Metode Pembayaran</option>
                  {paymentMethods.map(method => (
                    <option key={method.id} value={method.id}>{method.name}</option>
                  ))}
                </select>
              </div>

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

              {(formData.metodePembayaran === 'qris' || formData.metodePembayaran === 'transfer') && (
                <div className="form-group">
                  <label>Upload Bukti Pembayaran</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onPaymentProofChange}
                      required
                      disabled={isSubmitting}
                      id="paymentProof"
                    />
                    <label htmlFor="paymentProof" className="file-upload-label">
                      <div className="file-upload-icon">📷</div>
                      <div className="file-upload-text">
                        {paymentProof ? paymentProof.name : 'Pilih file bukti pembayaran'}
                      </div>
                    </label>
                  </div>
                  <p className="file-upload-note">
                    <small>
                      <strong>Catatan:</strong> File akan disimpan dengan nama yang berformat: 
                      NAMA_EMAIL_NOMOR_TELEPON_TIMESTAMP. Contoh: JOHNDOE_john_gmail_081234567890_1698765432100.jpg
                    </small>
                  </p>
                </div>
              )}
            </div>

            <div className="step-actions">
              <button type="button" className="prev-btn" onClick={prevStep}>
                Kembali
              </button>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Mengirim...' : 'Kirim Pesanan'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Fullscreen Image Overlay */}
      {fullscreenImage && (
        <div className="fullscreen-image-overlay" onClick={closeFullscreenImage}>
          <div className="fullscreen-image-container" onClick={(e) => e.stopPropagation()}>
            <img src={fullscreenImage} alt="Size Chart Fullscreen" className="fullscreen-image" />
            <button className="fullscreen-close-btn" onClick={closeFullscreenImage}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutProcess;