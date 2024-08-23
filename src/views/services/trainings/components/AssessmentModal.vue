<template>
  <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
    <ion-content>
      <div class="form-container">
        <ion-list>
          <!-- Input fields -->
          <ion-item>
            <ion-label position="stacked">End Date</ion-label>
            <ion-input
              v-model="form.endDate"
              placeholder="Select End Date"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Delivery Location</ion-label>
            <ion-input
              v-model="form.deliveryLocation"
              placeholder="Enter Location"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Delivery Method</ion-label>
            <ion-input
              v-model="form.deliveryMethod"
              placeholder="Enter Method"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Status</ion-label>
            <ion-input
              v-model="form.status"
              placeholder="Enter Status"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Training Materials</ion-label>
            <ion-input
              v-model="form.trainingMaterials"
              placeholder="Enter Materials"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Description</ion-label>
            <ion-textarea
              v-model="form.description"
              placeholder="Enter Description"
            ></ion-textarea>
          </ion-item>

          <!-- Button Section -->
          <div class="button-group">
            <ion-button expand="block" color="light" @click="closeModal"
              >Cancel</ion-button
            >
            <ion-button expand="block" color="primary" @click="submitAssessment"
              >Take Assessment</ion-button
            >
          </div>
        </ion-list>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script>
export default {
  data() {
    return {
      isModalOpen: false,
      form: {
        endDate: "",
        deliveryLocation: "",
        deliveryMethod: "",
        status: "",
        trainingMaterials: "",
        description: "",
      },
    };
  },
  methods: {
    closeModal() {
      this.isModalOpen = false;
    },
    openModal() {
      this.isModalOpen = true;
    },
    submitAssessment() {
      // Logic to handle assessment submission
      this.closeModal();
    },
  },
};
</script>

<style scoped>
.form-container {
  padding: 16px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
