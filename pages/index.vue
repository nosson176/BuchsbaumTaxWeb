<template>
  <div class="min-h-screen flex flex-col relative">
    <Header />
    <Home />
    <LogHandler />

    <!-- Loading overlay with spinner -->
    <div v-if="isLoading" class="overlay">
      <div class="spinner"></div>
    </div>

    <!-- Error message (optional) -->
    <div v-if="error" class="flex justify-center items-center text-red-500">
      <p>Error fetching data: {{ error }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { models } from '~/shared/constants'

export default {
  name: 'IndexPage',
  data() {
    return {
      isLoading: false,  // Track loading state
      error: null,       // Track errors
    }
  },
  fetch() {
    if (!this.clients || Object.keys(this.clients).length === 0) this.$api.getClientList(this.headers)
  },
  computed: {
    ...mapState([models.clientSearchValue, models.smartviews, models.clients, models.currentUser]),
    headers() {
      return this.$api.getHeaders()
    },
  },
  async mounted() {
    this.isLoading = true; // Set loading state

    try {
      // Initialize an array of API requests
      const apiRequests = [
        this.$api.getValueTypes(this.headers),
        this.$api.getAllUsers(this.headers),
        this.$api.getValueTaxGroups(this.headers),
        this.$api.getClientsHistory(this.headers),
        this.$api.getTodayLogs(this.headers),
      ];

      // // Conditionally add getSmartviews if smartviews is empty
      // if (!this.smartviews || Object.keys(this.smartviews).length === 0) {
      //   apiRequests.push(this.$api.getSmartviews(this.headers));
      // }
      if (!this.currentUser || Object.keys(this.currentUser).length === 0) {
        apiRequests.push(this.$api.getCurrentUser(this.headers));
      }

      // Execute all API requests
      await Promise.all(apiRequests);
    } catch (error) {
      console.error("Error fetching data:", error);
      this.error = error.message || 'An unknown error occurred.';
    } finally {
      this.isLoading = false; // Reset loading state
    }
  }

}
</script>

<style scoped>
/* Overlay styles */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #fff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
