// Get environment variables
export function getEnv() {
    return import.meta.env.MODE;
}
// It is a development mode
export function isDevMode() {
    return import.meta.env.DEV;
}
// It is a production mode
export function isProdMode() {
    return import.meta.env.PROD;
}
