import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '.', '')
	return {
		plugins: [
			react(),
			tsconfigPaths(),
			tailwindcss(),
			visualizer({ open: true, gzipSize: true, brotliSize: true })
		],
		server: {
			host: '0.0.0.0',
			port: 3000,
			proxy: {
				'/api': {
					target: env.VITE_API_BASE_URL || 'http://localhost:4200',
					changeOrigin: true,
					secure: false
				}
			}
		},
		build: {
			rollupOptions: {
				output: {
					manualChunks: {
						'react-vendors': ['react', 'react-dom'],
						'zod-vendor': ['zod'],
						'forms-vendor': ['react-hook-form']
					}
				}
			}
		}
	}
})
