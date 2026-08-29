import type { MenuConfig } from "./types";

/**
 * CONFIGURACIÓN DE LA CARTA DIGITAL (Cevichería Raquelita)
 */
export const MENU_CONFIG: MenuConfig = {
  // BRANDING GENERAL
  branding: {
    restaurantName: "Cevichería Raquelita",
    slogan: "Pescados y Mariscos • ¡El auténtico sabor y frescura del mar!",
    logoUrl: "/images/logo.webp",
    coverImage: "/images/hero.webp",
    socials: {
      instagram: "https://instagram.com/cevicheriaraquelita",
      facebook: "https://facebook.com/cevicheriaraquelita",
      whatsapp: "https://wa.me/51942286744?text=Hola%20Cevicher%C3%ADa%20Raquelita,%20quisiera%20hacer%20un%20pedido%20delivery",
      tiktok: "https://tiktok.com/@cevicheriaraquelita"
    }
  },

  // PALETA DE COLORES Y DISEÑO
  theme: {
    primaryColor: "#0284c7",       // Azul océano vibrante
    secondaryColor: "#f97316",     // Naranja cálido marino / Ají limo
    bgColor: "#090f1d",            // Fondo azul marino noche profundo y elegante
    cardBgColor: "#101d36",        // Tarjetas azul océano con efecto glassmorphism
    textColor: "#f8fafc",          // Blanco nítido de alta legibilidad
    textMutedColor: "#94a3b8",     // Azul grisáceo suave
    borderRadius: "20px",          // Bordes curvos modernos y estilizados
    fontFamily: "'Outfit', sans-serif" // Tipografía moderna Google Fonts
  },

  // CONFIGURACIÓN DE LA TIENDA / PEDIDOS
  store: {
    whatsappNumber: "51942286744", // Número de WhatsApp para delivery y pedidos directos
    currency: "S/",                // Soles peruanos
    enableCart: true,              // Carrito interactivo
    tax: 0.00,
    deliveryCost: 0.00
  },

  // CONFIGURACIÓN DE LA FUENTE DE DATOS
  dataSource: {
    type: "local",
    sheetsUrl: ""
  }
};
