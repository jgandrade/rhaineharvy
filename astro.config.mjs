// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
	// TODO: swap for the real domain once it's decided.
	site: 'https://rhaine-harvy.com',

	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'hover',
	},

	vite: {
		// GSAP ships ESM; pre-bundling keeps dev startup quick.
		optimizeDeps: { include: ['gsap', 'gsap/ScrollTrigger'] },
	},
});
