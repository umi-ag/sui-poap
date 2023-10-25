export const isProduction = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';
}
