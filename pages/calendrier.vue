<template>
  <div class="vuecal-container">
    <!-- Conteneur du header avec boutons -->
    <div class="calendar-header">
    
      <button class="submit-btn" @click="onSubmit">Soumettre</button>
    </div>

    <ClientOnly>
      <VueCal
        ref="vuecal"
        :events="events"
        :time-from="8 * 60"
        :time-to="18 * 60"
        :disable-views="['years', 'year']"
        default-view="week"
        locale="fr"
        :editable-events="{ title: false, drag: true, resize: true, delete: false, create: false }"
        :snap-to-time="15"
        @event-drop="onEventDrop"
        @event-duration-change="onEventResize"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueCal from 'vue-cal'

const events = ref([
  { start: '2025-11-10 10:00', end: '2025-11-10 12:00', title: 'Dr. John', content: 'Consultation', class: 'leisure' },
  { start: '2025-11-11 14:00', end: '2025-11-11 16:00', title: 'Dr. Kate', content: 'Réunion', class: 'health' },
  { start: '2025-11-12 09:00', end: '2025-11-12 11:00', title: 'Dr. John', content: 'Formation', class: 'sport' }
])

const vuecal = ref<any>(null)

// Gestion du déplacement d'événement
const onEventDrop = (event: any, originalEvent: any) => {
  console.log('Événement déplacé:', { titre: event.title, ancienDebut: originalEvent.start, nouveauDebut: event.start })
}

// Gestion du redimensionnement d'événement
const onEventResize = (event: any, originalEvent: any) => {
  console.log('Durée modifiée:', { titre: event.title, ancienneDurée: `${originalEvent.start} - ${originalEvent.end}`, nouvelleDurée: `${event.start} - ${event.end}` })
}

// Fonction Soumettre
const onSubmit = () => {
  console.log('Événements actuels à soumettre:', events.value)
}


</script>

<style>
@import 'vue-cal/dist/vuecal.css';

.vuecal-container {
  height: 100vh;
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.calendar-header {
    display: flex;
  justify-content: flex-end; 
  align-items: center;     
  margin-bottom: 10px;
}


.submit-btn {
  padding: 5px 15px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  float: right;
}

.submit-btn:hover {
  background-color: #369870;
}

.vuecal__event.leisure {
  background-color: rgba(253, 156, 66, 0.9);
  border: 1px solid rgb(233, 136, 46);
  color: #fff;
}

.vuecal__event.health {
  background-color: rgba(66, 185, 131, 0.9);
  border: 1px solid rgb(46, 165, 111);
  color: #fff;
}

.vuecal__event.sport {
  background-color: rgba(66, 129, 235, 0.9);
  border: 1px solid rgb(46, 109, 215);
  color: #fff;
}
</style>
