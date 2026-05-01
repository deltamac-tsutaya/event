import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [],
  theme: {
    extend: {
      colors: {
        // 主色
        black: "#000000",
        white: "#FFFFFF",
        cream: "#F5F0E8",
        // 識別色
        "green-ink": "#2D5016",
        "red-wine": "#8B4C5C",
        "gold-champagne": "#D4AF37",
        // 輔助色
        "gray-light": "#E8E3D8",
        "gray-dark": "#3D3D3D",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        "serif-tc": ["思源宋體", "serif"],
        sans: ["Noto Sans TC", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      fontSize: {
        // H1
        "h1-lg": ["72px", { lineHeight: "1.1", fontWeight: "600" }],
        "h1-md": ["56px", { lineHeight: "1.1", fontWeight: "400" }],
        "h1-sm": ["40px", { lineHeight: "1.1", fontWeight: "400" }],
        // H2
        "h2-lg": ["48px", { lineHeight: "1.2", fontWeight: "700" }],
        "h2-md": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        "h2-sm": ["24px", { lineHeight: "1.2", fontWeight: "700" }],
        // H3
        "h3-lg": ["24px", { lineHeight: "1.3", fontWeight: "400" }],
        "h3-md": ["20px", { lineHeight: "1.3", fontWeight: "400" }],
        "h3-sm": ["16px", { lineHeight: "1.3", fontWeight: "400" }],
        // Body
        body: ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.6", fontWeight: "400" }],
        // Caption
        caption: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "caption-sm": ["12px", { lineHeight: "1.5", fontWeight: "400" }],
      },
      spacing: {
        gutter: "20px", // mobile gutter
        "gutter-md": "32px", // tablet gutter
        "gutter-lg": "40px", // desktop gutter
      },
      maxWidth: {
        content: "1400px",
      },
    },
  },
  plugins: [],
};
export default config;
