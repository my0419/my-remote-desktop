import { createStore } from "redux";

const initialState = {
  token: null,
  user: null,

  serverSelected: null,
  servers: [],
}

const reducers = (state,action) => {
  switch(action.type) {
    case "AUTH":
      const { user, access_token } = action.payload
      return {...state, ...{ user, token: access_token}}
    case "LOGOUT":
      return initialState
    case "SERVER_CREATE":
      const { data } = action.payload
      let servers = state.servers || []
      servers.push(data)
      return {...state, ...{ servers, serverSelected: data }}
    case "SERVER_LIST":
      if (action.payload !== null) {
        const updateSelected = state.serverSelected ? action.payload.data.filter(s => {
          return s.id === state.serverSelected.id
        }).shift() : null
        return {...state, ...{servers: action.payload.data, serverSelected: updateSelected}}
      }
      return state
    case "SERVER_SELECTED":
      if (action.payload === null) {
        return {...state, ...{serverSelected: null}}
      }
      const server = state.servers.filter(s => s.id === parseInt(action.payload)).shift()
      return {...state, ...{serverSelected: server}}

    case "SERVER_UPDATE":
      const updatedServers = state.servers.map(s => {
        if (s.id === action.payload.data.id) {
          return action.payload.data
        }
        return s
      })
      return {...state, ...{servers: updatedServers, serverSelected: action.payload.data}}

    case "SERVER_DELETE":
      const filterServers = state.servers.filter(s => {
        return s.id !== action.payload.id
      })
      const selected = state.serverSelected && state.serverSelected.id === action.payload.id ? null : state.serverSelected
      return {...state, ...{servers: filterServers, serverSelected: selected}}

    default:
      return state;
  }
}

export default createStore (reducers, initialState);
