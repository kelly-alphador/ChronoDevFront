<template>
  <v-dialog
    v-model="dialog"
    :max-width="maxWidth"
    :persistent="persistent"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <slot name="activator" :props="activatorProps">
        <v-btn
          v-bind="activatorProps"
          :color="buttonColor"
          :prepend-icon="buttonIcon"
          :text="buttonText"
          variant="elevated"
          class="text-none font-weight-medium"
        ></v-btn>
      </slot>
    </template>

    <v-card class="modal-card" elevation="24">
      <!-- Header avec gradient bleu -->
      <div class="modal-header">
        <div class="header-gradient"></div>
        <div class="header-content">
          <div class="d-flex align-center">
            <v-avatar 
              :color="iconColor" 
              size="56" 
              class="elevation-4 icon-avatar"
            >
              <v-icon size="32" color="white">{{ icon }}</v-icon>
            </v-avatar>
            <div class="ml-4">
              <h2 class="modal-title">{{ title }}</h2>
              <p v-if="subtitle" class="modal-subtitle">{{ subtitle }}</p>
            </div>
          </div>
          <v-btn
            icon
            variant="text"
            class="close-btn"
            @click="closeDialog"
          >
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </div>
        <!-- Décoration -->
        <div class="header-decoration">
          <div class="decoration-circle circle-1"></div>
          <div class="decoration-circle circle-2"></div>
          <div class="decoration-circle circle-3"></div>
        </div>
      </div>

      <!-- Corps du modal avec slot -->
      <v-card-text class="modal-body pt-8 pb-6">
        <slot name="content">
          <p class="text-body-1 text-grey-darken-1">Contenu par défaut</p>
        </slot>
      </v-card-text>

      <!-- Divider décoratif -->
      <v-divider class="divider-gradient"></v-divider>

      <!-- Actions -->
      <v-card-actions class="modal-actions pa-6">
        <v-spacer></v-spacer>
        <slot name="actions">
          <v-btn
            text="Annuler"
            variant="text"
            color="grey-darken-1"
            class="text-none font-weight-medium px-6"
            @click="closeDialog"
          ></v-btn>
          <v-btn
            :text="confirmText"
            variant="elevated"
            color="primary"
            class="text-none font-weight-medium px-8 ml-3"
            :loading="loading"
            @click="handleConfirm"
          >
            <template v-slot:prepend>
              <v-icon>{{ confirmIcon }}</v-icon>
            </template>
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Titre du modal'
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'mdi-information'
  },
  iconColor: {
    type: String,
    default: 'blue-darken-2'
  },
  maxWidth: {
    type: [String, Number],
    default: '700'
  },
  persistent: {
    type: Boolean,
    default: false
  },
  buttonText: {
    type: String,
    default: 'Ouvrir'
  },
  buttonIcon: {
    type: String,
    default: 'mdi-plus'
  },
  buttonColor: {
    type: String,
    default: 'primary'
  },
  confirmText: {
    type: String,
    default: 'Confirmer'
  },
  confirmIcon: {
    type: String,
    default: 'mdi-check'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'close'])

const dialog = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  dialog.value = newVal
})

watch(dialog, (newVal) => {
  emit('update:modelValue', newVal)
  if (!newVal) {
    emit('close')
  }
})

const closeDialog = () => {
  dialog.value = false
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<style scoped>
.modal-card {
  border-radius: 20px !important;
  overflow: hidden;
}

.modal-header {
  position: relative;
  padding: 32px 32px 24px;
  overflow: hidden;
}

.header-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%);
  z-index: 0;
}

.header-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.icon-avatar {
  border: 3px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease;
}

.icon-avatar:hover {
  transform: scale(1.1) rotate(5deg);
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modal-subtitle {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 4px 0 0;
  font-weight: 400;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  transform: rotate(90deg);
}

.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 150px;
  height: 150px;
  top: -50px;
  right: -30px;
}

.circle-2 {
  width: 100px;
  height: 100px;
  bottom: -30px;
  left: 40%;
}

.circle-3 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: -20px;
}

.modal-body {
  min-height: 100px;
}

.divider-gradient {
  height: 2px;
  background: linear-gradient(90deg, transparent, #1976d2, transparent);
  border: none;
}

.modal-actions {
  background: linear-gradient(to bottom, rgba(25, 118, 210, 0.02), transparent);
}

/* Animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-card {
  animation: slideDown 0.3s ease-out;
}

/* Responsive */
@media (max-width: 600px) {
  .modal-header {
    padding: 24px 20px 20px;
  }
  
  .modal-title {
    font-size: 1.4rem;
  }
  
  .icon-avatar {
    width: 48px !important;
    height: 48px !important;
  }
}
</style>