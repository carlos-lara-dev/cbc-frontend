import { useEffect, useState } from "react"
import DataTable from 'react-data-table-component';
import HeaderComponent from "../../../components/HeaderComponent"
import MenuComponent from "../../../components/MenuComponent"
import { getQuestionsAllService, postAnswerService, postQuestionService, putAnswerService, putQuestionService } from "../../../services/settingsFnc";
import { FiEdit, FiMoreVertical, FiPlus } from "react-icons/fi";
import { getModulesService } from "../../../services/userFnc";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import "../tableStyle.css";

const MySwal = withReactContent(Swal);
const QuestionCatalog = () => {
  const [dataQuestion, setDataQuestion] = useState([])
  const [dataQuiz, setDataQuiz] = useState([])
  const [questionSelect, setQuestionSelect] = useState([])
  const [quizSelected, setQuizSelected] = useState([])
  const [noQuestion, setNoQuestion] = useState(1)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [isCorrectAnswer, setIsCorrectAnswere] = useState(false)
  const [scoreAnswer, setScoreAnswer] = useState(0)
  const [typeAnswer, setTypeAnswer] = useState(0)

  const getData = async () => {
    try {
      const data = await getQuestionsAllService()
      if (data?.data) {
        if (data.data.length > 0) {
          let tmpArray = data.data.sort((a, b) => a.idQuestion - b.idQuestion)
          setDataQuestion(tmpArray)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getModules = async () => {
    try {
      const data = await getModulesService()
      if (data?.data) {
        if (data.data.length > 0) {
          let tmpArray = data.data.sort((a, b) => a.idQuiz - b.idQuiz)
          setDataQuiz(tmpArray)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData();
    getModules();
  }, [])

  const handleClickSave = async () => {
    try {
      const request = await postQuestionService({
        description: question,
        idQuiz: quizSelected,
        noQuestion
      })

      if (!request?.error) {
        getData();
        return MySwal.fire({
          title: 'Excelente',
          text: 'El registro fue creado exitosamente',
          icon: 'success'
        })
      } else {
        return MySwal.fire({
          title: 'Atención',
          text: 'No se pudo crear el registro',
          icon: 'info'
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleClickQuestion = async (id) => {
    try {
      const searchQuestion = dataQuestion.find(item => item.idQuestion === id)
      setQuizSelected(searchQuestion.idQuiz)
      setNoQuestion(searchQuestion.noQuestion)
      setQuestion(searchQuestion.description)
      setQuestionSelect(searchQuestion.idQuestion)
    } catch (error) {
      console.log(error)
    }
  }

  const handleClickUpdate = async () => {
    try {
      const request = await putQuestionService(questionSelect, {
        description: question,
        idQuiz: quizSelected,
        noQuestion
      })

      if (!request?.error) {
        getData();
        return MySwal.fire({
          title: 'Excelente',
          text: 'El registro fue creado exitosamente',
          icon: 'success'
        })
      } else {
        return MySwal.fire({
          title: 'Atención',
          text: 'No se pudo crear el registro',
          icon: 'info'
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleClickInactive = async (row) => {
    try {
      let title = `¿Esta suguro de ${row.state === "Activo" ? "Inactivar" : "Activar"} el registro?`
      MySwal.fire({
        title,
        icon: "question"
      }).then(({isConfirmed}) => {
        if (isConfirmed) {
          const request = putQuestionService(row.idQuestion, {
            state: row.state === "Activo" ? "Inactivo" : "Activo"
          })
          getData();
          if (!request?.error) {
            return MySwal.fire({
              title: 'Excelente',
              text: 'Proceso completado',
              icon: 'success'
            })
          } else {
            return MySwal.fire({
              title: 'Atención',
              text: 'Algo salio mal',
              icon: 'info'
            })
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleClickSaveAnswer = async () => {
    try {
      const request = await postAnswerService({
        idQuestion: question,
        description: answer,
        isCorrect: isCorrectAnswer,
        value: scoreAnswer,
        type: typeAnswer
      })

      if (!request?.error) {
        getData();
        return MySwal.fire({
          title: 'Excelente',
          text: 'El registro fue creado exitosamente',
          icon: 'success'
        })
      } else {
        return MySwal.fire({
          title: 'Atención',
          text: 'No se pudo crear el registro',
          icon: 'info'
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleClickAnswer = async (idQuestion, idAnswer) => {
    try {
      const searchQuestion = dataQuestion.find(item => item.idQuestion === idQuestion)
      const searchAnswer = searchQuestion.Answers.find(item => item.idAnswers === idAnswer)
      setAnswer(searchAnswer.description)
      setIsCorrectAnswere(searchAnswer.isCorrect)
      setScoreAnswer(searchAnswer.value)
      setTypeAnswer(searchAnswer.type)
      setQuizSelected(searchAnswer.idAnswers)
    } catch (error) {
      console.log(error)
    }
  }

  const handleClickUpdateAnswer = async () => {
    try {
      const request = await putAnswerService(quizSelected, {
        description: answer,
        isCorrect: isCorrectAnswer,
        value: scoreAnswer,
        type: typeAnswer
      })

      if (!request?.error) {
        getData();
        return MySwal.fire({
          title: 'Excelente',
          text: 'El registro fue creado exitosamente',
          icon: 'success'
        })
      } else {
        return MySwal.fire({
          title: 'Atención',
          text: 'No se pudo crear el registro',
          icon: 'info'
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const ExpandedComponent = ({data}) => {
    const {Answers} = data;
    return (
      <div className="mx-1">
        <div className="d-flex justify-content-start">
          <div
            onClick={() => setQuestion(data.idQuestion)}
            className="btn btn-primary btn-md m-3"
            style={{ backgroundColor: "#810000", borderColor: "#810000" }}
            data-bs-toggle="modal"
            data-bs-target="#create-modal-answer"
          >
            <FiPlus />
          </div>
        </div>
          {
            Answers.length > 0 ? (
              Answers.map(item => (
                <div className="card m-1">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-1">
                        <div
                          className="btn border-0"
                          onClick={() => {
                            handleClickAnswer(data.idQuestion, item.idAnswers)
                          }}
                          data-bs-toggle="modal"
                          data-bs-target="#update-modal-answer"
                        >
                          <FiEdit />
                        </div>
                      </div>
                      <div className="col">
                        <p style={{fontSize: 12}}>{"Respuesta:"}</p>
                        <p>{item.description}</p>
                      </div>
                      <div className="col">
                      <p style={{fontSize: 12}}>{"Correcta/Incorrecta:"}</p>
                        <p>{item.isCorrect ? "Respuesta Correcta" : "Respuesta Incorrecta"}</p>
                      </div>
                      <div className="col">
                      <p style={{fontSize: 12}}>{"Puntos:"}</p>
                        <p>{`${item.value} PTS`}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center my-5'>
                <h6 className='text-muted'>{`No se encontraron respuestas`}</h6>
              </div>
            )
          }
      </div>
    )
  }

  const customStyles = {
    table: {
    },
  };

  const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
  };

  const columns = [
    {
      name: 'id',
      maxWidth: "100px",
      selector: row => row.idQuestion,
    },
    {
      name: 'Modulo',
      maxWidth: "200px",
      selector: row => row?.Quiz.title,
    },
    {
      name: 'Questionario',
      maxWidth: "100px",
      selector: row => row.noQuestion,
    },
    {
      name: 'Pregunta',
      selector: row => row.description,
    },
    {
      name: 'Estado',
      maxWidth: "100px",
      selector: row => row.state,
    },
    {
      name: 'Acción',
      maxWidth: "150px",
      sortable: true,
      sortField: "idTicketType",
      cell: (row) => (
        <div className="dropdown">
          <div className="btn border-0" data-bs-toggle="dropdown" aria-expanded="false">
            <FiMoreVertical />
          </div>
          <ul className="dropdown-menu dropdown-menu">
            <li>
              <div
                className="btn dropdown-item"
                onClick={() => handleClickQuestion(row.idQuestion)}
                data-bs-toggle="modal"
                data-bs-target="#update-modal"
              >Editar</div>
            </li>
            <li>
              <div
                className="btn dropdown-item"
                onClick={() => handleClickInactive(row)}
              >{row.state === "Activo" ? "Inactivar" : "Activar"}</div>
            </li>
          </ul>
        </div>
      ),
    }
  ]

  return (
    <div>
      <HeaderComponent />
      <MenuComponent />
      <div className="container">
        <div className='react-dataTable'>
          <DataTable
            noHeader
            subHeader
            sortServer
            responsive
            pagination
            paginationComponentOptions={paginationComponentOptions}
            data={dataQuestion}
            columns={columns}
            noDataComponent={<div className='text-center'>{"cargando..."}</div>}
            expandableRows
            expandableRowsComponent={ExpandedComponent}
            customStyles={customStyles}
            subHeaderComponent={
              <div>
                <div
                  className="btn btn-primary btn-md"
                  style={{ backgroundColor: "#810000", borderColor: "#810000" }}
                  data-bs-toggle="modal"
                  data-bs-target="#create-modal"
                >
                  <FiPlus />
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* CREAR TAREA */}
      <div className="modal fade" id="create-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Crear Cuestionario</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="my-1">
                <label className="form-label fw-semibold">Módulo</label>
                <select
                    className="form-select rounded-pill"
                    aria-label="Default select example"
                    onChange={(e) => setQuizSelected(e.target.value)}
                >
                    <option key={"D-0"} value={0} onClick={() => setQuizSelected(null)}>
                        <span className="dropdown-item"></span>
                    </option>
                    {
                        dataQuiz.map((item) => (
                            <option key={`D-${item.idQuiz}`} value={item.idQuiz} onClick={() => setQuizSelected(item.idQuiz)}>
                                <span className="dropdown-item">{item.title}</span>
                            </option>
                        ))
                    }
                </select>
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">No. Cuestionario</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="number"
                    placeholder="No. Cuestionario"
                    aria-label=".form-control-sm example"
                    value={noQuestion}
                    onChange={({ target }) => setNoQuestion(target.value)}
                />
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Pregunta</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="text"
                    placeholder="Nombre módulo"
                    aria-label=".form-control-sm example"
                    value={question}
                    onChange={({ target }) => setQuestion(target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <div className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</div>
              <div
                style={{ backgroundColor: "#810000", borderColor: "#810000" }}
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleClickSave}
              >
                Crear
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UPDATE TAREA */}
      <div className="modal fade" id="update-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Crear Cuestionario</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="my-1">
                <label className="form-label fw-semibold">Módulo</label>
                <select
                    className="form-select rounded-pill"
                    aria-label="Default select example"
                    onChange={(e) => setQuizSelected(e.target.value)}
                >
                    <option key={"D-0"} value={0} onClick={() => setQuizSelected(null)}>
                        <span className="dropdown-item"></span>
                    </option>
                    {
                        dataQuiz.map((item) => (
                            <option
                              selected={item.idQuiz === quizSelected}
                              key={`D-${item.idQuiz}`}
                              value={item.idQuiz}
                              onClick={() => setQuizSelected(item.idQuiz)}
                            >
                                <span className="dropdown-item">{item.title}</span>
                            </option>
                        ))
                    }
                </select>
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">No. Cuestionario</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="number"
                    placeholder="No. Cuestionario"
                    aria-label=".form-control-sm example"
                    value={noQuestion}
                    onChange={({ target }) => setNoQuestion(target.value)}
                />
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Pregunta</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="text"
                    placeholder="Pregunta"
                    aria-label=".form-control-sm example"
                    value={question}
                    onChange={({ target }) => setQuestion(target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <div className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</div>
              <div
                style={{ backgroundColor: "#810000", borderColor: "#810000" }}
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleClickUpdate}
              >
                Actualizar
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CREAR ANSWER */}
      <div className="modal fade" id="create-modal-answer" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Crear Respuesta</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="my-1">
                <label className="form-label fw-semibold">Respuesta</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="text"
                    placeholder="Respuesta"
                    aria-label=".form-control-sm example"
                    value={answer}
                    onChange={({ target }) => setAnswer(target.value)}
                />
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Respuesta Correcta/Incorrecta</label>
                <select
                    className="form-select rounded-pill"
                    aria-label="Default select example"
                    onChange={(e) => setIsCorrectAnswere(e.target.value)}
                >
                    <option key={"D-0"} value={null} onClick={() => setIsCorrectAnswere(null)}>
                        <span className="dropdown-item"></span>
                    </option>
                    <option key={"D-1"} value={true} onClick={() => setIsCorrectAnswere(true)}>
                        <span className="dropdown-item">Correcta</span>
                    </option>
                    <option key={"D-2"} value={false} onClick={() => setIsCorrectAnswere(false)}>
                        <span className="dropdown-item">Incorrecta</span>
                    </option>
                </select>
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Punteo</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="text"
                    placeholder="Nombre módulo"
                    aria-label=".form-control-sm example"
                    value={scoreAnswer}
                    onChange={({ target }) => setScoreAnswer(target.value)}
                />
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Tipo de respuesta</label>
                <select
                    className="form-select rounded-pill"
                    aria-label="Default select example"
                    onChange={(e) => setTypeAnswer(e.target.value)}
                >
                    <option value={null} onClick={() => setTypeAnswer(null)}>
                        <span className="dropdown-item"></span>
                    </option>
                    <option value={"select"} onClick={() => setTypeAnswer("select")}>
                        <span className="dropdown-item">Selección</span>
                    </option>
                    <option value={"input"} onClick={() => setTypeAnswer("input")}>
                        <span className="dropdown-item">Escritura</span>
                    </option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <div className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</div>
              <div
                style={{ backgroundColor: "#810000", borderColor: "#810000" }}
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleClickSaveAnswer}
              >
                Crear
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UPDATE ANSWER */}
      <div className="modal fade" id="update-modal-answer" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Actualizar Respuesta</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="my-1">
                <label className="form-label fw-semibold">Respuesta</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="text"
                    placeholder="Respuesta"
                    aria-label=".form-control-sm example"
                    value={answer}
                    onChange={({ target }) => setAnswer(target.value)}
                />
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Respuesta Correcta/Incorrecta</label>
                <select
                    className="form-select rounded-pill"
                    aria-label="Default select example"
                    onChange={(e) => setIsCorrectAnswere(e.target.value)}
                >
                    <option key={"D-0"} value={null} onClick={() => setIsCorrectAnswere(null)}>
                        <span className="dropdown-item"></span>
                    </option>
                    <option key={"D-1"} selected={isCorrectAnswer === true} value={true} onClick={() => setIsCorrectAnswere(true)}>
                        <span className="dropdown-item">Correcta</span>
                    </option>
                    <option key={"D-2"} selected={isCorrectAnswer === false} value={false} onClick={() => setIsCorrectAnswere(false)}>
                        <span className="dropdown-item">Incorrecta</span>
                    </option>
                </select>
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Punteo</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="text"
                    placeholder="Nombre módulo"
                    aria-label=".form-control-sm example"
                    value={scoreAnswer}
                    onChange={({ target }) => setScoreAnswer(target.value)}
                />
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Tipo de respuesta</label>
                <select
                    className="form-select rounded-pill"
                    aria-label="Default select example"
                    onChange={(e) => setTypeAnswer(e.target.value)}
                >
                    <option value={null} onClick={() => setTypeAnswer(null)}>
                        <span className="dropdown-item"></span>
                    </option>
                    <option value={"select"} selected={typeAnswer === "select"} onClick={() => setTypeAnswer("select")}>
                        <span className="dropdown-item">Selección</span>
                    </option>
                    <option value={"input"} selected={typeAnswer === "input"} onClick={() => setTypeAnswer("input")}>
                        <span className="dropdown-item">Escritura</span>
                    </option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <div className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</div>
              <div
                style={{ backgroundColor: "#810000", borderColor: "#810000" }}
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleClickUpdateAnswer}
              >
                Actualizar
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default QuestionCatalog