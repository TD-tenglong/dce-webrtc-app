const { resolve } = require
const OFF = 0
const WARN = 1
const ERROR = 2

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    'jest/globals': true
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'unicorn',
    'promise',
    'simple-import-sort',
    'prettier',
    'jest',
    '@talkdesk/eslint-plugin-dce'
  ],
  extends: [
    'standard',
    'plugin:eslint-comments/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:unicorn/recommended',
    'plugin:promise/recommended',
    'prettier'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx', '.js', '.json']
      },
      typescript: {
        project: [resolve('./tsconfig.json')]
      }
    }
  },
  rules: {
    // commonly used
    camelcase: OFF,
    'no-void': OFF,
    'comma-dangle': ['error', 'never'],
    'max-len': ['error', { code: 120 }],
    'prettier/prettier': 'error',
    'no-use-before-define': OFF,
    'eslint-comments/disable-enable-pair': [ERROR, { allowWholeFile: true }],
    'import/extensions': OFF,
    'newline-before-return': ERROR,
    'func-names': OFF,
    'lines-between-class-members': OFF,
    'max-classes-per-file': OFF,
    'no-console': OFF,
    'no-empty': OFF,
    'no-underscore-dangle': OFF,
    'no-unused-expressions': OFF,
    'no-useless-constructor': OFF,
    semi: [ERROR, 'never'],
    quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }],
    'node/no-callback-literal': OFF,
    'prefer-template': 2,

    // react
    'react/jsx-indent': [ERROR, 2],
    'react/jsx-filename-extension': [ERROR, { extensions: ['.ts', '.tsx', '.json', '.js'] }],
    'react/jsx-uses-react': OFF,
    'react/react-in-jsx-scope': OFF,
    'react/self-closing-comp': ERROR,
    'react/jsx-boolean-value': ERROR,

    // unicorn
    'unicorn/filename-case': [
      ERROR,
      {
        cases: {
          camelCase: true,
          pascalCase: true
        }
      }
    ],
    'unicorn/import-style': [
      'error',
      {
        styles: {
          path: {
            named: true
          }
        }
      }
    ],
    'unicorn/no-array-for-each': OFF,
    'unicorn/no-null': OFF,
    'unicorn/no-process-exit': OFF,
    'unicorn/prefer-module': OFF,
    'unicorn/prefer-node-protocol': OFF,
    'unicorn/prevent-abbreviations': OFF,

    // @typescript-eslint
    '@typescript-eslint/explicit-function-return-type': OFF,
    '@typescript-eslint/no-explicit-any': OFF,
    '@typescript-eslint/no-non-null-assertion': OFF,
    '@typescript-eslint/no-useless-constructor': ERROR,
    // simple-import-sort
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Packages. `react` related packages come first.
          ['^react', '^@?\\w'],
          // Internal packages.
          ['^(@cobalt|@cobalt-marketplace)(/.*|$)'],
          // Side effect imports.
          ['^\\u0000'],
          // Parent imports. Put `..` last.
          ['^@(/.*|$)', '^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports.
          ['^.+\\.s?css$']
        ]
      }
    ],
    'simple-import-sort/exports': 'warn',

    // promise
    'promise/always-return': OFF,

    '@talkdesk/dce/json-key-exists': [
      ERROR,
      {
        functionNames: ['i18n.t', 't'],
        localesPath: 'public/locales',
        specifics: [
          {
            matcher: /^global:(.*)$/,
            to: 'global.json'
          },
          {
            matcher: /^(.*)$/,
            to: 'app.json'
          }
        ]
      }
    ],
    '@talkdesk/dce/no-literal-in-jsx': [
      WARN,
      {
        allowList: ['-']
      }
    ],
    '@talkdesk/dce/unsubscribe-from-rtm-events': ERROR
  },
  overrides: [
    {
      files: ['**.mock.*'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': OFF,
        '@typescript-eslint/no-explicit-any': OFF
      }
    },
    {
      files: ['**.test*'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': OFF,
        '@typescript-eslint/no-explicit-any': OFF,
        '@talkdesk/dce/no-literal-in-jsx': OFF
      }
    },
    {
      files: ['**.spec*'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': OFF,
        '@typescript-eslint/no-explicit-any': OFF,
        '@talkdesk/dce/no-literal-in-jsx': OFF
      }
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        'import/no-duplicates': OFF
      }
    },
    {
      files: ['src/react-app-env.d.ts'],
      rules: {
        'unicorn/filename-case': OFF
      }
    },
    {
      files: ['**/*.js'],
      rules: {
        '@typescript-eslint/no-empty-function': OFF,
        '@typescript-eslint/explicit-module-boundary-types': OFF,
        '@typescript-eslint/no-unused-vars': OFF,
        '@typescript-eslint/explicit-function-return-type': OFF,
        '@typescript-eslint/no-explicit-any': OFF
      }
    },
    // These rules are only temporarily closed for js files
    // We will delete these rules and fix errors and warnings in the code
    {
      files: ['**/*.js'],
      rules: {
        quotes: OFF,
        semi: OFF,
        'comma-dangle': OFF,
        'prettier/prettier': OFF,
        'newline-before-return': OFF,
        'prefer-const': OFF,
        'one-var': OFF,
        'no-var': OFF,
        'dot-notation': OFF,
        'no-unneeded-ternary': OFF,
        'import/no-duplicates': OFF,
        'react/prop-types': OFF,
        'react/display-name': OFF,
        'promise/catch-or-return': OFF,
        'unicorn/consistent-destructuring': OFF,
        'unicorn/prefer-spread': OFF,
        'unicorn/explicit-length-check': OFF,
        'unicorn/consistent-function-scoping': OFF,
        'unicorn/prefer-keyboard-event-key': OFF,
        'unicorn/filename-case': OFF,
        'unicorn/no-array-reduce': OFF,
        'unicorn/no-abusive-eslint-disable': OFF,
        'unicorn/catch-error-name': OFF,
        'unicorn/prefer-optional-catch-binding': OFF,
        'unicorn/prefer-includes': OFF,
        'unicorn/prefer-array-find': OFF,
        'unicorn/better-regex': OFF,
        'unicorn/prefer-ternary': OFF,
        'unicorn/prefer-query-selector': OFF,
        'unicorn/no-new-array': OFF,
        'unicorn/prefer-dom-node-dataset': OFF,
        'unicorn/prefer-array-some': OFF,
        'unicorn/numeric-separators-style': OFF,
        'unicorn/no-useless-undefined': OFF,
        'unicorn/prefer-dom-node-append': OFF,
        'unicorn/prefer-dom-node-remove': OFF,
        'unicorn/prefer-number-properties': OFF,
        'eslint-comments/no-unlimited-disable': OFF,
        'simple-import-sort/imports': OFF
      }
    },
    // These rule are only temporarily closed for this file
    {
      files: ['src/components/rich-editor/RegisterQuill.js'],
      rules: {
        'max-len': OFF
      }
    },
    // These rule are only temporarily closed for this file
    {
      files: ['src/pages/livechat/touchpoints/touchpoint-modal/index.tsx'],
      rules: {
        '@typescript-eslint/ban-ts-comment': OFF
      }
    },
    {
      files: ['src/components/slider/utils/color.ts'],
      rules: {
        'unicorn/better-regex': OFF
      }
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'react/prop-types': OFF,
        '@typescript-eslint/explicit-module-boundary-types': OFF
      }
    }
  ]
}
