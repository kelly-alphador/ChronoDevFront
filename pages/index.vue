<template>
  <v-container fluid class="pa-6">
    <!-- Première ligne - Statistiques -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card elevation="3" class="rounded-lg">
          <v-card-item>
            <template v-slot:prepend>
              <v-avatar color="primary" size="56">
                <v-icon size="32" color="white">mdi-folder-multiple</v-icon>
              </v-avatar>
            </template>
            <v-card-title class="text-h5 font-weight-bold">Total Projets</v-card-title>
          </v-card-item>

          <v-card-text class="py-4">
            <v-row align="center" no-gutters>
              <v-col cols="6">
                <div class="text-h2 font-weight-bold text-primary">5</div>
                <div class="text-subtitle-1 text-medium-emphasis">Projets actifs</div>
              </v-col>

              <v-col class="text-right" cols="6">
                <v-icon
                  color="primary"
                  icon="mdi-briefcase-check"
                  size="88"
                ></v-icon>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <div class="d-flex py-3 justify-space-around">
            <div class="text-center">
              <v-icon color="success" size="24">mdi-check-circle</v-icon>
              <div class="text-caption text-medium-emphasis mt-1">3 Terminés</div>
            </div>
            <v-divider vertical></v-divider>
            <div class="text-center">
              <v-icon color="warning" size="24">mdi-progress-clock</v-icon>
              <div class="text-caption text-medium-emphasis mt-1">2 En cours</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="3" class="rounded-lg">
          <v-card-item>
            <template v-slot:prepend>
              <v-avatar color="success" size="56">
                <v-icon size="32" color="white">mdi-account-group</v-icon>
              </v-avatar>
            </template>
            <v-card-title class="text-h5 font-weight-bold">Total Utilisateurs</v-card-title>
          </v-card-item>

          <v-card-text class="py-4">
            <v-row align="center" no-gutters>
              <v-col cols="6">
                <div class="text-h2 font-weight-bold text-success">7</div>
                <div class="text-subtitle-1 text-medium-emphasis">Développeurs</div>
              </v-col>

              <v-col class="text-right" cols="6">
                <v-icon
                  color="success"
                  icon="mdi-account-multiple"
                  size="88"
                ></v-icon>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <div class="d-flex py-3 justify-space-around">
            <div class="text-center">
              <v-icon color="info" size="24">mdi-account-check</v-icon>
              <div class="text-caption text-medium-emphasis mt-1">6 Actifs</div>
            </div>
            <v-divider vertical></v-divider>
            <div class="text-center">
              <v-icon color="error" size="24">mdi-account-off</v-icon>
              <div class="text-caption text-medium-emphasis mt-1">1 Inactif</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Deuxième ligne - Graphiques -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="3" class="rounded-lg">
          <v-card-item>
            <v-card-title class="text-h6 font-weight-bold">
              <v-icon class="mr-2" color="primary">mdi-clock-time-four</v-icon>
              Heures de travail hebdomadaires
            </v-card-title>
            <v-card-subtitle>Semaine actuelle</v-card-subtitle>
          </v-card-item>

          <v-card-text>
                <WorkingHoursChart/>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-chip color="success" size="small" class="ma-2">
              <v-icon start>mdi-trending-up</v-icon>
              +15% vs semaine dernière
            </v-chip>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="3" class="rounded-lg">
          <v-card-item>
            <v-card-title class="text-h6 font-weight-bold">
              <v-icon class="mr-2" color="info">mdi-trophy</v-icon>
              Top  Développeurs
            </v-card-title>
            <v-card-subtitle>Les plus productifs</v-card-subtitle>
          </v-card-item>

          <v-card-text>
                  <TopDevelopers/>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
              
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import WorkingHoursChart from '~/components/WorkingHoursChart.vue';
import TopDevelopers from '~/components/TopDevelopers.vue';
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}
</style>