import React from "react";
import type { Dish } from "../types";
import { Plus, Minus, ShoppingBag, Send, Layers } from "lucide-react";

interface DishCardProps {
  dish: Dish;
  currency: string;
  enableCart: boolean;
  quantity: number;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
  onOpenVariantModal?: (dish: Dish) => void;
  whatsappNumber: string;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  currency,
  enableCart,
  quantity,
  onAddToCart,
  onRemoveFromCart,
  onOpenVariantModal,
  whatsappNumber,
}) => {
  const hasVariants = dish.variants && dish.variants.length > 0;

  // Calcular rango de precios si tiene variantes
  let minPrice = dish.price;
  let maxPrice = dish.price;
  if (hasVariants && dish.variants) {
    const prices = dish.variants.map((v) => v.price);
    minPrice = Math.min(...prices);
    maxPrice = Math.max(...prices);
  }

  const handleDirectOrder = () => {
    let text = "";
    if (hasVariants) {
      text = encodeURIComponent(
        `¡Hola! Quisiera información y pedir el plato *${dish.name}* (Rango: ${currency}${minPrice.toFixed(2)} - ${currency}${maxPrice.toFixed(2)}) de su menú digital.`
      );
    } else {
      text = encodeURIComponent(
        `¡Hola! Quisiera ordenar el plato *${dish.name}* (Precio: ${currency}${dish.price.toFixed(2)}) de su menú digital.`
      );
    }
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank");
  };

  const handleAddClick = () => {
    if (hasVariants && onOpenVariantModal) {
      onOpenVariantModal(dish);
    } else {
      onAddToCart();
    }
  };

  const getBadgeClass = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("popular") || l.includes("estrella") || l.includes("favorito") || l.includes("recomendado")) return "badge-popular";
    if (l.includes("fresco") || l.includes("2 en 1") || l.includes("gourmet") || l.includes("tamaño")) return "badge-marine";
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

          <div className="dish-price-wrapper">
            {hasVariants ? (
              <div className="dish-price-range">
                <span className="price-label-prefix">Desde</span>
                <span className="dish-price">
                  {currency}
                  {minPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="dish-price">
                {currency}
                {dish.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <p className="dish-description">{dish.description}</p>

        {/* Precios por tamaño visibles en la carta */}
        {hasVariants && dish.variants && (
          <div className="dish-variants-preview">
            <span className="variants-preview-title">Precios por tamaño:</span>
            <div className="variants-pills-row">
              {dish.variants.map((v) => (
                <span key={v.id} className="variant-pill-item">
                  <strong>{v.name.replace("Fuente ", "")}:</strong> {currency}{v.price.toFixed(0)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sección de acciones */}
        <div className="dish-action-row">
          {dish.available && (
            <>
              {enableCart ? (
                hasVariants ? (
                  <button onClick={handleAddClick} className="add-to-cart-btn has-variant-btn">
                    <Layers size={16} />
                    <span>Elegir Tamaño / Agregar</span>
                    {quantity > 0 && <span className="dish-added-indicator">({quantity} en pedido)</span>}
                  </button>
                ) : quantity === 0 ? (
                  <button onClick={handleAddClick} className="add-to-cart-btn">
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
