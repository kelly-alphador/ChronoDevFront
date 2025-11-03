<template>
  <v-container fluid class="login-container">
    <!-- Formes décoratives en arrière-plan -->
    <div class="decorative-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="5" lg="4" xl="3">
        <v-card class="login-card elevation-12" rounded="lg">
          <!-- Header Section -->
          <div class="login-header">
            <v-avatar size="80" class="mb-4" color="primary">
              <v-icon size="50" color="white">mdi-account-circle</v-icon>
            </v-avatar>
          </div>

          <v-card-text class="px-8 pb-8">
            <!-- Alert Error (vous gérerez la logique) -->
            <v-alert
              type="error"
              variant="tonal"
              density="compact"
              class="mb-6"
              closable
            >
              Utilisateur n'existe pas ou mot de passe incorrect
            </v-alert>

            <!-- Login Form -->
            <v-form>
              <!-- Email Field -->
              <v-text-field
                v-model="users.email"
                label="Adresse email"
                prepend-inner-icon="mdi-email-outline"
                type="email"
                variant="outlined"
                color="primary"
                class="mb-4"
                required
                density="comfortable"
              ></v-text-field>

              <!-- Password Field -->
              <v-text-field
                v-model="users.password"
                label="Mot de passe"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="users.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                color="primary"
                class="mb-2"
                required
                density="comfortable"
              ></v-text-field>

              <!-- Remember & Forgot Password -->
              <div class="d-flex justify-space-between align-center mb-6">
                <v-checkbox
                  v-model="users.rememberMe"
                  label="Se souvenir de moi"
                  color="primary"
                  density="compact"
                  hide-details
                ></v-checkbox>
                <a href="#" class="text-primary text-decoration-none">
                  Mot de passe oublié ?
                </a>
              </div>

              <!-- Login Button -->
              <v-btn
                block
                size="large"
                color="primary"
                variant="elevated"
                class="mb-4 login-btn"
                rounded="lg"
              >
                <v-icon left class="mr-2">mdi-login</v-icon>
                Se connecter
              </v-btn>
            </v-form>
          </v-card-text>

          <!-- Footer -->
          <v-card-actions class="justify-center pb-6">
            <span class="text-body-2">
              Pas encore de compte ?
              <a href="#" class="text-primary font-weight-bold text-decoration-none">
                S'inscrire
              </a>
            </span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({
  layout: 'logindefault'
})

const users = ref({
  email: '',
  password: '',
  showPassword: false,
  rememberMe: false
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* Formes décoratives identiques au register */
.decorative-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 400px;
  height: 400px;
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.shape-2 {
  width: 300px;
  height: 300px;
  bottom: -100px;
  right: -100px;
  animation-delay: 7s;
}

.shape-3 {
  width: 250px;
  height: 250px;
  top: 40%;
  right: -80px;
  animation-delay: 14s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-40px) rotate(180deg);
    opacity: 0.8;
  }
}

.login-card {
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  z-index: 1;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2) !important;
}

.login-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px 30px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.login-header::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: pulse 15s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1) rotate(180deg);
    opacity: 0.8;
  }
}

.login-header h1 {
  color: white !important;
  position: relative;
  z-index: 1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.login-header p {
  color: rgba(255, 255, 255, 0.95) !important;
  position: relative;
  z-index: 1;
}

.login-btn {
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4) !important;
  transition: all 0.3s ease;
}

.login-btn:hover {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6) !important;
  transform: translateY(-2px);
}

.divider-container {
  display: flex;
  align-items: center;
  position: relative;
}

.divider-text {
  background: white;
  font-size: 12px;
  font-weight: 500;
}

/* Custom styles for text fields */
:deep(.v-field--focused) {
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

:deep(.v-input__prepend-inner) {
  padding-right: 8px;
}

/* Alert custom styling */
:deep(.v-alert) {
  border-left: 4px solid #f44336;
}

/* Checkbox styling */
:deep(.v-checkbox .v-label) {
  font-size: 14px;
}

/* Link hover effects */
a {
  transition: all 0.2s ease;
}

a:hover {
  opacity: 0.8;
  text-decoration: underline !important;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .login-header {
    padding: 30px 15px 20px;
  }
  
  .login-header h1 {
    font-size: 1.75rem !important;
  }
  
  .login-card {
    margin: 10px;
  }
}

/* Animation for card entrance */
.login-card {
  animation: slideUp 0.5s ease-out;
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
</style>