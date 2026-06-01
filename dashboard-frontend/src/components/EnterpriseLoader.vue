<!-- components/EnterpriseLoader.vue -->
<script setup>
defineProps({
  loading: Boolean,
})
</script>

<template>
  <transition
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-300"
  >
    <div
      v-if="loading"
      class="fixed inset-0 z-[9999] bg-white/75 backdrop-blur-sm flex items-center justify-center"
    >
      <div class="flex flex-col items-center">
        <!-- Animated Beam -->
        <div class="beam-wrapper">
          <div class="beam"></div>
        </div>

        <!-- Text -->
        <div class="mt-6 text-center">
          <p class="text-slate-800 font-semibold tracking-wide">Loading Deployment...</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.beam-wrapper {
  width: 260px;
  height: 6px;
  background: rgba(15, 23, 42, 0.08);
  border-radius: 999px;
  overflow: hidden;
  position: relative;
}

.beam {
  position: absolute;
  left: -40%;
  width: 40%;
  height: 100%;
  border-radius: 999px;

  background: linear-gradient(90deg, transparent, #0f172a, #06b6d4, #0f172a, transparent);

  animation: beamMove 1.4s ease-in-out infinite;
}

@keyframes beamMove {
  0% {
    left: -40%;
  }

  100% {
    left: 100%;
  }
}
</style>
