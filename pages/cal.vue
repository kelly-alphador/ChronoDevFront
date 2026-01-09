<template>
  <div class="vuecal-container">
    <!-- Header avec sélecteur d'utilisateur -->
    <div class="calendar-header">
      <div class="user-selector">
        <label for="userSelect">Sélectionner un utilisateur :</label>
        <select 
          id="userSelect" 
          v-model="selectedUser" 
          @change="onUserChange"
          class="user-select"
        >
          <option value="">-- Sélectionner un utilisateur --</option>
          <option 
            v-for="user in users" 
            :key="`${user.nom}-${user.prenom}`" 
            :value="user.nom"
          >
            {{ user.prenom }} {{ user.nom }}
          </option>
        </select>
      </div>
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
      >
        <!-- SLOT POUR PERSONNALISER L'ÉVÉNEMENT -->
        <template #event="{ event }">
          <div 
            class="event-item"
            @contextmenu.prevent="openContextMenu($event, event)"
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
              <div v-if="event.statut" class="event-status">
                <span :class="`status-badge status-${event.statut.toLowerCase()}`">
                  {{ getStatusLabel(event.statut) }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </VueCal>
    </ClientOnly>

    <!-- Menu contextuel -->
    <div 
      v-if="contextMenu.visible && isManager" 
      ref="contextMenuRef"
      class="context-menu"
      :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
    >
      <div class="context-menu-item validate" @click="validerSaisie">
        <span class="menu-icon">✓</span>
        <span>Valider</span>
      </div>
      <div class="context-menu-item reject" @click="openRefusalModal">
        <span class="menu-icon">✗</span>
        <span>Refuser</span>
      </div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item info" @click="voirDetails">
        <span class="menu-icon">ℹ</span>
        <span>Voir détails</span>
      </div>
    </div>

    <!-- Modal de commentaire pour refus -->
    <div v-if="showCommentModal" class="modal-overlay" @click="closeCommentModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Motif du refus</h3>
          <button class="modal-close" @click="closeCommentModal">×</button>
        </div>
        <div class="modal-body">
          <label for="refusalComment">Veuillez indiquer le motif du refus :</label>
          <textarea 
            id="refusalComment"
            v-model="refusalComment" 
            rows="4" 
            placeholder="Exemple : Temps de travail non conforme, projet incorrect..."
            class="comment-textarea"
          ></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="closeCommentModal">Annuler</button>
          <button class="btn btn-reject" @click="confirmRefus">Confirmer le refus</button>
        </div>
      </div>
    </div>

    <!-- Message si aucun utilisateur n'est sélectionné -->
    <div v-if="!selectedUser && events.length === 0" class="empty-state">
    
      <p class="empty-text">Sélectionnez un utilisateur pour voir ses saisies de temps</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import VueCal from 'vue-cal'
import { UseCalendarStore } from '~/stores/calendar'
import { useAuthStore } from '~/stores/auth'
import { useValidationStore } from '~/stores/validation'
import { useAlert } from "@/composables/useAlert"

const { success, error, toast ,toastDetails } = useAlert()

definePageMeta({
  middleware: 'auth',
  layout: 'admin',
  meta: {
    requiresAuth: true
  }
})

const authStore = useAuthStore()
const CalendarStore = UseCalendarStore()
const validationStore = useValidationStore()

const username = ref('')

// Liste des utilisateurs et utilisateur sélectionné
const users = ref<UserNom[]>([])
const selectedUser = ref('')

// Types
interface CalendarEvent {
  id?: number
  start: string
  end: string
  title: string
  content?: string
  class?: string
  statut?: 'VALIDEE' | 'REFUSEE' | 'EN_ATTENTE'
}

interface UserNom {
  nom: string
  prenom: string
}

// États
const events = ref<CalendarEvent[]>([])
const vuecal = ref<any>(null)

// Menu contextuel
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  event: null as CalendarEvent | null
})

const contextMenuRef = ref<HTMLElement | null>(null)

// Modal de commentaire
const showCommentModal = ref(false)
const refusalComment = ref('')

// Vérifier si l'utilisateur est manager
const isManager = computed(() => {
  return authStore.user?.role?.toLowerCase() === 'manager'
})

// Obtenir l'ID du manager
const managerId = computed(() => {
  return authStore.user?.id || 0
})

// Fonction pour formater l'heure (HH:MM)
const formatTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

// Obtenir le label du statut
const getStatusLabel = (statut: string) => {
  const labels: Record<string, string> = {
    'VALIDEE': 'Validé',
    'REFUSEE': 'Refusé',
    'EN_ATTENTE': 'En attente'
  }
  return labels[statut] || statut
}

// Récupérer le nom d'utilisateur depuis localStorage
const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user")
  if (user) {
    const userJson = JSON.parse(user)
    username.value = userJson.nom || ''
  }
}

// Charger la liste des utilisateurs
const loadUsers = async () => {
  try {
    const response = await CalendarStore.GetListeUsersNom()
    users.value = response
  } catch (err) {
    console.error('Erreur lors du chargement des utilisateurs:', err)
    error("Impossible de charger la liste des utilisateurs")
  }
}

// Gérer le changement d'utilisateur
const onUserChange = async () => {
  if (selectedUser.value) {
    await loadSaisiesTemps(selectedUser.value)
  } else {
    events.value = []
  }
}
//Methode pour la couleur de evenement si valider green di refuser vert sinon leisure 
const getEventClass = (decision: string | null) => {
  if (decision === 'REFUSEE') return 'danger'
  if (decision === 'VALIDEE') return 'success'
  return 'leisure'
}
// Récupérer les saisies temps
const loadSaisiesTemps = async (userNom?: string) => {
  const nomToUse = userNom || username.value

  if (!nomToUse) {
    console.warn("Aucun nom d'utilisateur fourni")
    return
  }

  try {
    const saisies = await CalendarStore.GetSaisiesTemps(nomToUse)

    if (!saisies || saisies.length === 0) {
      toast("Il n'a pas encore effectué de saisie de temps.", 'info')
      events.value = []
      return
    }

    events.value = saisies.map((saisie: any) => {
      console.log(saisie.decision)
    
      return {
        id: saisie.id,
        start: `${saisie.dateSaisie.split('T')[0]} ${saisie.heureDebut.substring(0, 5)}`,
        end: `${saisie.dateSaisie.split('T')[0]} ${saisie.heureFin.substring(0, 5)}`,
        title: saisie.tacheNom,
        content: saisie.commentaire,
        statut: saisie.status,
        class: getEventClass(saisie.decision)
      }
    })

  } catch (err) {
    console.error('Erreur lors du chargement des saisies temps:', err)
    error("Une erreur est survenue lors du chargement des saisies de temps.")
  }
}

// Ouvrir le menu contextuel
const openContextMenu = (event: MouseEvent, calendarEvent: CalendarEvent) => {
  if (!isManager.value) return
  console.log("TOY AKA STATUT ZAO",calendarEvent.statut)
  // Empêcher l'ouverture si la saisie est déjà validée ou refusée
  if (calendarEvent.statut === 'VALIDEE' || calendarEvent.statut === 'REFUSEE') {
    toast(`Cette saisie a déjà été ${calendarEvent.statut === 'VALIDEE' ? 'validée' : 'refusée'}`, 'info')
    return
  }
  
  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    event: calendarEvent
  }
}

// Fermer le menu contextuel
const closeContextMenu = () => {
  contextMenu.value.visible = false
  contextMenu.value.event = null
}

// Valider une saisie
const validerSaisie = async () => {
  if (!contextMenu.value.event?.id) return

  try {
    const result = await validationStore.validerSaisie(
      contextMenu.value.event.id,
      managerId.value,
      'Validé par le manager'
    )

    if (result.success) {
      success('Saisie validée avec succès')
      
      // Recharger les saisies pour avoir les données à jour
      await loadSaisiesTemps(selectedUser.value)
    } else {
      error(result.message)
    }
  } catch (err) {
    console.error('Erreur lors de la validation:', err)
    error('Erreur lors de la validation')
  } finally {
    closeContextMenu()
  }
}

// Ouvrir la modal de refus
const openRefusalModal = () => {
  showCommentModal.value = true
  // Ne pas fermer le menu contextuel tout de suite pour garder la référence
}

// Confirmer le refus avec commentaire
const confirmRefus = async () => {
  if (!contextMenu.value.event?.id) return

  if (!refusalComment.value.trim()) {
    error('Veuillez indiquer un motif de refus')
    return
  }

  try {
    const result = await validationStore.refuserSaisie(
      contextMenu.value.event.id,
      managerId.value,
      refusalComment.value
    )

    if (result.success) {
      success('Saisie refusée')
      
      // Recharger les saisies pour avoir les données à jour
      await loadSaisiesTemps(selectedUser.value)
    } else {
      error(result.message)
    }
  } catch (err) {
    console.error('Erreur lors du refus:', err)
    error('Erreur lors du refus')
  } finally {
    closeCommentModal()
    closeContextMenu()
  }
}

// Fermer la modal de commentaire
const closeCommentModal = () => {
  showCommentModal.value = false
  refusalComment.value = ''
  closeContextMenu()
}

// Voir les détails
const voirDetails = () => {
  if (contextMenu.value.event) {
    const event = contextMenu.value.event
    const details = `
      Tâche: ${event.title}
      Horaire: ${formatTime(event.start)} - ${formatTime(event.end)}
      Statut: ${getStatusLabel(event.statut || 'EN_ATTENTE')}
      ${event.content ? `Commentaire: ${event.content}` : ''}
    `
    toastDetails(details)
  }
  closeContextMenu()
}

// Fermer le menu contextuel au clic ailleurs
const handleClickOutside = (event: MouseEvent) => {
  if (contextMenu.value.visible && 
      contextMenuRef.value && 
      !contextMenuRef.value.contains(event.target as Node)) {
    closeContextMenu()
  }
}

onMounted(async () => {
  await getUserFromLocalStorage()
  await loadUsers()
  
  const userRole = authStore.user?.role?.toLowerCase()
  if (userRole !== 'manager') {
    await loadSaisiesTemps()
  }

  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style>
@import 'vue-cal/dist/vuecal.css';

.vuecal-container {
  height: 100vh;
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 20px;
}

.user-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.user-selector label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
  white-space: nowrap;
}

.user-select {
  flex: 1;
  max-width: 400px;
  padding: 10px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #fff;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-select:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.user-select:hover {
  border-color: #1976d2;
}

/* Message d'état vide */
.empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 18px;
  color: #666;
  font-weight: 500;
}

/* Style personnalisé pour les événements */
.event-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: 6px 8px;
  height: 100%;
  width: 100%;
  cursor: context-menu;
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

.event-status {
  margin-top: 4px;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7em;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.status-validee {
  background-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.status-badge.status-refusee {
  background-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.status-badge.status-en_attente {
  background-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

/* Couleurs des événements selon leur statut */
.vuecal__event.leisure {
  background-color: rgba(253, 156, 66, 0.9);
  border: 1px solid rgb(233, 136, 46);
  color: #fff;
}

.vuecal__event.validated {
  background-color: rgba(76, 175, 80, 0.9);
  border: 1px solid rgb(56, 142, 60);
  color: #fff;
}

.vuecal__event.rejected {
  background-color: rgba(244, 67, 54, 0.9);
  border: 1px solid rgb(211, 47, 47);
  color: #fff;
}

/* Menu contextuel */
.context-menu {
  position: fixed;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 180px;
  z-index: 10000;
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.context-menu-item {
  padding: 10px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background-color 0.2s ease;
  font-size: 14px;
  color: #2c3e50;
}

.context-menu-item:hover {
  background-color: #f5f5f5;
}

.context-menu-item.validate:hover {
  background-color: #e8f5e9;
  color: #4caf50;
}

.context-menu-item.reject:hover {
  background-color: #ffebee;
  color: #f44336;
}

.context-menu-item.info:hover {
  background-color: #e3f2fd;
  color: #2196f3;
}

.menu-icon {
  font-size: 16px;
  font-weight: bold;
  width: 20px;
  text-align: center;
}

.context-menu-divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 4px 0;
}

/* Modal de commentaire */
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
  z-index: 10001;
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background-color: #f5f5f5;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.modal-body label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
  font-size: 14px;
}

.comment-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.comment-textarea:focus {
  outline: none;
  border-color: #f44336;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background-color: #e0e0e0;
  color: #666;
}

.btn-cancel:hover {
  background-color: #d0d0d0;
}

.btn-reject {
  background-color: #f44336;
  color: white;
}

.btn-reject:hover {
  background-color: #d32f2f;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(244, 67, 54, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .calendar-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .user-selector {
    flex-direction: column;
    align-items: stretch;
  }
  
  .user-select {
    max-width: none;
  }

  .context-menu {
    min-width: 160px;
  }

  .modal-content {
    width: 95%;
    margin: 20px;
  }
}

/* Scrollbar personnalisée */
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

* {
  scrollbar-width: thin;
  scrollbar-color: #1976d2 #f1f1f1;
}
</style>