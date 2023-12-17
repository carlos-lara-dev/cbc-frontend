import { useEffect, useRef, useState } from "react";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useActionData, useNavigate, useParams } from "react-router-dom";

import Presentation from "./Presentation";
import Accordion from "../../components/Accordion";
import QuizComponent from "../../components/QuizComponent";
import MenuComponent from "../../components/MenuComponent";
import HeaderComponent from "../../components/HeaderComponent";
import CountdownComponent from "../../components/CountdownComponent";

import {
    getAttempts,
    setDataUserAnswer,
    setUserQuiz,
    setScoreUser,
    getExtraOpportunity,
    getUserModuleResult,
    getQuizService,
    getPresentationService,
    getQuestionsService
} from "../../services/quizFnc.js";

const MySwal = withReactContent(Swal);

const CoursePage = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const [dataQuiz, setDataQuiz] = useState(null)
    const [dataPresentation, setDataPresentation] = useState([])
    const [questions, setDataQuestion] = useState([])
    const [totalProgress, setTotalProgress] = useState(0);
    const [userAnswers, setUserAnswers] = useState();
    const [currentQuestion, setCurrentQuestion] = useState(-1);
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [unansweredCount, setUnansweredCount] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answerSelects, setAnswerSelects] = useState([])
    const [timerStart, setTimerStart] = useState(false);
    const [timerRestart, setTimerRestart] = useState(false);
    const [time, setTotalTime] = useState(0)
    const [finalTime, setFinalTime] = useState(0)
    const [minimNote, setMinimNote] = useState(0);

    const [userData, setUserData] = useState(null);
    const [attemptsUserQuiz, setAttemptsUserQuiz] = useState([]);
    const [extraOpportunityQuiz, setExtraOpportunityQuiz] = useState([]);
    const [previousResults, setPreviousResults] = useState([]);
    const [presentationSelect, setPresentationSelect] = useState(0)
    const [questionSelect, setQuestionSelect] = useState(0)

    const counterRef = useRef(null)
    const timerRef = useRef(0)
    const completeTimer = () => {
        MySwal.fire({
            title: 'El tiempo se ha agotado',
            icon: 'info',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        })
        handleFinishQuiz()
    }

    const handleAnswerClick = (answerIndex, type = "select", value = null) => {
        if (
            userAnswers[currentQuestion] === null ||
            questions[questionSelect][currentQuestion].correctIndex.length > 1 ||
            type === "input"
        ) {
            if (
                userAnswers[currentQuestion] === null ||
                (Array.isArray(userAnswers[currentQuestion]) &&
                    userAnswers[currentQuestion].length <=
                    questions[questionSelect][currentQuestion].correctIndex.length) ||
                type === "input"
            ) {
                let isCorrect;
                if (type === "input") {
                    isCorrect =
                        questions[questionSelect][currentQuestion]["answers"][
                            answerIndex
                        ].description === value;
                } else {
                    isCorrect = questions[questionSelect][currentQuestion].correctIndex.includes(
                        answerIndex
                    );
                }

                setSelectedAnswer(answerIndex);
                if (questions[questionSelect][currentQuestion].correctIndex.length > 1) {
                    setAnswerSelects([...answerSelects, answerIndex])
                }

                setUserAnswers((prevUserAnswers) => {
                    const newUserAnswers = [...prevUserAnswers];

                    // Verificar si newUserAnswers[currentQuestion] es null o indefinido
                    if (!Array.isArray(newUserAnswers[currentQuestion])) {
                        newUserAnswers[currentQuestion] = [];
                    }

                    if (
                        questions[questionSelect][currentQuestion].correctIndex.length >
                        1
                    ) {
                        if (
                            newUserAnswers[currentQuestion] !== null &&
                            newUserAnswers[currentQuestion].length > 0
                        ) {
                            newUserAnswers[currentQuestion].push(
                                isCorrect
                                    ? {
                                        response: "correct",
                                        index: answerIndex,
                                        score:
                                            questions[questionSelect][currentQuestion][
                                                "answers"
                                            ][answerIndex].score,
                                    }
                                    : {
                                        response: "incorrect",
                                        index: answerIndex,
                                        score:
                                            questions[questionSelect][currentQuestion][
                                                "answers"
                                            ][answerIndex].score,
                                    }
                            );
                        } else {
                            newUserAnswers[currentQuestion] =
                                isCorrect
                                    ? [
                                        {
                                            response: "correct",
                                            index: answerIndex,
                                            score:
                                                questions[questionSelect][
                                                    currentQuestion
                                                ]["answers"][answerIndex].score,
                                        },
                                    ]
                                    : [
                                        {
                                            response: "incorrect",
                                            index: answerIndex,
                                            score:
                                                questions[questionSelect][
                                                    currentQuestion
                                                ]["answers"][answerIndex].score,
                                        },
                                    ];
                        }
                    } else {
                        newUserAnswers[currentQuestion] =
                            isCorrect
                                ? {
                                    response: "correct",
                                    index: answerIndex,
                                    score:
                                        questions[questionSelect][currentQuestion][
                                            "answers"
                                        ][answerIndex].score,
                                }
                                : {
                                    response: "incorrect",
                                    index: answerIndex,
                                    score:
                                        questions[questionSelect][currentQuestion][
                                            "answers"
                                        ][answerIndex].score || 0,
                                };
                    }
                    return newUserAnswers;
                });
            }
        }
    };



    const handleNextQuestion = () => {
        if (userAnswers[currentQuestion] !== null) {
            setSelectedAnswer(null);
            setCurrentQuestion((prevCorrectCount) => {
                // console.log("prevCorrectCount ====>", prevCorrectCount)
                return prevCorrectCount + 1
            });
        } else {
            // console.log("ELSE DEL CONSIAMA .....................", currentQuestion, userAnswers[currentQuestion])
            MySwal.fire({
                icon: "info",
                title: "¡Atención!",
                text: "Debe seleccionar una respuesta"
            })
        }
    };

    const handleInitQuiz = () => {
        if (counterRef.current && currentQuestion === -1) {
            counterRef.current.start()
        }
        setTimerStart(true)
        setCurrentQuestion((prevCorrectCount) => {
            // console.log("prevCorrectCount ====>", prevCorrectCount)
            return prevCorrectCount + 1
        });
    }

    const handleFinishQuiz = async () => {
        const datosUser = JSON.parse(localStorage.getItem("@user"));
        let totalNote = 0
        if (userAnswers[currentQuestion] !== null) {
            Swal.fire({
                title: "Validando respuestas...",
                timer: 5000,
                timerProgressBar: true
            });

            // Contar las preguntas no respondidas
            const unanswered = userAnswers.filter((answer) => answer === null).length;
            setUnansweredCount(unanswered);

            // Finalizar el quiz
            setQuizCompleted(true);
            setTimerStart(false);
            let dataInsertQuiz = [];
            const attemptsUser = attemptsUserQuiz.length ? (attemptsUserQuiz.length + 1) : 1;
            userAnswers.map(((item, index) => {
                const questionData = questions[questionSelect];
                if (item.length === undefined) {
                    const answerData = questionData[index].answers[item.index];
                    totalNote += item.score
                    dataInsertQuiz.push({
                        idUser: datosUser.idUser,
                        idQuestion: questionData[index].idQuestion,
                        idAnswer: answerData?.idAnswer,
                        attempt: attemptsUser
                    });
                } else {
                    item.forEach(i => {
                        const answerData = questionData[index].answers[i.index];
                        totalNote += i.score
                        dataInsertQuiz.push({
                            idUser: datosUser.idUser,
                            idQuestion: questionData[index].idQuestion,
                            idAnswer: answerData?.idAnswer,
                            attempt: attemptsUser
                        });
                    })
                }
            }));

            /* const attemptsUserQuiz = await getAttempts(userData.idUser, questions[0].idQuestion);
            console.log("INTENTOS DATA",attemptsUserQuiz) */
            // console.log("TOTAL NOTE ==========>", totalNote, minimNote);
            setCorrectCount(totalNote)
            localStorage.setItem(`@quest-${questionSelect}`, JSON.stringify({ note: totalNote, attempts: attemptsUser }))

            let dataQuiz = {
                idUser: datosUser.idUser,
                idQuiz: parseInt(id),
                attempts: attemptsUser,
                aproved: totalNote >= minimNote ? 1 : 0
            };

            // console.log("NOTA FINAL ---->", { totalNote, userAnswers });
            // console.log("DATA FINAL", { dataInsertQuiz, dataQuiz })
            const dataAnswers = await setDataUserAnswer(dataInsertQuiz);
            const dataUserQuiz = await setUserQuiz(dataQuiz);

            if (dataAnswers?.data && dataUserQuiz?.data) {
                const saveScore = await setScoreUser({
                    idUserQuiz: dataUserQuiz.data.idUserQuiz,
                    quizTime: `${Math.floor(timerRef.current / 60)}:${(timerRef.current % 60).toString().padStart(2, '0')}`,
                    score: totalNote
                });
                // console.log("[ TIME SCORE ] => ", saveScore);
                Swal.fire({
                    icon: "success",
                    title: "Proceso completado",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se han podido registrar tus datos prueba mas tarde.",
                });
            }
        } else {
            MySwal.fire({
                icon: "info",
                title: "¡Atención!",
                text: "Debe seleccionar una respuesta"
            })
        }
    };

    const handleResetQuestion = async () => {
        try {
            const attemptsUserQuizget = await getAttempts(userData.idUser, id);
            const quizReq = await getQuizService(id);
            let duration = quizReq.data.durationTime * 60 || 0
            setAttemptsUserQuiz(attemptsUserQuizget.data);
            setTotalTime(duration);
            setTimerRestart(true);
            setCurrentQuestion(-1);
            setQuizCompleted(false);
            setCorrectCount(0);
            setIncorrectCount(0);
            setUnansweredCount(0);
            setSelectedAnswer(null);
            setUserAnswers(Array(questions[questionSelect].length).fill(null));
        } catch (error) {
            console.log("error", error)
        }
    }

    const getInfoModule = async () => {
        try {
            const datosUser = JSON.parse(localStorage.getItem("@user"));
            setUserData(datosUser);

            const quizReq = await getQuizService(id);
            if (quizReq?.data) {
                let duration = quizReq.data.durationTime * 60 || 0
                setDataQuiz(quizReq.data)
                setTotalTime(duration)
                const requestResults = await getUserModuleResult(datosUser.idUser, id)
                if (requestResults?.data) {
                    setPreviousResults(requestResults.data)
                }
                const presentationReq = await getPresentationService(id)
                // console.log("PRESENTATIONS ==> ", presentationReq);
                if (presentationReq?.data) {
                    setDataPresentation(presentationReq.data || [])

                    const questionReq = await getQuestionsService(id)
                    // console.log("QUESTIONS ==> ", questionReq);
                    if (questionReq?.data) {
                        let array = []
                        questionReq.data.forEach((item) => {
                            let tmpArray = []
                            if (item !== null) {
                                item.forEach((quest) => {
                                    let arrayCorrectAnswer = []
                                    let arrayAnswer = []
                                    // console.log("quest", quest);
                                    quest.Answers.forEach((answer, index) => {
                                        // console.log("ANSWERE", answer);
                                        arrayAnswer.push({ idAnswer: answer.idAnswers, description: answer.description, score: answer.value, type: answer.type })
                                        if (answer.isCorrect) {
                                            arrayCorrectAnswer.push(index)
                                        }
                                    })
                                    tmpArray.push({
                                        idQuestion: quest.idQuestion,
                                        question: quest.description,
                                        answers: arrayAnswer,
                                        correctIndex: arrayCorrectAnswer
                                    })
                                })
                                array.push(tmpArray)
                            }
                        })
                        // console.log("ARRAY QUESTION ------------>", array)
                        setDataQuestion(array);
                        setUserAnswers(Array(array[0].length).fill(null))
                        const attemptsUserQuizget = await getAttempts(datosUser.idUser, quizReq.data.idQuiz);
                        const extraOpportunity = await getExtraOpportunity(datosUser.idUser, id);
                        setAttemptsUserQuiz(attemptsUserQuizget.data);
                        setExtraOpportunityQuiz(extraOpportunity.data);
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getInfoModule()
    }, [])

    useEffect(() => {
        if (questions.length > 0 && currentQuestion === questions[questionSelect].length) {
            handleFinishQuiz();
        }
    }, [currentQuestion, questions.length, questions]);

    useEffect(() => {
        if (questions.length > 0) {
            const percentagePerQuestion = 100 / questions[questionSelect].length;
            let noteMinimal = 0;
            if (questions.length > 0) {
                questions[questionSelect].forEach(item => {
                    item.answers.map(ans => {
                        noteMinimal += ans.score
                    })
                })
            }
            const porcentMinimal = Math.round(noteMinimal) * 0.8;
            setMinimNote(porcentMinimal)
            setTotalProgress(Math.round((currentQuestion + 1) * percentagePerQuestion));
        }
    }, [currentQuestion, questions, questions.length, questionSelect]);

    const loader = async () => {
        const user = JSON.parse(localStorage.getItem("@user"))
        if (!user) {
            return navigate("/login");
        }
        return null;
    };

    useEffect(() => {
        loader()
    }, [])

    const RenderPresentation = ({ data }) => {

        const makePresentation = () => {
            const filterPresentation = data.find(item => item.idPresentation === presentationSelect);
            return <Presentation files={filterPresentation?.PresentationItems} />
        }

        return (
            <div>
                {
                    data.length > 0 ? (
                        data.length > 1 ? (
                            <div>
                                <div className="d-flex">
                                    {
                                        data.map((pres, index) => (
                                            <div
                                                style={
                                                    presentationSelect === pres.idPresentation ?
                                                        { backgroundColor: "#810000", color: "#FFF" }
                                                        :
                                                        { backgroundColor: "#CCCCCC", color: "#000" }
                                                }
                                                className="btn mx-1 my-2 py-3 px-4"
                                                onClick={() => setPresentationSelect(pres.idPresentation)}
                                            >
                                                <b>{`Presentación ${index + 1}`}</b>
                                            </div>
                                        ))
                                    }
                                </div>
                                {presentationSelect !== 0 && (<div>{makePresentation()}</div>)}
                            </div>
                        ) : (
                            data.map((item) => <Presentation files={item.PresentationItems} />)
                        )
                    ) : (
                        <div className="d-flex justify-content-center py-5">
                            <h6 className="text-muted fst-italic">No se encontró ningúna presentación</h6>
                        </div>
                    )
                }
            </div>
        )
    }

    const RenderQuizzes = () => {

        const makeQuestion = () => {
            const filterQuestion = questions.find((i, index) => index === questionSelect);
            // console.log("filterQuestion", filterQuestion, questions);
            return (
                <div className="container border p-2">
                    <QuizComponent
                        module={dataQuiz?.title || ""}
                        dataQuiz={dataQuiz}
                        attemptsUserQuiz={attemptsUserQuiz}
                        counterRef={counterRef}
                        questions={filterQuestion}
                        totalQuestions={questions.length}
                        setTotalProgress={setTotalProgress}
                        currentQuestion={currentQuestion}
                        setCurrentQuestion={setCurrentQuestion}
                        userAnswers={userAnswers}
                        minimNote={minimNote}
                        setUserAnswers={setUserAnswers}
                        correctCount={correctCount}
                        quizCompleted={quizCompleted}
                        selectedAnswer={selectedAnswer}
                        setQuizCompleted={setQuizCompleted}
                        setSelectedAnswer={setSelectedAnswer}
                        handleAnswerClick={handleAnswerClick}
                        handleNextQuestion={handleNextQuestion}
                        handleInitQuiz={handleInitQuiz}
                        handleFinishQuiz={handleFinishQuiz}
                        handleResetQuestion={handleResetQuestion}
                        extraOpportunity={extraOpportunityQuiz}
                        enableQuiz={previousResults.length === 0 ? true : false}
                        questionActive={questionSelect}
                        answerSelects={answerSelects}
                        setAnswerSelects={setAnswerSelects}
                    />
                </div>
            )
        }

        const handleClickOption = (index) => {
            if (currentQuestion > -1 && !quizCompleted) {
                MySwal.fire({
                    title: '¿Estas seguro que quieres cambiar de cuestionario?',
                    text: 'Se perdera el todo el progreso',
                    icon: "info"
                }).then(({ isConfirmed }) => {
                    if (isConfirmed) {
                        setQuestionSelect(index)
                        setTimerStart(false);
                        setTimerRestart(true);
                        handleResetQuestion()
                        setTimerRestart(false);
                    }
                })
            } else {
                setQuestionSelect(index)
                setTimerStart(false);
                setTimerRestart(true);
                handleResetQuestion()
                setTimerRestart(false);
            }
        }

        return (
            <div>
                {
                    questions.length > 0 ? (
                        questions.length > 1 ? (
                            <div>
                                <div className="d-flex">
                                    {
                                        questions.map((q, index) => (
                                            <div
                                                key={`button-qz-${index}`}
                                                style={
                                                    questionSelect === index ?
                                                        { backgroundColor: "#810000", color: "#FFF" }
                                                        :
                                                        { backgroundColor: "#CCCCCC", color: "#000" }
                                                }
                                                className="btn mx-1 my-2 py-3 px-4"
                                                onClick={() => handleClickOption(index)}
                                            >
                                                <b>{`Cuestionario ${index + 1}`}</b>
                                            </div>
                                        ))
                                    }
                                </div>
                                {(<div>{makeQuestion()}</div>)}
                            </div>
                        ) : (
                            questions.map((item, index) => (
                                <div key={`frm-qz-${index}`} className="container border p-2">
                                    <QuizComponent
                                        module={dataQuiz?.title || ""}
                                        dataQuiz={dataQuiz}
                                        attemptsUserQuiz={attemptsUserQuiz}
                                        counterRef={counterRef}
                                        questions={item}
                                        totalQuestions={questions.length}
                                        setTotalProgress={setTotalProgress}
                                        currentQuestion={currentQuestion}
                                        setCurrentQuestion={setCurrentQuestion}
                                        userAnswers={userAnswers}
                                        minimNote={minimNote}
                                        setUserAnswers={setUserAnswers}
                                        correctCount={correctCount}
                                        incorrectCount={incorrectCount}
                                        unansweredCount={unansweredCount}
                                        quizCompleted={quizCompleted}
                                        selectedAnswer={selectedAnswer}
                                        setCorrectCount={setCorrectCount}
                                        setIncorrectCount={setIncorrectCount}
                                        setUnansweredCount={setUnansweredCount}
                                        setQuizCompleted={setQuizCompleted}
                                        setSelectedAnswer={setSelectedAnswer}
                                        handleAnswerClick={handleAnswerClick}
                                        handleNextQuestion={handleNextQuestion}
                                        handleInitQuiz={handleInitQuiz}
                                        handleFinishQuiz={handleFinishQuiz}
                                        handleResetQuestion={handleResetQuestion}
                                        extraOpportunity={extraOpportunityQuiz}
                                        enableQuiz={previousResults.length === 0 ? true : false}
                                        answerSelects={answerSelects}
                                        setAnswerSelects={setAnswerSelects}
                                    />
                                </div>
                            ))
                        )
                    ) : (
                        <div className="d-flex justify-content-center py-5">
                            <h6 className="text-muted fst-italic">No se encontró ningún cuestionario</h6>
                        </div>
                    )
                }
            </div>
        )

    }

    return (
        <div>
            <div className="row">
                <HeaderComponent />
            </div>
            <div className="row">
                <MenuComponent />
            </div>
            <div className="row p-lg-5 align-content-center" style={{ backgroundColor: "#AAAAAA" }}>
                <div className="col-lg-4 col-md-12 d-flex justify-content-center mt-2 pe-0">
                    <h2>{dataQuiz?.title || ""}</h2>
                </div>
                <div className="col-lg-4 col-md-12 pe-0">
                    <div className="container">
                        <label style={{ fontSize: 18 }}>Nivel de Avance - {totalProgress || 0} %</label>
                        <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                            <div className="progress-bar bg-dark" style={{ width: `${totalProgress}%` }}></div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-12 text-center pe-0">
                    <div className="d-flex justify-content-center mt-3 pe-0">
                        <h4 className="me-2">Tiempo restante</h4>
                        <CountdownComponent
                            onTimeout={timerStart}
                            completeTime={completeTimer}
                            totalTime={time}
                            restart={timerRestart}
                            finalTime={setFinalTime}
                            timerRef={timerRef}
                        />
                    </div>
                </div>
            </div>
            <div className="container my-4">
                <div className="row">
                    <Accordion title={"Presentación"} content={<RenderPresentation data={dataPresentation} />} />
                </div>
                <div className="row">
                    <Accordion
                        title={"Cuestionario"}
                        content={<RenderQuizzes />}
                    />
                </div>
            </div>
        </div>
    )
}

export default CoursePage;
