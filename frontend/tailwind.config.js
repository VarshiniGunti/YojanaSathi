/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Primary teal color palette
        "primary": "#0F766E",
        "primary-hover": "#0D9488",
        "primary-light": "#14B8A6",
        "primary-dark": "#115E59",
        
        // Accent orange color palette
        "accent": "#F97316",
        "accent-hover": "#EA580C",
        "accent-light": "#FB923C",
        
        // Status colors
        "success": "#059669",
        "warning": "#D97706",
        "error": "#DC2626",
        
        // Background colors
        "bg-gray": "#FAFAFA",
        "bg-light": "#F5F5F5",
        "card-white": "#FFFFFF",
        
        // Text colors
        "text-primary": "#171717",
        "text-secondary": "#525252",
        "text-muted": "#737373",
        
        // Border colors
        "border-gray": "#E5E5E5",
        "border-light": "#F5F5F5",
      },
      fontFamily: {
        "sans": ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      fontSize: {
        // Typography scale
        "xs": ["0.75rem", { lineHeight: "1rem" }],      // 12px
        "sm": ["0.875rem", { lineHeight: "1.25rem" }],  // 14px
        "base": ["1rem", { lineHeight: "1.5rem" }],     // 16px
        "lg": ["1.125rem", { lineHeight: "1.75rem" }],  // 18px
        "xl": ["1.25rem", { lineHeight: "1.75rem" }],   // 20px
        "2xl": ["1.5rem", { lineHeight: "2rem" }],      // 24px
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],   // 36px
        "5xl": ["3rem", { lineHeight: "1" }],           // 48px
      },
      spacing: {
        // Spacing system (extends default Tailwind spacing)
        "18": "4.5rem",   // 72px
        "22": "5.5rem",   // 88px
        "26": "6.5rem",   // 104px
        "30": "7.5rem",   // 120px
        "34": "8.5rem",   // 136px
      },
      boxShadow: {
        // Card shadows
        "card": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        "card-lg": "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        // Border radius scale
        "sm": "0.25rem",   // 4px
        "DEFAULT": "0.5rem",  // 8px
        "md": "0.5rem",    // 8px
        "lg": "0.75rem",   // 12px
        "xl": "1rem",      // 16px
        "2xl": "1.5rem",   // 24px
      },
      screens: {
        // Responsive breakpoints
        "mobile": { "max": "767px" },
        "tablet": { "min": "768px", "max": "1023px" },
        "desktop": { "min": "1024px" },
      },
      minHeight: {
        // Minimum touch target size for mobile
        "touch": "44px",
      },
      minWidth: {
        // Minimum touch target size for mobile
        "touch": "44px",
      },
    },
  },
  plugins: [],
};
