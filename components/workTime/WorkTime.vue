<template>
  <div class="flex h-screen bg-gray-100">
    <div class="flex-1 p-8 overflow-auto">
      <!-- Date range and user selection controls -->
      <div class="mb-4 flex items-center space-x-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">From:</label>
          <input type="date" v-model="startRangeFormatted" @change="inputChangeStart"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">To:</label>
          <input type="date" v-model="endRangeFormatted" @change="inputChangeEnd"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <div v-if="isCurrentUserAdmin">
          <label class="block text-sm font-medium text-gray-700">User:</label>
          <select v-model="selectedUser"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <option value="" selected>{{ this.currentUser.username }}</option>
            <option v-for="user in usersList" :key="user.id" :value="user.id">{{ user.username }}</option>
          </select>
        </div>
        <div class="flex items-center pt-6">
          <button @click="filterSelectFunc"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Search
          </button>
        </div>
      </div>

      <!-- Timesheet -->
      <div class="bg-white shadow rounded-lg">
        <!-- Timesheet header -->
        <div class="flex justify-between items-center px-6 py-4 border-b">
          <h2 class="text-xl font-semibold">Timesheet</h2>
          <div class="flex items-center space-x-2">
            <span>All activity</span>
            <span>from {{ formatDate(startRangeFormatted) }} - {{ formatDate(endRangeFormatted) }}</span>
            <span>for {{ this.userNameSearch || 'All users' }}</span>
          </div>
          <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded">
            Actions
          </button>
        </div>

        <!-- Display a message if workTimesData is empty -->
        <div v-if="workTimesData.length === 0" class="p-4">
          <p class="text-center text-gray-600">No work times available for the selected date range and user.</p>
        </div>

        <div v-else>
          <div v-for="(day, index) in workTimesData" :key="index" class="border-b last:border-b-0">
            <div class="px-6 py-4">
              <h3 class="text-lg font-semibold text-gray-700">{{ (day.date) }}</h3>
            </div>
            <div v-for="(user, userIndex) in day.users" :key="userIndex"
              :class="['flex items-center px-6 py-5', { 'bg-gray-50': userIndex % 2 !== 0 }]">
              <div class="w-8 h-8 rounded-full text-white font-bold flex items-center justify-center mr-4"
                :class="getUserColor(user.username)">
                {{ user.username[0] }}
              </div>
              <span class="w-40 text-sm">{{ user.username }}</span>
              <div class="flex items-center space-x-2 w-24">
                <span class="text-green-500 text-xs">●</span>
                <input type="text" v-model="user.startTime" @change="onBlur(user, 'startTime')"
                  class="bg-transparent text-sm w-16 focus:outline-none border-0 cursor-pointer" />
              </div>
              <div class="flex items-center space-x-2 w-24">
                <span class="text-red-500 text-xs">●</span>
                <input type="text" v-model="user.endTime" @change="onBlur(user, 'endTime')"
                  class="bg-transparent text-sm w-16 focus:outline-none border-0 cursor-pointer" />
              </div>
              <span class="w-32 text-sm text-gray-600">{{ calculateDurationUnixToHHmm(user.sumHoursWork) }}</span>
            </div>
            <!-- Total hours for the day -->
            <div class="flex justify-end px-6 py-2 bg-gray-100">
              <span v-if="fetchAll === false" class="font-semibold text-gray-700">{{ sumHourForEachDate(day, index)
                }}</span>
            </div>
          </div>
          <div class="flex justify-end px-6 pt-7 pb-2 ">
            <span class="font-bold text-gray-700">{{ sumHourForAllRange(workTimesData) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { models, USER_TYPE_ADMIN } from '~/shared/constants';
import { formatDate } from '~/shared/utility';

export default {
  name: 'TimesheetComponent',
  data() {
    const now = new Date()
    return {
      workTimesData: [],
      selectedUser: "",
      // users: [],
      usersList: [],
      isAdmin: false,
      fetching: false,
      fetchAll: false,
      userNameSearch: "",
      startRange: new Date(now.getFullYear(), now.getMonth()).getTime(),
      endRange: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime(),
      tempStartRange: new Date(now.getFullYear(), now.getMonth()).toISOString().slice(0, 10),
      tempEndRange: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString().slice(0, 10),
      previousValues: {}
    };
  },
  computed: {
    ...mapState([models.currentUser, models.users]),
    headers() {
      return this.$api.getHeaders()
    },
    isCurrentUserAdmin() {
      return this.currentUser && this.currentUser.userType === USER_TYPE_ADMIN;
    },
    startRangeFormatted() {
      return new Date(this.startRange).toISOString().slice(0, 10);
    },
    endRangeFormatted() {
      return new Date(this.endRange).toISOString().slice(0, 10);
    }

  },
  watch: {
    currentUser: {
      handler(newVal) {
        if (newVal && newVal.id && !this.fetching) {
          this.fetchCurrentUserWorkTimes(); // Fetch data when currentUser changes
          this.userNameSearch = this.currentUser.username;
          if (this.isCurrentUserAdmin) {
            this.fetchUsers()
          }
        }
      },
      immediate: true
    }
  },
  async mounted() {
    if (!this.currentUser || !Object.keys(this.currentUser).length) {
      await this.$api.getCurrentUser(this.headers)
    }
    // this.$api.getCurrentUser(this.headers)
    this.isAdmin = this.isCurrentUserAdmin; // Update admin flag
  },
  methods: {
    sumHourForEachDate(day) {
      console.log(day)
      const entries = Object.values(day);
      const sum = entries[1].reduce((acc, el) => acc + el.sumHoursWork, 0);
      return this.calculateDurationUnixToHHmm(sum);
    },

    sumHourForAllRange(workTimes) {
      const entries = Object.values(workTimes);

      const sum = entries.reduce((acc, el) => {
        // Sum the hours for all users in the current entry
        const usersSum = el.users.reduce((userAcc, user) => {
          return userAcc + user.sumHoursWork;
        }, 0);

        return acc + usersSum;
      }, 0);

      return this.calculateDurationUnixToHHmm(sum);
    },

    formatDate(date) {
      return formatDate(date,); // Adjust according to your function's signature
    },

    filteredUsers(users) {
      const usersArray = Object.values(users);

      // Add "All users" option if the current user is an admin
      if (this.isCurrentUserAdmin) {
        usersArray.push({ username: "All users", id: 0 });
      }

      // Filter out the current user
      const filteredArray = usersArray.filter(user => user.id !== this.currentUser?.id);

      // Sort alphabetically by username but always keep "All users" at the top
      return filteredArray.sort((a, b) => {
        if (a.username === "All users") return -1; // "All users" comes first
        if (b.username === "All users") return 1;
        return a.username.localeCompare(b.username); // Sort the rest alphabetically
      });
    },

    async fetchUsers() {
      try {
        // Fetch users only if not already fetched
        if (!this.Users || Object.keys(this.Users).length === 0) {
          // const headers = this.$api.getHeaders();
          const users = await this.$api.getAllUsers(this.headers);
          this.usersList = this.filteredUsers(users);
        } else {
          this.usersList = this.filteredUsers(this.Users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },

    inputChangeStart(event) {
      this.tempStartRange = event.target.value;
    },

    inputChangeEnd(event) {
      this.tempEndRange = event.target.value;
    },

    onBlur(workTime) {
      if (!this.isCurrentUserAdmin) return;

      // Extract the date and time parts
      const [startHours, startMinutes] = workTime.startTime.split(':').map(Number);
      const [endHours, endMinutes] = workTime.endTime.split(':').map(Number);

      // Get the date of the work time
      const date = new Date(workTime.date); // Assuming workTime.date is already a proper date

      // Set the time for the startTime and endTime using the parsed hours and minutes
      const startTimeDate = new Date(date);
      startTimeDate.setHours(startHours, startMinutes, 0, 0); // hh, mm, ss, ms

      const endTimeDate = new Date(date);
      endTimeDate.setHours(endHours, endMinutes, 0, 0); // hh, mm, ss, ms

      // Convert startTimeDate to Unix timestamp in milliseconds
      const startTimeUnix = startTimeDate.getTime();

      // Convert endTimeDate to milliseconds directly
      const endTimeMillis = endTimeDate.getTime();

      // Calculate the duration in milliseconds
      const durationMillis = endTimeMillis - startTimeUnix;
      // Prepare the updated work time object
      const updatedWorkTime = {
        ...workTime,
        startTime: startTimeUnix,
        endTime: endTimeMillis,
        sumHoursWork: durationMillis
      };

      // Now, send updatedWorkTime to the server
      this.updateWorkTime(updatedWorkTime);
    },

    async updateWorkTime(workTime) {
      try {
        const headers = this.$api.getHeaders();
        await this.$api.updateWorkTimeByWorkTimeId(headers, workTime, this.currentUser);
        // Refresh the data or handle the response accordingly
      } catch (error) {
        console.error('Error updating work time:', error);
      }
    },

    async fetchByUserId() {
      if (this.selectedUser === "") {
        this.selectedUser = this.currentUser.id
      }
      try {
        const headers = this.$api.getHeaders();
        const response = await this.$api.getTimeWorksByMonthAndUserId(headers, this.selectedUser, this.startRange, this.endRange)
        this.userNameSearch = response[0].username
        if (typeof response === 'number') {
          this.workTimesData = []
          return
        }
        this.workTimesData = this.formatTimes(response);
      } catch (error) {
        console.error("error", error)
      }
    },

    filterSelectFunc() {
      this.startRange = new Date(this.tempStartRange).getTime();
      this.endRange = new Date(this.tempEndRange).getTime();

      if (this.selectedUser === 0) return this.fetchAllWorkTimes()
      if (this.selectedUser !== 0 && this.selectedUser !== null) return this.fetchByUserId()
    },

    async fetchCurrentUserWorkTimes() {
      if (!this.currentUser || !this.currentUser.id || this.fetching) return;
      this.fetching = true; // Set flag to indicate fetching is in progress
      try {
        const headers = this.$api.getHeaders();
        const response = await this.$api.getTimeWorksByMonthAndUserId(headers, this.currentUser.id, this.startRange, this.endRange);
        this.workTimesData = this.formatTimes(response);
      } catch (error) {
        console.error('Error fetching work times:', error);
      } finally {
        this.fetching = false; // Reset flag after fetching
      }
    },

    async fetchAllWorkTimes() {
      if (!this.currentUser || !this.currentUser.id) return;
      try {
        const headers = this.$api.getHeaders();
        const response = await this.$api.getAllTimeWorksByDate(headers, this.startRange, this.endRange);
        this.userNameSearch = "All Users"
        this.workTimesData = this.formatTimes(response);
        this.fetchAll = true
      } catch (error) {
        console.error('Error fetching work times:', error);
      }
    },



    formatTimes(response) {
      const entries = Object.values(response);
      if (this.userNameSearch === "All Users") this.calculateDurationSum(entries)
      const groupedByDate = entries.reduce((acc, entry) => {
        const date = this.formatDateFunc(entry.date);
        if (!acc[date]) {
          acc[date] = { date, users: [] };
        }
        acc[date].users.push({
          ...entry,
          startTime: this.formatToHHmm(entry.startTime),
          endTime: this.formatToHHmm(entry.endTime),
        });
        return acc;
      }, {});
      return Object.values(groupedByDate);
    },

    calculateDurationSum(data) {
      // Convert milliseconds to minutes and sum up
      const totalMinutes = data.reduce((acc, item) => acc + (item.sumHoursWork / 60000), 0);

      // Convert total minutes into hours and minutes
      Math.floor(totalMinutes / 60);
      Math.round(totalMinutes % 60);
    },

    formatDateFunc(date) {
      const d = new Date(date);
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      return d.toLocaleDateString('en-US', options);
    },

    formatToHHmm(time) {
      if (!time) return '';
      const d = new Date(time);
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    },

    calculateDurationUnixToHHmm(duration) {
      const totalSeconds = Math.floor(duration / 1000);
      // Calculate hours and minutes
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);

      return `${hours} hours, ${minutes} minutes`;
    },

    getUserColor(name) {
      const colors = {
        'Dorothy Gale': 'bg-purple-500',
        'Marion Ravenwood': 'bg-green-500',
        'Mary Poppins': 'bg-blue-500',
        'Don Corleone': 'bg-orange-500',
        'Jason Ho': 'bg-yellow-500',
        'Hermione Granger': 'bg-pink-500',
        'Mulan Fa': 'bg-indigo-500'
      };
      return colors[name] || 'bg-gray-500';
    },
  }
};
</script>