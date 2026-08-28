export const appEnvironment = process.env.NEXT_PUBLIC_APP_ENV === "production" ? "production" : "local";
export const isProduction = appEnvironment === "production";
export const environmentBadge = isProduction ? "PRODUCTION DATA" : "LOCAL MOCK DATA";
export const dataLabel = isProduction ? "本番データ" : "ローカルモックデータ";
