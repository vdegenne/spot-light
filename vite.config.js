import {defineConfig} from 'vite';
import {materialShell} from 'material-shell/vite.js';
import {materialAll} from 'rollup-plugin-material-all';
import {mdicon2svg} from 'vite-plugin-mdicon2svg';

/**
 * @type {import('vite').Plugin[]}
 */
const plugins = [];

/** Dev plugins */
if (process.env.NODE_ENV === 'development') {
	try {
		const {vscodeUiConnectorPlugin} = await import('vscode-ui-connector');
		plugins.push(
			vscodeUiConnectorPlugin({
				ignoredShadowDoms: ['color-picker', 'color-mode-picker'],
				debug: true,
			})
		);
	} catch {}
}

try {
	const {default: basicSsl} = await import('@vitejs/plugin-basic-ssl');
	plugins.push(basicSsl());
} catch {}

/** Material plugins */
plugins.push(
	materialShell({
		// pathToDefaultMaterialStyleSheet: './src/styles/stylesheets/material.css',
	}),
	materialAll(),
	mdicon2svg({
		variant: 'rounded',
		include: [
			'./src/**/*.ts',
			'./node_modules/@vdegenne/material-color-helpers/lib/elements/**/*.js',
		],
	})
);

if (process.env.NODE_ENV === 'production') {
	try {
		const module = await import('rollup-plugin-minify-template-literals');
		plugins.push(module.minifyTemplateLiterals());
	} catch {}
	try {
		const {minifyHtml} = await import('@vdegenne/rollup-plugin-minify-html');
		plugins.push(minifyHtml());
	} catch {}
	try {
		const {viteSingleFile} = await import('vite-plugin-singlefile');
		plugins.push(
			viteSingleFile({
				useRecommendedBuildConfig: false,
			})
		);
	} catch {}
}

/** PWA plugin */
try {
	const {VitePWA} = await import('vite-plugin-pwa');
	plugins.push(
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['*.{png,ico,json,otf,ttf,woff2}'],
			manifest: {
				// theme_color: 'red',
				icons: [
					{
						src: 'pwa-64x64.png',
						sizes: '64x64',
						type: 'image/png',
					},
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any',
					},
					{
						src: 'maskable-icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable',
					},
				],
			},
		})
	);
} catch {}

/** CONFIG */
export default defineConfig({
	base: './',
	resolve: {
		// preserveSymlinks: true,
	},
	server: {
		// port: 5180,
		proxy: {
			// '/api': 'http://localhost:23058',
			// '/data': {
			// 	target: 'http://localhost:5173', // Vite's default dev server address
			// 	changeOrigin: true,
			// 	rewrite: (path) => path.replace(/^\/data/, '/dist/data'),
			// },
		},
		// https: {
		// 	key: fs.readFileSync('./ssl/server.key'),
		// 	cert: fs.readFileSync('./ssl/server.crt'),
		// },
	},
	build: {
		// outDir: 'docs',
		// emptyOutDir: false,
		// assetsInlineLimit: 6000,
		// rollupOptions: {
		// 	input: {
		// 		index: pathlib.resolve(__dirname, 'index.html'),
		// 		print: pathlib.resolve(__dirname, 'print/index.html'),
		// 	},
		// },
	},
	esbuild: {
		legalComments: 'none',
	},
	plugins,
});
