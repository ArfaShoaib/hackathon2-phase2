import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary-accent))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
        },
        danger: {
          DEFAULT: 'hsl(var(--danger))',
        },
        text: {
          primary: 'hsl(var(--text-primary))',
          secondary: 'hsl(var(--text-secondary))',
        },
      },
      borderRadius: {
        glass: '32px',
      },
      backdropBlur: {
        'xs': '10px',
        'sm': '15px',
        'md': '22px',
        'lg': '30px',
      },
      boxShadow: {
        glass: '0 20px 70px rgba(0, 0, 0, 0.5)',
        'glass-hover': '0 25px 80px rgba(190, 220, 255, 0.4)',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.32, 0.85, 0.18, 1.15)',
      },
      animation: {
        'stagger-entrance': 'staggerEntrance 0.07s ease-out',
      },
      keyframes: {
        staggerEntrance: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;