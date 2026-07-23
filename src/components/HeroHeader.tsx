import React from "react";
import type { BrandingConfig } from "../types";
import { Phone, ChevronDown } from "lucide-react";

interface HeroHeaderProps {
  branding: BrandingConfig;
  onScrollToMenu: () => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ branding, onScrollToMenu }) => {
  return (
    <header className="hero-header" id="home">
      <div
        className="hero-bg"
        id="hero-background"
        style={{ backgroundImage: `url(${branding.coverImage})` }}
      ></div>
      <div className="hero-overlay"></div>

      <div className="hero-content">
        {/* Logo del restaurante con animación de entrada 3D */}
        <div className="logo-card-wrapper">
          <div className="logo-card">
            <img
              id="restaurant-logo"
              src={branding.logoUrl}
              alt="Logo"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&h=150&q=80";
              }}
            />
          </div>
        </div>

        <h1 id="restaurant-name">{branding.restaurantName}</h1>
        <p className="slogan" id="restaurant-slogan">
          {branding.slogan}
        </p>

        {/* Enlaces de Redes Sociales */}
        <div className="social-links">
          {branding.socials.instagram && (
            <a
              href={branding.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              aria-label="Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          )}
          {branding.socials.facebook && (
            <a
              href={branding.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              aria-label="Facebook"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          )}
          {branding.socials.whatsapp && (
            <a
              href={branding.socials.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              aria-label="WhatsApp"
            >
              <Phone size={20} />
            </a>
          )}
          {branding.socials.tiktok && (
            <a
              href={branding.socials.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              aria-label="TikTok"
            >
              {/* Icono de TikTok en SVG personalizado */}
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </a>
          )}
        </div>

        {/* Indicador de Desplazamiento */}
        <button
          onClick={onScrollToMenu}
          className="scroll-down-indicator"
          aria-label="Ver Menú"
        >
          <span>Ver Menú</span>
          <ChevronDown size={24} />
        </button>
      </div>
    </header>
  );
};
