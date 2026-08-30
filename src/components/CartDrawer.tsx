import React, { useEffect, useState } from "react";
import type { CartItem } from "../types";
import {
  AlertCircle,
  Banknote,
  Bike,
  CheckCircle2,
  LoaderCircle,
  MapPin,
  Minus,
  Navigation,
  Phone,
  Plus,
  Send,
  ShoppingBag,
  ShoppingCart,
  Store,
  Tag,
  UserRound,
  X,
} from "lucide-react";

type DeliveryType = "delivery" | "pickup";
type PaymentMethod = "yape" | "cash";

interface PreciseLocation {
  latitude: number;
  longitude: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  currency: string;
  whatsappNumber: string;
  restaurantName: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  currency,
  whatsappNumber,
  restaurantName,
}) => {
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("yape");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [addressReference, setAddressReference] = useState("");
  const [preciseLocation, setPreciseLocation] = useState<PreciseLocation | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [locationMessage, setLocationMessage] = useState("");

  useEffect(() => {
    if (!isOpen) setIsDeliveryModalOpen(false);
  }, [isOpen]);

  const getItemUnitPrice = (item: CartItem) => {
    return item.selectedVariant ? item.selectedVariant.price : item.dish.price;
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + getItemUnitPrice(item) * item.quantity,
    0
  );
  const total = subtotal;

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationMessage("Tu navegador no permite registrar la ubicación.");
      return;
    }

    setLocationStatus("loading");
    setLocationMessage("Solicitando permiso de ubicación…");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPreciseLocation({
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
        });
        setLocationStatus("success");
        setLocationMessage("Ubicación exacta registrada correctamente.");
      },
      (error) => {
        setPreciseLocation(null);
        setLocationStatus("error");
        if (error.code === error.PERMISSION_DENIED) {
          setLocationMessage("No se concedió el permiso. Presiona otra vez y acepta el acceso a tu ubicación.");
        } else if (error.code === error.TIMEOUT) {
          setLocationMessage("No pudimos obtener tu ubicación a tiempo. Inténtalo nuevamente.");
        } else {
          setLocationMessage("No pudimos registrar tu ubicación. Revisa que la ubicación del teléfono esté activa.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleSendOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const orderTypeLabel = deliveryType === "delivery" ? "DELIVERY" : "RECOJO EN LOCAL";
    const paymentLabel = paymentMethod === "yape" ? "Yape" : "Efectivo";
    const mapsUrl = preciseLocation
      ? `https://maps.google.com/?q=${preciseLocation.latitude},${preciseLocation.longitude}`
      : "No registrada";

    let message = `*NUEVO PEDIDO - ${orderTypeLabel}*\n`;
    message += `*${restaurantName.toUpperCase()}*\n`;
    message += `-------------------------------------------\n\n`;

    message += `*Datos del cliente:*\n`;
    message += `👤 Nombre: ${customerName}\n`;
    message += `📞 Teléfono: ${customerPhone}\n`;
    message += `🛵 Modalidad: ${deliveryType === "delivery" ? "Delivery" : "Recojo en local"}\n`;
    if (deliveryType === "delivery") {
      message += `📍 Dirección referencial: ${addressReference}\n`;
      message += `🗺️ Ubicación exacta: ${mapsUrl}\n`;
    }
    message += `💳 Medio de pago: ${paymentLabel}\n\n`;

    message += `*Detalle del Pedido:*\n`;
    cartItems.forEach((item) => {
      const unitPrice = getItemUnitPrice(item);
      const itemSubtotal = unitPrice * item.quantity;
      if (item.selectedVariant) {
        message += `• _${item.quantity}x_ *${item.dish.name}* [${item.selectedVariant.name}] (${currency}${itemSubtotal.toFixed(2)})\n`;
      } else {
        message += `• _${item.quantity}x_ *${item.dish.name}* (${currency}${itemSubtotal.toFixed(2)})\n`;
      }
    });
    message += `\n`;

    message += `*TOTAL A PAGAR: ${currency}${total.toFixed(2)}*\n`;
    message += `-------------------------------------------\n\n`;
    message += `_Pedido enviado desde la Carta Digital de Cevichería Raquelita_ 📱`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {/* Overlay translúcido */}
      <div
        onClick={onClose}
        className={`cart-drawer-overlay ${isOpen ? "active" : ""}`}
      ></div>

      {/* Cajón deslizante */}
      <div className={`cart-drawer ${isOpen ? "active" : ""}`}>
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-area">
            <ShoppingCart size={20} />
            <h3>Tu Pedido</h3>
          </div>
          <button onClick={onClose} className="close-drawer-btn" aria-label="Cerrar carrito">
            <X size={20} />
          </button>
        </div>

        {/* Listado de platos */}
        <div className="cart-items-container">
          {cartItems.length === 0 ? (
            <div className="empty-cart-state">
              <ShoppingBag size={56} />
              <p>Tu pedido está vacío</p>
              <span>Selecciona tus platos y fuentes del menú</span>
            </div>
          ) : (
            <>
              {/* Lista de productos */}
              <div className="cart-items-list">
                {cartItems.map((item) => {
                  const unitPrice = getItemUnitPrice(item);
                  return (
                    <div key={item.cartItemId} className="cart-item">
                      <div className="cart-item-info">
                        <h4 className="cart-item-name">{item.dish.name}</h4>
                        {item.selectedVariant && (
                          <div className="cart-item-variant-chip">
                            <Tag size={11} />
                            <span>{item.selectedVariant.name}</span>
                          </div>
                        )}
                        <span className="cart-item-price">
                          {currency}
                          {(unitPrice * item.quantity).toFixed(2)}
                          {item.quantity > 1 && (
                            <small className="cart-item-unit-note"> ({currency}{unitPrice.toFixed(2)} c/u)</small>
                          )}
                        </span>
                      </div>

                      <div className="cart-item-actions">
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                          className="cart-item-btn"
                          aria-label="Disminuir"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="cart-item-qty">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                          className="cart-item-btn"
                          aria-label="Aumentar"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer del Carrito */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-line">
              <span>Subtotal</span>
              <span>
                {currency}
                {subtotal.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => setIsDeliveryModalOpen(true)}
              className="send-order-btn"
              type="button"
            >
              <Bike size={18} />
              <span>Configurar entrega</span>
              <strong>
                {currency}
                {total.toFixed(2)}
              </strong>
            </button>
          </div>
        )}
      </div>

      {isDeliveryModalOpen && (
        <div className="delivery-modal-overlay" role="presentation">
          <section
            className="delivery-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delivery-modal-title"
          >
            <div className="delivery-modal-header">
              <div>
                <span className="delivery-modal-eyebrow">Último paso</span>
                <h3 id="delivery-modal-title">Configura tu entrega</h3>
                <p>Cuéntanos cómo quieres recibir tu pedido.</p>
              </div>
              <button
                type="button"
                className="delivery-modal-close"
                onClick={() => setIsDeliveryModalOpen(false)}
                aria-label="Cerrar configuración de entrega"
              >
                <X size={20} />
              </button>
            </div>

            <form className="delivery-form" onSubmit={handleSendOrder}>
              <fieldset className="delivery-fieldset">
                <legend>Modalidad de entrega</legend>
                <div className="delivery-type-grid">
                  <label className={`delivery-choice-card ${deliveryType === "delivery" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="deliveryType"
                      value="delivery"
                      checked={deliveryType === "delivery"}
                      onChange={() => setDeliveryType("delivery")}
                    />
                    <span className="delivery-choice-icon"><Bike size={23} /></span>
                    <span><strong>Delivery</strong><small>Lo llevamos a tu dirección</small></span>
                  </label>
                  <label className={`delivery-choice-card ${deliveryType === "pickup" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="deliveryType"
                      value="pickup"
                      checked={deliveryType === "pickup"}
                      onChange={() => setDeliveryType("pickup")}
                    />
                    <span className="delivery-choice-icon"><Store size={23} /></span>
                    <span><strong>Recojo en local</strong><small>Recógelo en nuestra tienda</small></span>
                  </label>
                </div>
              </fieldset>

              <div className="delivery-form-grid">
                <label className="delivery-input-group">
                  <span><UserRound size={15} /> Nombre completo</span>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Ej. María López"
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="delivery-input-group">
                  <span><Phone size={15} /> Número de teléfono</span>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(event) => setCustomerPhone(event.target.value)}
                    placeholder="Ej. 987 654 321"
                    autoComplete="tel"
                    inputMode="tel"
                    minLength={7}
                    required
                  />
                </label>
              </div>

              {deliveryType === "delivery" && (
                <div className="delivery-address-section">
                  <label className="delivery-input-group">
                    <span><MapPin size={15} /> Dirección referencial</span>
                    <textarea
                      value={addressReference}
                      onChange={(event) => setAddressReference(event.target.value)}
                      placeholder="Calle, número, urbanización y una referencia cercana"
                      rows={3}
                      required
                    />
                  </label>

                  <div className="precise-location-card">
                    <div className="precise-location-copy">
                      <Navigation size={21} />
                      <div>
                        <strong>Registra tu ubicación exacta</strong>
                        <p>
                          Al tocar el botón, la página registrará tu ubicación exacta. Debes presionarlo y aceptar el permiso de ubicación para que funcione.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`location-request-btn ${locationStatus === "success" ? "success" : ""}`}
                      onClick={handleRequestLocation}
                      disabled={locationStatus === "loading"}
                    >
                      {locationStatus === "loading" ? (
                        <><LoaderCircle className="spin-icon" size={17} /> Registrando ubicación…</>
                      ) : locationStatus === "success" ? (
                        <><CheckCircle2 size={17} /> Ubicación exacta registrada</>
                      ) : (
                        <><MapPin size={17} /> Registrar mi ubicación exacta</>
                      )}
                    </button>
                    {locationMessage && (
                      <div className={`location-feedback ${locationStatus}`}>
                        {locationStatus === "success" ? <CheckCircle2 size={15} /> : locationStatus === "error" ? <AlertCircle size={15} /> : null}
                        <span>{locationMessage}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <fieldset className="delivery-fieldset payment-fieldset">
                <legend>¿Cómo pagarás?</legend>
                <div className="payment-method-grid">
                  <label className={`payment-method-card yape ${paymentMethod === "yape" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="yape"
                      checked={paymentMethod === "yape"}
                      onChange={() => setPaymentMethod("yape")}
                    />
                    <img src="/images/yape-logo.webp" alt="Yape" />
                    <span><strong>Yape</strong><small>Pago digital</small></span>
                  </label>
                  <label className={`payment-method-card ${paymentMethod === "cash" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                    />
                    <span className="cash-icon"><Banknote size={25} /></span>
                    <span><strong>Efectivo</strong><small>Pago al recibir o recoger</small></span>
                  </label>
                </div>
              </fieldset>

              <div className="delivery-modal-footer">
                <div className="delivery-total">
                  <span>Total del pedido</span>
                  <strong>{currency}{total.toFixed(2)}</strong>
                </div>
                <button type="submit" className="delivery-submit-btn">
                  <Send size={19} />
                  <span>Enviar pedido por WhatsApp</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
};
