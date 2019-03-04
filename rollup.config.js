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

const apply = (changable, constant) => changable.map(entry => ({
    ...constant,
    ...entry,
    output: {
        ...constant.output,
        file: entry.output,
    },
}));

const createChangable = (pattern, prefix = '', postfix = '.js') => pattern.map(entry => ({
    ...entry,
    output: `${prefix}${entry.output}${postfix}`,
}));

const config = {
    entries: [
        {
            input: 'src/index.js',
            output: 'index',
        },
        {
            input: 'src/execute.js',
            output: 'execute',
        },
        {
            input: 'src/command.js',
            output: 'command',
        },
        {
            input: 'src/request.js',
            output: 'request',
        },
        {
            input: 'src/respond.js',
            output: 'respond',
        }
    ],
    cjs: {
        plugins: [
            babel(),
            globals(),
        ],
        external: externals,
        output: {
            format: 'cjs',
            indent: false,
        },
    },
    esDev: {
        plugins: [
            babel(),
            builtins(),
            nodeResolve({
                jsnext: true,
            }),
        ],
        output: {
            format: 'es', indent: false,
        },
    },
    esProd: {
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
        output: { format: 'es', indent: false },
    },
    umdDev: {
        output: {
            format: 'umd',
            name: 'CQC',
        },
        plugins: [
            builtins(),
            nodeResolve(),
            babel({
                exclude: 'node_modules/**/*.js',
            }),
            commonjs()
        ],
    },
    umdProd: {
        output: {
            format: 'umd',
            name: 'CQC',
        },
        plugins: [
            builtins(),
            nodeResolve(),
            babel({
                exclude: 'node_modules/**/*.js',
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
export default BABEL_ENV === 'es5' ? [
    ...apply(createChangable(config.entries, 'dist/'), config.umdDev),
    ...apply(createChangable(config.entries, 'dist/', '.min.js'), config.umdProd),
] : [
    ...apply(createChangable(config.entries, 'lib/'), config.cjs),
    ...apply(createChangable(config.entries, 'es/'), config.esDev),
    ...apply(createChangable(config.entries, 'es/', '.min.js'), config.esProd),
]
