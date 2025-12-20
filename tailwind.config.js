
export default {
  darkMode: 'class',
  safelist: ['dark'],
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
        sans: ['Avenir', 'Helvetica', 'Arial', 'ヒラギノ角ゴシック　Pro', 'Hiragino Kaku Gothic Pro', 'メイリオ', 'Meiryo', '游ゴシック体', 'Yu Gothic', 'YuGothic', 'sans-serif'],
        mono: ['Source Han Code JP', '源ノ角ゴシック Code JP', 'Source Han Code', '源ノ角ゴシック Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
    },
  },

  plugins: [],
};
