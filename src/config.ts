import type { MenuConfig } from "./types";

/**
 * CONFIGURACIÓN DE LA CARTA DIGITAL (El Rompemuelle)
 */
export const MENU_CONFIG: MenuConfig = {
  // BRANDING GENERAL
  branding: {
    restaurantName: "El Rompemuelle",
    slogan: "Cevichería & Restaurante Marino • ¡El sabor fresco del mar!",
    logoUrl: "/images/logo.png", // Enlace al logo generado
    coverImage: "/images/hero.png", // Imagen de fondo principal
    socials: {
      instagram: "https://instagram.com/elrompemuelle",
      facebook: "https://facebook.com/elrompemuelle",
      whatsapp: "https://wa.me/51948099076?text=Hola%20El%20Rompemuelle,%20quisiera%20hacer%20un%20pedido",
      tiktok: "https://tiktok.com/@elrompemuelle"
    }
  },

  // PALETA DE COLORES Y DISEÑO
  theme: {
    primaryColor: "#38bdf8",       // Cyan mar brillante
    secondaryColor: "#fbbf24",     // Dorado ámbar frito/ceviche
    bgColor: "#090d16",            // Fondo azul marino noche súper elegante
    cardBgColor: "#111a2e",        // Tarjetas azul océano con efecto cristal
    textColor: "#f8fafc",          // Texto principal de alta claridad
    textMutedColor: "#94a3b8",     // Texto secundario
    borderRadius: "18px",          // Bordes curvos elegantes
    fontFamily: "'Outfit', sans-serif" // Tipografía moderna Google Fonts
  },

  // CONFIGURACIÓN DE LA TIENDA / PEDIDOS
  store: {
    whatsappNumber: "51948099076", // Número de WhatsApp para recibir pedidos
    currency: "S/",                // Soles peruanos
    enableCart: true,              // Carrito flotante interactivo
    tax: 0.00,
    deliveryCost: 0.00
  },

  // CONFIGURACIÓN DE LA FUENTE DE DATOS
  dataSource: {
    type: "local", // "local" o "sheets"
    sheetsUrl: ""
  }
};
