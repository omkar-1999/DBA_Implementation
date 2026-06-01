<script setup>
import { FileText, Image, Paperclip, Trash2 } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
  baseUrl: {
    type: String,
    default: '',
  },
  mode: {
    type: String,
    default: 'files',
    validator: (value) => ['files', 'screenshots'].includes(value),
  },
  emptyText: {
    type: String,
    default: 'No attachments added',
  },
})

const emit = defineEmits(['upload', 'remove', 'paste'])

function handleUpload(event) {
  emit('upload', event)
}

function handlePaste(event) {
  emit('paste', event)
}
</script>

<template>
  <section class="space-y-3">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h3 class="text-sm font-semibold text-slate-800">{{ title }}</h3>
        <p class="text-xs text-slate-500">
          {{
            mode === 'screenshots'
              ? 'Paste screenshots directly from clipboard.'
              : 'Attach release scripts or supporting evidence.'
          }}
        </p>
      </div>

      <div class="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-slate-500">
        <Image v-if="mode === 'screenshots'" class="h-4 w-4" />
        <Paperclip v-else class="h-4 w-4" />
      </div>
    </div>

    <div
      v-if="mode === 'screenshots'"
      contenteditable
      role="textbox"
      aria-label="Paste screenshots"
      @paste="handlePaste"
      class="min-h-28 rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-500 focus:bg-white focus:ring-2 focus:ring-slate-200"
    />

    <input
      v-else
      type="file"
      multiple
      @change="handleUpload"
      class="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
    />

    <div class="space-y-2">
      <div
        v-for="(item, index) in items"
        :key="item.url || item.name || index"
        class="flex min-h-11 items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
      >
        <div class="flex min-w-0 items-center gap-2">
          <FileText class="h-4 w-4 shrink-0 text-slate-400" />

          <a
            v-if="item.url"
            :href="`${baseUrl}${item.url}`"
            target="_blank"
            rel="noreferrer"
            class="truncate font-medium text-blue-700 underline-offset-2 hover:underline"
          >
            {{ item.name || `Attachment ${index + 1}` }}
          </a>

          <span v-else class="truncate font-medium text-slate-700">
            {{
              item.name ||
              (mode === 'screenshots' ? `Screenshot ${index + 1}` : `Attachment ${index + 1}`)
            }}
          </span>
        </div>

        <button
          type="button"
          @click="emit('remove', index)"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
          title="Remove attachment"
        >
          <Trash2 class="h-4 w-4" />
        </button>
      </div>

      <p
        v-if="!items.length"
        class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
      >
        {{ emptyText }}
      </p>
    </div>
  </section>
</template>
