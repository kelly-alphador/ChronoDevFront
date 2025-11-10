<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo">
        <h1>🔐 Connexion</h1>
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">
            <span class="icon">📧</span>
            Email
          </label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            required 
            placeholder="jean.rakoto@example.com"
            :disabled="loading"
          />
        </div>
        
        <div class="form-group">
          <label for="password">
            <span class="icon">🔒</span>
            Mot de passe
          </label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            required 
            placeholder="••••••••"
            :disabled="loading"
          />
        </div>
        
        <div v-if="error" class="error-message">
          ⚠️ {{ error }}
        </div>
        
        <button type="submit" :disabled="loading" class="submit-btn">
          <span v-if="!loading">Se connecter</span>
          <span v-else class="loading">
            <span class="spinner"></span>
            Connexion en cours...
          </span>
        </button>
      </form>
    </div>
  </div>
</template>
<script setup >
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'
definePageMeta({
  layout:'logindefault'
})
const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  const result = await authStore.login(email.value, password.value)

  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error
  }

  loading.value = false
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.login-card {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 450px;
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo h1 {
  text-align: center;
  margin-bottom: 2.5rem;
  color: #333;
  font-size: 2rem;
  font-weight: 700;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 600;
  font-size: 0.95rem;
}

.icon {
  font-size: 1.2rem;
}

input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  text-align: center;
  border-left: 4px solid #c33;
  font-weight: 500;
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}
</style>
