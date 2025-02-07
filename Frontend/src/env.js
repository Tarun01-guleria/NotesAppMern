const { VITE_API_BASE_URL, ...otherViteConfig } = import.meta.env;

export const Env = {
  API_BASE_URL:
    VITE_API_BASE_URL === "prod" ? window.location.origin : VITE_API_BASE_URL,
  __vite__: otherViteConfig,
};
