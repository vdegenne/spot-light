import {nodeResolve} from '@rollup/plugin-node-resolve';
import ts from '@rollup/plugin-typescript';

/** @type {import('rollup').RollupOptions} */
export default [
	{
		input: './src/spot-light.ts',
		output: {file: './lib/spot-light.js', format: 'es'},
		plugins: [nodeResolve(), ts()],
	},
];
