<template>
  <v-container fluid class="pa-6">
 

    <!-- Carte Heures de la Semaine -->
    <v-row class="mb-6">
      <v-col cols="6">
        <v-card elevation="3" class="rounded-lg">
          <v-card-item>
            <template v-slot:prepend>6
              <v-avatar color="primary" size="56">
                <v-icon size="32" color="white">mdi-calendar-week</v-icon>
              </v-avatar>
            </template>
            <v-card-title class="text-h5 font-weight-bold">
              Heures de la Semaine
            </v-card-title>
            <v-card-subtitle>
              {{ formatDateRange(currentWeekStart, currentWeekEnd) }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <!-- Navigation de semaine -->
            <div class="d-flex justify-center align-center mb-4">
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                @click="previousWeek"
                :loading="loadingWeek"
                size="small"
              ></v-btn>
              <v-chip color="primary" class="mx-2">
                Semaine {{ getCurrentWeekNumber() }}
              </v-chip>
              <v-btn
                icon="mdi-chevron-right"
                variant="text"
                @click="nextWeek"
                :loading="loadingWeek"
                size="small"
              ></v-btn>
            </div>

            <v-divider class="mb-4"></v-divider>

            <!-- Total d'heures -->
            <v-row class="mb-4">
              <v-col cols="12" class="text-center">
                <div class="text-h2 font-weight-bold text-primary">
                  {{ weekData?.totalHeures || 0 }}h
                </div>
                <div class="text-subtitle-1 text-medium-emphasis">
                  Total heures travaillées
                </div>
              </v-col>
            </v-row>

            <!-- Liste des projets -->
            <div v-if="weekData?.projets && weekData.projets.length > 0">
              <h4 class="text-h6 mb-3">
                <v-icon color="primary" class="mr-2">mdi-briefcase</v-icon>
                Projets de la semaine ({{ weekData.projets.length }})
              </h4>
              <v-list>
                <v-list-item
                  v-for="(projet, index) in weekData.projets"
                  :key="index"
                  class="mb-2"
                >
                  <template v-slot:prepend>
                    <v-avatar color="success" size="40">
                      <v-icon color="white">mdi-check-circle</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-medium">
                    {{ getProjectName(projet) }}
                  </v-list-item-title>
                  <template v-slot:append v-if="getProjectHours(projet)">
                    <v-chip color="success" size="small">
                      <v-icon start size="small">mdi-clock</v-icon>
                      {{ getProjectHours(projet) }}h
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </div>
            <v-alert v-else type="info" variant="tonal" class="mt-4">
              Aucun projet pour cette semaine
            </v-alert>

            <!-- États -->
            <div v-if="weekData?.etats && weekData.etats.length > 0" class="mt-4">
              <h4 class="text-h6 mb-3">
                <v-icon color="info" class="mr-2">mdi-state-machine</v-icon>
                États des tâches
              </h4>
              <div class="d-flex flex-wrap ga-2">
                <v-chip
                  v-for="(etat, index) in weekData.etats"
                  :key="index"
                  color="info"
                  variant="outlined"
                >
                  {{ typeof etat === 'string' ? etat : etat.nomEtat }}
                  <span v-if="etat.total" class="ml-2 font-weight-bold">
                    ({{ etat.total }})
                  </span>
                </v-chip>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <!--cart pour le mensuel-->
      <v-col cols="6">
        <v-card elevation="3" class="rounded-lg">
          <v-card-item>
            <template v-slot:prepend>
              <v-avatar color="success" size="56">
                <v-icon size="32" color="white">mdi-calendar-month</v-icon>
              </v-avatar>
            </template>
            <v-card-title class="text-h5 font-weight-bold">
              Heures du Mois
            </v-card-title>
            <v-card-subtitle>
              {{ formatMonth(currentMonth) }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <!-- Navigation de mois -->
            <div class="d-flex justify-center align-center mb-4">
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                @click="previousMonth"
                :loading="loadingMonth"
                size="small"
              ></v-btn>
              <v-chip color="success" class="mx-2">
                {{ formatMonth(currentMonth) }}
              </v-chip>
              <v-btn
                icon="mdi-chevron-right"
                variant="text"
                @click="nextMonth"
                :loading="loadingMonth"
                size="small"
              ></v-btn>
            </div>

            <v-divider class="mb-4"></v-divider>

            <!-- Total d'heures -->
            <v-row class="mb-4">
              <v-col cols="12" class="text-center">
                <div class="text-h2 font-weight-bold text-success">
                  {{ monthData?.totalHeures || 0 }}h
                </div>
                <div class="text-subtitle-1 text-medium-emphasis">
                  Total heures du mois
                </div>
              </v-col>
            </v-row>

            <!-- Liste des projets avec détails -->
            <div v-if="monthData?.projets && monthData.projets.length > 0">
              <h4 class="text-h6 mb-3">
                <v-icon color="success" class="mr-2">mdi-briefcase-variant</v-icon>
                Projets du mois ({{ monthData.projets.length }})
              </h4>
              
              <v-expansion-panels>
                <v-expansion-panel
                  v-for="(projet, index) in monthData.projets"
                  :key="index"
                >
                  <v-expansion-panel-title>
                    <div class="d-flex align-center justify-space-between w-100">
                      <div class="d-flex align-center">
                        <v-icon color="success" class="mr-3">mdi-folder</v-icon>
                        <span class="font-weight-medium">
                          {{ projet.projet || projet.nomProjet }}
                        </span>
                      </div>
                      <v-chip color="success" size="small" class="mr-3">
                        <v-icon start size="small">mdi-clock</v-icon>
                        {{ projet.heures || projet.totalHeure }}h
                      </v-chip>
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-card variant="tonal" color="success">
                      <v-card-text>
                        <div class="d-flex justify-space-around text-center">
                          <div>
                            <div class="text-h5 font-weight-bold text-success">
                              {{ projet.heures || projet.totalHeure }}
                            </div>
                            <div class="text-caption">Heures totales</div>
                          </div>
                          <v-divider vertical></v-divider>
                          <div>
                            <div class="text-h5 font-weight-bold text-success">
                              {{ calculatePercentage(projet.heures || projet.totalHeure) }}%
                            </div>
                            <div class="text-caption">Du temps mensuel</div>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>

            <!-- Message si pas de données -->
            <v-alert
              v-else
              type="info"
              variant="tonal"
              class="mt-4"
            >
              Aucun projet pour ce mois
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import auth from '~/middleware/auth';
import { UseDashboardStore } from '~/stores/Dashboard';
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'auth',
  meta: {
    requiresAuth: true
  }
})

const authStore = useAuthStore()

// Déterminer le layout en fonction du rôle
const currentLayout = computed(() => {
  const userRole = authStore.user?.role?.toLowerCase()
  
  if (userRole === 'chefprojet') return 'projet'
  if (userRole === 'developpeur') return 'developper'
  
  return 'auth'
})
// Appliquer le layout dynamiquement
watch(currentLayout, (newLayout) => {
  setPageLayout(newLayout)
}, { immediate: true })
const dashboardStore = UseDashboardStore();

// États
const weekData = ref(null);
const monthData = ref(null);
const loadingWeek = ref(false);
const loadingMonth = ref(false);
const userId = ref(null);
const userName = ref('');

// Dates
const currentWeekStart = ref(new Date());
const currentWeekEnd = ref(new Date());
const currentMonth = ref(new Date());

// Fonctions  pour les dates
function getWeekDates(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  
  const monday = new Date(d.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  return { start: monday, end: sunday };
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


function getProjectName(projet) {
 
  if (typeof projet === 'string') return projet;
 
  return projet.projet || projet.nomProjet || 'Projet sans nom';
}

function getProjectHours(projet) {
  
  if (typeof projet === 'string') return '';
  return projet.heures || projet.totalHeure || 0;
}

function calculatePercentage(hours) {
  if (!monthData.value?.totalHeures) return 0;
  return Math.round((hours / monthData.value.totalHeures) * 100);
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
  if (!userId.value) return;
  console.log("Je suis appeler");
  loadingWeek.value = true;
  const { start, end } = getWeekDates(date);
  currentWeekStart.value = start;
  currentWeekEnd.value = end;
  
  try {
    const response = await dashboardStore.GetDataHoursByWeekUser(
      userId.value,
      formatDate(start),
      formatDate(end)
    );
    console.log("IO NY RESPONSE", response);
    weekData.value = response || null;
    console.log('Week data:', weekData.value);
  } catch (error) {
    console.error('Erreur chargement semaine:', error);
    weekData.value = null;
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
  if (!userId.value) return;
  
  loadingMonth.value = true;
  currentMonth.value = date;
  
  try {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    const response = await dashboardStore.GetDataHoursByMothAndUser(
      userId.value,
      year,
      month
    );
    console.log("io kwh", response);
    
    monthData.value = response && response.length > 0 ? response[0] : null;
    console.log('Month data:', monthData.value);
  } catch (error) {
    console.error('Erreur chargement mois:', error);
    monthData.value = null;
  } finally {
    loadingMonth.value = false;
  }
}

// Initialisation
onMounted(async () => {
  const userData = localStorage.getItem("user");
  console.log(typeof userData);
  if (!userData) {
    console.log("Aucun utilisateur trouvé");
    return;
  }

  const user = JSON.parse(userData);
  userId.value = user.id;
  userName.value = `${user.prenom} ${user.nom}`;
  console.log("ID UTILISATEUR =", user.id);
  
  // Charger les données de la semaine et du mois actuels
  await Promise.all([
    loadWeekData(new Date()),
    loadMonthData(new Date())
  ]);
});
</script>

<style scoped>
.gradient-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.v-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

.v-list-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
  transition: all 0.2s;
}

.v-list-item:hover {
  background: #f0f0f0;
  border-color: #1976d2;
}

.v-expansion-panel {
  margin-bottom: 8px;
}
</style>