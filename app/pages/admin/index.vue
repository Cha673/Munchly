<!-- Dashboard Administrateur
  Fonctionnalités :
   - Listing des restaurateurs avec possibilité de suppression
   - AMène vers la page add_restaurateur quand on veut ajouter un restaurateur
-->
<script setup lang="ts">
import { useUserStore } from "~/stores/users/user";
import { ref, computed } from "vue";
import UserCard from "~/components/UserCard.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

definePageMeta({
  layout: "admin",
  middleware: ["auth-admin"],
});

useHead({
  title: t("meta.dashboard_title"),
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    {
      name: "description",
      content: t("meta.dashboard_description"),
    },
  ],
});

useSeoMeta({
  title: t("meta.dashboard_title"),
  ogTitle: t("meta.dashboard_title"),
  description: t("meta.dashboard_description"),
  ogDescription: t("meta.dashboard_description"),
  ogImage: "/images/admin-dashboard.jpg",
  twitterCard: "summary_large_image",
});

const userStore = useUserStore();
const restaurateurs = computed(() => userStore.getRestaurateurs);

const handleLogout = async () => {
  userStore.logout();
  await navigateTo("/login");
};

const handleDeleteUser = (userId: number) => {
  try {
    userStore.deleteUser(userId);
  } catch (error: any) {
    alert(error.message);
  }
};

const showAddForm = ref(false);
const newUser = ref({
  name: "",
  email: "",
  password: "",
});

const handleAddRestaurateur = () => {
  try {
    userStore.addRestaurateur({
      ...newUser.value,
      role: "restaurateur",
    });
    showAddForm.value = false;
    newUser.value = { name: "", email: "", password: "" };
  } catch (error: any) {
    alert(error.message);
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>{{ t("admin.bo_resto") }}</h1>
      </div>

      <div class="dashboard-content">
        <div class="section-header">
          <h2>{{ t("admin.restaurateurs_list") }}</h2>
          <NuxtLink to="/admin/add-restaurateur" class="add-button">
            {{ t("admin.add_resto") }}
          </NuxtLink>
        </div>

        <!-- Liste des restaurateurs -->
        <div class="users-list">
          <UserCard
            v-for="user in restaurateurs"
            :key="user.id"
            :id="user.id"
            :nom="user.name"
            :email="user.email"
            :role="user.role"
            @delete="handleDeleteUser"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import "@/assets/css/pages/auth.css";

/* Styles supplémentaires spécifiques au dashboard */
.auth-box.dashboard {
  max-width: 1000px;
}

.dashboard {
  background-color: white;
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 50rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dashboard-header h1 {
  margin: 0;
  text-align: left;
}

.dashboard-content {
  margin-top: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  color: #374151;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.add-button {
  background-color: #4b5563;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.2s ease;
  width: 100%;
  max-width: 11rem;
  border: 0;
  text-align: center;
}

.add-button:hover {
  background-color: #374151;
}

.users-list {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    align-items: stretch;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .add-button {
    width: 100%;
    text-align: center;
  }

  .auth-box.dashboard {
    padding: 1.5rem;
  }
}
</style>
