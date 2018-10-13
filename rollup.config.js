import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
const BABEL_ENV = process.env.BABEL_ENV
const config = {
  cjs: {
    input: 'src/index.js',
    output: { file: 'lib/cqrs-bus.js', format: 'cjs', indent: false },
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
      babel()
    ],
    external: [ 'event-target-shim' ],
  },
  esDev: {
    input: 'src/index.js',
    output: { file: 'es/cqrs-bus.js', format: 'es', indent: false },
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
      babel()
    ],
    external: [ 'event-target-shim' ],
  },
  esProd: {
    input: 'src/index.js',
    output: { file: 'es/cqrs-bus.min.js', format: 'es', indent: false },
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      babel(),
      nodeResolve({
        jsnext: true,
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      })
    ],
    external: [ 'event-target-shim' ],
  },
  umdDev: {
    input: 'src/index.js',
    output: {
      file: 'dist/cqrs-bus.js',
      format: 'umd',
      name: 'CQRSBus',
    },
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
      nodeResolve(),
      babel({
        exclude: '**/node_modules/**',
      }),
      commonjs()
    ],
  },
  umdProd: {
    input: 'src/index.js',
    output: {
      file: 'dist/cqrs-bus.min.js',
      format: 'umd',
      name: 'CQRSBus',
    },
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      nodeResolve(),
      babel({
        exclude: '**/node_modules/**',
      }),
      commonjs(),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      })
    ],
  },
}
export default BABEL_ENV === 'es5' ? [config.umdDev, config.umdProd] : [config.cjs, config.esDev, config.esProd]