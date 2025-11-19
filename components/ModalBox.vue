<template>
  <div class="modal-overlay" @click.self="CloseModal">
    <div class="modal-card" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">{{ title }}</h2>
        <button class="close-btn" @click="CloseModal">&times;</button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])

function CloseModal() {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  /*backdrop-filter: blur(4px);*/
}

.modal-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 600px;
  overflow: hidden;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  color: white;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 32px;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.2s, transform 0.2s;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: rotate(90deg);
}

.close-btn:active {
  transform: rotate(90deg) scale(0.95);
}

.modal-body {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

/* Scrollbar personnalisée */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #1976d2;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #1565c0;
}

/* Styles pour le formulaire dans le slot */
.modal-body :deep(.form-projet) {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-body :deep(.form-group) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-body :deep(.form-group label) {
  display: block;
  color: #333;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.modal-body :deep(.form-group input),
.modal-body :deep(.form-group select),
.modal-body :deep(.form-group textarea) {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: #fafafa;
}

.modal-body :deep(.form-group input:focus),
.modal-body :deep(.form-group select:focus),
.modal-body :deep(.form-group textarea:focus) {
  outline: none;
  border-color: #1976d2;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.modal-body :deep(.form-group input:hover),
.modal-body :deep(.form-group select:hover),
.modal-body :deep(.form-group textarea:hover) {
  border-color: #bdbdbd;
}

.modal-body :deep(.form-actions) {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.modal-body :deep(.btn-primary) {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
}

.modal-body :deep(.btn-primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
}

.modal-body :deep(.btn-primary:active) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(25, 118, 210, 0.3);
}

.modal-body :deep(.btn-secondary) {
  background: white;
  color: #666;
  border: 2px solid #e0e0e0;
  padding: 12px 28px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.modal-body :deep(.btn-secondary:hover) {
  background: #f5f5f5;
  border-color: #bdbdbd;
  transform: translateY(-2px);
}

.modal-body :deep(.btn-secondary:active) {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-card {
    width: 95%;
    max-width: none;
    margin: 20px;
  }

  .modal-header {
    padding: 16px 20px;
  }

  .modal-title {
    font-size: 20px;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-body :deep(.form-actions) {
    flex-direction: column;
  }

  .modal-body :deep(.btn-primary),
  .modal-body :deep(.btn-secondary) {
    width: 100%;
  }
}
</style>