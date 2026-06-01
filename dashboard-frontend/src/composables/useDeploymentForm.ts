import { ref, computed } from "vue";

export function useDeploymentForm() {
  const submitted = ref(false);
  const useCustomDatabase = ref(false);
  const uploadedFiles = ref<File[]>([]);

  const formData = ref({
    database: "",
    customDatabaseName: "",
    deploymentUrl: "",
    deploymentReason: "",
    changeRequest: "",
    prNumber: "",
    prApprovalUrl: ""
  });

  const databases = ["Shipwatch", "Engine", "BAO"];

  function addFiles(files: FileList) {
    uploadedFiles.value.push(...Array.from(files));
  }

  function removeFile(index: number) {
    uploadedFiles.value.splice(index, 1);
  }

  const isFormValid = computed(() => {
    const hasDatabase = useCustomDatabase.value
      ? formData.value.customDatabaseName.trim()
      : formData.value.database;

    return hasDatabase && formData.value.deploymentReason.trim();
  });

  function resetForm() {
    formData.value = {
      database: "",
      customDatabaseName: "",
      deploymentUrl: "",
      deploymentReason: "",
      changeRequest: "",
      prNumber: "",
      prApprovalUrl: ""
    };
    uploadedFiles.value = [];
    useCustomDatabase.value = false;
  }

  function submit() {
    submitted.value = true;
    setTimeout(() => {
      submitted.value = false;
      resetForm();
    }, 5000);
  }

  return {
    submitted,
    useCustomDatabase,
    uploadedFiles,
    formData,
    databases,
    addFiles,
    removeFile,
    isFormValid,
    submit
  };
}