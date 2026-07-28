import tseslint from 'typescript-eslint'

/**
 * Solo cubre el backend (server/, api/) por ahora — el frontend (src/) no
 * tenía ESLint configurado antes de este módulo y no es parte de su alcance.
 */
export default tseslint.config(
  {
    ignores: ['node_modules', 'dist', 'src', 'prisma/migrations'],
  },
  ...tseslint.configs.recommended,
  {
    files: ['server/**/*.ts', 'api/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  }
)
