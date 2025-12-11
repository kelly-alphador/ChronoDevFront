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

    <!-- Modal de formulaire avec style ModalBox -->
    <ModalBox title="Ajouter un événement" v-if="showModal" @close="closeModal">
      <form class="form-projet" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="dateSaisie">Date de saisie</label>
          <input 
            v-model="formData.dateSaisie" 
            type="date" 
            id="dateSaisie"
            readonly
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="heure_deb">Heure début *</label>
            <input 
              v-model="formData.heure_deb" 
              type="time" 
              id="heure_deb"
              required
            />
          </div>

          <div class="form-group">
            <label for="heure_fin">Heure fin *</label>
            <input 
              v-model="formData.heure_fin" 
              type="time" 
              id="heure_fin"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="projetId">Projet *</label>
          <select 
            v-model="formData.projetId" 
            id="projetId"
            @change="loadTachesByProjet"
            required
          >
            <option value="">-- Sélectionner un projet --</option>
            <option v-for="projet in projects" :key="projet.id" :value="projet.id">
              {{ projet.nom }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="tacheId">Tâche *</label>
          <select 
            v-model="formData.tacheId" 
            id="tacheId"
            required
            :disabled="!formData.projetId || taches.length === 0"
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
          <label for="commentaire">Commentaire</label>
          <textarea 
            v-model="formData.commentaire" 
            id="commentaire"
            rows="3"
            placeholder="Ajouter un commentaire..."
          ></textarea>
        </div>

        <div class="form-group">
          <label for="statut">Statut *</label>
          <select v-model="formData.statut" id="statut" required>
            <option value="">-- Sélectionner un statut --</option>
            <option value="En attente">En attente</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
            <option value="Annulé">Annulé</option>
          </select>
        </div>

        <div class="form-group">
          <label for="utilisateurId">Utilisateur ID *</label>
          <input 
            v-model.number="formData.utilisateurId" 
            type="number" 
            id="utilisateurId"
            required
            placeholder="ID de l'utilisateur"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">Ajouter</button>
          <button type="button" class="btn-secondary" @click="closeModal">Annuler</button>
        </div>
      </form>
    </ModalBox>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VueCal from 'vue-cal'
import { UseCalendarStore } from '~/stores/calendar'
import { useAuthStore } from '~/stores/auth'
import { useAlert } from "@/composables/useAlert"
import ModalBox from '~/components/ModalBox.vue'

const { success, error, confirm, toast } = useAlert()

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

// Fonction de suppression avec Sweet Alert
const deleteEvent = async (event: any) => {
  const result = await confirm("Êtes-vous sûr de vouloir supprimer cette saisie de temps ?")
  console.log("les evenement sont",event)
  
  if (result.isConfirmed) {
    try {
      const response = await CalendarStore.deleteSaisieTemps(event.id)
      
      if (response.success) {
        events.value = events.value.filter((e: any) => e.id !== event.id)
        toast("Saisie de temps supprimée avec succès !", "success")
      } else {
        error(response.error || "Échec de la suppression")
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      error("Une erreur est survenue lors de la suppression")
    }
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
    
    events.value = saisies.map((saisie: any) => ({
      id: saisie.id,
      start: `${saisie.dateSaisie.split('T')[0]} ${saisie.heureDebut.substring(0, 5)}`,
      end: `${saisie.dateSaisie.split('T')[0]} ${saisie.heureFin.substring(0, 5)}`,
      title: saisie.tacheNom,
      content: saisie.commentaire,
      class: 'leisure'
    }))
  } catch (err) {
    console.error('Erreur lors du chargement des saisies temps:', err)
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
  } catch (err) {
    console.error('Erreur lors du chargement des tâches:', err)
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

// Soumettre le formulaire avec Sweet Alert
const handleSubmit = async () => {
  if (formData.value.heure_fin <= formData.value.heure_deb) {
    error('L\'heure de fin doit être après l\'heure de début')
    return
  }
  
  try {
    const formDataToSend = {
      ...formData.value,
      heure_deb: formData.value.heure_deb + ":00",
      heure_fin: formData.value.heure_fin + ":00"
    }

    const response = await CalendarStore.createSaisieTemps(formDataToSend)
    
    if (response.success) {
      const tacheSelectionnee = taches.value.find(t => t.id === Number(formData.value.tacheId))
      events.value.push({
        id: response.id,
        start: `${formData.value.dateSaisie} ${formData.value.heure_deb}`,
        end: `${formData.value.dateSaisie} ${formData.value.heure_fin}`,
        title: tacheSelectionnee?.nom || 'Nouvelle tâche',
        content: formData.value.commentaire,
        class: 'leisure'
      })

      closeModal()
      await loadSaisiesTemps()
      toast("Saisie de temps ajoutée avec succès !", "success")
    } else {
      error(response.error || "Erreur lors de l'ajout de la saisie")
    }
  } catch (err) {
    console.error('Erreur lors de l\'ajout:', err)
    error("Une erreur inattendue est survenue")
  }
}

// Fermer le modal
const closeModal = () => {
  showModal.value = false
}

// Fonction Soumettre
const onSubmit = () => {
  console.log('Événements actuels à soumettre:', events.value)
  success('Événements soumis avec succès !')
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
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background-color: #369870;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 184, 131, 0.3);
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.delete-btn:hover {
  background-color: #e74c3c;
  color: white;
  transform: scale(1.2) rotate(90deg);
  box-shadow: 0 4px 8px rgba(231, 76, 60, 0.4);
}

.vuecal__event.leisure {
  background-color: rgba(253, 156, 66, 0.9);
  border: 1px solid rgb(233, 136, 46);
  color: #fff;
}

/* Styles du formulaire - comme ModalBox de projet.vue */
.form-projet {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
  margin: 0;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: #fff;
  color: #2c3e50;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.form-group input:disabled,
.form-group select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.form-group input[readonly] {
  background-color: #f9f9f9;
  cursor: default;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-hint {
  font-size: 12px;
  color: #999;
  font-style: italic;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 10px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.btn-primary,
.btn-secondary {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(25, 118, 210, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
  box-shadow: 0 6px 12px rgba(25, 118, 210, 0.4);
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #2c3e50;
}

.btn-secondary:hover {
  background-color: #bdbdbd;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

/* Scrollbar personnalisée (style bleu) */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  border-radius: 10px;
  transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
  box-shadow: 0 0 10px rgba(25, 118, 210, 0.5);
}

/* Pour Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #1976d2 #f1f1f1;
}
</style>