<script setup>
import { useUserStore } from "~/stores/users/user";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const userStore = useUserStore();

const handleLogout = async () => {
  userStore.logout();
  await navigateTo("/login");
};
</script>

<template>
  <div>
    <nav class="navigation">
      <div class="nav-container">
        <div class="nav-links">
          <NuxtLink to="/restaurateur">{{ t("header_home") }}</NuxtLink>
          <NuxtLink to="/restaurateur/mon-restaurant">{{
            t("header_restaurateur_dashboard")
          }}</NuxtLink>
          <NuxtLink to="/restaurateur/plats">{{ t("header_plats") }}</NuxtLink>
          <NuxtLink to="/restaurateur/commandes">{{
            t("header_restaurateur_orders")
          }}</NuxtLink>
        </div>
        <div class="nav-actions">
          <button @click="handleLogout" class="logout-btn">
            {{ t("logout") }}
          </button>
          <div class="language-switcher">
            <NuxtLink
              :to="$switchLocalePath('fr')"
              :class="{ active: locale === 'fr' }"
              >FR</NuxtLink
            >
            <NuxtLink
              :to="$switchLocalePath('en')"
              :class="{ active: locale === 'en' }"
              >EN</NuxtLink
            >
          </div>
        </div>
      </div>
    </nav>

    <main>
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
.navigation {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  position: sticky;
  top: 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-links a.router-link-active {
  background: rgba(255, 255, 255, 0.3);
}

.nav-actions {
  margin-left: 2rem;
}

.logout-btn {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

.language-switcher {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
}

.language-switcher a {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  text-decoration: none;
}

.language-switcher a:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.language-switcher a.active {
  background: white;
  color: #764ba2;
}

main {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    padding: 1rem;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
    gap: 1rem;
  }

  .nav-links a {
    width: 100%;
    text-align: center;
  }

  .nav-actions {
    margin: 1rem 0 0 0;
    width: 100%;
  }

  .logout-btn {
    width: 100%;
  }
}
</style>
