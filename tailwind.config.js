
export default {
  darkMode: 'class',
  safelist: [
    'dark',
    'flow-root',
    'float-right',
    'clear-both',
    'w-[320px]',
    'w-full',
    'max-w-full',
    'mb-2',
    'mb-6',
    'ml-6',
    'text-xs',
    'text-slate-500',
    'decoration-dotted',
    'underline',
    'underline-offset-4',
  ],
  prefix: '',
  content: [
    './content/**/*',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Noto Sans JP', 'sans-serif'],
        mono: ['Source Han Code JP', '源ノ角ゴシック Code JP', 'Source Han Code', '源ノ角ゴシック Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      keyframes: {
        radar: {
          '0%, 100%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.05)' },
          '50%': { transform: 'scale(1.08)' },
          '60%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        radar: 'radar 2.4s ease-in-out infinite',
      },
    },
  },

  plugins: [],
};
