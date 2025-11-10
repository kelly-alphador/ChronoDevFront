<template>
  <div>
    <p>Le compteur est : {{ counter.count }}</p>
    <button @click="counter.increment()">Incrémenter</button>
  </div>
</template>

<script setup>
import { useCounterStore } from '~/stores/counter';

const counter = useCounterStore();
</script>
