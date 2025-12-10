<template>
  <v-container>
    <v-row class="mb-4">
     
    </v-row>
    <v-row>
      <v-col cols="4" v-for="project in projects" :key="project.id">
        <v-card class="mx-auto" max-width="400">
          <v-layout>
            <v-app-bar color="primary">
              <v-btn icon @click="toggleDrawer(project.id)">
                <v-icon>{{ project.open ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>

              <v-tooltip activator="parent" location="top">
                <template #activator="{ props }">
                  <v-toolbar-title v-bind="props" class="flex-grow-1 project-title">
                    {{ project.nom }}
                  </v-toolbar-title>
                </template>
                <span class="tooltip-text">{{ project.nom }}</span>
              </v-tooltip>

              <v-spacer></v-spacer>
              <v-btn 
                icon="mdi-eye" 
                @click="viewProjectDetails(project)"
              ></v-btn>
            </v-app-bar>

            <v-main>
              <v-expand-transition>
                <v-container v-show="project.open">
                  <v-row dense>
                    <v-col cols="12" v-for="task in project.tasks" :key="task.id" >
                      <v-card color="white" elevation="1" class="task-card">
                        <v-card-title class="text-subtitle-2 py-2">
                          {{ task.nom }}
                        </v-card-title>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-expand-transition>
            </v-main>
          </v-layout>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog pour afficher les détails du projet -->
    <v-dialog v-model="detailsDialog" max-width="700">
      <v-card v-if="selectedProject" class="project-details-card">
        <v-card-title class="bg-primary text-white d-flex align-center pa-4">
          <v-icon class="mr-2" size="large">mdi-folder-open</v-icon>
          <span class="text-h5">{{ selectedProject.nom }}</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="detailsDialog = false" variant="text">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pt-6 pb-4">
          <div class="mb-5">
            <div class="text-h6 mb-3 d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-information</v-icon>
              Informations du projet
            </div>
            <v-divider class="mb-4"></v-divider>
            
            <v-row class="project-info-grid">
              <v-col cols="6">
                <div class="info-item">
                  <div class="info-label">
                    <v-icon size="small" color="grey-darken-1">mdi-account-tie</v-icon>
                    Manager
                  </div>
                  <div class="info-value">{{ selectedProject.manager }}</div>
                </div>
              </v-col>

              <v-col cols="6">
                <div class="info-item">
                  <div class="info-label">
                    <v-icon size="small" color="grey-darken-1">mdi-calendar-plus</v-icon>
                    Date de création
                  </div>
                  <div class="info-value">{{ formatDate(selectedProject.dateCreation) }}</div>
                </div>
              </v-col>

              <v-col cols="6">
                <div class="info-item">
                  <div class="info-label">
                    <v-icon size="small" color="grey-darken-1">mdi-calendar-check</v-icon>
                    Date de fin
                  </div>
                  <div class="info-value">{{ formatDate(selectedProject.dateFin) }}</div>
                </div>
              </v-col>

              <v-col cols="6">
                <div class="info-item">
                  <div class="info-label">
                    <v-icon size="small" color="grey-darken-1">mdi-clock-outline</v-icon>
                    Durée estimée
                  </div>
                  <div class="info-value">{{ selectedProject.dureeEstimee }} heures</div>
                </div>
              </v-col>

              <v-col cols="6">
                <div class="info-item">
                  <div class="info-label">
                    <v-icon size="small" color="grey-darken-1">mdi-calendar-range</v-icon>
                    Nombre de jours
                  </div>
                  <div class="info-value">{{ selectedProject.nombre_jour }} jours</div>
                </div>
              </v-col>
            </v-row>
          </div>

          <div class="mb-5">
            <div class="text-h6 mb-3 d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-chart-box</v-icon>
              Statistiques
            </div>
            <v-divider class="mb-4"></v-divider>
            
            <v-row>
              <v-col cols="6">
                <v-card color="blue-lighten-5" elevation="0" class="stat-card">
                  <v-card-text class="text-center pa-4">
                    <v-icon color="primary" size="40" class="mb-2">mdi-format-list-checks</v-icon>
                    <div class="text-h4 text-primary font-weight-bold">
                      {{ selectedProject.tasks.length }}
                    </div>
                    <div class="text-caption text-grey-darken-1 mt-1">Tâches totales</div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="6">
                <v-card color="orange-lighten-5" elevation="0" class="stat-card">
                  <v-card-text class="text-center pa-4">
                    <v-icon color="orange" size="40" class="mb-2">mdi-calendar-range</v-icon>
                    <div class="text-h4 text-orange font-weight-bold">
                      {{ projectDuration }}
                    </div>
                    <div class="text-caption text-grey-darken-1 mt-1">Jours restants</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <div>
            <div class="text-h6 mb-3 d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-clipboard-list</v-icon>
              Liste des tâches
            </div>
            <v-divider class="mb-4"></v-divider>
            
            <v-list density="compact" class="tasks-list">
              <v-list-item
                v-for="(task, index) in selectedProject.tasks"
                :key="task.id"
                class="task-detail-item mb-2"
                rounded
              >
                <template v-slot:prepend>
                  <v-avatar color="primary" size="36">
                    <span class="text-white font-weight-bold">{{ index + 1 }}</span>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-medium mb-1">
                  {{ task.nom }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>

        <v-card-actions class="px-6 pb-4">
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="elevated" @click="detailsDialog = false">
            <v-icon start>mdi-check</v-icon>
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal pour ajouter un projet -->
    <ModalBox title="Ajout de projet" v-if="IsActif" @close="CloseModal">
      <form class="form-projet" @submit.prevent="submitProjet">
        <div class="form-group">
          <label for="nom">Nom du projet</label>
          <input 
            v-model="form.nom"
            type="text" 
            id="nom" 
            placeholder="Entrez le nom du projet"
            maxlength="100"
          >
        </div>

        <div class="form-group">
          <label for="dateCreation">Date de création</label>
          <input 
            v-model="form.dateCreation"
            type="datetime-local" 
            id="dateCreation"
          >
        </div>

        <div class="form-group">
          <label for="dureeEstimee">Durée estimée (en heures)</label>
          <input 
            v-model.number="form.dureeEstimee"
            type="number" 
            id="dureeEstimee" 
            placeholder="Ex: 120.5"
            step="0.1"
            min="0"
          >
        </div>

        <div class="form-group">
          <label for="dateFin">Date de fin</label>
          <input 
            v-model="form.dateFin"
            type="datetime-local" 
            id="dateFin"
          >
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">Ajouter</button>
          <button type="button" class="btn-secondary" @click="CloseModal">Annuler</button>
        </div>
      </form>
    </ModalBox>

    <!-- Modal pour ajouter une tâche -->
    <ModalBox title="Ajout de tâche" v-if="IsTaskModalActive" @close="closeTaskModal">
      <form class="form-projet" @submit.prevent="submitTask">
        <div class="form-group">
          <label for="taskNom">Nom de la tâche</label>
          <input 
            v-model="taskForm.nom"
            type="text" 
            id="taskNom" 
            placeholder="Entrez le nom de la tâche"
            maxlength="100"
            required
          >
        </div>

        <div class="form-group">
          <label for="taskDureeEstimee">Durée estimée (en heures)</label>
          <input 
            v-model.number="taskForm.dureeEstimee"
            type="number" 
            id="taskDureeEstimee" 
            placeholder="Ex: 8.5"
            step="0.1"
            min="0"
            required
          >
        </div>

        <div class="form-group">
          <label for="taskDateDebut">Date de début</label>
          <input 
            v-model="taskForm.dateDebut"
            type="datetime-local" 
            id="taskDateDebut"
            required
          >
        </div>

        <div class="form-group">
          <label for="taskDateFin">Date de fin</label>
          <input 
            v-model="taskForm.dateFin"
            type="datetime-local" 
            id="taskDateFin"
            required
          >
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">Ajouter</button>
          <button type="button" class="btn-secondary" @click="closeTaskModal">Annuler</button>
        </div>
      </form>
    </ModalBox>

  </v-container>
</template>

<script setup>
import ModalBox from '~/components/ModalBox.vue'
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '~/stores/projet'


definePageMeta({
  middleware: 'auth',
  layout:'developper',
  meta: {
    requiresAuth: true
  }
})


const dashboardStore = UseDashboardStore();

const IsActif = ref(false)
const IsTaskModalActive = ref(false)
const currentProjectForTask = ref(null)
const projects = ref([])
const projectStore = useProjectStore()

onMounted(async () => {
  loadProject()
})

const detailsDialog = ref(false)
const selectedProject = ref(null)

const form = ref({
  nom: "",
  dateCreation: "",
  dureeEstimee: 0,
  dateFin: "",
})

const taskForm = ref({
  nom: "",
  dureeEstimee: 0,
  dateDebut: "",
  dateFin: "",
})
const totalTasksDuration = computed(() => {
  if (!selectedProject.value) return 0
  return selectedProject.value.tasks.reduce((sum, task) => sum + task.dureeEstime, 0)
})

const CloseModal = () => {
  IsActif.value = !IsActif.value
}

const projectDuration = computed(() => {
  if (!selectedProject.value) return 0
  const today = new Date()
  const endDate = new Date(selectedProject.value.dateFin)
  const diffTime = endDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('fr-FR', options)
}

const toggleDrawer = (projectId) => {
  const project = projects.value.find(p => p.id === projectId)
  if (project) {
    project.open = !project.open
  }
}

const viewProjectDetails = async (project) => {
  const response = await projectStore.GetProjectById(project.id)
  if (response.success && response.data) {
    selectedProject.value = {
      ...response.data[0],
      id: project.id,
      tasks: project.tasks,
      open: project.open
    }
    detailsDialog.value = true
  } else {
    console.error('Erreur lors de la récupération des détails du projet:', response.error)
  }
}


const loadProject = async () => {
  const response = await projectStore.GetIdName()
  if (response.success && response.data) {
    projects.value = response.data.map((p) => ({
      ...p,
      open: false,
      tasks: []
    }))
   
    for (const project of projects.value) {
      const taches = await projectStore.TacheGetProjectId(project.id)
      if (taches.success && taches.data) {
        project.tasks = taches.data
      }
    }
  } else {
    console.error(response.error)
  }
}

</script>

<style scoped>
.v-card-subtitle {
  opacity: 0.9;
}

.task-card {
  border-left: 3px solid rgb(var(--v-theme-primary));
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.task-card:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tooltip-text {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  box-shadow: 
    0 4px 12px rgba(25, 118, 210, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.2);
}

.project-title {
  cursor: help;
  transition: all 0.3s ease;
}

.task-card .v-card-title {
  font-weight: 500;
}

.project-details-card {
  border-radius: 12px;
  overflow: hidden;
}

.project-info-grid {
  gap: 12px;
}

.info-item {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.info-item:hover {
  background: #eeeeee;
  transform: translateY(-2px);
}

.info-label {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-value {
  font-size: 1rem;
  color: #212121;
  font-weight: 600;
}

.stat-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.tasks-list {
  background: transparent;
}

.task-detail-item {
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
  padding: 8px 12px;
}

.task-detail-item:hover {
  background-color: rgba(25, 118, 210, 0.05);
  border-color: #1976d2;
  transform: translateX(4px);
}
</style>