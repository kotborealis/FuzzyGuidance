import {terser} from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';

const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/index.jsx',
    output: {
        file: 'public/bundle.js',
        format: 'iife', // immediately-invoked function expression — suitable for <script> tags
        sourcemap: true
    },
    plugins: [
        replace({
            "process.env.NODE_ENV": JSON.stringify(production)
        }),
        babel({
            exclude: "node_modules/**"
        }),
        resolve(),
        commonjs({
            namedExports: {
                'react-dom': ['render'],
                'react': ['useRef', 'isValidElement', 'useState', 'useCallback', 'useEffect', 'useMemo', 'createContext', 'useContext', 'createElement', 'cloneElement']
            }
        }),
        production && terser(), // minify, but only in production,
    ]
};