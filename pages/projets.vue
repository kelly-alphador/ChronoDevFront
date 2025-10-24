<template>
  <v-container>
    <v-row>
      <v-col cols="4" v-for="project in projects" :key="project.id">
        <v-card class="mx-auto" max-width="400">
          <v-layout>
            <v-app-bar color="primary">
              <v-btn icon @click="toggleDrawer(project.id)">
                <v-icon>{{ project.open ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>

              <v-toolbar-title class="flex-grow-1">
                {{ project.name }}
            </v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn 
                icon="mdi-delete" 
                @click="deleteProject(project.id)"
              ></v-btn>
            </v-app-bar>

            <v-main>
              <v-expand-transition>
                <v-container v-show="project.open">
                  <v-row dense>
                    <v-col cols="12" v-for="task in project.tasks" :key="task.id">
                      <v-card color="white" elevation="1" class="task-card">
                        <v-card-title class="text-subtitle-2 py-2">
                          {{ task.name }}
                        </v-card-title>

                        <v-card-subtitle class="py-1">
                          Durée estimée: {{ task.dureeEstime }}h
                        </v-card-subtitle>
                        <v-card-actions class="py-1">
                          <v-spacer></v-spacer>
                          <v-btn 
                            icon="mdi-delete" 
                            size="small"
                            color="error"
                            variant="text"
                            @click="deleteTask(project.id, task.id)"
                          ></v-btn>
                        </v-card-actions>
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
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue'

const projects = ref([
  {
    id: 1,
    name: 'Projet Web',
    open: false,
    tasks: [
      { id: 1, name: 'Conception UI', dureeEstime: 8 },
      { id: 2, name: 'Développement Frontend', dureeEstime: 16 },
      { id: 3, name: 'Intégration API', dureeEstime: 12 }
    ]
  },
  {
    id: 2,
    name: 'Application Mobile',
    open: false,
    tasks: [
      { id: 1, name: 'Design mockups', dureeEstime: 10 },
      { id: 2, name: 'Développement iOS', dureeEstime: 20 },
      { id: 3, name: 'Tests utilisateurs', dureeEstime: 6 }
    ]
  },
  {
    id: 3,
    name: 'Migration Base de données',
    open: false,
    tasks: [
      { id: 1, name: 'Analyse des données', dureeEstime: 5 },
      { id: 2, name: 'Script de migration', dureeEstime: 15 },
      { id: 3, name: 'Validation', dureeEstime: 8 }
    ]
  }
])


const drawers = ref(false)

const toggleDrawer = (projectId) => {
  const project = projects.value.find(p => p.id === projectId)
  if (project) {
    project.open = !project.open
  }
}
const deleteProject = (projectId) => {
  const index = projects.value.findIndex(p => p.id === projectId)
  if (index !== -1) {
    projects.value.splice(index, 1)
  }
}

const deleteTask = (projectId, taskId) => {
  const project = projects.value.find(p => p.id === projectId)
  if (project) {
    const taskIndex = project.tasks.findIndex(t => t.id === taskId)
    if (taskIndex !== -1) {
      project.tasks.splice(taskIndex, 1)
    }
  }
}
</script>

<style scoped>
.v-card-subtitle {
  opacity: 0.9;
}

.task-card {
  border-left: 3px solid rgb(var(--v-theme-primary));
  
}

.task-card .v-card-title {
  font-weight: 500;
}
</style>