import React, { useState, useEffect } from 'react';
import "./styles.css"

const QuizComponent = ({
    module,
    dataQuiz,
    attemptsUserQuiz,
    questions = [],
    userAnswers,
    currentQuestion,
    minimNote,
    correctCount,
    incorrectCount,
    unansweredCount,
    quizCompleted,
    selectedAnswer,
    handleAnswerClick,
    handleNextQuestion,
    handleInitQuiz,
    handleFinishQuiz,
    handleResetQuestion,
    extraOpportunity,
    enableQuiz
}) => {
    const [answerSelects, setAnswerSelects] = useState([])

    console.log("COMPOENET QUIZ ==>", questions);

    if (quizCompleted) {
        return (
            <div className='text-center'>
                {
                    correctCount >= minimNote ? (
                        <>
                            <h2>Ganaste la prueba ¡Felicidades!</h2>
                            <h3 className='m-1'><b>Pasaste con {(correctCount * 100) / questions.length} puntos</b></h3>
                            <p><b>Pasaste a Siguiente módulo</b></p>
                        </>
                    ) : (
                        <>
                            <h2 className='mt-3'>¡No has superado el curso!</h2>
                            <h3 className='my-3'><b>El puntaje mínimo es del 80%, contacta a tu supervisor para más indicaciones.</b></h3>
                            {console.log("??¡?¡?¡22?¡?¡?¡??", dataQuiz.attempts, attemptsUserQuiz.length, attemptsUserQuiz)}
                            {
                                dataQuiz.attempts > (attemptsUserQuiz.length + 1) ? (
                                    <button
                                        className='btn btn-sm text-white mb-3'
                                        style={{ backgroundColor: '#810000' }}
                                        onClick={handleResetQuestion}
                                    >
                                        Repetir Cuestionario
                                    </button>
                                ) : (
                                    <h5><b>{"Ya no tienes oportunidades en este modulo"}</b></h5>
                                )
                            }
                        </>
                    )
                }
            </div>
        );
    }

    const currentQuestionObj = questions[currentQuestion];

    if (currentQuestion === -1) {
        return (
            <div className='container p-4'>
                {
                    questions.length > 0 ? (
                        <div className='jumbotron'>
                            <h5><b>{`Bienvenido a tu ${dataQuiz?.title || ""}`}</b></h5>
                            <p>Marque el o los incisos con la respuesta correcta.</p>
                            <div className='d-flex justify-content-center m-3'>
                                {console.log("??¡?¡?11¡?¡?¡?¡??", enableQuiz, dataQuiz.attempts, attemptsUserQuiz, attemptsUserQuiz.length)}
                                {
                                    enableQuiz ? (
                                        dataQuiz.attempts > attemptsUserQuiz.length ? (
                                            <button
                                                className='btn btn-md text-white'
                                                style={{ backgroundColor: '#810000' }}
                                                onClick={() => handleInitQuiz()}
                                            >
                                                Iniciar Cuestionario
                                            </button>
                                        ) : (
                                            extraOpportunity?.idUserAttemptsQuiz ? (
                                                (dataQuiz.attempts + extraOpportunity.attempts) > attemptsUserQuiz.length ? (
                                                    <button
                                                        className='btn btn-md text-white'
                                                        style={{ backgroundColor: '#810000' }}
                                                        onClick={() => handleInitQuiz()}
                                                    >
                                                        Iniciar Cuestionario
                                                    </button>
                                                ) : (
                                                    <h5>
                                                        <b>{"Ya no tienes oportunidades disponibles para este cuestionario"}</b>
                                                    </h5>
                                                )
                                            ) : (
                                                <h5>
                                                    {console.log("NPI ...........", dataQuiz.attempts,"+",extraOpportunity.attempts)}
                                                    <b>{"Ya no tienes oportunidades disponibles para este cuestionario"}</b>
                                                </h5>
                                            )
                                        )
                                    ) : (
                                        <h5>
                                            <b>{"Ya has aprobado este módulo"}</b>
                                        </h5>
                                    )
                                }

                            </div>
                        </div>
                    ) : (
                        <div className="d-flex justify-content-center py-5">
                            <h6 className="text-muted fst-italic">No se encontro ningún cuestionario</h6>
                        </div>
                    )
                }
            </div>
        )
    }


    if (!currentQuestionObj) {
        return (
            <div>
                <p>Error: Question not found</p>
            </div>
        );
    }
console.log(currentQuestionObj);

    const handleClickAnswer = (index) => {
        handleAnswerClick(index)
        setAnswerSelects([...answerSelects, index])
    }

    return (
        <div className='container border-1 p-4'>
            <h6>{"PREGUNTA "} {currentQuestion + 1}</h6>
            <h5 className='mt-3 mb-4'>{currentQuestionObj.question}</h5>
            <ol type='A'>
                {currentQuestionObj.answers.map((answer, index) => {
                    if (answer.type === 'text') {
                        if (currentQuestionObj.correctIndex.length > 1) {
                            return (
                                <li
                                    key={index}
                                    onClick={() => handleClickAnswer(index)}
                                    className={`lower-alpha m-1 mb-2`}
                                >
                                    <div
                                        className='border-0 rounded-3 shadow p-3'
                                        style={{
                                            backgroundColor:
                                                userAnswers[currentQuestion] !== null &&
                                                ((questions[currentQuestion].correctIndex.includes(selectedAnswer))
                                                    ? '#7cb425'
                                                    : index === selectedAnswer
                                                        ? '#E70202'
                                                        : 'transparent'),
                                            color:
                                                userAnswers[currentQuestion] !== null &&
                                                    (questions[currentQuestion].correctIndex.includes(selectedAnswer) &&
                                                        index === selectedAnswer)
                                                    ? '#FFF'
                                                    : index === selectedAnswer
                                                        ? '#FFF'
                                                        : '#000'
                                        }}
                                    >
                                        {answer.description}
                                    </div>
                                </li>
                            )
                        }
                        return (
                            <li
                                key={index}
                                onClick={() => handleAnswerClick(index)}
                                className={`lower-alpha m-1 mb-2`}
                            >
                                <div
                                    className='border-0 rounded-3 shadow p-3'
                                    style={{
                                        backgroundColor:
                                            userAnswers[currentQuestion] !== null &&
                                            ((questions[currentQuestion].correctIndex.includes(selectedAnswer) && index === selectedAnswer)
                                                ? '#7cb425'
                                                : index === selectedAnswer
                                                    ? '#E70202'
                                                    : 'transparent'),
                                        color:
                                            userAnswers[currentQuestion] !== null &&
                                                (questions[currentQuestion].correctIndex.includes(selectedAnswer) &&
                                                    index === selectedAnswer)
                                                ? '#FFF'
                                                : index === selectedAnswer
                                                    ? '#FFF'
                                                    : '#000'
                                    }}
                                >
                                    {answer.description}
                                </div>
                            </li>
                        )
                    }
                    return (
                        <li key={index} className={`lower-alpha m-1 mb-2`}>
                            <div className='border-0 rounded-3 shadow p-3'>
                                <input
                                    className="form-control form-control-md"
                                    aria-label=".form-control-sm example"
                                    type="text"
                                    onChange={({ target }) => console.log(target.value)}
                                />
                            </div>
                        </li>
                    )
                })}
            </ol>
            <div className='d-flex justify-content-end m-3'>
                {currentQuestion === questions.length - 1 ? (
                    <button
                        className='btn btn-sm text-white'
                        style={{ backgroundColor: '#810000' }}
                        onClick={handleFinishQuiz}
                    >
                        Finalizar Cuestionario
                    </button>
                ) : (
                    <button
                        className='btn btn-sm text-white'
                        style={{ backgroundColor: '#810000' }}
                        onClick={handleNextQuestion}
                    >
                        Siguiente Pregunta
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuizComponent;
