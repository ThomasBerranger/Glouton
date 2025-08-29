<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {BrowserMultiFormatReader} from '@zxing/browser';
import axios from "axios";
import {isValidEcoscore, isValidNovaGroup, isValidNutriscore, type Product} from "@/interfaces/product.ts";
import Ecoscore from "@/components/Product/Scores/Ecoscore.vue";
import Nutriscore from "@/components/Product/Scores/Nutriscore.vue";
import Novagroup from "@/components/Product/Scores/Novagroup.vue";
import moment from "moment";
import Datepicker from "@/components/Datepicker.vue";
import type {ExpirationDate} from "@/interfaces/expiration-date.ts";
import {getProductUrlByType, PRODUCT_URL, SCANNED_PRODUCT_URL} from "@/constants/api.ts";
import {useTokenStore} from "@/stores/token.ts";
import router from "@/router";
import {selectBestCategory, productCategories} from '@/constants/productCategories.ts'

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

  axios.get(`${SCANNED_PRODUCT_URL}?barcode=${code.value}`, {
    headers: {Authorization: `Bearer ${tokenStore.token}`},
  }).then(response => {
    router.push({
      name: 'product.details',
      params: {id: response.data.id}
    }).catch(error => {
      console.log(error);
    })
  });

  axios
      .get(`https://world.openfoodfacts.org/api/v2/product/${code.value}.json?fields=product_name,nutriscore_data,ecoscore_data,selected_images,generic_name_fr,nova_group,categories_tags`)
      .then(response => {
        mode.value = 'found';

        newProduct.value.scanned = true;
        newProduct.value.barcode = code.value;
        newProduct.value.name = response.data.product.product_name.charAt(0).toUpperCase() + response.data.product.product_name.slice(1).toLowerCase();

        newProduct.value.nutriscore = isValidNutriscore(response.data.product.nutriscore_data?.grade) ? response.data.product.nutriscore_data?.grade : null;
        newProduct.value.novagroup = isValidNovaGroup(response.data.product.nova_group) ? response.data.product.nova_group : null;
        newProduct.value.ecoscore = isValidEcoscore(response.data.product.ecoscore_data?.grade) ? response.data.product.ecoscore_data?.grade : null;

        newProduct.value.description = response.data.product.generic_name_fr ? response.data.product.generic_name_fr.charAt(0).toUpperCase() + response.data.product.generic_name_fr.slice(1).toLowerCase() : '';

        images.value = manageImages(response.data.product.selected_images);

        const selectedCategory = selectBestCategory(response.data.product.categories_tags);

        newProduct.value.category = selectedCategory && selectedCategory.selectedCategory ? parseInt(selectedCategory.selectedCategory) : 7;
      })
      .catch(error => {
        mode.value = 'manual';
        newProduct.value.barcode = code.value;
        newProduct.value.category = 7;
      })
      .finally(() => {
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
  <div class="min-screen-height w-screen px-3">
    <section v-if="mode === 'scanning'">
      <video ref="videoRef"></video>

      <button @click="mode = 'manual'; showDatePicker = true; newProduct.category = 7;"
              class="green-background mt-5 px-3 py-1.5 text-white rounded">
        Ajouter un produit sans code-barres
      </button>
    </section>

    <section v-else-if="mode === 'found'" class="px-5">

      <p class="font-semibold mt-3">Nom</p>
      <input v-model="newProduct.name" class="w-full border p-2"/>

      <p class="font-light">{{ newProduct.description }}</p>

      <p class="font-semibold mt-4 mb-3">Image{{ images.length > 1 ? 's' : '' }}</p>
      <div class="grid grid-cols-4 gap-2 mt-2">
        <img
            v-for="image in images" :key="image"
            :src="image" :alt="`${newProduct.name} image`"
            :class="[image === newProduct.image ? 'opacity-100' : 'opacity-50', 'h-24 aspect-square object-contain']"
            @click="newProduct.image = image"
        >
      </div>

      <div class="w-full flex justify-center items-baseline gap-5 my-5">
        <Nutriscore :nutriscore="newProduct.nutriscore"/>
        <Novagroup :novagroup="newProduct.novagroup"/>
        <Ecoscore :ecoscore="newProduct.ecoscore"/>
      </div>
    </section>

    <section v-else>
      <div class="w-full px-5 my-4">
        <p v-if="newProduct.barcode" class="mt-2 text-red-400 font-semibold">Produit inconnu</p>

        <p class="font-semibold mt-3">Nom</p>
        <input v-model="newProduct.name" class="w-full border p-2"/>

        <p class="font-semibold mt-3">Notes</p>
        <textarea rows="3" v-model="newProduct.description" class="w-full p-2" placeholder="Aucune note"/>

        <p class="font-semibold mt-3">Image (url)</p>
        <input v-model="newProduct.image" class="w-full border p-2"/>
        <img v-if="newProduct.image" :src="newProduct.image" class="h-32 m-auto" :alt="newProduct.name">
      </div>
    </section>

    <section v-if="mode !== 'scanning'" class="px-5 mt-1">
      <div class="flex-row mt-3">
        <p class="font-semibold mt-3">Catégorie</p>
        <select v-model="newProduct.category" class="w-full p-2">
          <option v-for="(category, id) in productCategories" :value="id" :key="id">{{ category.name }}</option>
        </select>
      </div>

      <div class="flex-row justify-center mt-4">
        <p @click="showDatePicker = true" class="font-semibold">Dates d'expirations :</p>
        <div class="grid grid-cols-2 gap-2 gap-x-5 mt-1 px-5 mb-1">
          <button v-for="expirationDate in newProduct.expirationDates" type="button"
                  class="col-span-1 bg-red-400 text-white rounded py-0.5 text-sm tracking-wider">
            {{ moment(expirationDate.date).format('L') }}
          </button>
          <button @click="showDatePicker = true"
                  class="col-span-1 green-background text-white rounded py-0.5 text-sm tracking-wider">
            Ajouter
          </button>
        </div>
      </div>

      <div class="flex justify-center">
        <button v-if="!newProduct.name || !newProduct.expirationDates"
                class="btn green-background opacity-50 text-white mt-5 px-3 py-1.5 rounded">
          Enregistrer
        </button>
        <button v-else @click="submit" class="btn green-background text-white mt-5 px-3 py-1.5 rounded">Enregistrer
        </button>
      </div>
    </section>

    <Datepicker v-if="showDatePicker" :date="moment().format('L')" @update-date="addExpirationDate"/>
  </div>
</template>

<style>

</style>
