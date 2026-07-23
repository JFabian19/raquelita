import React from "react";
import type { Dish } from "../types";
import { Plus, Minus, ShoppingBag, Send } from "lucide-react";

interface DishCardProps {
  dish: Dish;
  currency: string;
  enableCart: boolean;
  quantity: number;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
  whatsappNumber: string;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  currency,
  enableCart,
  quantity,
  onAddToCart,
  onRemoveFromCart,
  whatsappNumber,
}) => {
  const handleDirectOrder = () => {
    const text = encodeURIComponent(
      `¡Hola! Quisiera ordenar el plato *${dish.name}* (Precio: ${currency}${dish.price.toFixed(2)}) de su menú digital.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank");
  };

  const getBadgeClass = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("popular") || l.includes("estrella") || l.includes("favorito") || l.includes("recomendado")) return "badge-popular";
    if (l.includes("fresco") || l.includes("2 en 1") || l.includes("gourmet")) return "badge-marine";
    if (l.includes("picante") || l.includes("afrodisíaco")) return "badge-picante";
    return "badge-generic";
  };

  return (
    <div className={`dish-card ${!dish.available ? "is-unavailable" : ""}`}>
      {/* Overlay de Agotado */}
      {!dish.available && (
        <div className="dish-soldout-overlay">
          <span className="soldout-tag">Agotado</span>
        </div>
      )}

      {/* Imagen del plato opcional */}
      {dish.image && (
        <div className="dish-image-container">
          <img
            src={dish.image}
            alt={dish.name}
            className="dish-image"
            onError={(e) => {
              (e.target as HTMLElement).parentElement!.style.display = "none";
            }}
          />
          <div className="dish-image-overlay"></div>
        </div>
      )}

      {/* Detalles del plato */}
      <div className="dish-info">
        <div className="dish-header">
          <div className="dish-title-area">
            <h3 className="dish-name">{dish.name}</h3>
            {dish.labels && dish.labels.length > 0 && (
              <div className="dish-badges-inline">
                {dish.labels.map((label, idx) => (
                  <span key={idx} className={`badge ${getBadgeClass(label)}`}>
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>
          <span className="dish-price">
            {currency}
            {dish.price.toFixed(2)}
          </span>
        </div>
        <p className="dish-description">{dish.description}</p>

        {/* Sección de acciones */}
        <div className="dish-action-row">
          {dish.available && (
            <>
              {enableCart ? (
                quantity === 0 ? (
                  <button onClick={onAddToCart} className="add-to-cart-btn">
                    <ShoppingBag size={16} />
                    <span>Añadir al Pedido</span>
                  </button>
                ) : (
                  <div className="dish-qty-control">
                    <button
                      onClick={onRemoveFromCart}
                      className="qty-btn"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="qty-num">{quantity}</span>
                    <button
                      onClick={onAddToCart}
                      className="qty-btn"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                )
              ) : (
                <button onClick={handleDirectOrder} className="add-to-cart-btn">
                  <Send size={16} />
                  <span>Pedir por WhatsApp</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
