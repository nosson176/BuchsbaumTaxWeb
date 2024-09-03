<template>
    <div class="h-screen w-screen text-xs">
        <div class="bg-black text-white p-3 flex mb-1 gap-4">
            <h2 class="text-sm font-bold">Logs</h2>
            <button class="px-2 py-0.5 rounded text-xs"
                :class="{ 'bg-gray-200 text-black': !showAllLogs, 'bg-gray-600 text-white': showAllLogs }"
                @click="toggleLogView">
                {{ showAllLogs ? 'Show selected client' : 'Show all clients' }}
            </button>
            <span class="text-xs">(Press Alt + G to toggle search mode)</span>
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
                    <tr v-if="isSearchMode">
                        <td v-for="header in tableHeaders" :key="header" class="border px-2 py-0.5">
                            <input type="text" v-model="filters[header]" @input="applyFilters" class="w-full">
                        </td>
                    </tr>
                    <template v-if="logsToDisplay.length > 0">
                        <tr v-for="log in logsToDisplay" :key="log.id">
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
            sortColumn: null,
            sortDirection: 1,
            isSearchMode: false,
            filters: {},
        };
    },

    computed: {
        ...mapState({
            clientAndLogs: state => state.clientAndLogs
        }),

        tableHeaders() {
            return ['Last Name', 'Log Status', 'Log ID', 'Note', 'Date of Log', 'Priority', 'yaer_name', "alarem_date", "alarm_time", 'employee_alarm', 'alarm complete'];
        },

        allLogs() {
            return this.clientsWithLogs.flatMap(client => client.logs.map(log => ({
                ...log,
                lastName: client.client.lastName,
                status: client.client.status
            })));
        },

        filteredLogs() {
            if (!this.isSearchMode) return this.allLogs;

            let logs = this.allLogs;

            // Apply filters
            Object.entries(this.filters).forEach(([key, value]) => {
                if (value) {
                    logs = logs.filter(log => {
                        const logValue = this.getLogValue(log, key);
                        if (['Priority', 'yaer_name'].includes(key)) {
                            return logValue.toString() === value.toString();
                        }
                        if (['Date of Log', 'alarem_date'].includes(key)) {
                            return new Date(logValue).toDateString().includes(value);
                        }
                        if (key === 'alarm_time') {
                            return logValue.includes(value);
                        }
                        if (key === 'alarm complete') {
                            return logValue.toString().toLowerCase().includes(value.toLowerCase());
                        }
                        return logValue.toString().toLowerCase().includes(value.toLowerCase());
                    });
                }
            });

            return logs;
        },

        logsToDisplay() {
            let logs = this.filteredLogs;

            // Apply sorting
            if (this.sortColumn) {
                logs = _.orderBy(
                    logs,
                    this.getSortFunction(this.sortColumn),
                    this.sortDirection === 1 ? 'asc' : 'desc'
                );
            }

            return logs;
        },
    },

    mounted() {
        this.fetchLogs();
        this.initializeFilters();
        window.addEventListener('keydown', this.handleKeyDown);
    },

    beforeDestroy() {
        window.removeEventListener('keydown', this.handleKeyDown);
    },

    methods: {
        initializeFilters() {
            this.tableHeaders.forEach(header => {
                this.$set(this.filters, header, '');
            });
        },

        getSortFunction(column) {
            const columnMap = {
                'Last Name': 'lastName',
                'Log Status': 'status',
                'Log ID': 'id',
                'Note': 'note',
                'Date of Log': 'logDate',
                'Priority': 'priority',
                'yaer_name': 'years',
                'alarem_date': 'alarmDate',
                'employee_alarm': 'alarmUserName',
                'alarm_time': 'alarmTime',
                'alarm complete': 'alarmComplete'
            };

            return columnMap[column] || '';
        },

        sortBy(column) {
            if (this.sortColumn === column) {
                this.sortDirection *= -1;
            } else {
                this.sortColumn = column;
                this.sortDirection = 1;
            }
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
        },

        getLogValue(log, key) {
            const columnMap = {
                'Last Name': 'lastName',
                'Log Status': 'status',
                'Log ID': 'id',
                'Note': 'note',
                'Date of Log': 'logDate',
                'Priority': 'priority',
                'yaer_name': 'years',
                'alarem_date': 'alarmDate',
                'employee_alarm': 'alarmUserName',
                'alarm_time': 'alarmTime',
                'alarm complete': 'alarmComplete'
            };
            return log[columnMap[key]] || '';
        },

        applyFilters() {
            // This method is called on input events
            // The filtering is handled reactively by the filteredLogs computed property
        },

        handleKeyDown(event) {
            if (event.altKey && event.key === 'g') {
                this.isSearchMode = !this.isSearchMode;
                if (!this.isSearchMode) {
                    this.initializeFilters();
                }
            }
        },
    }
};
</script>