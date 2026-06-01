<!-- components/EnterpriseIntro.vue -->
<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['finished'])

onMounted(() => {
  setTimeout(() => {
    emit('finished')
  }, 3500) // your intro duration
})

const visible = ref(true)

onMounted(() => {
  setTimeout(() => {
    visible.value = false
  }, 4200)
})
</script>

<template>
  <transition
    enter-active-class="transition-all duration-700 ease-out"
    leave-active-class="transition-all duration-1000 ease-in"
    leave-to-class="opacity-0 scale-110 blur-sm"
  >
    <div v-if="visible" class="fixed inset-0 z-[9999] overflow-hidden bg-[#020617]">
      <!-- PREMIUM AMBIENT BACKGROUND -->
      <div class="ambient-bg">
        <div class="orb orb1"></div>
        <div class="orb orb2"></div>
        <div class="orb orb3"></div>

        <div class="beam beam1"></div>
        <div class="beam beam2"></div>

        <div class="noise"></div>
      </div>

      <!-- GLOW -->
      <div
        class="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-cyan-500/20 blur-[140px] rounded-full animate-pulse"
      ></div>

      <div
        class="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-blue-600/20 blur-[160px] rounded-full animate-pulse"
      ></div>

      <!-- CENTER CONTENT -->
      <div class="relative h-full flex items-center justify-center">
        <div class="text-center">
          <!-- TITLE -->
          <h1
            class="text-6xl font-black tracking-[0.3em] text-white uppercase mb-4 animate-fade-up"
          >
            DBA CONTROL CENTER
          </h1>

          <p class="text-cyan-300 text-lg tracking-[0.4em] uppercase animate-fade-up-delay">
            Database Deployment Platform
          </p>

          <!-- LOADER -->
          <div class="mt-16 flex justify-center">
            <div class="loader-bar overflow-hidden rounded-full">
              <div class="loader-progress"></div>
            </div>
          </div>

          <p class="mt-5 text-slate-500 tracking-[0.2em] uppercase text-xs">
            Initializing Deployment Services...
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* PREMIUM AMBIENT BACKGROUND */
.ambient-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* GLOW ORBS */
.orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(120px);
  opacity: 0.25;
  animation: floatOrb 6s ease-in-out infinite;
}

.orb1 {
  width: 500px;
  height: 500px;
  background: #06b6d4;
  top: -10%;
  left: -10%;
}

.orb2 {
  width: 600px;
  height: 600px;
  background: #2563eb;
  bottom: -20%;
  right: -10%;
  animation-delay: 3s;
}

.orb3 {
  width: 400px;
  height: 400px;
  background: #0ea5e9;
  top: 40%;
  left: 40%;
  animation-delay: 6s;
}

/* LIGHT BEAMS */
.beam {
  position: absolute;
  width: 40%;
  height: 120%;
  top: -10%;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.04), transparent);

  transform: rotate(25deg);
  filter: blur(10px);
  animation: beamMove 4s linear infinite;
}

.beam1 {
  left: 10%;
}

.beam2 {
  right: 5%;
  animation-delay: 5s;
}

/* FILM GRAIN */
.noise {
  position: absolute;
  inset: 0;
  opacity: 0.035;
  background-image: radial-gradient(circle, white 1px, transparent 1px);
  background-size: 4px 4px;
}

/* ORB MOTION */
@keyframes floatOrb {
  0% {
    transform: translate(0, 0) scale(1);
  }

  25% {
    transform: translate(40px, -20px) scale(1.05);
  }

  50% {
    transform: translate(-20px, 30px) scale(0.95);
  }

  75% {
    transform: translate(30px, 20px) scale(1.03);
  }

  100% {
    transform: translate(0, 0) scale(1);
  }
}

/* LIGHT MOVEMENT */
@keyframes beamMove {
  from {
    transform: translateX(-150px) rotate(25deg);
  }

  to {
    transform: translateX(150px) rotate(25deg);
  }
}

.loader-bar {
  width: 420px;
  height: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.loader-progress {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #06b6d4, #3b82f6, #06b6d4);
  animation: load 4s ease forwards;
  box-shadow: 0 0 30px #06b6d4;
}

@keyframes load {
  from {
    width: 0%;
  }

  to {
    width: 100%;
  }
}

.animate-spin-slow {
  animation: spin 16s linear infinite;
}

.animate-spin-reverse {
  animation: spinReverse 18s linear infinite;
}

@keyframes spinReverse {
  from {
    transform: rotate(360deg);
  }

  to {
    transform: rotate(0deg);
  }
}

.animate-fade-up {
  animation: fadeUp 1s ease forwards;
}

.animate-fade-up-delay {
  opacity: 0;
  animation: fadeUp 1s ease forwards;
  animation-delay: 0.5s;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fall {
  from {
    transform: translateY(-200px);
  }

  to {
    transform: translateY(120vh);
  }
}
</style>
