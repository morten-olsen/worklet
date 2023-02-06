import { nodeResolve } from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import { RollupOptions } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import sucrase from '@rollup/plugin-sucrase';
// import auto from '@rollup/plugin-auto-install';
import replace from '@rollup/plugin-replace';
import { BundleConfig } from '.';

const defaultConfig = (def: BundleConfig): RollupOptions => {
  const env = def.env || [];
  const replacements = env.reduce((acc, key) => {
    acc[`process.env.${key}`] = JSON.stringify(process.env[key]);
    return acc;
  }, {} as Record<string, string>);
  return {
    plugins: [
      json(),
      replace({
        ...replacements,
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
      sucrase({
        transforms: ['typescript', 'jsx'],
      }),
      nodePolyfills() as any,
      nodeResolve({ preferBuiltins: false, extensions: ['.js', '.ts', '.tsx'] }),
      commonjs({ include: /node_modules/ }),
      alias({
        entries: {
          'aws-sdk': 'aws-sdk/dist/aws-sdk-react-native',
        },
      }),
    ],
  };
};

export { defaultConfig };
