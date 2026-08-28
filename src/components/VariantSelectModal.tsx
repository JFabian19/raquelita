import React, { useState, useEffect } from "react";
import type { Dish, DishVariant } from "../types";
import { X, Plus, Minus, ShoppingBag, Check, Sparkles } from "lucide-react";

interface VariantSelectModalProps {
  isOpen: boolean;
  dish: Dish | null;
  currency: string;
  onClose: () => void;
  onConfirm: (dish: Dish, selectedVariant: DishVariant, quantity: number) => void;
}

export const VariantSelectModal: React.FC<VariantSelectModalProps> = ({
  isOpen,
  dish,
  currency,
  onClose,
  onConfirm,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<DishVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Seleccionar la primera variante por defecto al abrir
  useEffect(() => {
    if (dish && dish.variants && dish.variants.length > 0) {
      setSelectedVariant(dish.variants[0]);
      setQuantity(1);
    }
  }, [dish]);

  // Manejo de tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !dish || !dish.variants || dish.variants.length === 0) {
    return null;
  }

  const currentPrice = selectedVariant ? selectedVariant.price : dish.price;
  const totalPrice = currentPrice * quantity;

  const handleAdd = () => {
    if (selectedVariant) {
      onConfirm(dish, selectedVariant, quantity);
      onClose();
    }
  };

  return (
    <div className="variant-modal-overlay" onClick={onClose}>
      <div
        className="variant-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-dish-title"
      >
        {/* Encabezado del Modal */}
        <div className="variant-modal-header">
          <div className="variant-modal-title-wrap">
            <div className="variant-modal-badge">
              <Sparkles size={13} />
              <span>Personaliza tu fuente</span>
            </div>
            <h3 id="modal-dish-title" className="variant-modal-title">
              {dish.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="variant-modal-close-btn"
            aria-label="Cerrar ventana"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="variant-modal-body">
          {dish.image && (
            <div className="variant-modal-img-wrap">
              <img
                src={dish.image}
                alt={dish.name}
                className="variant-modal-img"
                onError={(e) => {
                  (e.target as HTMLElement).parentElement!.style.display = "none";
                }}
              />
            </div>
          )}

          <p className="variant-modal-dish-desc">{dish.description}</p>

          <div className="variant-options-section">
            <div className="variant-options-header">
              <span className="variant-section-label">Selecciona el tamaño:</span>
              <span className="variant-section-hint">
                Más económico = porción más chica • Mayor precio = fuente más grande / familiar
              </span>
            </div>

            <div className="variant-cards-list">
              {dish.variants.map((variant) => {
                const isSelected = selectedVariant?.id === variant.id;
                return (
                  <div
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`variant-card-option ${isSelected ? "selected" : ""}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedVariant(variant);
                      }
                    }}
                  >
                    <div className="variant-radio-indicator">
                      {isSelected && <Check size={14} className="check-icon" />}
                    </div>

                    <div className="variant-card-info">
                      <span className="variant-name">{variant.name}</span>
                      {variant.description && (
                        <span className="variant-desc">{variant.description}</span>
                      )}
                    </div>

                    <div className="variant-card-price">
                      <span className="price-currency">{currency}</span>
                      <span className="price-val">{variant.price.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Control de Cantidad */}
          <div className="variant-qty-section">
            <span className="qty-section-label">Cantidad:</span>
            <div className="variant-qty-controls">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="variant-qty-btn"
                aria-label="Disminuir cantidad"
              >
                <Minus size={16} />
              </button>
              <span className="variant-qty-number">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="variant-qty-btn"
                aria-label="Aumentar cantidad"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="variant-modal-footer">
          <button
            type="button"
            onClick={handleAdd}
            className="variant-confirm-btn"
          >
            <ShoppingBag size={18} />
            <span>Añadir al Pedido</span>
            <span className="variant-confirm-total">
              {currency}
              {totalPrice.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
