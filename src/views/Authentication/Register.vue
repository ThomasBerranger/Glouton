<script lang="ts" setup>
import {ref} from 'vue'
import axios from 'axios'
import router from "@/router";
import {RouterLink} from "vue-router";
import {useTokenStore} from "@/stores/token";

const email = ref('');
const password = ref('');
const tokenStore = useTokenStore();

const onSubmit = () => {
  axios.post('https://glouton-fd999217b246.herokuapp.com/register', {
    email: email.value,
    password: password.value,
  })
      .then(response => {
        tokenStore.setToken(response.data.token)
        router.push('/');
      })
      .catch(error => {
        console.error('Error during registration:', error);
      });
}
</script>

<template>
  <div class="w-screen screen-height flex flex-1 flex-col justify-center">

    <div class="w-full">
      <img class="mx-auto h-20 w-auto" src="/public/logo.png" alt="Your Company"/>
      <h2 class="mt-5 text-center text-2xl leading-9 tracking-tight text-gray-900">Création de compte</h2>
    </div>

    <div class="w-full px-4 mt-3">
      <form @submit.prevent="onSubmit" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
          <div class="mt-2">
            <input v-model="email" id="email" name="email" type="email" autocomplete="email" required=""
                   class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm px-2"/>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Mot de passe</label>
          </div>
          <div class="mt-2">
            <input v-model="password" id="password" name="password" type="password" autocomplete="current-password"
                   required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm px-2"/>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center gap-y-4 pt-2">
          <button class="rounded-md bg-green-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm">
            Créer mon compte
          </button>
          <RouterLink to="/login" class="text-sm text-gray-900">Connexion <span aria-hidden="true">&rarr;</span>
          </RouterLink>
        </div>
      </form>
    </div>

  </div>

</template>