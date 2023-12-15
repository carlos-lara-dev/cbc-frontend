import axios from "axios";

export const getQuizService = async (id) => {
    try {
        const request = await axios.get(`https://backendcbc-5dd5b425d6bf.herokuapp.com/quiz/v1/quiz/${id}`);
        return request
    } catch (error) {
        return null
    }
}

export const getPresentationService = async (id) => {
    try {
        const data = await axios.get(`https://backendcbc-5dd5b425d6bf.herokuapp.com/quiz/v1/presentation/quiz/${id}`)
        return data
    } catch (error) {
        return null
    }
}

export const getQuestionsService = async (id) => {
    try {
        const data = await axios.get(`https://backendcbc-5dd5b425d6bf.herokuapp.com/quiz/v1/question/quiz/${id}`)
        return data
    } catch (error) {
        return null
    }
}

export const getAttempts = async (idUser, idQuiz) => {
    try {
        const attemptsUser = await axios.get(`https://backendcbc-5dd5b425d6bf.herokuapp.com/quiz/v1/user/${idUser}/quiz/${idQuiz}`);
        // console.log("---*.*---", attemptsUser);
        return attemptsUser;
    } catch (error) {
        return 0;
    }
};

export const getExtraOpportunity = async (idUser, idQuiz) => {
    try {
        const extraData = await axios.get(`https://backendcbc-5dd5b425d6bf.herokuapp.com/quiz/v1/user-attempts-quiz/${idUser}/${idQuiz}`);
        // console.log("---*.*---", extraData);
        return extraData;
    } catch (error) {
        return 0
    }
}

export const getUserModuleResult = async (idUser, idQuiz) => {
    try {
        const data = await axios.get(`https://backendcbc-5dd5b425d6bf.herokuapp.com/quiz/v1/user/${idUser}/quiz/${idQuiz}/aproved`)
        return data
    } catch (error) {
        return null
    }
}

export const setDataUserAnswer = async (data) => {
    try {
        const dataQuizUser = await axios.post(`https://backendcbc-5dd5b425d6bf.herokuapp.com/quiz/v1/user-answer`, data);
        return dataQuizUser;
    } catch (error) {
        return error;
    }
};

export const setUserQuiz = async (data) => {
    try {
        // console.log("SET")
        const dataQuizUser = await axios.post(`https://backendcbc-5dd5b425d6bf.herokuapp.com/quiz/v1/user-quiz`, data);
        return dataQuizUser;
    } catch (error) {
        return error;
    }
};

export const putUserQuiz = async (idUser, idQuiz, data) => {
    try {
        // console.log("PUT")
        const dataQuizUser = await axios.put(`https://backendcbc-5dd5b425d6bf.herokuapp.com/quiz/v1/user-quiz/${idUser}/${idQuiz}`, data);
        return dataQuizUser;
    } catch (error) {
        return error;
    }
};

export const setScoreUser = async (params) => {
    try {
        const scoreUser = await axios.post(`https://backendcbc-5dd5b425d6bf.herokuapp.com/quiz/v1/user-score-quiz`, params);
        // console.log("---*---", scoreUser);
        return scoreUser;
    } catch (error) {
        return 0;
    }
};

export const getDivisionService = async () => {
    try {
        const request = await axios.get("https://backendcbc-5dd5b425d6bf.herokuapp.com/settings/v1/division")
        return request
    } catch (error) {
        return 0
    }
}

export const getAgencyService = async (areaSelected) => {
    try {
        const request = await axios.get(`https://backendcbc-5dd5b425d6bf.herokuapp.com/settings/v1/agency/area/${areaSelected}`)
        return request;
    } catch (error) {
        return 0;
    }
}