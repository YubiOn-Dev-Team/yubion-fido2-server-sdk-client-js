import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/umd/yubion-fido2-server-sdk-client.min.js',
    format: 'umd',
    name: 'yubionFido2Client',
    sourcemap: true,
  },
  plugins: [
    typescript({ tsconfig: './tsconfig.json', outDir: 'dist/umd' }),
    nodeResolve(),
    terser(),
  ],
};
