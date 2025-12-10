<template>
  <v-app>
    <!-- App Bar stylisé avec gradient et élévation -->
    <v-app-bar 
      color="primary"
      elevation="4"
      prominent
    >
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="ToggleDrawer()"></v-app-bar-nav-icon>
      </template>
      
      <v-app-bar-title class="text-h5 font-weight-bold">
        ChronoDev
      </v-app-bar-title>

      <template v-slot:append>
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-bell-outline</v-icon>
        </v-btn>
        <v-avatar size="40" class="ml-2">
          <v-icon>mdi-account-circle</v-icon>
        </v-avatar>
      </template>
    </v-app-bar>

    <!-- Navigation Drawer stylisé avec sections et icônes -->
    <v-navigation-drawer
    v-model="drawer"
      permanent
      color="grey-lighten-5"
      width="280"
    >
      <!-- En-tête du drawer -->
      <v-sheet color="primary" class="pa-4" dark>
        <v-avatar size="64" class="mb-2">
          <v-icon size="40">mdi-account-circle</v-icon>
        </v-avatar>
        <div class="text-h6 font-weight-bold">{{ UserName }}</div>
        <div class="text-caption">{{ UserEmail }}</div>
      </v-sheet>

      <v-divider></v-divider>

      <!-- Menu principal -->
      <v-list density="comfortable" nav class="py-2">
          <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Tableau de bord"
          to="/Dashboard"
          value="dashboard"
          color="primary"
          rounded="xl"
          class="mx-2 mb-1"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-multiple"
          title="Utilisateurs"
          value="users"
          to="/users"
          color="primary"
          rounded="xl"
          class="mx-2 mb-1"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-folder-multiple"
          title="Projets"
          value="projects"
          to="/projets"
          color="primary"
          rounded="xl"
          class="mx-2 mb-1"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-calendar"
          title="Calendrier"
          value="calendar"
          to="/calendrier"
          color="primary"
          rounded="xl"
          class="mx-2 mb-1"
        ></v-list-item>
      </v-list>

      <v-divider class="my-2"></v-divider>

      <!-- Section secondaire -->
      <v-list density="comfortable" nav>
        <v-list-subheader>PARAMÈTRES</v-list-subheader>
        
        <v-list-item
          prepend-icon="mdi-cog"
          title="Configuration"
          value="settings"
          color="primary"
          rounded="xl"
          class="mx-2 mb-1"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-help-circle"
          title="Aide"
          value="help"
          color="primary"
          rounded="xl"
          class="mx-2 mb-1"
        ></v-list-item>
      </v-list>

      <!-- Bouton de déconnexion en bas -->
      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            block
            color="error"
            variant="tonal"
            prepend-icon="mdi-logout"
            rounded="lg"
            @click="handleLogout()"
          >
            Déconnexion
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Contenu principal avec couleur de fond -->
    <v-main class="bg-grey-lighten-4">
      <v-container fluid>
        <slot/>
      </v-container>
    </v-main>
  </v-app>
</template>
<script setup>
    import { useAuthStore } from '@/stores/auth';
    
    import { ref } from 'vue';
import auth from '~/middleware/auth';
    const authStore=useAuthStore()
    const drawer=ref(false);
    const UserName=computed(()=>{
        if(authStore.user && authStore.user.nom && authStore.user.prenom)
        {
          return `${authStore.user.nom} ${authStore.user.prenom}`
        }
        return 'user inconnu'
    })
    const UserEmail=computed(()=>{
        return authStore.user?.email ?? 'email inconnu'
    })
    //Methode pour afficher et cacher la navigation drawer
    const ToggleDrawer=()=>{
        console.log("je suis cliquer");
        drawer.value=!drawer.value
    }
    //InformationUSer=authStore.user.value
    const handleLogout=()=>{
        console.log("je deconnecte")
        authStore.logout();
    }
</script>
<style scoped>
.v-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.08);
}

.v-list-item--active {
  font-weight: 600;
}
</style>