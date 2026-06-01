<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  newComment: {
    type: String,
    default: '',
  },
  commentFiles: {
    type: Array,
    default: () => [],
  },
  commentScreenshots: {
    type: Array,
    default: () => [],
  },
  showScreenshotPlaceholder: {
    type: Boolean,
    required: true,
  },
})

defineEmits([
  'close',
  'submit',
  'update:newComment',
  'paste-screenshots',
  'focus-screenshots',
  'blur-screenshots',
  'upload-files',
  'remove-file',
  'remove-screenshot',
])
</script>

<template>
  <div v-if="show" class="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center">
    <div class="bg-white w-[95vw] max-w-7xl h-[95vh] overflow-y-auto rounded-2xl p-8 shadow-2xl relative">
      <!-- CLOSE -->
      <button @click="$emit('close')" class="absolute top-3 right-3 text-gray-500">✕</button>

      <h2 class="text-lg font-semibold mb-4">Add Comment</h2>

      <!-- COMMENT -->
      <textarea
        :value="newComment"
        @input="$emit('update:newComment', $event.target.value)"
        placeholder="Enter your comment..."
        class="w-full border rounded-lg p-3 mb-3"
      ></textarea>

      <!-- SCREENSHOT PASTE -->
      <!-- Correct: No space inside tags -->
      <div
        contenteditable
        @paste="$emit('paste-screenshots', $event)"
        @focus="$emit('focus-screenshots')"
        @blur="$emit('blur-screenshots', $event)"
        class="w-full min-h-[120px] border border-slate-300 rounded-lg p-3 mb-3 overflow-auto relative"
      >
        <span v-if="showScreenshotPlaceholder" class="text-gray-400 pointer-events-none">
          Screenshots...
        </span>
      </div>

      <div v-if="commentScreenshots.length" class="mb-3">
        <div
          v-for="(img, index) in commentScreenshots"
          :key="index"
          class="flex justify-between bg-slate-50 border px-3 py-1 rounded mb-1 text-sm"
        >
          Screenshot {{ index + 1 }}
          <button @click="$emit('remove-screenshot', index)" class="text-red-500">Remove</button>
        </div>
      </div>

      <!-- FILE UPLOAD -->
      <input
        type="file"
        multiple
        @change="$emit('upload-files', $event)"
        class="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
      />

      <div v-if="commentFiles.length" class="mb-3">
        <div
          v-for="(file, index) in commentFiles"
          :key="index"
          class="flex justify-between bg-slate-50 border px-3 py-1 rounded mb-1 text-sm"
        >
          {{ file.name }}
          <button @click="$emit('remove-file', index)" class="text-red-500">Remove</button>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="flex justify-end mt-4 gap-2">
        <button @click="$emit('close')" class="px-4 py-2 bg-gray-300 rounded">Cancel</button>

        <button @click="$emit('submit')" class="px-4 py-2 bg-blue-600 text-white rounded">
          Submit
        </button>
      </div>
    </div>
  </div>
</template>
