// The legacy lightbox imports process only to choose its development build.
// Supply the build mode without exposing any server environment variables.
export const env = { NODE_ENV: import.meta.env.MODE };
export default { env };
