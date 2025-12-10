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
                <div class="text-h2 font-weight-bold text-primary">{{ Nb_project }}</div>
                <div class="text-subtitle-1 text-medium-emphasis">Projets actifs</div>
              </v-col>

              <v-col class="text-right" cols="6">
                <v-icon color="primary" icon="mdi-briefcase-check" size="88"></v-icon>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <div class="d-flex py-3 justify-space-around">
            <div class="text-center">
              <v-icon color="success" size="24">mdi-check-circle</v-icon>
              <div class="text-caption text-medium-emphasis mt-1">{{ Termine }} Terminés</div>
            </div>
            <v-divider vertical></v-divider>
            <div class="text-center">
              <v-icon color="warning" size="24">mdi-progress-clock</v-icon>
              <div class="text-caption text-medium-emphasis mt-1">{{ En_cours }} En cours</div>
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
                <div class="text-h2 font-weight-bold text-success">{{ userStats.totalUsers }}</div>
                <div class="text-subtitle-1 text-medium-emphasis">Utilisateurs</div>
              </v-col>

              <v-col class="text-right" cols="6">
                <v-icon color="success" icon="mdi-account-multiple" size="88"></v-icon>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <div class="py-3 px-3">
            <v-row>
              <v-col cols="4" class="text-center">
                <v-avatar color="blue-lighten-1" size="40" class="mb-2">
                  <v-icon color="white" size="20">mdi-code-tags</v-icon>
                </v-avatar>
                <div class="text-h6 font-weight-bold text-blue-darken-2">{{ userStats.developpeurs }}</div>
                <div class="text-caption text-medium-emphasis">Développeurs</div>
              </v-col>

              <v-col cols="4" class="text-center">
                <v-avatar color="purple-lighten-1" size="40" class="mb-2">
                  <v-icon color="white" size="20">mdi-account-tie</v-icon>
                </v-avatar>
                <div class="text-h6 font-weight-bold text-purple-darken-2">{{ userStats.managers }}</div>
                <div class="text-caption text-medium-emphasis">Managers</div>
              </v-col>

              <v-col cols="4" class="text-center">
                <v-avatar color="orange-lighten-1" size="40" class="mb-2">
                  <v-icon color="white" size="20">mdi-account-star</v-icon>
                </v-avatar>
                <div class="text-h6 font-weight-bold text-orange-darken-2">{{ userStats.chefsProjet }}</div>
                <div class="text-caption text-medium-emphasis">Chefs de Projet</div>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Deuxième ligne - Heures de travail par semaine -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="3" class="rounded-lg">
          <v-card-item>
            <v-card-title class="text-h6 font-weight-bold">
              <v-icon class="mr-2" color="primary">mdi-clock-time-four</v-icon>
              Heures de travail hebdomadaires
            </v-card-title>
            <v-card-subtitle>
              {{ formatDateRange(currentWeekStart, currentWeekEnd) }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <div class="d-flex justify-center align-center mb-4">
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                @click="previousWeek"
                size="small"
              ></v-btn>
              <v-chip color="primary" class="mx-2">
                Semaine {{ getCurrentWeekNumber() }}
              </v-chip>
              <v-btn
                icon="mdi-chevron-right"
                variant="text"
                @click="nextWeek"
                size="small"
              ></v-btn>
            </div>

            <!-- Champ de recherche -->
            <v-text-field
              v-model="searchWeek"
              prepend-inner-icon="mdi-magnify"
              label="Rechercher un développeur"
              variant="outlined"
              density="compact"
              clearable
              class="mb-4"
            ></v-text-field>

            <v-data-table
              :headers="weekHeaders"
              :items="filteredWeekData"
              :loading="loadingWeek"
              class="elevation-1"
              items-per-page="10"
            >
              <template v-slot:item.developpeur="{ item }">
                <div class="d-flex align-center py-2">
                  <v-avatar color="primary" size="32" class="mr-3">
                    <span class="text-white text-caption">
                      {{ getInitials(item.developpeur) }}
                    </span>
                  </v-avatar>
                  <span class="font-weight-medium">{{ item.developpeur }}</span>
                </div>
              </template>

              <template v-slot:item.totalHeures="{ item }">
                <v-chip color="success" size="small">
                  <v-icon start size="small">mdi-clock</v-icon>
                  {{ item.totalHeures }}h
                </v-chip>
              </template>

              <template v-slot:item.nombreProjets="{ item }">
                <v-chip color="warning" size="small">
                  <v-icon start size="small">mdi-briefcase</v-icon>
                  {{ item.nombreProjets || item.projets?.length || 0 }}
                </v-chip>
              </template>

              <template v-slot:item.projets="{ item }">
                <div class="d-flex flex-wrap ga-1">
                  <v-tooltip 
                    v-for="(projet, index) in item.projets"
                    :key="index"
                    location="top"
                  >
                    <template v-slot:activator="{ props }">
                      <v-chip
                        v-bind="props"
                        size="small"
                        variant="outlined"
                        color="info"
                      >
                        <!-- Si projet est un objet avec .projet et .heures -->
                        <template v-if="typeof projet === 'object' && projet.projet">
                          {{ projet.projet }}: {{ projet.heures }}h
                        </template>
                        <!-- Si projet est juste un string -->
                        <template v-else>
                          {{ projet }}
                        </template>
                      </v-chip>
                    </template>
                    <span v-if="typeof projet === 'object' && projet.projet">
                      {{ projet.projet }} - {{ projet.heures }} heures
                    </span>
                    <span v-else>{{ projet }}</span>
                  </v-tooltip>
                </div>
              </template>
            </v-data-table>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-chip color="info" size="small" class="ma-2">
              <v-icon start>mdi-account-group</v-icon>
              {{ filteredWeekData.length }} développeurs
            </v-chip>
            <v-chip color="success" size="small" class="ma-2">
              <v-icon start>mdi-clock</v-icon>
              {{ totalWeekHours }}h totales
            </v-chip>
            <v-chip color="warning" size="small" class="ma-2">
              <v-icon start>mdi-briefcase</v-icon>
              {{ totalWeekProjects }} projets
            </v-chip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Troisième ligne - Heures par mois -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="3" class="rounded-lg">
          <v-card-item>
            <v-card-title class="text-h6 font-weight-bold">
              <v-icon class="mr-2" color="info">mdi-calendar-month</v-icon>
              Heures de travail mensuelles
            </v-card-title>
            <v-card-subtitle>
              {{ formatMonth(currentMonth) }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <div class="d-flex justify-center align-center mb-4">
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                @click="previousMonth"
                size="small"
              ></v-btn>
              <v-chip color="info" class="mx-2">
                {{ formatMonth(currentMonth) }}
              </v-chip>
              <v-btn
                icon="mdi-chevron-right"
                variant="text"
                @click="nextMonth"
                size="small"
              ></v-btn>
            </div>

            <!-- Champ de recherche -->
            <v-text-field
              v-model="searchMonth"
              prepend-inner-icon="mdi-magnify"
              label="Rechercher un développeur"
              variant="outlined"
              density="compact"
              clearable
              class="mb-4"
            ></v-text-field>

            <v-data-table
              :headers="monthHeaders"
              :items="filteredMonthData"
              :loading="loadingMonth"
              class="elevation-1"
              items-per-page="10"
            >
              <template v-slot:item.developpeur="{ item }">
                <div class="d-flex align-center py-2">
                  <v-avatar color="info" size="32" class="mr-3">
                    <span class="text-white text-caption">
                      {{ getInitials(item.developpeur) }}
                    </span>
                  </v-avatar>
                  <span class="font-weight-medium">{{ item.developpeur }}</span>
                </div>
              </template>

              <template v-slot:item.totalHeures="{ item }">
                <v-chip color="primary" size="small">
                  <v-icon start size="small">mdi-clock</v-icon>
                  {{ item.totalHeures }}h
                </v-chip>
              </template>

              <template v-slot:item.nombreProjets="{ item }">
                <v-chip color="orange" size="small">
                  <v-icon start size="small">mdi-briefcase</v-icon>
                  {{ item.nombreProjets || item.projets?.length || 0 }}
                </v-chip>
              </template>

              <template v-slot:item.projets="{ item }">
                <div class="d-flex flex-wrap ga-1">
                  <v-tooltip 
                    v-for="(projet, index) in item.projets"
                    :key="index"
                    location="top"
                  >
                    <template v-slot:activator="{ props }">
                      <v-chip
                        v-bind="props"
                        size="small"
                        variant="outlined"
                        color="purple"
                      >
                        {{ projet.projet }}: {{ projet.heures }}h
                      </v-chip>
                    </template>
                    <span>{{ projet.projet }} - {{ projet.heures }} heures</span>
                  </v-tooltip>
                </div>
              </template>
            </v-data-table>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-chip color="info" size="small" class="ma-2">
              <v-icon start>mdi-account-group</v-icon>
              {{ filteredMonthData.length }} développeurs
            </v-chip>
            <v-chip color="primary" size="small" class="ma-2">
              <v-icon start>mdi-clock</v-icon>
              {{ totalMonthHours }}h totales
            </v-chip>
            <v-chip color="orange" size="small" class="ma-2">
              <v-icon start>mdi-briefcase</v-icon>
              {{ totalMonthProjects }} projets
            </v-chip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { UseDashboardStore } from '~/stores/Dashboard';

definePageMeta({
  middleware: 'auth',
  layout:'admin',
  meta: {
    requiresAuth: true
  }
});

const dashboardStore = UseDashboardStore();

// États
const weekData = ref([]);
const monthData = ref([]);
const loadingWeek = ref(false);
const loadingMonth = ref(false);
const Nb_project = ref(0);
const En_cours = ref(0);
const Termine = ref(0);
const userStats = ref({
  totalUsers: 0,
  developpeurs: 0,
  managers: 0,
  chefsProjet: 0
});

// Dates actuelles
const currentWeekStart = ref(new Date());
const currentWeekEnd = ref(new Date());
const currentMonth = ref(new Date());

// Recherche
const searchWeek = ref('');
const searchMonth = ref('');

// Headers pour les tableaux
const weekHeaders = [
  { title: 'Développeur', key: 'developpeur', sortable: true },
  { title: 'Total Heures', key: 'totalHeures', sortable: true },
  { title: 'Nombre de Projets', key: 'nombreProjets', sortable: true },
  { title: 'Projets', key: 'projets', sortable: false }
];

const monthHeaders = [
  { title: 'Développeur', key: 'developpeur', sortable: true },
  { title: 'Total Heures', key: 'totalHeures', sortable: true },
  { title: 'Nombre de Projets', key: 'nombreProjets', sortable: true },
  { title: 'Projets', key: 'projets', sortable: false }
];

// Computed - Filtrage des données
const filteredWeekData = computed(() => {
  if (!searchWeek.value) return weekData.value;
  return weekData.value.filter(dev => 
    dev.developpeur.toLowerCase().includes(searchWeek.value.toLowerCase())
  );
});

const filteredMonthData = computed(() => {
  if (!searchMonth.value) return monthData.value;
  return monthData.value.filter(dev => 
    dev.developpeur.toLowerCase().includes(searchMonth.value.toLowerCase())
  );
});

const totalWeekHours = computed(() => {
  return filteredWeekData.value.reduce((sum, dev) => sum + dev.totalHeures, 0);
});

const totalMonthHours = computed(() => {
  return filteredMonthData.value.reduce((sum, dev) => sum + dev.totalHeures, 0);
});

const totalWeekProjects = computed(() => {
  return filteredWeekData.value.reduce((sum, dev) => sum + (dev.nombreProjets || dev.projets?.length || 0), 0);
});

const totalMonthProjects = computed(() => {
  return filteredMonthData.value.reduce((sum, dev) => sum + (dev.nombreProjets || dev.projets?.length || 0), 0);
});

// Fonctions utilitaires
function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

function getWeekDates(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lundi
  
  const monday = new Date(d.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  return {
    start: monday,
    end: sunday
  };
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function formatDateRange(start, end) {
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  return `${start.toLocaleDateString('fr-FR', options)} - ${end.toLocaleDateString('fr-FR', options)}`;
}

function formatMonth(date) {
  const options = { month: 'long', year: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
}

function getCurrentWeekNumber() {
  const d = new Date(currentWeekStart.value);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Navigation semaine
async function previousWeek() {
  const newDate = new Date(currentWeekStart.value);
  newDate.setDate(newDate.getDate() - 7);
  await loadWeekData(newDate);
}

async function nextWeek() {
  const newDate = new Date(currentWeekStart.value);
  newDate.setDate(newDate.getDate() + 7);
  await loadWeekData(newDate);
}

async function loadWeekData(date) {
  loadingWeek.value = true;
  const { start, end } = getWeekDates(date);
  currentWeekStart.value = start;
  currentWeekEnd.value = end;
  
  try {
    const response = await dashboardStore.GetDataHeurSemaine(
      formatDate(start),
      formatDate(end)
    );
    weekData.value = response;
  } catch (error) {
    console.error('Erreur chargement semaine:', error);
  } finally {
    loadingWeek.value = false;
  }
}

// Navigation mois
async function previousMonth() {
  const newDate = new Date(currentMonth.value);
  newDate.setMonth(newDate.getMonth() - 1);
  await loadMonthData(newDate);
}

async function nextMonth() {
  const newDate = new Date(currentMonth.value);
  newDate.setMonth(newDate.getMonth() + 1);
  await loadMonthData(newDate);
}

async function loadMonthData(date) {
  loadingMonth.value = true;
  currentMonth.value = date;
  
  try {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    const response = await dashboardStore.GetDataHeurMois(year, month);
    monthData.value = response;
  } catch (error) {
    console.error('Erreur chargement mois:', error);
  } finally {
    loadingMonth.value = false;
  }
}

// Chargement des données de projets
const LoadNumberOfProject = async () => {
  try {
    const response = await dashboardStore.GetDataNumberOfProject();
    Nb_project.value = response.data.total;
    En_cours.value = response.data.enCours;
    Termine.value = response.data.termine;
  } catch (error) {
    console.error('Erreur chargement projets:', error);
  }
};

// Chargement des données utilisateurs
const LoadNumberOfUser = async () => {
  try {
    const response = await dashboardStore.GetDataNumbreUser();
    console.log("ZANY ARY", response);
    
    // Mise à jour des stats utilisateurs
    userStats.value = {
      totalUsers: response.totalUsers || 0,
      developpeurs: response.developpeurs || 0,
      managers: response.managers || 0,
      chefsProjet: response.chefsProjet || 0
    };
  } catch (error) {
    console.error('Erreur chargement utilisateurs:', error);
  }
};

// Initialisation
onMounted(async () => {
  // Charger toutes les données
  await LoadNumberOfProject();
  await LoadNumberOfUser();
  await loadWeekData(new Date());
  await loadMonthData(new Date());
});
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

.v-data-table {
  border-radius: 8px;
}
</style>