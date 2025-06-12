<script lang="ts" setup>
import type {Product} from "@/interfaces/product.ts";
import {onMounted, ref} from "vue";
import axios from "axios";
import Chart from 'chart.js/auto';

const props = defineProps<{
  product: Product
}>();

const allergens = ref<string[]>([]);
const nutriments = ref<Record<string, string>>({});
const ingredientsAnalysis = ref<string>('');
const chartCanvas = ref<HTMLCanvasElement | null>(null);
let myChart: Chart | null = null;

const initChart = (chartData: { labels: string[], data: number[], colors: string[] }) => {
  if (chartCanvas.value) {

    myChart = new Chart(chartCanvas.value, {
      type: 'polarArea',
      data: {
        labels: chartData.labels,
        datasets: [{
          data: chartData.data,
          backgroundColor: chartData.colors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'left'
          }
        }
      }
    });
  }
};

onMounted((): void => {
  axios
      .get(`https://world.openfoodfacts.net/api/v2/product/${props.product.barcode}?fields=ingredients_analysis_tags_fr,allergens_tags_fr,ingredients,ingredients_text_fr,nutriments`)
      .then(response => {
        nutriments.value["Matières grasses"] = `${response.data.product.nutriments.fat} ${response.data.product.nutriments.fat_unit}`;
        nutriments.value["Graisses saturées"] = `${response.data.product.nutriments["saturated-fat"]} ${response.data.product.nutriments["saturated-fat_unit"]}`;
        nutriments.value["Sucres"] = `${response.data.product.nutriments.sugars} ${response.data.product.nutriments.sugars_unit}`;
        nutriments.value["Sel"] = `${response.data.product.nutriments.salt} ${response.data.product.nutriments.salt_unit}`;
        ingredientsAnalysis.value = response.data.product.ingredients_analysis_tags_fr;
        allergens.value = response.data.product.allergens_tags_fr;

        const ingredients = response.data.product.ingredients
            .filter((ingredient: {
              percent_estimate?: number
            }) => ingredient.percent_estimate && ingredient.percent_estimate >= 1);

        const labels = ingredients.map((ingredient: { text: string }) =>
            ingredient.text.charAt(0).toUpperCase() + ingredient.text.slice(1).toLowerCase()
        );
        const data = ingredients.map((ingredient: { percent_estimate: number }) => ingredient.percent_estimate);
        const colors = ingredients.map((_: any, index: number) => {
          const hue = (index * 360) / ingredients.length;
          return `hsla(${hue}, 70%, 60%, 0.6)`;
        });

        initChart({
          labels: labels,
          data: data,
          colors: colors
        });
      });
});
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-10 h-screen animate-overlay"
       @click="$emit('closeNutritionalDetails')">
    <div class="w-3/4 bg-white z-20 p-2 rounded animate-modal" @click.stop>
      <div class="text-center">Données nutritionnelles</div>

      <div class="w-full h-56">
        <canvas ref="chartCanvas"></canvas>
      </div>

      <div class="text-xs">
        <table class="min-w-full divide-y divide-gray-300 mb-3">
          <thead>
          <tr>
            <th scope="col" class="py-1.5 pl-2 text-left font-semibold">Repères
              nutritionnelles
            </th>
          </tr>
          </thead>
          <tbody>
          <tr class="even:bg-gray-50" v-for="[key, nutriment] in Object.entries(nutriments)" :key="key">
            <td class="whitespace-nowrap py-1 pl-2 font-medium">{{ key }} : {{ nutriment }}</td>
          </tr>
          </tbody>
        </table>

        <table class="min-w-full divide-y divide-gray-300 mb-3">
          <thead>
          <tr>
            <th scope="col" class="py-1.5 pl-2 text-left font-semibold">Analyse des ingrédients</th>
          </tr>
          </thead>
          <tbody>
          <tr class="even:bg-gray-50" v-for="ingredientAnalysis in ingredientsAnalysis" :key="ingredientAnalysis">
            <td class="whitespace-nowrap py-1 pl-2 font-medium">{{ ingredientAnalysis }}</td>
          </tr>
          </tbody>
        </table>

        <table class="min-w-full divide-y divide-gray-300 mb-3">
          <thead>
          <tr>
            <th scope="col" class="py-1.5 pl-2 text-left font-semibold">Allergènes</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td class="whitespace-nowrap py-1 pl-2 font-medium">
              <span v-for="(allergen, index) in allergens" :key="index">{{ allergen }}{{ index < allergens.length - 1 ? ', ' : '' }}</span>
            </td>
          </tr>
          </tbody>
        </table>
        <br>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-overlay {
  animation: fadeIn 0.3s ease;
}

.animate-modal {
  animation: slideIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-40px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>