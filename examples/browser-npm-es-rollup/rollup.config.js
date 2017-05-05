import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'index.mjs',
  format: 'iife',
  dest: 'dist/index.js',
  plugins: [
    resolve({
      browser: true
    })
  ]
};