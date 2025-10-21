<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Chart, BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

// 1 Enregistrement des composants nécessaires de Chart.js
Chart.register(BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend)

// 2️ Référence au canvas (le DOM)
const chartCanvas = ref(null)

// 3️ Données statiques
const labels = ['Fafa', 'Stéphano', 'Sylver']
const data = [20, 50, 40]

// 4️ Création du graphique après le montage du composant
onMounted(() => {
  new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Heures travaillées (semaine actuelle)',
          data,
          backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true },
      },
    },
  })
})
</script>

<style scoped>
canvas {
  max-width: 600px;
  margin: auto;
}
</style>
