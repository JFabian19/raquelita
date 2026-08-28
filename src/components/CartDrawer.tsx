import React from "react";
import type { CartItem } from "../types";
import { X, ShoppingBag, Plus, Minus, Send, ShoppingCart, Tag } from "lucide-react";

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
  const getItemUnitPrice = (item: CartItem) => {
    return item.selectedVariant ? item.selectedVariant.price : item.dish.price;
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + getItemUnitPrice(item) * item.quantity,
    0
  );
  const total = subtotal;

  const handleSendOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (cartItems.length === 0) return;

    // Cabecera del pedido delivery
    let message = `*NUEVO PEDIDO DELIVERY - ${restaurantName.toUpperCase()}*\n`;
    message += `-------------------------------------------\n\n`;

    // Detalle de productos
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

    // Resumen financiero
    message += `*TOTAL A PAGAR: ${currency}${total.toFixed(2)}*\n`;
    message += `-------------------------------------------\n\n`;

    message += `📍 *Dirección de Entrega / Delivery:* (Escribe tu dirección o ubicación aquí)\n`;
    message += `👤 *Nombre de contacto:*\n\n`;
    message += `_Pedido enviado desde la Carta Digital de Cevichería Raquelita_ 📱`;

    // Generar enlace
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
              onClick={handleSendOrder}
              className="send-order-btn"
              type="button"
            >
              <Send size={18} />
              <span>Enviar Pedido Delivery</span>
              <strong>
                {currency}
                {total.toFixed(2)}
              </strong>
            </button>
          </div>
        )}
      </div>
    </>
  );
};
