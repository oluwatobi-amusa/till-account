/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    /**
     * FLUID SIZING SYSTEM - ALL DEFAULTS OVERRIDDEN
     * Scales smoothly between 375px (mobile) and 1440px (desktop)
     * Usage: text-xl, p-4, m-8, gap-12, etc. (standard Tailwind syntax, all fluid)
     */
    fontSize: {
      xs: ['clamp(0.75rem, 0.71rem + 0.19vw, 0.875rem)', { lineHeight: '1.5' }],
      sm: ['clamp(0.875rem, 0.83rem + 0.19vw, 1rem)', { lineHeight: '1.5' }],
      base: ['clamp(1rem, 0.96rem + 0.19vw, 1.125rem)', { lineHeight: '1.6' }],
      lg: ['clamp(1.125rem, 1.06rem + 0.28vw, 1.313rem)', { lineHeight: '1.5' }],
      xl: ['clamp(1.25rem, 1.16rem + 0.38vw, 1.5rem)', { lineHeight: '1.4' }],
      '2xl': ['clamp(1.5rem, 1.37rem + 0.56vw, 1.875rem)', { lineHeight: '1.3' }],
      '3xl': ['clamp(1.875rem, 1.7rem + 0.75vw, 2.375rem)', { lineHeight: '1.2' }],
      '4xl': ['clamp(2.25rem, 2.03rem + 0.94vw, 2.875rem)', { lineHeight: '1.1' }],
      '5xl': ['clamp(3rem, 2.69rem + 1.32vw, 3.875rem)', { lineHeight: '1.1' }],
      '6xl': ['clamp(3.75rem, 3.35rem + 1.69vw, 4.875rem)', { lineHeight: '1' }],
      '7xl': ['clamp(4.5rem, 4.02rem + 2.07vw, 6rem)', { lineHeight: '1' }],
      '8xl': ['clamp(6rem, 5.35rem + 2.82vw, 8rem)', { lineHeight: '1' }],
      '9xl': ['clamp(8rem, 7.13rem + 3.76vw, 10.5rem)', { lineHeight: '1' }]
    },
    spacing: {
      px: '1px',
      0: '0',
      0.5: 'clamp(0.125rem, 0.114rem + 0.047vw, 0.156rem)',
      1: 'clamp(0.25rem, 0.228rem + 0.094vw, 0.313rem)',
      1.5: 'clamp(0.375rem, 0.342rem + 0.141vw, 0.469rem)',
      2: 'clamp(0.5rem, 0.456rem + 0.188vw, 0.625rem)',
      2.5: 'clamp(0.625rem, 0.57rem + 0.235vw, 0.781rem)',
      3: 'clamp(0.75rem, 0.684rem + 0.282vw, 0.938rem)',
      3.5: 'clamp(0.875rem, 0.798rem + 0.329vw, 1.094rem)',
      4: 'clamp(1rem, 0.912rem + 0.376vw, 1.25rem)',
      5: 'clamp(1.25rem, 1.14rem + 0.47vw, 1.563rem)',
      6: 'clamp(1.5rem, 1.368rem + 0.564vw, 1.875rem)',
      7: 'clamp(1.75rem, 1.596rem + 0.658vw, 2.188rem)',
      8: 'clamp(2rem, 1.824rem + 0.752vw, 2.5rem)',
      9: 'clamp(2.25rem, 2.052rem + 0.846vw, 2.813rem)',
      10: 'clamp(2.5rem, 2.28rem + 0.94vw, 3.125rem)',
      11: 'clamp(2.75rem, 2.508rem + 1.034vw, 3.438rem)',
      12: 'clamp(3rem, 2.736rem + 1.128vw, 3.75rem)',
      14: 'clamp(3.5rem, 3.192rem + 1.316vw, 4.375rem)',
      16: 'clamp(4rem, 3.648rem + 1.504vw, 5rem)',
      20: 'clamp(5rem, 4.56rem + 1.88vw, 6.25rem)',
      24: 'clamp(6rem, 5.472rem + 2.256vw, 7.5rem)',
      28: 'clamp(7rem, 6.384rem + 2.632vw, 8.75rem)',
      32: 'clamp(8rem, 7.296rem + 3.008vw, 10rem)',
      36: 'clamp(9rem, 8.208rem + 3.384vw, 11.25rem)',
      40: 'clamp(10rem, 9.12rem + 3.76vw, 12.5rem)',
      44: 'clamp(11rem, 10.032rem + 4.136vw, 13.75rem)',
      48: 'clamp(12rem, 10.944rem + 4.512vw, 15rem)',
      52: 'clamp(13rem, 11.856rem + 4.888vw, 16.25rem)',
      56: 'clamp(14rem, 12.768rem + 5.264vw, 17.5rem)',
      60: 'clamp(15rem, 13.68rem + 5.64vw, 18.75rem)',
      64: 'clamp(16rem, 14.592rem + 6.016vw, 20rem)',
      72: 'clamp(18rem, 16.416rem + 6.768vw, 22.5rem)',
      80: 'clamp(20rem, 18.24rem + 7.52vw, 25rem)',
      96: 'clamp(24rem, 21.888rem + 9.024vw, 30rem)'
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        xs: '475px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        starter: {
          primary: '#425590',
          blue: '#245EAC',
          gray: '#61616A'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif']
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(10px)' }
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'slide-in': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'fade-out': 'fade-out 0.6s ease-out',
        'scale-in': 'scale-in 0.6s ease-out',
        'slide-in': 'slide-in 0.6s ease-out',
        'slide-up': 'slide-up 0.8s ease-out',
        'slide-down': 'slide-down 0.8s ease-out',
        float: 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite'
      },
      backdropFilter: {
        none: 'none',
        blur: 'blur(20px)'
      },
      backgroundImage: {
        'hero-pattern': "url('/hero-bg.jpg')",
        'grid-pattern': 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
