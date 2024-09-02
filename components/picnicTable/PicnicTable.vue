<template>
    <div class="h-screen w-screen text-xs">
        <div class="bg-black text-white p-3 flex mb-1 gap-4">
            <h2 class="text-sm font-bold">Logs</h2>
            <button class="px-2 py-0.5 rounded text-xs"
                :class="{ 'bg-gray-200 text-black': !showAllLogs, 'bg-gray-600 text-white': showAllLogs }"
                @click="toggleLogView">
                {{ showAllLogs ? 'Show selected client' : 'Show all clients' }}
            </button>
        </div>
        <div class="border border-black overflow-auto">
            <table class="w-full border-collapse text-xs">
                <thead>
                    <tr class="bg-gray-200 border-black sticky top-0">
                        <th v-for="header in tableHeaders" @click="sortBy(header)" :key="header"
                            class="border px-2 py-1 text-left font-normal cursor-pointer">
                            {{ header }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="logsToDisplay && logsToDisplay.length > 0">
                        <template v-for="log in logsToDisplay">
                            <tr :key="log.id">
                                <td class="border px-2 py-0.5">{{ log.lastName }}</td>
                                <td class="border px-2 py-0.5">{{ log.status }}</td>
                                <td class="border px-2 py-0.5">{{ log.id }}</td>
                                <td class="border px-2 py-0.5">{{ log.note }}</td>
                                <td class="border px-2 py-0.5">{{ log.logDate }}</td>
                                <td class="border px-2 py-0.5">{{ log.priority }}</td>
                                <td class="border px-2 py-0.5">{{ log.years }}</td>
                                <td class="border px-2 py-0.5">{{ log.alarmDate }}</td>
                                <td class="border px-2 py-0.5">{{ log.alarmTime }}</td>
                                <td class="border px-2 py-0.5">{{ log.alarmUserName }}</td>
                                <td class="border px-2 py-0.5">{{ log.alarmComplete }}</td>
                            </tr>
                        </template>
                    </template>
                    <tr v-else>
                        <td :colspan="tableHeaders.length" class="border px-2 py-0.5 text-center">No logs available</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';

export default {
    name: 'ClientLogsTable',

    data() {
        return {
            showAllLogs: false,
            clientsWithLogs: [],
            sortColumn: "Date of Log",
            sortDirection: 1
        };
    },

    computed: {
        ...mapState({
            clientAndLogs: state => state.clientAndLogs
        }),

        tableHeaders() {
            return ['Last Name', 'Log Status', 'Log ID', 'Note', 'Date of Log', 'Priority', 'yaer_name', "alarem_date", "alarm_time", 'employee_alarm', 'alarm complete'];
        },

        logsToDisplay() {
            console.log(this.clientsWithLogs)
            const allLogs = this.clientsWithLogs.flatMap(client => client.logs.map(log => ({
                ...log,
                lastName: client.client.lastName,
                status: client.client.status
            })));
            console.log(allLogs)
            return this.sortLogs(allLogs);
        }
    },

    mounted() {
        this.fetchLogs();
    },

    methods: {
        sortLogs(logs) {
            if (!this.sortColumn) {
                return logs;
            }

            const sortedLogs = _.orderBy(
                logs,
                this.getSortFunction(this.sortColumn),
                this.sortDirection === 1 ? 'desc' : 'asc'
            );

            return sortedLogs;
        },

        getSortFunction(column) {
            switch (column) {
                case 'Last Name':
                    return 'lastName';
                case 'Log Status':
                    return 'status';
                case 'Log ID':
                    return 'id';
                case 'Note':
                    return 'note';
                case 'Date of Log':
                    return 'logDate';
                case 'Priority':
                    return 'priority';
                case 'yaer_name':
                    return 'years';
                case 'alarem_date':
                    return 'alarmDate';
                case 'employee_alarm':
                    return 'alarmUserName';
                case 'alarm_time':
                    return 'alarmTime';
                case 'alarm complete':
                    return 'alarmComplete';
                default:
                    return '';
            }
        },

        sortBy(column) {
            if (this.sortColumn === column) {
                this.sortDirection *= -1;
            } else {
                this.sortColumn = column;
                this.sortDirection = 1;
            }
            // this.fetchLogs();
        },

        async fetchLogs() {
            try {
                if (this.showAllLogs) {
                    await this.fetchClientsWithLogs();
                } else {
                    const response = await this.$api.getClientsWithLogs(this.getHeaders(), this.getSelectedClients());
                    this.clientsWithLogs = response;
                }
            } catch (error) {
                console.error("Error fetching logs:", error);
            }
        },

        async fetchClientsWithLogs() {
            try {
                const response = await this.$api.getClientsWithLogs(this.getHeaders());
                this.clientsWithLogs = response;
            } catch (error) {
                console.error("Error fetching clients with logs:", error);
            }
        },

        toggleLogView() {
            this.showAllLogs = !this.showAllLogs;
            this.fetchLogs();
        },

        getHeaders() {
            return this.$api.getHeaders();
        },

        getSelectedClients() {
            if (process.client) {
                const params = new URLSearchParams(window.location.search);
                return JSON.parse(params.get('client'));
            }
            return null;
        }
    }
};
</script>