import React, { useState, useEffect, useRef } from "react";
import { MENU_CONFIG } from "./config";
import type { Category, Dish, DishVariant, CartItem } from "./types";
import { SplashLoader } from "./components/SplashLoader";
import { HeroHeader } from "./components/HeroHeader";
import { CategoryNav } from "./components/CategoryNav";
import { DishCard } from "./components/DishCard";
import { CartDrawer } from "./components/CartDrawer";
import { VariantSelectModal } from "./components/VariantSelectModal";
import { ShoppingCart, Image as ImageIcon, Sparkles } from "lucide-react";

export const App: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estado para el modal de selección de tamaños/variantes
  const [selectedDishForVariant, setSelectedDishForVariant] = useState<Dish | null>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

  // 1. Inyección Dinámica de Estilos (Colores, Fuentes y Variables CSS)
  useEffect(() => {
    const root = document.documentElement;
    const theme = MENU_CONFIG.theme;

    root.style.setProperty("--primary-color", theme.primaryColor);
    root.style.setProperty("--secondary-color", theme.secondaryColor);
    root.style.setProperty("--bg-color", theme.bgColor);
    root.style.setProperty("--card-bg-color", theme.cardBgColor);
    root.style.setProperty("--text-color", theme.textColor);
    root.style.setProperty("--text-muted-color", theme.textMutedColor);
    root.style.setProperty("--border-radius", theme.borderRadius);
    root.style.setProperty("--font-family", theme.fontFamily);

    // Sombras glow
    const hex = theme.primaryColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    root.style.setProperty("--glow-color", `rgba(${r}, ${g}, ${b}, 0.25)`);

    // Inyectar Google Font dinámicamente
    const fontName = theme.fontFamily.split(",")[0].replace(/['"]/g, "").trim();
    const linkId = "dynamic-google-font";
    let link = document.getElementById(linkId) as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800&display=swap`;
  }, []);

  // 2. Cargar el Carrito Guardado (Persistent Cart)
  useEffect(() => {
    const savedCart = localStorage.getItem("carta_digital_cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // Migración de formato si venía del modelo anterior sin cartItemId
        const normalized = parsed.map((item: any) => ({
          cartItemId: item.cartItemId || (item.selectedVariant ? `${item.dish.id}-${item.selectedVariant.id}` : item.dish.id),
          dish: item.dish,
          selectedVariant: item.selectedVariant,
          quantity: item.quantity || 1
        }));
        setCart(normalized);
      } catch (e) {
        console.error("Error al parsear el carrito guardado", e);
      }
    }
  }, []);

  // Guardar carrito al cambiar
  useEffect(() => {
    localStorage.setItem("carta_digital_cart", JSON.stringify(cart));
  }, [cart]);

  // 3. Cargar Datos del Menú (JSON o Google Sheets)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (MENU_CONFIG.dataSource.type === "sheets" && MENU_CONFIG.dataSource.sheetsUrl) {
          const res = await fetch(MENU_CONFIG.dataSource.sheetsUrl);
          const csvText = await res.text();
          const parsed = parseCSV(csvText);
          setCategories(parsed.categories);
          setDishes(parsed.items);
          if (parsed.categories.length > 0) {
            setActiveCategory(parsed.categories[0].id);
          }
        } else {
          // Por defecto carga local de public/menu.json
          const res = await fetch("/menu.json");
          const data = await res.json();
          setCategories(data.categories || []);
          setDishes(data.items || []);
          if (data.categories && data.categories.length > 0) {
            setActiveCategory(data.categories[0].id);
          }
        }
      } catch (err) {
        console.error("Error cargando los datos del menú", err);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    loadData();
  }, []);

  // Parser de Google Sheets CSV
  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/);
    if (lines.length < 2) return { categories: [], items: [] };

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const categoriesMap: { [id: string]: Category } = {};
    const items: Dish[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values: string[] = [];
      let insideQuote = false;
      let currentVal = "";

      for (let charIdx = 0; charIdx < line.length; charIdx++) {
        const char = line[charIdx];
        if (char === '"') {
          insideQuote = !insideQuote;
        } else if (char === "," && !insideQuote) {
          values.push(currentVal.trim());
          currentVal = "";
        } else {
          currentVal += char;
        }
      }
      values.push(currentVal.trim());

      const row: { [key: string]: string } = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });

      const categoryId = row["categoria_id"] || row["category_id"] || "";
      const categoryName = row["categoria_nombre"] || row["category_name"] || categoryId;
      const categoryDesc = row["categoria_descripcion"] || row["category_desc"] || "";
      const categoryImg = row["categoria_imagen"] || row["category_image"] || "";

      const dishId = row["plato_id"] || row["dish_id"] || `${i}`;
      const dishName = row["plato_nombre"] || row["dish_name"] || "";
      const dishDesc = row["plato_descripcion"] || row["dish_desc"] || "";
      const dishPrice = parseFloat((row["plato_precio"] || row["dish_price"] || "0").replace(/[^0-9.]/g, ""));
      const dishImg = row["plato_imagen"] || row["dish_image"] || "";
      const dishLabelsStr = row["plato_etiquetas"] || row["dish_labels"] || "";
      const dishAvailableStr = (row["plato_disponible"] || row["dish_available"] || "true").toLowerCase();

      if (!categoryId || !dishName) continue;

      if (!categoriesMap[categoryId]) {
        categoriesMap[categoryId] = {
          id: categoryId,
          name: categoryName,
          description: categoryDesc,
          image: categoryImg,
        };
      }

      const labels = dishLabelsStr
        ? dishLabelsStr
            .split(",")
            .map((l) => l.trim())
            .filter(Boolean)
        : [];
      const available =
        dishAvailableStr === "true" ||
        dishAvailableStr === "si" ||
        dishAvailableStr === "verdadero" ||
        dishAvailableStr === "1";

      items.push({
        id: dishId,
        category: categoryId,
        name: dishName,
        description: dishDesc,
        price: dishPrice,
        image: dishImg,
        labels: labels,
        available: available,
      });
    }

    return {
      categories: Object.values(categoriesMap),
      items: items,
    };
  };

  // 4. Manejo del Carrito
  const handleAddToCart = (dish: Dish) => {
    // Si el plato tiene variantes, abrir modal de selección
    if (dish.variants && dish.variants.length > 0) {
      setSelectedDishForVariant(dish);
      setIsVariantModalOpen(true);
      return;
    }

    // Plato sin variantes (precio único)
    const cartItemId = dish.id;
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prevCart.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { cartItemId, dish, quantity: 1 }];
    });
  };

  const handleAddToCartWithVariant = (dish: Dish, selectedVariant: DishVariant, quantity: number) => {
    const cartItemId = `${dish.id}-${selectedVariant.id}`;
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prevCart.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { cartItemId, dish, selectedVariant, quantity }];
    });
  };

  const handleRemoveFromCart = (dish: Dish) => {
    const cartItemId = dish.id;
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.cartItemId === cartItemId);
      if (existing && existing.quantity > 1) {
        return prevCart.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prevCart.filter((item) => item.cartItemId !== cartItemId);
    });
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.cartItemId === cartItemId);
      if (!existing) return prevCart;

      const nextQty = existing.quantity + delta;
      if (nextQty <= 0) {
        return prevCart.filter((item) => item.cartItemId !== cartItemId);
      }
      return prevCart.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: nextQty } : item
      );
    });
  };

  const handleOpenVariantModal = (dish: Dish) => {
    setSelectedDishForVariant(dish);
    setIsVariantModalOpen(true);
  };

  // Desplazarse manualmente a la sección
  const handleScrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = sectionsRef.current[categoryId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToMenuStart = () => {
    const anchor = document.getElementById("menu-nav-anchor");
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth" });
    }
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => {
    const price = item.selectedVariant ? item.selectedVariant.price : item.dish.price;
    return acc + price * item.quantity;
  }, 0);

  return (
    <>
      {/* 1. Loader de Entrada */}
      <SplashLoader isLoading={isLoading} branding={MENU_CONFIG.branding} />

      {/* App visible tras carga */}
      <div id="app" style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.5s ease" }}>
        
        {/* 2. Hero Header Banner */}
        <HeroHeader branding={MENU_CONFIG.branding} onScrollToMenu={handleScrollToMenuStart} />

        <div id="menu-nav-anchor"></div>

        {/* 3. Categorías Deslizantes (Sticky Nav) */}
        {categories.length > 0 && (
          <CategoryNav
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={handleScrollToCategory}
          />
        )}

        {/* 4. Contenedor de Platos */}
        <main className="menu-sections-container" id="menu-container">
          {categories.length === 0 ? (
            <div className="menu-loading-placeholder">
              <p>No se encontraron categorías. Revisa tu archivo de datos.</p>
            </div>
          ) : (
            categories.map((category) => {
              const categoryDishes = dishes.filter((dish) => dish.category === category.id);
              return (
                <section
                  key={category.id}
                  ref={(el) => { sectionsRef.current[category.id] = el; }}
                  data-category-id={category.id}
                  className="category-section"
                >
                  {/* Banner de Categoría */}
                  <div className="category-banner">
                    {category.image ? (
                      <>
                        <img
                          className="category-banner-img"
                          src={category.image}
                          alt={category.name}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        <div className="category-banner-overlay"></div>
                      </>
                    ) : (
                      <div className="category-placeholder-backdrop">
                        <div className="category-placeholder-grid-pattern"></div>
                        <div className="category-placeholder-badge">
                          <ImageIcon size={15} />
                          <span>Cevichería Raquelita</span>
                        </div>
                      </div>
                    )}
                    <div className="category-banner-content">
                      <div className="category-badge-chip">
                        <Sparkles size={13} />
                        <span>Categoría</span>
                      </div>
                      <h2>{category.name}</h2>
                      <p>{category.description}</p>
                    </div>
                  </div>

                  {/* Rejilla de platos */}
                  <div className="dishes-grid">
                    {categoryDishes.map((dish) => {
                      // Total de este plato en el carrito (incluyendo variantes)
                      const dishInCartCount = cart
                        .filter((item) => item.dish.id === dish.id)
                        .reduce((acc, item) => acc + item.quantity, 0);

                      return (
                        <DishCard
                          key={dish.id}
                          dish={dish}
                          currency={MENU_CONFIG.store.currency}
                          enableCart={MENU_CONFIG.store.enableCart}
                          quantity={dishInCartCount}
                          onAddToCart={() => handleAddToCart(dish)}
                          onRemoveFromCart={() => handleRemoveFromCart(dish)}
                          onOpenVariantModal={handleOpenVariantModal}
                          whatsappNumber={MENU_CONFIG.store.whatsappNumber}
                        />
                      );
                    })}
                  </div>
                </section>
              );
            })
          )}
        </main>

        {/* 5. Pie de Página */}
        <footer className="restaurant-footer">
          <div className="footer-wave">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,57.05,18.3,88.42,26.85,160.42,46.46,245.4,69.53,321.39,56.44Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <div className="footer-content">
            <img
              className="footer-logo"
              src={MENU_CONFIG.branding.logoUrl}
              alt="Logo"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <h3>{MENU_CONFIG.branding.restaurantName}</h3>
            <p className="footer-slogan">{MENU_CONFIG.branding.slogan}</p>

            <div className="footer-delivery-callout">
              <span>🛵 ¡Pide tu delivery directo al WhatsApp!</span>
              <a
                href={`https://wa.me/${MENU_CONFIG.store.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-wa-link"
              >
                942 286 744
              </a>
            </div>

            <div className="footer-divider"></div>

            <p className="thank-you-msg">
              <span className="text-primary">❤️</span> ¡Gracias por visitarnos hoy!
            </p>

            <div className="developer-credit">
              <p>© {new Date().getFullYear()} Todos los derechos reservados.</p>
              <p>Hecho para <span style={{ color: "#38bdf8", fontWeight: 600 }}>Cevichería Raquelita</span></p>
            </div>
          </div>
        </footer>

        {/* 6. Botón Flotante del Carrito */}
        {MENU_CONFIG.store.enableCart && (
          <button
            onClick={() => setIsCartOpen(true)}
            className={`cart-floating-btn ${cartItemCount > 0 ? "show" : ""}`}
            aria-label="Abrir carrito"
          >
            <div className="cart-icon-wrapper">
              <ShoppingCart size={22} />
              <span className="cart-badge">{cartItemCount}</span>
            </div>
            <div className="cart-btn-details">
              <span className="cart-btn-title">Ver Pedido</span>
              <span className="cart-btn-total">
                {MENU_CONFIG.store.currency}
                {cartTotal.toFixed(2)}
              </span>
            </div>
          </button>
        )}

        {/* 7. Cajón del Carrito */}
        {MENU_CONFIG.store.enableCart && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cart}
            onUpdateQuantity={handleUpdateQuantity}
            currency={MENU_CONFIG.store.currency}
            whatsappNumber={MENU_CONFIG.store.whatsappNumber}
            restaurantName={MENU_CONFIG.branding.restaurantName}
          />
        )}

        {/* 8. Modal de Selección de Tamaños y Variantes */}
        <VariantSelectModal
          isOpen={isVariantModalOpen}
          dish={selectedDishForVariant}
          currency={MENU_CONFIG.store.currency}
          onClose={() => setIsVariantModalOpen(false)}
          onConfirm={handleAddToCartWithVariant}
        />

      </div>
    </>
  );
};

export default App;
