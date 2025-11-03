<template>
  <div class="register-container">
    <div class="register-card">
      <div class="card-header">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="19" y1="8" x2="19" y2="14"></line>
            <line x1="22" y1="11" x2="16" y2="11"></line>
          </svg>
        </div>
        <h1 class="title">Créer un compte</h1>
      </div>

      <form @submit.prevent="handleSubmit" class="register-form">
        <div class="form-row">
          <div class="form-group">
            <label for="nom" class="label">Nom</label>
            <input
              type="text"
              id="nom"
              v-model="formData.nom"
              class="input"
              placeholder="Votre nom"
              required
            />
          </div>

          <div class="form-group">
            <label for="prenom" class="label">Prénom</label>
            <input
              type="text"
              id="prenom"
              v-model="formData.prenom"
              class="input"
              placeholder="Votre prénom"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="email" class="label">Email</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            class="input"
            placeholder="exemple@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="role" class="label">Rôle</label>
          <select
            id="role"
            v-model="formData.role"
            class="input"
            required
          >
            <option value="" disabled>Sélectionnez un rôle</option>
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <div class="form-group">
          <label for="password" class="label">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="formData.password"
            class="input"
            placeholder="••••••••"
            required
          />
        </div>

        <div class="form-group">
          <label for="passwordConfirm" class="label">Confirmer le mot de passe</label>
          <input
            type="password"
            id="passwordConfirm"
            v-model="formData.passwordConfirm"
            class="input"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" class="submit-btn">
          <span>S'inscrire</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        <div class="footer-text">
          <p>Vous avez déjà un compte ? <NuxtLink to="/login" class="link">Connectez-vous</NuxtLink></p>
        </div>
      </form>
    </div>

    <div class="decorative-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'logindefault'
})

const formData = ref({
  nom: '',
  prenom: '',
  email: '',
  password: '',
  passwordConfirm: '',
  role: ''
})

const handleSubmit = () => {
  if (formData.value.password !== formData.value.passwordConfirm) {
    alert('Les mots de passe ne correspondent pas')
    return
  }
  
  console.log('Données du formulaire:', formData.value)
  // Ajoutez ici votre logique d'inscription
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

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
  background: rgba(255, 255, 255, 0.1);
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  right: 10%;
  animation-delay: 5s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: -50px;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
  }
}

.register-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 520px;
  padding: 2rem;
  position: relative;
  z-index: 1;
  animation: slideUp 0.6s ease-out;
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

.card-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.icon {
  width: 40px;
  height: 40px;
  color: white;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: #718096;
  font-size: 1rem;
  margin: 0;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
}

.input {
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  color: #2d3748;
}

.input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input::placeholder {
  color: #a0aec0;
}

.submit-btn {
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.submit-btn:active {
  transform: translateY(0);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.footer-text {
  text-align: center;
  margin-top: 1.5rem;
  color: #718096;
}

.link {
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link:hover {
  color: #764ba2;
  text-decoration: underline;
}

@media (max-width: 640px) {
  .register-card {
    padding: 2rem 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 1.75rem;
  }
}
</style>