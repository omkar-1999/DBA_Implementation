<script setup>
import { useDeploymentForm } from "@/composables/useDeploymentForm";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseTextarea from "@/components/ui/BaseTextarea.vue";
import BaseAlert from "@/components/ui/BaseAlert.vue";
import { useDeploymentStore } from '@/stores/deploymentStore';
import { v4 as uuidv4 } from 'uuid'

const {
  submitted,
  useCustomDatabase,
  uploadedFiles,
  formData,
  databases,
  addFiles,
  removeFile,
  isFormValid,
  submit
} = useDeploymentForm();
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">

    <div>
      <h1 class="text-2xl font-semibold">New Production Deployment</h1>
      <p class="text-muted-foreground">
        Submit a new production database deployment request
      </p>
    </div>

    <BaseAlert v-if="submitted" type="success">
      Deployment ticket submitted successfully!
    </BaseAlert>

    <BaseCard>
      <div class="space-y-6">

        <!-- Database -->
        <div>
          <label class="block mb-2">Production Database *</label>

          <BaseInput
            v-if="useCustomDatabase"
            v-model="formData.customDatabaseName"
            placeholder="Enter custom database name"
          />

          <select
            v-else
            v-model="formData.database"
            class="input"
          >
            <option value="">Select database</option>
            <option v-for="db in databases" :key="db" :value="db">
              {{ db }}
            </option>
          </select>

          <button
            type="button"
            class="text-primary mt-2 text-sm"
            @click="useCustomDatabase = !useCustomDatabase"
          >
            {{ useCustomDatabase ? "Select from list" : "Enter custom name" }}
          </button>
        </div>

        <!-- URL -->
        <BaseInput
          v-model="formData.deploymentUrl"
          placeholder="Deployment URL"
        />

        <!-- File Upload -->
        <input
          type="file"
          multiple
          @change="e => addFiles(e.target.files)"
        />

        <div v-if="uploadedFiles.length" class="space-y-2">
          <div
            v-for="(file, i) in uploadedFiles"
            :key="i"
            class="flex justify-between p-3 bg-muted rounded"
          >
            <span>{{ file.name }}</span>
            <button @click="removeFile(i)">Remove</button>
          </div>
        </div>

        <!-- Reason -->
        <BaseTextarea
          v-model="formData.deploymentReason"
          placeholder="Reason for deployment"
        />

        <!-- Submit -->
        const { addDeployment } = useDeploymentStore()

const handleSubmit = () => {
  const newDeployment = {
    id: `DEP-${Math.floor(Math.random() * 10000)}`,
    database: formData.database || formData.customDatabaseName,
    requestedBy: "Demo User",
    date: new Date().toISOString().split('T')[0],
    status: "Pending",
    changeRequest: formData.changeRequest,
    prNumber: formData.prNumber,
    reason: formData.deploymentReason
  }

  addDeployment(newDeployment)

  alert("Deployment Submitted Successfully!")

  // Optional: reset form
}

      </div>
    </BaseCard>
  </div>
</template>