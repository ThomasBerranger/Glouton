<script setup lang="ts">
import {ref} from 'vue'
import {BrowserMultiFormatReader} from '@zxing/browser';

const videoRef = ref<HTMLVideoElement | null>(null);
const codeReader = new BrowserMultiFormatReader();

const code = ref('');

const startScan = async () => {
  if (!videoRef.value) return;

  try {
    console.log('Démarrage du scan')
    await codeReader.decodeFromVideoDevice(
        undefined, // caméra par défaut
        videoRef.value,
        (result) => {
          if (result) {
            console.log('Code détecté:', result.getText());
            code.value = result.getText();
          }
        }
    )
  } catch (error) {
    console.error('Erreur lors du scan:', error);
  }
}
</script>

<template>
  <div class="screen-height w-screen text-center">
    <br>
    <video ref="videoRef"></video>
    <button class="btn green-background p-2 text-white" @click="startScan">Scan</button>
    <p>Code: {{ code }}</p>
  </div>
</template>

<style>

</style>
