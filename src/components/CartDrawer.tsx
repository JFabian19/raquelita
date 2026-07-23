import React from "react";
import type { CartItem } from "../types";
import { X, ShoppingBag, Plus, Minus, Send, ShoppingCart } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (dishId: string, delta: number) => void;
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
  const subtotal = cartItems.reduce((acc, item) => acc + item.dish.price * item.quantity, 0);
  const total = subtotal;

  const handleSendOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (cartItems.length === 0) return;

    // Cabecera del pedido
    let message = `*NUEVO PEDIDO - ${restaurantName.toUpperCase()}*\n`;
    message += `-------------------------------------------\n\n`;

    // Detalle de productos
    message += `*Detalle del Pedido:*\n`;
    cartItems.forEach((item) => {
      const itemSubtotal = item.dish.price * item.quantity;
      message += `• _${item.quantity}x_ *${item.dish.name}* (${currency}${itemSubtotal.toFixed(2)})\n`;
    });
    message += `\n`;

    // Resumen financiero
    message += `*TOTAL A PAGAR: ${currency}${total.toFixed(2)}*\n`;
    message += `-------------------------------------------\n\n`;

    message += `_Pedido enviado desde la Carta Digital_ 📱`;

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
              <span>Selecciona tus platos favoritos del menú</span>
            </div>
          ) : (
            <>
              {/* Lista de productos */}
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.dish.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4 className="cart-item-name">{item.dish.name}</h4>
                      <span className="cart-item-price">
                        {currency}
                        {(item.dish.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    <div className="cart-item-actions">
                      <button
                        onClick={() => onUpdateQuantity(item.dish.id, -1)}
                        className="cart-item-btn"
                        aria-label="Disminuir"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="cart-item-qty">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.dish.id, 1)}
                        className="cart-item-btn"
                        aria-label="Aumentar"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))}
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
              <span>Enviar Pedido</span>
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
