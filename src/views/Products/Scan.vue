<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {BrowserMultiFormatReader} from '@zxing/browser';
import axios from "axios";
import type {Product} from "@/interfaces/product.ts";
import Ecoscore from "@/components/Product/Scores/Ecoscore.vue";
import Nutriscore from "@/components/Product/Scores/Nutriscore.vue";
import Novagroup from "@/components/Product/Scores/Novagroup.vue";
import moment from "moment";
import Datepicker from "@/components/Datepicker.vue";
import type {ExpirationDate} from "@/interfaces/expiration-date.ts";
import {getProductUrlByType} from "@/constants/api.ts";
import {useTokenStore} from "@/stores/token.ts";
import router from "@/router";

const tokenStore = useTokenStore();

const videoRef = ref<HTMLVideoElement | null>(null);
const codeReader = new BrowserMultiFormatReader();

const newProduct = ref<Product>({} as Product);
const code = ref<string>('');
const images = ref<string[]>([]);

const mode = ref<'scanning' | 'found' | 'manual'>('scanning');
const showDatePicker = ref<boolean>(false);

const startScan = async () => {
  if (!videoRef.value) return;

  try {
    const result = await codeReader.decodeOnceFromVideoDevice(
        undefined, // default camera
        videoRef.value
    );

    if (result) {
      code.value = result.getText();
      videoRef.value = null;
      fetchData();
    }
  } catch (error) {
    console.error('Scanning error:', error);
  }
}

const fetchData = (): void => {
  if (!code.value) return;

  axios
      .get(`https://world.openfoodfacts.org/api/v2/product/${code.value}.json?fields=product_name,nutriscore_data,ecoscore_data,selected_images,generic_name_fr,nova_group`)
      .then(response => {
        mode.value = 'found';
        newProduct.value.barcode = code.value;
        newProduct.value.scanned = true;
        newProduct.value.name = response.data.product.product_name;
        newProduct.value.nutriscore = response.data.product.nutriscore_data?.grade;
        newProduct.value.ecoscore = response.data.product.ecoscore_data?.grade;
        newProduct.value.novagroup = response.data.product.nova_group;
        newProduct.value.description = response.data.product.generic_name_fr ? response.data.product.generic_name_fr.charAt(0).toUpperCase() + response.data.product.generic_name_fr.slice(1).toLowerCase() : '';

        images.value = manageImages(response.data.product.selected_images);

        showDatePicker.value = true;
      })
      .catch(error => {
        mode.value = 'manual';
        newProduct.value.barcode = code.value;
        showDatePicker.value = true;
      })
}

const manageImages = (availableImages: string[]): string[] => {
  availableImages = Object.values(availableImages)
      .map(image => image?.display?.fr)
      .filter(url => url !== undefined);

  newProduct.value.image = availableImages[0] ?? null;

  return availableImages;
};

const addExpirationDate = (expirationDate: string | null): void => {
  console.log(expirationDate);

  if (!expirationDate) return;

  const newExpirationDate: ExpirationDate = {
    date: expirationDate
  };

  newProduct.value.expirationDates.push(newExpirationDate);
  showDatePicker.value = false;
};

const submit = (): void => {
  axios.post(
      getProductUrlByType(newProduct.value),
      newProduct.value,
      {headers: {Authorization: `Bearer ${tokenStore.token}`}}
  )
      .then(response => {
        router.push('/');
      });
};

onMounted((): void => {
  startScan();

  newProduct.value.expirationDates = [];
});
</script>

<template>
  <div class="min-screen-height w-screen text-center">
    <section v-if="mode === 'scanning'">
      <video ref="videoRef"></video>

      <button @click="mode = 'manual'; showDatePicker = true;"
              class="green-background mt-5 px-3 py-1.5 text-white rounded">
        Ajouter un produit sans code-barres
      </button>
    </section>

    <section v-else-if="mode === 'found'">
      <h1 class="text-2xl mt-3">{{ newProduct.name }}</h1>
      <p class="text-xl font-light">{{ newProduct.description }}</p>

      <p class="mt-3">Images</p>
      <div class="flex justify-evenly mt-2">
        <img
            v-for="image in images" :key="image"
            :src="image" :alt="`${newProduct.name} image`"
            :class="[image === newProduct.image ? 'opacity-100' : 'opacity-50', 'w-20']"
            @click="newProduct.image = image"
        >
      </div>

      <div class="w-full flex justify-evenly mt-5">
        <Nutriscore :nutriscore="newProduct.nutriscore"/>
        <Novagroup :novagroup="newProduct.novagroup"/>
        <Ecoscore :ecoscore="newProduct.ecoscore"/>
      </div>

      <br>
      <div class="flex-row justify-center">
        <p @click="showDatePicker = true">Dates d'expirations :</p>
        <p v-for="expirationDate in newProduct.expirationDates" class="font-light">
          {{ moment(expirationDate.date).format('L') }}
        </p>
      </div>
    </section>

    <section v-else>
      <div class="w-full justify-center mb-4">
        <p v-if="newProduct.barcode" class="mt-2 text-red-500">Produit inconnu</p>

        <h1 class="text-2xl mt-3">Nom</h1>
        <input v-model="newProduct.name" class="w-3/4 border border-green-800 rounded px-2 py-1" type="text">

        <p class="text-xl font-light mt-3">Description</p>
        <input v-model="newProduct.description" class="w-3/4 border border-green-800 rounded px-2 py-1" type="text">

        <p class="text-xl font-light mt-3">Image (url)</p>
        <input v-model="newProduct.image" class="w-3/4 border border-green-800 rounded px-2 py-1" type="text">
        <img v-if="newProduct.image" :src="newProduct.image" class="h-32 m-auto" :alt="newProduct.name">

        <br>
        <br>

        <div class="flex-row justify-center">
          <p @click="showDatePicker = true">Dates d'expirations :</p>
          <p v-for="expirationDate in newProduct.expirationDates" class="font-light">
            {{ moment(expirationDate.date).format('L') }}
          </p>
        </div>
      </div>
    </section>

    <section v-if="mode !== 'scanning'" class="mt-1">
      <button @click="showDatePicker = true" class="btn green-background text-xs text-white px-3 py-1.5 rounded">
        Ajouter
      </button>

      <br><br>

      <button v-if="!newProduct.name || !newProduct.expirationDates"
              class="btn green-background opacity-50 text-white px-3 py-1.5 rounded">
        Enregistrer
      </button>
      <button v-else @click="submit" class="btn green-background text-white px-3 py-1.5 rounded">Enregistrer</button>
    </section>

    <Datepicker v-if="showDatePicker" :date="moment().format('L')" @update-date="addExpirationDate"/>
  </div>
</template>

<style>

</style>
