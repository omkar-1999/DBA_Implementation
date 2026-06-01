<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  CheckCircle2,
  Database,
  Loader2,
  RotateCcw,
  Send,
  Share2,
  X,
} from 'lucide-vue-next'
import DeploymentAttachmentList from '@/components/deployment/DeploymentAttachmentList.vue'
import DeploymentFormField from '@/components/deployment/DeploymentFormField.vue'
import DeploymentShareDialog from '@/components/deployment/DeploymentShareDialog.vue'
import { useDeploymentRequestForm } from '@/composables/useDeploymentRequestForm'
import { useDeploymentStore } from '@/stores/deploymentStore.js'

const router = useRouter()
const route = useRoute()
const deploymentStore = useDeploymentStore()

const submitting = ref(false)
const submitted = ref(false)
const submitError = ref('')
const showShareModal = ref(false)

const isAmend = computed(() => Boolean(route.params.id))
const deploymentId = computed(() => route.params.id)
const pageTitle = computed(() =>
  isAmend.value ? 'Amend Deployment' : 'New Production Database Deployment',
)
const submitLabel = computed(() => {
  if (submitting.value) return isAmend.value ? 'Updating...' : 'Submitting...'
  return isAmend.value ? 'Update Deployment' : 'Submit Deployment Ticket'
})

const {
  formData,
  databases,
  availableUsers,
  availableTeams,
  sharedUsers,
  sharedTeams,
  loading,
  loadError,
  apiBaseUrl,
  hasShareSelection,
  isReadyToSubmit,
  initialize,
  clearAmendData,
  selectDatabase,
  addDeploymentFiles,
  removeDeploymentFile,
  addPastedScreenshots,
  removeScreenshot,
  setSharedUsers,
  setSharedTeams,
  getUserName,
  getTeamName,
  buildSubmissionPayload,
} = useDeploymentRequestForm()

onMounted(async () => {
  try {
    await initialize({ deploymentId: deploymentId.value })
  } catch (error) {
    console.error('Failed to initialize deployment form', error)
  }
})

async function handleSubmit() {
  if (submitting.value || !isReadyToSubmit.value) return

  submitting.value = true
  submitError.value = ''

  try {
    const deployment = buildSubmissionPayload({ deploymentId: deploymentId.value })

    if (isAmend.value) {
      await deploymentStore.amendDeployment(deployment)
    } else {
      deployment.id = `DEP-${Date.now()}`
      await deploymentStore.addDeployment(deployment)
    }

    submitted.value = true

    setTimeout(() => {
      router.push('/')
    }, 800)
  } catch (error) {
    console.error('Deployment submit failed', error)
    submitError.value =
      error.response?.data?.message || 'Unable to submit deployment request. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <main class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <header
        class="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between"
      >
        <div class="flex items-start gap-3">
          <div
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white"
          >
            <Database class="h-5 w-5" />
          </div>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Production change control
            </p>
            <h1 class="mt-1 text-2xl font-semibold text-slate-900">{{ pageTitle }}</h1>
            <p class="mt-1 text-sm text-slate-500">
              Capture database scope, approvals, evidence, and release timing in one request.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            v-if="isAmend"
            type="button"
            @click="clearAmendData"
            class="inline-flex h-9 items-center gap-2 rounded-md border border-rose-200 bg-white px-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
          >
            <RotateCcw class="h-4 w-4" />
            Clear
          </button>

          <button
            type="button"
            @click="router.back()"
            class="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            title="Go back"
          >
            <ArrowLeft class="h-4 w-4" />
          </button>

          <button
            type="button"
            @click="router.back()"
            class="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            title="Close"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </header>

      <div
        v-if="loading"
        class="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
      >
        Loading deployment request...
      </div>

      <div
        v-if="loadError"
        class="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
      >
        {{ loadError }}
      </div>

      <div
        v-if="submitted"
        class="mb-4 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
      >
        <CheckCircle2 class="h-4 w-4" />
        Deployment submitted successfully.
      </div>

      <div
        v-if="submitError"
        class="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
      >
        {{ submitError }}
      </div>

      <form class="space-y-5" @submit.prevent="handleSubmit">
        <section class="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="border-b border-slate-200 px-5 py-4">
            <h2 class="text-base font-semibold text-slate-900">Request Details</h2>
            <p class="text-sm text-slate-500">Core production target and change references.</p>
          </div>

          <div class="grid gap-4 px-5 py-5 md:grid-cols-2">
            <DeploymentFormField label="Production database / system" required>
              <input
                list="databasesList"
                :value="formData.databaseName"
                placeholder="Select production database / system"
                class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                @input="selectDatabase($event.target.value)"
              />
              <datalist id="databasesList">
                <option v-for="db in databases" :key="db.database_id" :value="db.database_name">
                  {{ db.database_name }}
                </option>
              </datalist>
            </DeploymentFormField>

            <DeploymentFormField label="Change Request">
              <input
                v-model="formData.changeRequest"
                placeholder="CR-12345"
                class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </DeploymentFormField>

            <DeploymentFormField label="Reason for Deployment" required>
              <textarea
                v-model="formData.reason"
                rows="3"
                class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 md:col-span-2"
              />
            </DeploymentFormField>

            <DeploymentFormField label="Pull Request Number / URL">
              <input
                v-model="formData.prNumber"
                placeholder="PR number or URL"
                class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </DeploymentFormField>

            <DeploymentFormField label="Deployment URL">
              <input
                v-model="formData.deploymentUrl"
                placeholder="https://deployment-link"
                class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </DeploymentFormField>
          </div>
        </section>

        <section class="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="border-b border-slate-200 px-5 py-4">
            <h2 class="text-base font-semibold text-slate-900">Execution Notes</h2>
            <p class="text-sm text-slate-500">
              SQL script, operational remarks, and release schedule.
            </p>
          </div>

          <div class="grid gap-4 px-5 py-5">
            <DeploymentFormField label="SQL Script">
              <textarea
                v-model="formData.SqlScript"
                rows="6"
                placeholder="Write or paste SQL script here..."
                class="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </DeploymentFormField>

            <DeploymentFormField label="Remarks">
              <textarea
                v-model="formData.Remarks"
                rows="3"
                class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </DeploymentFormField>

            <DeploymentFormField
              label="Schedule Deployment"
              hint="Leave empty for immediate deployment."
            >
              <input
                v-model="formData.scheduleAt"
                type="datetime-local"
                class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 md:max-w-sm"
              />
            </DeploymentFormField>
          </div>
        </section>

        <section class="grid gap-5 lg:grid-cols-2">
          <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <DeploymentAttachmentList
              title="Screenshots"
              mode="screenshots"
              :items="formData.screenshots"
              :base-url="apiBaseUrl"
              empty-text="No screenshots pasted"
              @paste="addPastedScreenshots"
              @remove="removeScreenshot"
            />
          </div>

          <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <DeploymentAttachmentList
              title="Deployment Files"
              mode="files"
              :items="formData.deploymentFiles"
              :base-url="apiBaseUrl"
              empty-text="No deployment files attached"
              @upload="addDeploymentFiles"
              @remove="removeDeploymentFile"
            />
          </div>
        </section>

        <section class="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-base font-semibold text-slate-900">Visibility</h2>
              <p class="text-sm text-slate-500">
                {{
                  hasShareSelection
                    ? `${sharedUsers.length} users and ${sharedTeams.length} teams selected.`
                    : 'Select users and teams who need access.'
                }}
              </p>
            </div>

            <button
              type="button"
              @click="showShareModal = true"
              class="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              <Share2 class="h-4 w-4" />
              Select Users / Teams
            </button>
          </div>

          <div
            v-if="hasShareSelection"
            class="flex flex-wrap gap-2 border-t border-slate-200 px-5 py-4"
          >
            <span
              v-for="userId in sharedUsers"
              :key="`user-${userId}`"
              class="rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
            >
              {{ getUserName(userId) }}
            </span>

            <span
              v-for="teamId in sharedTeams"
              :key="`team-${teamId}`"
              class="rounded-md bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700"
            >
              {{ getTeamName(teamId) }}
            </span>
          </div>
        </section>

        <div class="flex justify-end border-t border-slate-200 pt-5">
          <button
            type="submit"
            :disabled="submitting || !isReadyToSubmit"
            class="inline-flex h-11 min-w-48 items-center justify-center gap-2 rounded-md bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            <Loader2 v-if="submitting" class="h-4 w-4 animate-spin" />
            <Send v-else class="h-4 w-4" />
            {{ submitLabel }}
          </button>
        </div>
      </form>

      <DeploymentShareDialog
        :open="showShareModal"
        :users="availableUsers"
        :teams="availableTeams"
        :selected-users="sharedUsers"
        :selected-teams="sharedTeams"
        @close="showShareModal = false"
        @update:users="setSharedUsers"
        @update:teams="setSharedTeams"
      />
    </main>
  </div>
</template>
