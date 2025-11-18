import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useUserStore } from "../../app/stores/users/user";

describe("UserStore", () => {
  beforeEach(() => {
    // Crée une nouvelle instance de Pinia pour chaque test
    setActivePinia(createPinia());
  });

  it("devrait se connecter avec des identifiants valides", () => {
    const store = useUserStore();

    const user = store.login({
      email: "test_user@example.com",
      password: "user123",
    });

    expect(user).toBeDefined();
    expect(store.isAuthenticated).toBe(true);
    expect(store.user).not.toBeNull();
    expect(store.user?.email).toBe("test_user@example.com");
  });

  it("devrait lever une erreur avec des identifiants invalides", () => {
    const store = useUserStore();

    expect(() =>
      store.login({ email: "nope@example.com", password: "bad" })
    ).toThrow();

    expect(store.isAuthenticated).toBe(false);
    expect(store.user).toBeNull();
  });
});
