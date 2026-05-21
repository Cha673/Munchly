export const useApi = () => {
  const config = useRuntimeConfig();

  return $fetch.create({
    baseURL: config.public.apiBaseUrl,
    onRequest({ request, options }) {
      const authState = process.client
        ? localStorage.getItem("auth_state")
        : null;
      let token = null;

      if (authState) {
        const parsed = JSON.parse(authState);
        token = parsed.token;
      }

      if (token) {
        options.headers = new Headers(options.headers || {});
        options.headers.set("Authorization", `Bearer ${token}`);
      }
    },
    onResponseError({ response }) {
      console.error("Erreur API :", response._data);
    },
  });
};
