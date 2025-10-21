<template>
  <div>
    <v-card class="mx-auto" max-width="500" elevation="3">
      <v-card-title class="text-h5 font-weight-bold bg-primary text-white py-4">
        <v-icon start>mdi-trophy</v-icon>
        Top Développeurs
      </v-card-title>

      <v-list class="py-0 bg-transparent">
        <v-list-item
          v-for="(dev, index) in topDevelopers"
          :key="index"
          class="px-4 py-3"
          :class="{'bg-grey-lighten-5': index % 2 === 0}"
        >
          <template v-slot:prepend>
            <v-avatar 
              :color="getColorByRank(index)" 
              size="40"
              class="elevation-2"
            >
              <span class="text-white font-weight-bold text-h6">
                {{ index + 1 }}
              </span>
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-medium text-body-1">
            {{ dev.name }}
          </v-list-item-title>

          <v-list-item-subtitle class="d-flex align-center mt-1">
            <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
            <span class="font-weight-medium">{{ dev.hours }}h</span>
          </v-list-item-subtitle>

          <template v-slot:append>
            <v-chip 
              :color="getColorByRank(index)" 
              size="small"
              variant="flat"
            >
              {{ dev.hours }}h
            </v-chip>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-card-actions class="px-4 py-3 bg-grey-lighten-4">
        <v-icon size="small" color="info">mdi-information</v-icon>
        <span class="text-caption ml-2">
          Classement basé sur les heures travaillées
        </span>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const topDevelopers = ref([
  { name: "Andriamampindry Kelly", hours: 20 },
  { name: "Andrianalisoa Josephin", hours: 40 },
  { name: "Razafindartafa Stephano", hours: 50 },
  { name: "Vahinisoa Juvance", hours: 60 },
  { name: "Vahinisoa Jenny", hours: 100 },
])

const getColorByRank = (index) => {
  const colors = {
    0: 'amber-darken-2',  // Or
    1: 'blue-grey',       // Argent
    2: 'deep-orange',     // Bronze
    3: 'blue',
    4: 'teal',
  }
  return colors[index] || 'grey'
}
</script>

<style scoped>
.v-list-item {
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04) !important;
  transform: translateX(4px);
}

.v-avatar {
  font-family: 'Roboto', sans-serif;
}
</style>