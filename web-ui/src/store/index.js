import { createStore } from 'vuex'
import { getField, updateField } from 'vuex-map-fields'

// CONSTANTS
const API_URL = 'https://cleanupp.azure-api.net/v1'
const SUBSCRIPTION_KEY = '8cb0bb42cc6448528405bac37d2ce4a1'
const EMPLOYEE_ID = '1'

// Functions
const requestHeaders = (username, password) => {
    // Encode the Authorization credentials
    const authorization = 'Basic ' + btoa(username + ':' + password)

    // Create the Headers
    const requestHeaders = new Headers()
    requestHeaders.append("Authorization", authorization)
    requestHeaders.append("Cookie", "CAKEPHP=b58pvvsbpvb0haqisgru5jq85b")
    return requestHeaders
}

const postMeasurementValue = async (username, password, payload) => {
    const headers = requestHeaders(username, password)
    headers.append('Content-Type', 'application/json')
    const response = await fetch(API_URL + '/tasks/measurements/checkpoints/edit/' + EMPLOYEE_ID
        + '/?subscription-key=' + SUBSCRIPTION_KEY, {
            method: 'POST',
            headers: headers,
            body: payload
    })
    if (response.status !== 200) return null
    else return await response.json()
}

const getToDoCounter = async (username, password, date) => {
    const response = await fetch(API_URL + '/tasks/todocounter/' + date
        + '/?subscription-key=' + SUBSCRIPTION_KEY, {
            method: 'GET',
            headers: requestHeaders(username, password)
    })
    if (response.status !== 200) return null
    else return await response.json()
}

const getDashboardsByDate = async (username, password, date) => {
    const response = await fetch(API_URL + '/reporting/getdashboarddata/' + date + '/'
        + date + '/?subscription-key=' + SUBSCRIPTION_KEY, {
            method: 'GET',
            headers: requestHeaders(username, password)
        })
    if (response.status !== 200) return null
    else return await response.json()
}

const validMeasurementValue = (measurement, randomValue) => {
    if (randomValue) console.log('Random Value: ...')
    let value = null
    switch (measurement['check']) {
        case 'BETWEEN (inclusive)':
            value = Number(measurement['check_val_2']) - (Number(measurement['check_val_1']) / 2);
            break;
        case '<':
            value = Number(measurement['check_val_1']) - 1;
            break;
        case '>=':
            value = Number(measurement['check_val_1']) + 1;
            break;
        case '<=':
            value = Number(measurement['check_val_1']) - 1;
            break;
        case '=':
            value = true;
            break;
        default:
            console.log('Unknown Check: ' + measurement['check'])
            break;
    }
    return JSON.stringify({
        "0": {
            "CheckResult": {
                "id": String(measurement['id']),
                "value": String(value),
                "action": "",
                "employee_id": String(null)
            }
        }
    });
}

export default createStore({
  state: {
    username: '',
    password: '',
    date: new Date().toISOString().substring(0, 10),
    message: '',
    messageHistory: [],

    skipCompleted: true,
    randomValue: false,

    toDoCounter: null,
    dashboards: null,
    isLoggedIn: false,

    isLoading: false,
    progress: 0,
  },
  getters: {
    getField,
    isLoggedIn: state => state.isLoggedIn,
    dashboards: state => state.dashboards,
    isLoading: state => state.isLoading,
    progress: state => state.progress,
    message: state => state.message,
    messageHistory: state => state.messageHistory,
    formattedDate: state => {
      const date = new Date(state.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return year + '-' + month + '-' + day
    },
    taskCount: state => {
      let count = { total: 0, completed: 0 }

      const dashboard = state.dashboards ? state.dashboards[Object.keys(state.dashboards)[0]] : null
      if (!dashboard) return count

      for (const tasklist of Object.keys(dashboard)) {
        for (const task of Object.keys(dashboard[tasklist]['TemperatureTask'])) {
          count.total++
          dashboard[tasklist]['TemperatureTask'][task]['TMeasurement'][0]['CheckResult'][0].passed ? count.completed++ : null
        }
      }
      return count
    }
  },
  mutations: {
    updateField,
    setUsername(state, username) { state.username = username },
    setPassword(state, password) { state.password = password },
    setDate(state, date) { state.date = date },
    setLoggedIn(state, isLoggedIn) { state.isLoggedIn = isLoggedIn },
    setToDoCounter(state, toDoCounter) { state.toDoCounter = toDoCounter },
    setDashboards(state, dashboards) { state.dashboards = dashboards },
    setMessage(state, message) { state.message = message; state.messageHistory.push(message) },
    setLoading(state, isLoading) {
      state.isLoading = isLoading;
      if (!isLoading) {
        state.message = '';
        state.messageHistory = [];
        state.progress = 0;
      }
    },
    setProgress(state, progress) { state.progress = progress },
  },
  actions: {
    login({ commit, dispatch }, { username, password }) {
      commit('setUsername', username)
      commit('setPassword', password)
      dispatch('loadToDoCounter')
    },
    async loadToDoCounter({ commit, dispatch, getters, state }) {
      commit('setLoading', true)
      await getToDoCounter(state.username, state.password, getters.formattedDate).then(toDoCounter => {
          if (toDoCounter) {
              commit('setLoggedIn', true)
              commit('setToDoCounter', toDoCounter)
          }
      }).finally(() => {
          commit('setLoading', false)
          dispatch('loadDashboardsData')
      })
    },
    async loadDashboardsData({ commit, getters, state }) {
      commit('setLoading', true)
      await getDashboardsByDate(state.username, state.password, getters.formattedDate).then(dashboards => {
        if (dashboards) {
            commit('setDashboards', dashboards)
        }
      }).finally(() => commit('setLoading', false))
    },
    async autocompleteTasks({ commit, getters, state }) {
        commit('setLoading', true)
        const dashboard = getters.dashboards[getters.formattedDate]
        let counter = 0
        for (const tasklist in dashboard) {
          for (const task in dashboard[tasklist]['TemperatureTask']) {
              commit('setProgress', 100 / getters.taskCount.total * ++counter)
              const taskName = dashboard[tasklist]['TemperatureTask'][task].excerpt
              const measurement = dashboard[tasklist]['TemperatureTask'][task]['TMeasurement'][0]['CheckResult'][0]
              if (measurement['passed'] && state.skipCompleted) {
                commit('setMessage', 'SKIPPED: ' + taskName )
                continue
              }

              const value = validMeasurementValue(measurement, state.randomValue)
              await postMeasurementValue(state.username, state.password, value).then(result => {
                  commit('setMessage', result['passed'] ? 'SUCCESS: ' + taskName : 'FAILED: ' + taskName )
              }).catch(() => {
                  commit('setMessage', 'FAILED: ' + taskName )
              })
          }
        }
        await getDashboardsByDate(state.username, state.password, getters.formattedDate).then(dashboards => {
            if (dashboards) {
                commit('setDashboards', dashboards)
            }
        }).finally(() => commit('setLoading', false))
    },
    logout({ commit, state }) {
        commit('setLoggedIn', false)
        commit('setUsername', '')
        commit('setPassword', '')
        commit('setDate', new Date().toISOString().substring(0, 10))
        commit('setMessage', '')
        commit('setLoading', false)
        commit('setToDoCounter', null)
        commit('setDashboards', null)
        state.skipCompleted = true
        state.randomValue = false
    }
  },
  modules: {
  }
})
