import axios from "axios"

export const getQuestionsAllService = async () => {
  try {
      const data = await axios.get(`https://backendcbc-5dd5b425d6bf.herokuapp.com/quiz/v1/question`)
      return data
  } catch (error) {
      return null
  }
}

export const getAnswerService = async () => {
  try {
      const data = await axios.get(`https://backendcbc-5dd5b425d6bf.herokuapp.com/settings/v1/answer`)
      console.log("ANSWER", data);
      return data
  } catch (error) {
      return null
  }
}

export const getAgencyService = async () => {
  try {
      const data = await axios.get(`https://backendcbc-5dd5b425d6bf.herokuapp.com/settings/v1/agency`)
      console.log("ANSWER", data);
      return data
  } catch (error) {
      return null
  }
}

export const getPresentationsService = async () => {
  try {
      const data = await axios.get(`https://backendcbc-5dd5b425d6bf.herokuapp.com/quiz/v1/presentation`)
      return data
  } catch (error) {
      return null
  }
}

export const getRolesServices = async () => {
  try {
    const data = await axios.get(`https://backendcbc-5dd5b425d6bf.herokuapp.com/settings/v1/role`)
    return data
  } catch (error) {
    return null
  }
}

export const getRoleUsersServices = async () => {
  try {
    const data = await axios.get(`https://backendcbc-5dd5b425d6bf.herokuapp.com/settings/v1/role-user`)
    return data
  } catch (error) {
    return null
  }
}

export const getExtraAnswerServices = async () => {
  try {
    const data = await axios.get("https://backendcbc-5dd5b425d6bf.herokuapp.com/quiz/v1/user-attempts-quiz")
    return data
  } catch (error) {
    return null
  }
}

export const postRolesServices = async (params) => {
  try {
    const data = await axios.post(`https://backendcbc-5dd5b425d6bf.herokuapp.com/settings/v1/role`, params)
    return data
  } catch (error) {
    return null
  }
}

export const putRolesServices = async (id, params) => {
  try {
    const data = await axios.put(`https://backendcbc-5dd5b425d6bf.herokuapp.com/settings/v1/role/${id}`, params)
    return data
  } catch (error) {
    return null
  }
}

export const postRoleUsersServices = async (params) => {
  try {
    const data = await axios.post(`https://backendcbc-5dd5b425d6bf.herokuapp.com/settings/v1/role-user`, params)
    return data
  } catch (error) {
    return null
  }
}

export const putRoleUsersServices = async (id, params) => {
  try {
    const data = await axios.put(`https://backendcbc-5dd5b425d6bf.herokuapp.com/settings/v1/role-user/${id}`, params)
    return data
  } catch (error) {
    return null
  }
}

export const postAreaService = async (params) => {
  try {
    const data = await axios.post(`https://backendcbc-5dd5b425d6bf.herokuapp.com/settings/v1/area`, params)
    return data
  } catch (error) {
      return null
  }
}

export const putAreaService = async (id, params) => {
  try {
    const data = await axios.put(`https://backendcbc-5dd5b425d6bf.herokuapp.com/settings/v1/area/${id}`, params)
    return data
  } catch (error) {
      return null
  }
}

export const postAgencyService = async (params) => {
  try {
    const data = await axios.post(`https://backendcbc-5dd5b425d6bf.herokuapp.com/settings/v1/agency`, params)
    return data
  } catch (error) {
      return null
  }
}

export const postAttemptsExtraSerivce = async (params) => {
  try {
    const data = await axios.post(`https://backendcbc-5dd5b425d6bf.herokuapp.com/quiz/v1/user-attempts-quiz`, params)
    return data
  } catch (error) {
      return null
  }
}

export const putAttemptsExtraSerivce = async (id, params) => {
  try {
    const data = await axios.put(`https://backendcbc-5dd5b425d6bf.herokuapp.com/quiz/v1/user-attempts-quiz/${id}`, params)
    return data
  } catch (error) {
      return null
  }
}

export const putAgencyService = async (id, params) => {
  try {
    const data = await axios.put(`https://backendcbc-5dd5b425d6bf.herokuapp.com/settings/v1/agency/${id}`, params)
    return data
  } catch (error) {
      return null
  }
}

export const postDivisionSerivice = async (params) => {
  try {
    const data = await axios.post(`https://backendcbc-5dd5b425d6bf.herokuapp.com/settings/v1/division`, params)
    return data
  } catch (error) {
      return null
  }
}

export const putDivisionSerivice = async (id, params) => {
  try {
    const data = await axios.put(`https://backendcbc-5dd5b425d6bf.herokuapp.com/settings/v1/division/${id}`, params)
    return data
  } catch (error) {
      return null
  }
}

export const postQuizService = async (params) => {
  try {
    const data = await axios.post(`https://backendcbc-5dd5b425d6bf.herokuapp.com/quiz/v1/quiz`, params)
    return data
  } catch (error) {
      return null
  }
}

export const putQuizService = async (id, params) => {
  try {
    const data = await axios.put(`https://backendcbc-5dd5b425d6bf.herokuapp.com/quiz/v1/quiz/${id}`, params)
    return data
  } catch (error) {
      return null
  }
}

export const postQuestionService = async (params) => {
  try {
    const data = await axios.post(`https://backendcbc-5dd5b425d6bf.herokuapp.com/quiz/v1/question`, params)
    return data
  } catch (error) {
      return null
  }
}

export const putQuestionService = async (id, params) => {
  try {
    const data = await axios.put(`https://backendcbc-5dd5b425d6bf.herokuapp.com/quiz/v1/question/${id}`, params)
    return data
  } catch (error) {
      return null
  }
}

export const postAnswerService = async (params) => {
  try {
    const data = await axios.post(`https://backendcbc-5dd5b425d6bf.herokuapp.com/settings/v1/answer`, params)
    return data
  } catch (error) {
      return null
  }
}

export const putAnswerService = async (id, params) => {
  try {
    const data = await axios.put(`https://backendcbc-5dd5b425d6bf.herokuapp.com/settings/v1/answer/${id}`, params)
    return data
  } catch (error) {
      return null
  }
}

export const postPresentationService = async (params) => {
  try {
    const data = await axios.post(`https://backendcbc-5dd5b425d6bf.herokuapp.com/quiz/v1/presentation`, params)
    return data
  } catch (error) {
      return null
  }
}

export const postPresentationItemService = async (params) => {
  try {
    const data = await axios.post(`https://backendcbc-5dd5b425d6bf.herokuapp.com/quiz/v1/presentation-item`, params)
    return data
  } catch (error) {
      return null
  }
}