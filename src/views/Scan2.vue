<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Quagga from '@ericblade/quagga2'

const scannerRef = ref<HTMLDivElement | null>(null)
const scannedCode = ref('')

const startScanner = async () => {
  if (!scannerRef.value) return

  try {
    await Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: scannerRef.value,
        constraints: {
          facingMode: "environment"
        },
      },
      decoder: {
        readers: ["ean_reader", "ean_8_reader"]
      }
    })

    // Ecouteur pour la détection d'un code
    Quagga.onDetected((result) => {
      if (result && result.codeResult) {
        scannedCode.value = result.codeResult.code || ''
        console.log('Code détecté:', result.codeResult.code)
      }
    })

    Quagga.start()
  } catch (error) {
    console.error('Erreur init scanner:', error)
  }
}

// Nettoyage à la destruction du composant
onUnmounted(() => {
  Quagga.stop()
})
</script>

<template>
  <div class="screen-height w-screen text-center">
    <div v-if="scannedCode" class="mt-4">
      Code détecté : {{ scannedCode }}
    </div>


    <div ref="scannerRef"></div>


    <button class="btn green-background p-2 text-white" @click="startScanner">
      Lancer Scanner
    </button>
  </div>
</template>

<style scoped>
#interactive.viewport {
  width: 100%;
  height: 300px;
}
</style>