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
        :editable-events="{ title: false, drag: true, resize: true, delete: false, create: false }"
        :snap-to-time="15"
        @event-drop="onEventDrop"
        @event-duration-change="onEventResize"
        @cell-click="onCellClick"
      />
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
          <!-- SELECT PROJET  -->
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

             <!-- SELECT TÂCHES (dépend du projet) -->
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
import { ref,onMounted } from 'vue'
import VueCal from 'vue-cal'
import { UseCalendarStore } from '~/stores/calendar'
const CalendarStore = UseCalendarStore();
const UserId=ref(0);

const projects = ref<Projet[]>([]);
const username = ref('');

//Récupérer le nom d'utilisateur depuis localStorage
const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  if (user) {
    const userJson = JSON.parse(user);
    username.value = userJson.nom || '';
    UserId.value = userJson.id;
  }
};
//Récupérer les saisies temps depuis le backend
const loadSaisiesTemps = async () => {
  if (!username.value) return;
  
  try {
    const saisies = await CalendarStore.GetSaisiesTemps(username.value);
    
    // Transformer les données backend en événements calendrier
    events.value = saisies.map((saisie: any) => ({
      start: `${saisie.dateSaisie.split('T')[0]} ${saisie.heureDebut.substring(0, 5)}`,
      end: `${saisie.dateSaisie.split('T')[0]} ${saisie.heureFin.substring(0, 5)}`,
      title: saisie.tacheNom,
      content: saisie.commentaire,
      class: 'leisure'
    }));
  } catch (error) {
    console.error('Erreur lors du chargement des saisies temps:', error);
  }
};

//methode recuperer les projets
const GetProject = async () => {
  const reponse = await CalendarStore.GetProject();
  projects.value = reponse;          
};

onMounted(async () => {
  await GetProject();
  await getUserFromLocalStorage();
  await loadSaisiesTemps();
});
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

// États
const events = ref([
  { start: '2025-11-10 10:00', end: '2025-11-10 12:00', title: 'Dr. John', content: 'Consultation', class: 'leisure' },
  { start: '2025-11-11 14:00', end: '2025-11-11 16:00', title: 'Dr. Kate', content: 'Réunion', class: 'health' },
  { start: '2025-11-12 09:00', end: '2025-11-12 11:00', title: 'Dr. John', content: 'Formation', class: 'sport' }
])

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
  utilisateurId: ''as number | string
})
//Recuperer l'id de l'utilisateur en localstorage

//  Charger les tâches en fonction du projet sélectionné
const loadTachesByProjet = async () => {
  const projetId = formData.value.projetId;
  
  if (!projetId) {
    taches.value = [];
    formData.value.tacheId = '';
    return;
  }

  try {
    // Appel API réel via le store
    const response = await CalendarStore.GetTachesByProjectId(Number(projetId));
    taches.value = response;
    formData.value.tacheId = ''; // Réinitialiser la sélection de tâche
    console.log('Tâches du projet', projetId, ':', taches.value);
  } catch (error) {
    console.error('Erreur lors du chargement des tâches:', error);
    taches.value = [];
  }
};

const taches = ref<Tache[]>([])

// Gestion du clic sur une cellule du calendrier
const onCellClick = (date: Date, event: any) => {
  console.log("je suis cliquer");
  // Formatter la date au format YYYY-MM-DD
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  // Formatter l'heure au format HH:MM
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  // Calculer l'heure de fin (1 heure après par défaut)
  const endDate = new Date(date)
  endDate.setHours(endDate.getHours() + 1)
  const endHours = String(endDate.getHours()).padStart(2, '0')
  const endMinutes = String(endDate.getMinutes()).padStart(2, '0')
  //Recuperer l'Id de l'user
   const user=localStorage.getItem("user");
  if(user==null)
  { 
      console.log("aucun donnees");
  }
  else{
    const UserJson=JSON.parse(user);
    UserId.value=UserJson.id;
  }
  // Remplir le formulaire avec les données du clic
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

  // Réinitialiser les tâches
  taches.value = []

  // Afficher le modal
  showModal.value = true
}


// Soumettre le formulaire
const handleSubmit = async () => {
  console.log('Nouvelle entrée à créer:', formData.value)
  
  // Validation
  if (formData.value.heure_fin <= formData.value.heure_deb) {
    alert('L\'heure de fin doit être après l\'heure de début')
    return
  }
  const formDataToSend = {
  ...formData.value,
  heure_deb: formData.value.heure_deb + ":00",
  heure_fin: formData.value.heure_fin + ":00"
  };


  // Ajouter l'événement au calendrier (simulation)
  const response=CalendarStore.createSaisieTemps(formDataToSend);
  console.log("IO RESPONSE ZAO",response);
  const tacheSelectionnee = taches.value.find(t => t.id === Number(formData.value.tacheId))
  events.value.push({
    start: `${formData.value.dateSaisie} ${formData.value.heure_deb}`,
    end: `${formData.value.dateSaisie} ${formData.value.heure_fin}`,
    title: tacheSelectionnee?.nom || 'Nouvelle tâche',
    content: formData.value.commentaire,
    class: 'leisure'
  })

  // Fermer le modal
  closeModal()
}

// Fermer le modal
const closeModal = () => {
  showModal.value = false
}

// Gestion du déplacement d'événement
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