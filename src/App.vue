<!-- App.vue -->
<template>
  <!-- Renderiza o componente Home dentro do App -->
  <div id="app">
    <Home />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Home from './views/Home.vue'; // Importa o componente Home

export default defineComponent({
  name: 'App',
  components: {
    Home, // Registra o componente Home para uso no template
  },
});
</script>

<style>
/* Estilos globais opcionais */
</style>
