<template>
    <div>
        <!-- Tooltip Container -->
        <div v-if="showTooltip" class="tooltip-container">
            <div v-for="log in matchingLogs" :key="log.id" class="tooltip">
                <p><strong>Alarm for Client ID:</strong> {{ log.clientName }}</p>
                <p><strong>Note:</strong> {{ log.note }}</p>
                <button @click="handleConfirm(log)">Confirm</button>
                <button @click="handleClose(log)">Close</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import dayjs from 'dayjs'
import { models, mutations } from '~/shared/constants';

export default {
    name: 'LogHandler',

    data() {
        return {
            filteredLogs: [], // Holds the filtered and sorted logs
            matchingLogs: [], // Stores logs matching the current time
            showTooltip: false, // Controls visibility of the tooltip
            intervalId: null, // Interval ID for checking every minute
        }
    },

    computed: {
        ...mapState([
            models.dayLogs,
            models.currentUser,
            models.clients
        ]),

        logsArray() {
            console.log(Object.values(this.dayLogs))
            return this.dayLogs ? Object.values(this.dayLogs) : []
        },

        headers() {
            return this.$api.getHeaders()
        },
    },

    watch: {
        [models.dayLogs]: {
            deep: true,
            immediate: true,
            handler(newDayLogs) {
                console.log(newDayLogs)
                this.filterAndSortLogs(Object.values(newDayLogs));

            }
        }
    },

    methods: {
        filterAndSortLogs(logs) {
            const currentUser = this.currentUser
            if (!currentUser) {
                console.error('Current user is not defined')
                return
            }

            this.filteredLogs = logs
                .filter(log => log.alarmUserName === currentUser.username)
                .sort((a, b) =>
                    dayjs(a.alarmTime, 'DD-MM-YYYY HH:mm').diff(dayjs(b.alarmTime, 'DD-MM-YYYY HH:mm'))
                )

            if (!this.intervalId) {
                this.startLogCheckingInterval()
            }
        },

        startLogCheckingInterval() {
            this.intervalId = setInterval(() => {
                const currentTime = dayjs().format('DD-MM-YYYY HH:mm')
                // Find logs matching the current time
                const newMatches = this.filteredLogs.filter(log => {
                    return log.alarmTime === currentTime
                })

                if (newMatches.length > 0) {
                    // Add new matches to the existing matchingLogs and remove from filteredLogs
                    this.matchingLogs.push(...newMatches)
                    this.filteredLogs = this.filteredLogs.filter(log => !newMatches.includes(log))

                    const clientsArray = Object.values(this.clients);

                    // Map logs to display names instead of IDs
                    this.matchingLogs.forEach(log => {
                        const matchedClient = clientsArray.find(client => client.id === log.clientId);
                        if (matchedClient) {
                            log.clientName = matchedClient.lastName; // Set clientName based on matching client
                        } else {
                            log.clientName = 'Unknown Client'; // Fallback if client not found
                        }
                    });

                    this.showTooltip = true
                }
            }, 29000)
        },

        async handleConfirm(log) {
            this.selectedClientId = log.clientId
            const headers = this.headers
            await this.$api.getClientData(headers, log)
            this.$store.commit(mutations.setModelResponse, {
                model: models.clientClicked,
                data: Math.random(),
            })
            this.removeLog(log)
        },

        handleClose(log) {
            this.removeLog(log)
        },

        removeLog(log) {
            console.log(log)
            console.log(this.matchingLogs)
            this.matchingLogs = this.matchingLogs.filter(l => l.id !== log.id)
            console.log(this.matchingLogs)
            // Keep tooltip open if there are more matching logs
            if (this.matchingLogs.length === 0) {
                this.showTooltip = false
            }
        }
    },

    beforeDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
    }
}
</script>

<style>
.tooltip-container {
    position: fixed;
    top: 40px;
    right: 10px;
    z-index: 1000;
}

.tooltip {
    background-color: #fff;
    padding: 15px;
    margin: 10px 0;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 200px;
    font-size: 0.6rem;
}

button {
    margin-top: 5px;
    margin-right: 5px;
    font-weight: bold;
}
</style>