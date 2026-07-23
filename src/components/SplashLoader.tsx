import React, { useEffect, useState } from "react";
import type { BrandingConfig } from "../types";

interface SplashLoaderProps {
  isLoading: boolean;
  branding: BrandingConfig;
}

export const SplashLoader: React.FC<SplashLoaderProps> = ({ isLoading, branding }) => {
  const [shouldRender, setShouldRender] = useState(true);
  const [fadeClass, setFadeClass] = useState("");

  useEffect(() => {
    if (!isLoading) {
      setFadeClass("fade-out");
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 600); // Duración de la animación de transición en CSS (0.6s)
      return () => clearTimeout(timer);
    } else {
      setShouldRender(true);
      setFadeClass("");
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div className={`loader-wrapper ${fadeClass}`}>
      <div className="loader-content">
        <div className="logo-spinner-container">
          <div className="spinner-ring"></div>
          <img
            className="loader-logo"
            src={branding.logoUrl}
            alt={branding.restaurantName}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&h=150&q=80";
            }}
          />
        </div>
        <h2 className="loader-name">{branding.restaurantName}</h2>
        <p className="loader-slogan">{branding.slogan || "Preparando el menú..."}</p>
      </div>
    </div>
  );
};
