import axios from "axios"
// https://backendcbc-5dd5b425d6bf.herokuapp.com
export const getGeneralDataInscriptionService = async () => {
  try {
    const data = await axios.get("http://localhost:5000/quiz/v1/general/pie")
    return data
  } catch (error) {
    return 0
  }
}

export const getGeneralDataByDivision = async () => {
  try {
    const data = await axios.get("http://localhost:5000/quiz/v1/general/results/division")
    return data
  } catch (error) {
    console.log(error)
  }
}

export const getGeneralDataByArea = async () => {
  try {
    const data = await axios.get("http://localhost:5000/quiz/v1/general/results/division/area")
    return data
  } catch (error) {
    console.log(error)
  }
}

export const getUsersByArea = async () => {
  try {
    const data = await axios.get("http://localhost:5000/quiz/v1/general/users/area")
    return data
  } catch (error) {
    console.log(error)
  }
}

export const getDataByArea = async () => {
  try {
    const data = await axios.get("http://localhost:5000/quiz/v1/general/results/area")
    return data
  } catch (error) {
    console.log(error)
  }
}

export const getDataGeneralAdvances = async () => {
  try {
    const data = await axios.get("http://localhost:5000/quiz/v1/general/advence/users")
    return data
  } catch (error) {
    console.log(error)
  }
}

export const getDataGeneralAdvancesByArea = async (area) => {
  try {
    const data = await axios.post("http://localhost:5000/quiz/v1/general/advence/users/area", {area})
    return data
  } catch (error) {
    console.log(error)
  }
}

export const getDataCenterDivisionAreaAgency = async (id) => {
  try {
    const data = await axios.get(`http://localhost:5000/quiz/v1/center/results/division/${id}/area`)
    return data
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getDataResultsByAreaName = async (area) => {
  try {
    const data = await axios.post("http://localhost:5000/quiz/v1/center/results/area/name", {area})
    return data
  } catch (error) {
    console.log(error)
    return null
  }
}