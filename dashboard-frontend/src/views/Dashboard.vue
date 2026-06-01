<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import EnterpriseIntro from '@/components/EnterpriseIntro.vue'
import EnterpriseLoader from '@/components/EnterpriseLoader.vue'
import StatusCards from '@/components/dashboard/StatusCards.vue'
import DeploymentTable from '@/components/dashboard/DeploymentTable.vue'
import DeploymentDetails from '@/components/dashboard/DeploymentDetails.vue'
import ApprovalModal from '@/components/dashboard/ApprovalModal.vue'
import ShareModal from '@/components/dashboard/ShareModal.vue'
import CommentModal from '@/components/dashboard/CommentModal.vue'
import ImagePreviewModal from '@/components/dashboard/ImagePreviewModal.vue'
import { useDeploymentStore } from '@/stores/deploymentStore.js'
import { useLoaderStore } from '@/stores/loaderStore'
import { userService } from '@/services/userService'
import { useDeploymentFilters } from '@/composables/useDeploymentFilters'
import { useDeploymentDetails } from '@/composables/useDeploymentDetails'
import { useApprovalFlow } from '@/composables/useApprovalFlow'
import { useCommentActions } from '@/composables/useCommentActions'
import { useDeploymentActions } from '@/composables/useDeploymentActions'
import { useFileHandlers } from '@/composables/useFileHandlers'
import { usePermissions } from '@/composables/usePermissions'
import { handleError } from '@/utils/errorHandler'

const loaderStore = useLoaderStore()
const store = useDeploymentStore()
const router = useRouter()

const showIntro = ref(true)
const globalLoading = computed(() => loaderStore.isLoading)

const currentUser = ref(null)
const availableUsers = ref([])
const availableTeams = ref([])
const availableApprovers = ref([])
const selected = ref(null)
const sharedUsers = ref([])
const sharedTeams = ref([])

const {
  showScreenshotPlaceholder,
  showImageModal,
  selectedImage,
  copyText,
  downloadFile,
  openImageModal,
  closeImageModal,
  onScreenshotFocus,
  onScreenshotBlur,
  appendUploadedFiles,
  pasteScreenshots,
} = useFileHandlers()

const {
  deploymentFiles,
  screenshots,
  expandedAudit,
  expandedData,
  loadSelectedAssets,
  loadSelectedAudit,
  refreshAllData,
  loadVersionDetails,
} = useDeploymentDetails(store, selected, sharedUsers, sharedTeams)

const {
  showCommentModal,
  newComment,
  commentFiles,
  commentScreenshots,
  openCommentModal,
  removeCommentFile,
  removeCommentScreenshot,
  submitCommentAction,
} = useCommentActions(currentUser, refreshAllData)

const { showApprovalModal, selectedApprovers, sendForApproval } = useApprovalFlow(
  selected,
  currentUser,
  refreshAllData,
)

const { showShareModal, pamInput, selectDeployment, saveSharing, handlePamAdd, executeAction } =
  useDeploymentActions(store, selected, currentUser, sharedUsers, sharedTeams, refreshAllData)

const permissions = usePermissions(currentUser, selected)
const permissionFlags = computed(() => ({
  isClosed: permissions.isClosed.value,
  isDba: permissions.isDba.value,
  isDev: permissions.isDev.value,
  isApproverUser: permissions.isApproverUser.value,
  canLock: permissions.canLock.value,
  canSendForApproval: permissions.canSendForApproval.value,
  canApprove: permissions.canApprove.value,
  canReject: permissions.canReject.value,
  canRequesterReview: permissions.canRequesterReview.value,
  canCompleteAsDba: permissions.canCompleteAsDba.value,
  canAmend: permissions.canAmend.value,
}))

const {
  selectedDatabase,
  developerFilter,
  activeStatus,
  filteredDeployments,
  statusCounts,
  hasPendingApprovals,
} = useDeploymentFilters(store, currentUser, selected)

const copyDeploymentDetails = async () => {
  if (!selected.value) return

  await copyText(
    `Database : ${selected.value.database || ''}
Reason : ${selected.value.reason || ''}
Change Request : ${selected.value.changeRequest || ''}`,
    'Deployment details',
  )
}

const goToDashboard = () => {
  router.push('/')
  selected.value = null
}

const goToNewDeployment = () => {
  router.push('/new-deployment')
}

const goToAmend = (id) => {
  router.push(`/amend-deployment/${id}`)
}

const loadDashboardBootstrap = async () => {
  try {
    const [user, dashboardUsers] = await Promise.all([
      userService.getCurrentUser(),
      userService.getDashboardUsers(),
      store.fetchDeployments(),
    ])

    currentUser.value = user
    availableUsers.value = dashboardUsers.users
    availableTeams.value = dashboardUsers.teams
    availableApprovers.value = dashboardUsers.approvers
  } catch (error) {
    handleError(error, 'Failed to load dashboard')
  }
}

const viewDeploymentDetails = (log, index) => {
  return loadVersionDetails(log, index, selected.value?.version_number)
}

const toggleAmendDetails = (log, index) => {
  return loadVersionDetails(log, index, log.version_number)
}

watch(selected, async (deployment) => {
  if (!deployment) return

  await Promise.all([loadSelectedAssets(deployment), loadSelectedAudit(deployment)])
})

watch(selected, (deployment) => {
  console.log('SELECTED >>>', deployment)
})

onMounted(loadDashboardBootstrap)
</script>

<template>
  <EnterpriseIntro v-if="showIntro" @finished="showIntro = false" />
  <EnterpriseLoader v-if="!showIntro" :loading="globalLoading" />

  <div v-if="!showIntro" class="min-h-screen bg-[#f8fafc] relative overflow-hidden">
    <!-- Corporate Header -->
    <div class="bg-white border-b shadow-sm px-8 py-4 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <!-- Logo -->
        <img
          src="@/assets/logo.png"
          alt="Navig8"
          class="h-10 cursor-pointer"
          @click="goToDashboard"
        />

        <div>
          <h1 class="text-2xl font-semibold text-slate-800">Production Deployment Dashboard</h1>
          <p class="text-sm text-slate-500">Enterprise Database Release Management</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button
          @click="goToNewDeployment"
          class="bg-slate-600 hover:bg-slate-900 text-white px-5 py-2 rounded-md text-sm font-medium transition"
        >
          + New Deployment
        </button>

        <button
          @click="router.push('/history')"
          class="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-md text-sm font-medium transition"
        >
          View History
        </button>
      </div>
    </div>

    <div class="p-8">
      <!-- KPI Status Cards -->
      <StatusCards
        :counts="statusCounts"
        :has-pending-approvals="hasPendingApprovals"
        @select-status="activeStatus = $event"
      />

      <!-- Table Section -->
      <DeploymentTable
        :deployments="filteredDeployments"
        @select-deployment="selectDeployment"
      />

      <!-- Details Panel -->
      <DeploymentDetails
        v-if="selected"
        :selected="selected"
        :current-user="currentUser"
        :workflow-actions="store.workflowActions || []"
        :screenshots="screenshots"
        :deployment-files="deploymentFiles"
        :comments="store.comments"
        :expanded-audit="expandedAudit"
        :expanded-data="expandedData"
        :permissions="permissionFlags"
        :shared-users="sharedUsers"
        :shared-teams="sharedTeams"
        :pam-input="pamInput"
        @copy-details="copyDeploymentDetails"
        @execute-action="executeAction"
        @preview="openImageModal"
        @download="downloadFile"
        @copy-sql="copyText($event, 'SQL')"
        @comment-action="openCommentModal"
        @show-approval="showApprovalModal = true"
        @show-share="showShareModal = true"
        @update:pam-input="pamInput = $event"
        @add-pam="handlePamAdd"
        @amend="goToAmend"
        @view-details="viewDeploymentDetails"
        @view-amend-details="toggleAmendDetails"
        @collapse-audit="expandedAudit = null"
      />
    </div>
  </div>

  <ApprovalModal
    :show="showApprovalModal"
    :approvers="availableApprovers"
    :selected-approvers="selectedApprovers"
    @close="showApprovalModal = false"
    @send="sendForApproval"
    @update:selected-approvers="selectedApprovers = $event"
  />

  <ShareModal
    :show="showShareModal"
    :users="availableUsers"
    :teams="availableTeams"
    :shared-users="sharedUsers"
    :shared-teams="sharedTeams"
    @close="showShareModal = false"
    @save="saveSharing"
    @update:users="sharedUsers = $event"
    @update:teams="sharedTeams = $event"
  />

  <CommentModal
    :show="showCommentModal"
    :new-comment="newComment"
    :comment-files="commentFiles"
    :comment-screenshots="commentScreenshots"
    :show-screenshot-placeholder="showScreenshotPlaceholder"
    @close="showCommentModal = false"
    @submit="submitCommentAction"
    @update:new-comment="newComment = $event"
    @paste-screenshots="pasteScreenshots($event, commentScreenshots)"
    @focus-screenshots="onScreenshotFocus"
    @blur-screenshots="onScreenshotBlur($event, commentScreenshots)"
    @upload-files="appendUploadedFiles($event, commentFiles)"
    @remove-file="removeCommentFile"
    @remove-screenshot="removeCommentScreenshot"
  />

  <ImagePreviewModal
    :show="showImageModal"
    :image="selectedImage"
    @close="closeImageModal"
  />
</template>
