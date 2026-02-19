import type { SettingsDTO } from "../services/settings-service";

const normalizeHexColor = (value?: string | null) => {
  if (!value) return null;
  const hex = value.trim().replace("#", "");
  if (hex.length === 3) {
    return `#${hex
      .split("")
      .map((c) => `${c}${c}`)
      .join("")}`;
  }
  if (hex.length === 6) return `#${hex}`;
  return null;
};

const getReadableTextColor = (hexColor?: string | null) => {
  const normalized = normalizeHexColor(hexColor);
  if (!normalized) return null;
  const hex = normalized.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return luminance > 0.5 ? "#000000" : "#ffffff";
};

export const applyBranding = (settings: SettingsDTO | null) => {
  if (!settings) return;
  const root = document.documentElement;

  if (settings.primary_color) {
    root.style.setProperty("--primary", settings.primary_color);
    root.style.setProperty("--sidebar-primary", settings.primary_color);
    const primaryForeground = getReadableTextColor(settings.primary_color);
    if (primaryForeground) {
      root.style.setProperty("--primary-foreground", primaryForeground);
      root.style.setProperty("--sidebar-primary-foreground", primaryForeground);
    }
  }

  if (settings.secondary_color) {
    root.style.setProperty("--secondary", settings.secondary_color);
    root.style.setProperty("--sidebar-accent", settings.secondary_color);
    const secondaryForeground = getReadableTextColor(settings.secondary_color);
    if (secondaryForeground) {
      root.style.setProperty("--secondary-foreground", secondaryForeground);
      root.style.setProperty("--sidebar-accent-foreground", secondaryForeground);
    }
  }

  const accentColor = settings.secondary_color ?? settings.primary_color;
  if (accentColor) {
    root.style.setProperty("--accent", accentColor);
    const accentForeground = getReadableTextColor(accentColor);
    if (accentForeground) {
      root.style.setProperty("--accent-foreground", accentForeground);
    }
  }

  if (settings.brand_name) document.title = settings.brand_name;

  if (settings.favicon_url) {
    const link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (link) {
      link.href = settings.favicon_url;
    }
  }
};
