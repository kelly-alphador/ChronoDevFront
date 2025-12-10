<template>
  <div class="vuecal-container">
    <!-- Header avec bouton soumettre -->
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
        :snap-to-time="15"
        @cell-click="onCellClick"
      >
        <!-- SLOT POUR PERSONNALISER L'ÉVÉNEMENT -->
        <template #event="{ event }">
          <div
            class="event-item"
            @mouseenter="hoveredEventId = event.id"
            @mouseleave="hoveredEventId = null"
          >
            <div class="event-content-wrapper">
              <div class="event-header">
                <strong class="event-title">{{ event.title }}</strong>
                <span class="event-time">
                  {{ formatTime(event.start) }} - {{ formatTime(event.end) }}
                </span>
              </div>
              <div v-if="event.content" class="event-description">
                {{ event.content }}
              </div>
            </div>
            
            <!-- Bouton X au survol -->
            <button
              v-if="hoveredEventId === event.id"
              class="delete-btn"
              @click.stop="deleteEvent(event)"
              title="Supprimer"
            >
              ×
            </button>
          </div>
        </template>
      </VueCal>
    </ClientOnly>

    <!-- Modal de formulaire -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Ajouter un événement</h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>

        <form @submit.prevent="handleSubmit" class="event-form">
          <div class="form-group">
            <label>Date de saisie</label>
            <input 
              v-model="formData.dateSaisie" 
              type="date" 
              readonly
              class="form-input"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Heure début *</label>
              <input 
                v-model="formData.heure_deb" 
                type="time" 
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>Heure fin *</label>
              <input 
                v-model="formData.heure_fin" 
                type="time" 
                required
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Projet *</label>
            <select 
              v-model="formData.projetId" 
              @change="loadTachesByProjet"
              required
              class="form-input"
            >
              <option value="">-- Sélectionner un projet --</option>
              <option v-for="projet in projects" :key="projet.id" :value="projet.id">
                {{ projet.nom }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Tâche *</label>
            <select 
              v-model="formData.tacheId" 
              required
              :disabled="!formData.projetId || taches.length === 0"
              class="form-input"
            >
              <option value="">-- Sélectionner une tâche --</option>
              <option v-for="tache in taches" :key="tache.id" :value="tache.id">
                {{ tache.nom }}
              </option>
            </select>
            <small v-if="formData.projetId && taches.length === 0" class="form-hint">
              Aucune tâche disponible pour ce projet
            </small>
          </div>

          <div class="form-group">
            <label>Commentaire</label>
            <textarea 
              v-model="formData.commentaire" 
              rows="3"
              class="form-input"
              placeholder="Ajouter un commentaire..."
            ></textarea>
          </div>

          <div class="form-group">
            <label>Statut *</label>
            <select v-model="formData.statut" required class="form-input">
              <option value="">-- Sélectionner un statut --</option>
              <option value="En attente">En attente</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
              <option value="Annulé">Annulé</option>
            </select>
          </div>

          <div class="form-group">
            <label>Utilisateur ID *</label>
            <input 
              v-model.number="formData.utilisateurId" 
              type="number" 
              required
              class="form-input"
              placeholder="ID de l'utilisateur"
            />
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-cancel">
              Annuler
            </button>
            <button type="submit" class="btn-submit">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VueCal from 'vue-cal'
import { UseCalendarStore } from '~/stores/calendar'
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

const CalendarStore = UseCalendarStore()
const UserId = ref(0)
const projects = ref<Projet[]>([])
const username = ref('')
const hoveredEventId = ref<number | null>(null)

// Types
interface Projet {
  id: number
  nom: string
}

interface Tache {
  id: number
  nom: string
  projetId: number
}

interface CalendarEvent {
  id?: number
  start: string
  end: string
  title: string
  content?: string
  class?: string
}

// États
const events = ref<CalendarEvent[]>([])
const vuecal = ref<any>(null)
const showModal = ref(false)

// Données du formulaire
const formData = ref({
  dateSaisie: '',
  heure_deb: '',
  heure_fin: '',
  commentaire: '',
  statut: '',
  tacheId: '' as number | string,
  projetId: '' as number | string,
  utilisateurId: '' as number | string
})

const taches = ref<Tache[]>([])

// Fonction pour formater l'heure (HH:MM)
const formatTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

// Fonction de suppression
const deleteEvent = async (event: any) => {

  try {
    // Appel API pour supprimer
    const response = await CalendarStore.deleteSaisieTemps(event.id)
    
    // Vérifier le succès de la suppression
    if (response.success) {
      // Retirer l'événement de la liste
      events.value = events.value.filter((e: any) => e.id !== event.id)
      console.log(response.message)
    } else {
      throw new Error('Échec de la suppression')
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

// Récupérer le nom d'utilisateur depuis localStorage
const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user")
  if (user) {
    const userJson = JSON.parse(user)
    username.value = userJson.nom || ''
    UserId.value = userJson.id
  }
}

// Récupérer les saisies temps depuis le backend
const loadSaisiesTemps = async () => {
  if (!username.value) return
  
  try {
    const saisies = await CalendarStore.GetSaisiesTemps(username.value)
    
    // Transformer les données backend en événements calendrier
    events.value = saisies.map((saisie: any) => ({
      id: saisie.id, // IMPORTANT: ajouter l'ID
      start: `${saisie.dateSaisie.split('T')[0]} ${saisie.heureDebut.substring(0, 5)}`,
      end: `${saisie.dateSaisie.split('T')[0]} ${saisie.heureFin.substring(0, 5)}`,
      title: saisie.tacheNom,
      content: saisie.commentaire,
      class: 'leisure'
    }))
  } catch (error) {
    console.error('Erreur lors du chargement des saisies temps:', error)
  }
}

// Méthode récupérer les projets
const GetProject = async () => {
  const reponse = await CalendarStore.GetProject()
  projects.value = reponse
}

onMounted(async () => {
  await GetProject()
  await getUserFromLocalStorage()
  await loadSaisiesTemps()
})

// Charger les tâches en fonction du projet sélectionné
const loadTachesByProjet = async () => {
  const projetId = formData.value.projetId
  
  if (!projetId) {
    taches.value = []
    formData.value.tacheId = ''
    return
  }

  try {
    const response = await CalendarStore.GetTachesByProjectId(Number(projetId))
    taches.value = response
    formData.value.tacheId = ''
    console.log('Tâches du projet', projetId, ':', taches.value)
  } catch (error) {
    console.error('Erreur lors du chargement des tâches:', error)
    taches.value = []
  }
}

// Gestion du clic sur une cellule du calendrier
const onCellClick = (date: Date, event: any) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  const endDate = new Date(date)
  endDate.setHours(endDate.getHours() + 1)
  const endHours = String(endDate.getHours()).padStart(2, '0')
  const endMinutes = String(endDate.getMinutes()).padStart(2, '0')
  
  const user = localStorage.getItem("user")
  if (user) {
    const UserJson = JSON.parse(user)
    UserId.value = UserJson.id
  }
  
  formData.value = {
    dateSaisie: `${year}-${month}-${day}`,
    heure_deb: `${hours}:${minutes}`,
    heure_fin: `${endHours}:${endMinutes}`,
    commentaire: '',
    statut: '',
    tacheId: '',
    projetId: '',
    utilisateurId: UserId.value
  }

  taches.value = []
  showModal.value = true
}

// Soumettre le formulaire
const handleSubmit = async () => {
  if (formData.value.heure_fin <= formData.value.heure_deb) {
    alert('L\'heure de fin doit être après l\'heure de début')
    return
  }
  
  const formDataToSend = {
    ...formData.value,
    heure_deb: formData.value.heure_deb + ":00",
    heure_fin: formData.value.heure_fin + ":00"
  }

  const response = await CalendarStore.createSaisieTemps(formDataToSend)
  
  const tacheSelectionnee = taches.value.find(t => t.id === Number(formData.value.tacheId))
  events.value.push({
    id: response.id, // ID retourné par le backend
    start: `${formData.value.dateSaisie} ${formData.value.heure_deb}`,
    end: `${formData.value.dateSaisie} ${formData.value.heure_fin}`,
    title: tacheSelectionnee?.nom || 'Nouvelle tâche',
    content: formData.value.commentaire,
    class: 'leisure'
  })

  closeModal()
}

// Fermer le modal
const closeModal = () => {
  showModal.value = false
}

/* Gestion du déplacement d'événement
const onEventDrop = (event: any, originalEvent: any) => {
  console.log('Événement déplacé:', { 
    titre: event.title, 
    ancienDebut: originalEvent.start, 
    nouveauDebut: event.start 
  })
}

// Gestion du redimensionnement d'événement
const onEventResize = (event: any, originalEvent: any) => {
  console.log('Durée modifiée:', { 
    titre: event.title, 
    ancienneDurée: `${originalEvent.start} - ${originalEvent.end}`, 
    nouvelleDurée: `${event.start} - ${event.end}` 
  })
}
*/
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
  padding: 8px 20px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
}

.submit-btn:hover {
  background-color: #369870;
}

/* Style personnalisé pour les événements */
.event-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 6px 8px;
  height: 100%;
  width: 100%;
  gap: 8px;
}

.event-content-wrapper {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.event-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.event-title {
  font-weight: 600;
  font-size: 0.9em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.event-time {
  font-size: 0.75em;
  opacity: 0.9;
  font-weight: 500;
}

.event-description {
  font-size: 0.8em;
  opacity: 0.85;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.delete-btn {
  position: absolute;
  right: 4px;
  top: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.95);
  color: #e74c3c;
  border: 1px solid #e74c3c;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.delete-btn:hover {
  background-color: #e74c3c;
  color: white;
  transform: scale(1.15);
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

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  line-height: 1;
  padding: 0;
  width: 30px;
  height: 30px;
}

.close-btn:hover {
  color: #333;
}

/* Formulaire */
.event-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #42b883;
}

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-input[readonly] {
  background-color: #f9f9f9;
}

textarea.form-input {
  resize: vertical;
  font-family: inherit;
}

.form-hint {
  display: block;
  margin-top: 4px;
  color: #999;
  font-size: 0.85rem;
  font-style: italic;
}

/* Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.btn-cancel,
.btn-submit {
  padding: 10px 24px;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background-color: #e0e0e0;
}

.btn-submit {
  background-color: #42b883;
  color: white;
}

.btn-submit:hover {
  background-color: #369870;
}

/* Responsive */
@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }
}
</style>