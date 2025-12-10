<template>
  <v-container fluid class="pa-6">
    <v-card elevation="3" class="rounded-lg">
      <!-- En-tête de la carte -->
      <v-card-title class="bg-primary pa-6">
        <div class="d-flex align-center justify-space-between w-100">
          <div>
            <h2 class="text-h4 font-weight-bold text-white mb-2">
              <v-icon icon="mdi-account-group" class="mr-3" color="white"></v-icon>
              Liste des Utilisateurs
            </h2>
            <p class="text-subtitle-1 text-grey-lighten-3 mb-0">
              Gestion complète des profils utilisateurs
            </p>
          </div>
          <v-chip color="white" variant="flat" size="large">
            <v-icon icon="mdi-account-multiple" class="mr-2"></v-icon>
            {{ totalItems }} utilisateurs
          </v-chip>
        </div>
      </v-card-title>

      <!-- Barre de recherche et filtres -->
      <v-card-text class="pa-6">
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Rechercher un utilisateur"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
              color="primary"
            ></v-text-field>
          </v-col>
         
        </v-row>

        <!-- DataTable -->
        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="serverItems"
          :items-length="totalItems"
          :loading="loading"
          :search="search"
          item-value="id"
          @update:options="loadItems"
          class="elevation-1 rounded-lg custom-table"
          hover
        >
          <!-- Slot pour personnaliser les en-têtes -->
          <template v-slot:headers="{ columns }">
            <tr>
              <template v-for="column in columns" :key="column.key">
                <th class="table-header">
                  <span class="font-weight-bold text-uppercase">
                    {{ column.title }}
                  </span>
                </th>
              </template>
            </tr>
          </template>

          <!-- Slot pour l'ID avec badge -->
          <template v-slot:item.id="{ item }">
            <v-chip
              color="primary"
              variant="flat"
              size="small"
              class="font-weight-bold"
            >
              #{{ item.id }}
            </v-chip>
          </template>

          <!-- Slot pour le nom avec avatar -->
          <template v-slot:item.nom="{ item }">
            <div class="d-flex align-center py-2">
              <v-avatar
                color="primary"
                size="40"
                class="mr-3"
              >
                <span class="text-h6 text-white">
                  {{ item.nom.charAt(0) }}
                </span>
              </v-avatar>
              <span class="font-weight-medium">{{ item.nom }}</span>
            </div>
          </template>

          <!-- Slot pour le prénom -->
          <template v-slot:item.prenom="{ item }">
            <span class="text-body-1">{{ item.prenom }}</span>
          </template>

          <!-- Slot pour l'email avec icône -->
          <template v-slot:item.Email="{ item }">
            <div class="d-flex align-center">
              <v-icon icon="mdi-email" size="small" class="mr-2" color="grey"></v-icon>
              <span class="text-body-2">{{ item.Email }}</span>
            </div>
          </template>

          <!-- Slot pour les actions -->
          <template v-slot:item.actions="{ item }">
            <div class="d-flex gap-2">
              <v-btn
                icon="mdi-eye"
                size="small"
                variant="text"
                color="info"
                @click="viewItem(item)"
              ></v-btn>
              <v-btn
                icon="mdi-pencil"
                size="small"
                variant="text"
                color="warning"
                @click="editItem(item)"
              ></v-btn>
              <v-btn
                icon="mdi-delete"
                size="small"
                variant="text"
                color="error"
                @click="deleteItem(item)"
              ></v-btn>
            </div>
          </template>

          <!-- Slot pour le chargement -->
          <template v-slot:loading>
            <v-skeleton-loader type="table-row@8"></v-skeleton-loader>
          </template>

          <!-- Slot pour aucun résultat -->
          <template v-slot:no-data>
            <div class="text-center pa-8">
              <v-icon icon="mdi-database-off" size="64" color="grey"></v-icon>
              <p class="text-h6 text-grey mt-4">Aucune donnée disponible</p>
            </div>
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
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
  console.log("MON ROLE EST",userRole)
  if (userRole === 'chefprojet') return 'projet'
  if (userRole === 'manager') return 'admin'
  
  return 'auth'
})
// Appliquer le layout dynamiquement
watch(currentLayout, (newLayout) => {
  setPageLayout(newLayout)
}, { immediate: true })

const cars = [
  {
    id: '1',
    nom: "ANDRIAMMPINDRY",
    prenom: 'Gasoline',
    Email: 'USA@gmail.com',
  },
  {
    id: '2',
    nom: "ANDRIAMMPINDRY",
    prenom: 'Electric',
    Email: 'USA@gmail.com',
  },
  {
    id: '3',
    nom: "ANDRIAMMPINDRY",
    prenom: 'Gasoline',
    Email: 'USA@gmail.com',
  },
  {
    id: '4',
    nom: "ANDRIAMMPINDRY",
    prenom: 'Gasoline',
    Email: 'USA@gmail.com',
  },
  {
    id: '5',
    nom: "ANDRIAMMPINDRY",
    prenom: 'Gasoline',
    Email: 'USA@gmail.com',
  },
  {
    id: '6',
    nom: "ANDRIAMMPINDRY",
    prenom: 'Gasoline',
    Email: 'USA@gmail.com',
  },
  {
    id: '7',
    nom: "ANDRIAMMPINDRY",
    prenom: 'Gasoline',
    Email: 'USA@gmail.com',
  },
  {
    id: '8',
    nom: "ANDRIAMMPINDRY",
    prenom: 'Gasoline',
    Email: 'USA@gmail.com',
  },
  {
    id: '9',
    nom: "ANDRIAMMPINDRY",
    prenom: 'Gasoline',
    Email: 'USA@gmail.com',
  },
  {
    id: '10',
    nom: "ANDRIAMMPINDRY",
    prenom: 'Gasoline',
    Email: 'USA@gmail.com',
  },
]

const FakeAPI = {
  async fetch({ page, itemsPerPage, sortBy }) {
    return new Promise(resolve => {
      setTimeout(() => {
        const start = (page - 1) * itemsPerPage
        const end = start + itemsPerPage
        const items = cars.slice()
        if (sortBy.length) {
          const sortKey = sortBy[0].key
          const sortOrder = sortBy[0].order
          items.sort((a, b) => {
            const aValue = a[sortKey]
            const bValue = b[sortKey]
            return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
          })
        }
        const paginated = items.slice(start, end)
        resolve({ items: paginated, total: items.length })
      }, 500)
    })
  },
}

const search = ref('')
const itemsPerPage = ref(3)
const headers = ref([
  { title: 'Id', key: 'id', align: 'start', sortable: true },
  { title: 'Nom', key: 'nom', align: 'start', sortable: true },
  { title: 'Prénom', key: 'prenom', align: 'start', sortable: true },
  { title: 'Email', key: 'Email', align: 'start', sortable: true },
  { title: 'Actions', key: 'actions', align: 'center', sortable: false },
])
const serverItems = ref([])
const loading = ref(true)
const totalItems = ref(0)

function loadItems({ page, itemsPerPage, sortBy }) {
  loading.value = true
  FakeAPI.fetch({ page, itemsPerPage, sortBy }).then(({ items, total }) => {
    serverItems.value = items
    totalItems.value = total
    loading.value = false
  })
}

function viewItem(item) {
  console.log('Voir:', item)
}

function editItem(item) {
  console.log('Éditer:', item)
}

function deleteItem(item) {
  console.log('Supprimer:', item)
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.custom-table :deep(.v-table__wrapper) {
  border-radius: 8px;
}

.custom-table :deep(tbody tr:hover) {
  background-color: rgba(103, 126, 234, 0.05) !important;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.table-header {
  background-color: #f5f7fa !important;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
  padding: 16px !important;
}

.custom-table :deep(.v-data-table-footer) {
  background-color: #fafbfc;
  border-top: 1px solid #e0e0e0;
  padding: 12px 16px;
}

.gap-2 {
  gap: 8px;
}
</style>