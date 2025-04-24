import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'opensans': ['Open Sans', 'sans-serif'],
        'mono': ['Roboto Mono', 'monospace'],
      },
      colors: {
        'deep-blue': '#0A2342',
        'slate-gray': '#29434E',
        'electric-blue': '#29B6F6',
        'gold': '#FFC107',
        'dark-slate': '#1A2E38',
        'navy': '#051B30',
        'charcoal': '#222831',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-pattern': 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h40v40H0V0zm20 20v20H0V20h20zm20 0v20H20V20h20zM20 0v20H0V0h20zm20 0v20H20V0h20z\' fill=\'%2329B6F6\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(41, 182, 246, 0.5)',
        'glow-gold': '0 0 20px rgba(255, 193, 7, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(41, 182, 246, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(41, 182, 246, 0.8)' },
        }
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(4px)',
        'blur-md': 'blur(10px)',
        'blur-lg': 'blur(16px)',
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#0A2342",
            foreground: "#FFFFFF",
            primary: {
              50: "#E3F2FD",
              100: "#BBDEFB",
              200: "#90CAF9",
              300: "#64B5F6",
              400: "#42A5F5",
              500: "#29B6F6", // Electric blue
              600: "#1E88E5",
              700: "#1976D2",
              800: "#1565C0",
              900: "#0D47A1",
              DEFAULT: "#29B6F6",
              foreground: "#FFFFFF"
            },
            secondary: {
              50: "#FFF8E1",
              100: "#FFECB3",
              200: "#FFE082",
              300: "#FFD54F",
              400: "#FFCA28",
              500: "#FFC107", // Gold/amber
              600: "#FFB300",
              700: "#FFA000",
              800: "#FF8F00",
              900: "#FF6F00",
              DEFAULT: "#FFC107",
              foreground: "#000000"
            },
            content1: {
              DEFAULT: "#29434E", // Slate gray
              foreground: "#FFFFFF"
            },
            content2: {
              DEFAULT: "#1A2E38", // Darker slate
              foreground: "#FFFFFF"
            }
          },
          layout: {
            boxShadow: {
              small: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
              medium: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              large: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
            },
            borderRadius: {
              small: "0.375rem",
              medium: "0.5rem",
              large: "0.75rem"
            }
          }
        }
      }
    })
  ],
};