export default ({ app, store, $toast }, inject) => {
  const websocket = {
    socket: null,
    users: store.state.users,
    selectedClient: store.state.selectedClient,

    connect(userId) {
      const websocketUrl =
        process.env.NODE_ENV === 'production'
          ? `${process.env.BACKEND_URL_P_WEBSOCKET}/websocket` // Append /websocket if missing
          : `${process.env.BACKEND_URL_WEBSOCKET}/websocket` // Development WebSocket URL

      console.log('WebSocket URL:', websocketUrl)
      console.log('WebSocket userId:', `${websocketUrl}/${userId}`)

      // Construct the WebSocket URL with the userId
      this.socket = new WebSocket(`${websocketUrl}/${userId}`)

      this.socket.onopen = () => {
        console.log('Connected to WebSocket')
      }

      this.socket.onmessage = (event) => {
        console.log('WebSocket Message Received:', event)

        // Parse the incoming message data
        const data = JSON.parse(event.data)

        // Call the appropriate handler based on the message type
        if (data.type === 'message') {
          this.handleMessage(data)
        } else if (data.type === 'alarm') {
          this.handleAlarm(data)
        } else {
          console.warn(`Unhandled message type: ${data.type}`)
        }
      }

      this.socket.onclose = () => {
        console.log('Disconnected from WebSocket')
        // Attempt to reconnect after 5 seconds
        setTimeout(() => this.connect(userId), 5000)
      }
    },

    handleMessage(data) {
      // Format the 'created' field if it exists
      if (data.created) {
        const date = new Date(data.created)
        data.created = date.toISOString()
      }

      // Push the message to the store
      store.commit('pushNewMsg', {
        msg: data,
        parentId: data.parentId,
      })

      // Find the sender from the store
      const users = Object.values(store.state.users)
      const user = users.find((user) => user.id === data.senderId)

      // Display a toast notification
      if (user) {
        $toast.success(`Message from ${user.username}`)
      } else {
        $toast.warning(`User with id ${data.senderId} not found.`)
      }
    },

    handleAlarm(data) {
      store.commit('pushDayLog', {
        state: this.selectedClient,
        log: data,
      })
      $toast.info(`Alarm add to list`)
    },

    sendMessageToServer(message) {
      if (this.socket?.readyState === WebSocket.OPEN) {
        const payload = { type: 'message', ...message }
        this.socket.send(JSON.stringify(payload))
      } else {
        console.warn('WebSocket is not open. Cannot send message.')
      }
    },

    sendAlarmToServer(alarm) {
      if (this.socket?.readyState !== WebSocket.OPEN) {
        console.warn('WebSocket is not open. Cannot send alarm.')
        return
      }
      // Remove unnecessary properties
      const { historyLogJson, new: isNew, historyLog, timeSpent, ...alarmPayload } = alarm

      // Send the alarm with the appropriate type
      const payload = { type: 'alarm', ...alarmPayload }
      this.socket.send(JSON.stringify(payload))
    },
  }

  // Inject the WebSocket object into the Nuxt context
  inject('websocket', websocket)
}
