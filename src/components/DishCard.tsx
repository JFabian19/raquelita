import React from "react";
import type { Dish } from "../types";
import { Plus, Minus, ShoppingBag, Send, Layers, Fish } from "lucide-react";

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
  const referenceImages: Record<string, string> = {
    "leche-de-tigre": "leche-de-tigre.webp",
    "ceviche-mixto": "ceviche-mixto.webp",
    "ceviche-simple": "ceviche-de-pescado-del-dia.webp",
    "ceviche-salsa-rocoto": "ceviche-de-corvina.webp",
    "ceviche-carretillero": "duo-marino-ceviche-chicharron-de-pescado.webp",
    "chicharron-pescado": "chicharron-de-pescado.webp",
    "chicharron-mixto": "chicharron-mixto.webp",
    "jalea-mixta": "jalea-mixta.webp",
    "cabrilla-frita": "cabrilla-frita.webp",
    "chita-frita": "chita-frita-menu.webp",
    "sudado-trambollo": "sudado-de-trambollo-menu.webp",
    "sudado-congrio": "sudado-de-congrio-menu.webp",
    "sudado-cabrilla": "sudado-de-cabrilla.webp",
    "sudado-tollo": "sudado-de-tollo-menu.webp",
    "guisada": "guisada-menu.webp",
    "chilcano": "chilcano-menu.webp",
    "parihuela": "parihuela-de-cabrilla.webp",
    "duo-marino": "duo-marino-ceviche-chicharron-de-pescado.webp",
    "trio-marino": "trio-marino-ceviche-chicharron-arroz-con-mariscos.webp",
    "arroz-marisco": "arroz-con-mariscos.webp",
    "chaufa-marisco": "chaufa-de-mariscos.webp",
    "fuente-ceviche-mixto": "fuente-mediana-ceviche-mixto.webp",
    "fuente-chicharron-pescado": "chicharron-de-pescado.webp",
    "fuente-jalea-mixta": "fuente-mediana-jalea-mixta.webp",
    "fuente-sudado-trambollo": "sudado-de-trambollo-menu.webp",
    "fuente-sudado-cabrilla": "fuente-grande-sudado-de-pescado.webp",
    "fuente-sudado-tollo": "sudado-de-tollo-menu.webp",
    "fuente-parihuela": "fuente-grande-parihuelas.webp",
    "fuente-duo-familiar": "duo-marino-ceviche-chaufa-de-mariscos.webp",
    "fuente-trio-familiar": "trio-marino-ceviche-chicharron-chaufa-con-mariscos.webp",
    "fuente-ronda-marina": "jalea-mixta.webp",
    "fuente-arroz-marisco": "fuente-grande-arroz-con-mariscos.webp",
    "fuente-chaufa-marisco": "fuente-grande-chaufa-de-mariscos.webp",
    "chicha-morada": "chicha-morada-de-maiz-1-lt.webp",
    "maracuya": "maracuya-menu.webp",
    "gaseosa-litro": "gaseosa-descartable.webp",
    "gaseosa-litro-medio": "gaseosa-descartable.webp",
    "cerveza-trujillo": "cerveza-trujillo-menu.webp",
    "cerveza-cusquena": "cerveza-cusquena-negra.webp",
    "cerveza-trigo": "cerveza-cusquena-trigo.webp",
    "cerveza-lata": "cerveza-lata-menu.webp",
  };

  const referenceImage = dish.image || (referenceImages[dish.id]
    ? `/images/referencias/${referenceImages[dish.id]}`
    : "");

  const editorialLabels = dish.labels?.length
    ? dish.labels
    : dish.id.includes("ceviche") || dish.id === "leche-de-tigre"
      ? ["Pescado fresco"]
      : dish.id.includes("trio") || dish.id.includes("duo") || dish.id.includes("ronda")
        ? ["Favorito"]
        : [];

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

      <div className={`dish-image-container ${!referenceImage ? "dish-image-placeholder" : ""}`}>
        {referenceImage ? (
          <img className="dish-image" src={referenceImage} alt={dish.name} loading="lazy" />
        ) : (
          <div className="dish-placeholder-mark" aria-label="Fotografía pendiente">
            <img src="/images/logo.webp" alt="" />
            <span>Foto próximamente</span>
          </div>
        )}
        <div className="dish-image-shade" />
        {editorialLabels.length > 0 && (
          <div className="dish-image-badges">
            {editorialLabels.map((label, idx) => (
              <span key={idx} className={`image-badge ${getBadgeClass(label)}`}>
                <Fish size={11} /> {label}
              </span>
            ))}
          </div>
        )}
        <span className="reference-photo-note">Foto referencial</span>
      </div>

      {/* Detalles del plato */}
      <div className="dish-info">
        <div className="dish-header">
          <div className="dish-title-area">
            <h3 className="dish-name">{dish.name}</h3>
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
