import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor-react',
              test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 30,
            },
            {
              name: 'vendor-motion',
              test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/,
              priority: 25,
            },
            {
              name: 'vendor-dataviz',
              test: /node_modules[\\/](recharts|@nivo|d3-|react-simple-maps|us-atlas|topojson)[\\/]/,
              priority: 20,
            },
            {
              name: 'vendor-firebase',
              test: /node_modules[\\/]firebase[\\/]/,
              priority: 15,
            },
          ],
        },
      },
    },
  },
})
