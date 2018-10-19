import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals';
import pkg from './package.json'

const BABEL_ENV = process.env.BABEL_ENV

const makeExternalPredicate = externalsArr => {
  if (externalsArr.length === 0) {
    return () => false
  }
  const externalPattern = new RegExp(`^(${externalsArr.join('|')})($|/)`)
  return id => externalPattern.test(id)
}

const externals = makeExternalPredicate([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
])

const config = {
  cjs: {
    input: 'src/index.js',
    output: { file: 'lib/cqrs-bus.js', format: 'cjs', indent: false },
    plugins: [
      babel(),
      globals(),
    ],
    external: externals,
  },
  esDev: {
    input: 'src/index.js',
    output: { file: 'es/cqrs-bus.js', format: 'es', indent: false },
    plugins: [
      babel(),
      builtins(),
    ],
    external: externals,
  },
  esProd: {
    input: 'src/index.js',
    output: { file: 'es/cqrs-bus.min.js', format: 'es', indent: false },
    plugins: [
      babel(),
      builtins(),
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
    external: externals,
  },
  umdDev: {
    input: 'src/index.js',
    output: {
      file: 'dist/cqrs-bus.js',
      format: 'umd',
      name: 'CQRSBus',
    },
    plugins: [
      builtins(),
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
      builtins(),
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