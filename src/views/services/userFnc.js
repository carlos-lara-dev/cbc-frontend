import axios from "axios"

export const loginService = async (user, password) => {
  try {
    const login = await axios.post("http://localhost:4500/settings/v1/user/login", { user, password })
    return login
  } catch (error) {
    console.log(error)
    return null
  }
}

export const registerService = async (params) => {
  try {
    const register = await axios.post("http://localhost:4500/settings/v1/user", params)
    return register
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getDivisionService = async () => {
  try {
    const request = await axios.get("http://localhost:4500/settings/v1/division")
    return request
  } catch (error) {
    return null
  }
}

export const getAreasByDivisionService = async (id) => {
  try {
    const request = await axios.get(`http://localhost:4500/settings/v1/area/division/${id}`)
    return request
  } catch (error) {
    return null
  }
}

export const getAreasService = async () => {
  try {
    const request = await axios.get("http://localhost:4500/settings/v1/area")
    return request
  } catch (error) {
    return null
  }
}

export const getAgencyService = async (areaSelected) => {
  try {
    const request = await axios.get(`http://localhost:4500/settings/v1/agency/area/${areaSelected}`)
    return request
  } catch (error) {
    return null
  }
}

export const getAgencyByAreaNameService = async (area) => {
  try {
    const request = await axios.post(`http://localhost:4500/settings/v1/agency/area/name`, {area})
    return request
  } catch (error) {
    return null
  }
}

export const getModulesService = async () => {
  try {
    const data = await axios.get("http://localhost:4500/quiz/v1/quiz");
    return data
  } catch (error) {
    return null
  }
}

export const getAllUsersService = async () => {
  try {
    const data = await axios.get("http://localhost:4500/settings/v1/user");
    return data
  } catch (error) {
    return null
  }
}