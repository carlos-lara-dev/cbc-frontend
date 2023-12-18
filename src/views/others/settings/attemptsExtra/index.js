import { useEffect, useState } from 'react';
import { FiMoreVertical, FiPlus } from 'react-icons/fi';
import { getExtraAnswerServices, postAttemptsExtraSerivce, putAttemptsExtraSerivce } from '../../../services/settingsFnc';
import { getAllUsersService, getModulesService } from '../../../services/userFnc';
import DataTable from 'react-data-table-component';
import HeaderComponent from "../../../components/HeaderComponent"
import MenuComponent from "../../../components/MenuComponent"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import "../tableStyle.css";

const MySwal = withReactContent(Swal);
const AttemptsExtra = () => {
  const [dataAnswers, setDataAnswers] = useState([])
  const [dataUsers, setDataUsers] = useState([])
  const [dataQuizzes, setDataQuizzes] = useState([])
  const [answerSelected, setAnswerSelected] = useState(null)
  const [userSelected, setUserSelected] = useState(null)
  const [quizSelected, setQuizSelected] = useState(null)
  const [attemptsValue, setAttemptsValue] = useState(0)

  const getData = async () => {
    try {
      const request = await getExtraAnswerServices()
      console.log("REQUEST =--->", request)
      if (request?.data) {
        setDataAnswers(request.data)
      }
    } catch (error) {
      console.log("[ ERROR ]", error)
    }
  }

  const getUsers = async () => {
    try {
      const request = await getAllUsersService()
      if (request?.data) {
        setDataUsers(request.data)
      }
    } catch (error) {
      console.log("[ ERROR ]", error)
    }
  }

  const getQuizzes = async () => {
    try {
      const request = await getModulesService()
      if (request?.data) {
        setDataQuizzes(request.data)
      }
    } catch (error) {
      console.log("[ ERROR ]", error)
    }
  }

  useEffect(() => {
    getData()
    getUsers()
    getQuizzes()
  }, [])

  const cleanInputs = () => {
    setUserSelected(null)
    setQuizSelected(null)
  }

  const handleClickSave = async () => {
    try {
      if (userSelected !== null && quizSelected !== null && attemptsValue > 0) {
        const request = await postAttemptsExtraSerivce({
          idUser: userSelected,
          idQuiz: quizSelected,
          attempts: attemptsValue
        })

        cleanInputs();
        getData();
        if (!request?.error) {
          getData();
          return MySwal.fire({
            title: 'Excelente',
            text: 'El registro fue creado exitosamente',
            icon: 'success'
          })
        } else {
          getData();
          return MySwal.fire({
            title: 'Atención',
            text: 'No se pudo crear el registro',
            icon: 'info'
          })
        }
      } else {
        return MySwal.fire({
          title: 'Atención',
          text: 'Debes ingresar todos los datos',
          icon: 'info'
        })
      }
    } catch (error) {
      console.log("[ ERROR ] =>", error)
    }
  }

  const handleClickAnswer = async (id) => {
    try {
      const searchAnswer = dataAnswers.find(item => item.idUserAttemptsQuiz === id)
      setQuizSelected(searchAnswer.idQuiz)
      setUserSelected(searchAnswer.idUser)
      setAttemptsValue(searchAnswer.attempts)
      setAnswerSelected(searchAnswer.idUserAttemptsQuiz)
    } catch (error) {
      console.log("ERROR ===> ", error)
    }
  }

  const handleClickUpdate = async () => {
    try {
      if (userSelected !== null && quizSelected !== null && attemptsValue > 0) {
        const request = await putAttemptsExtraSerivce(answerSelected, {
          idUser: userSelected,
          idQuiz: quizSelected,
          attempts: attemptsValue
        })

        cleanInputs();
        getData();
        if (!request?.error) {
          getData();
          return MySwal.fire({
            title: 'Excelente',
            text: 'El registro fue actualizado exitosamente',
            icon: 'success'
          })
        } else {
          getData();
          return MySwal.fire({
            title: 'Atención',
            text: 'No se pudo actualizar el registro',
            icon: 'info'
          })
        }
      } else {
        return MySwal.fire({
          title: 'Atención',
          text: 'Debes ingresar todos los datos',
          icon: 'info'
        })
      }
    } catch (error) {
      console.log("[ ERROR ] =>", error)
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
          const request = putAttemptsExtraSerivce(row.idUserAttemptsQuiz, {
            state: row.state === "Activo" ? "Inactivo" : "Activo"
          })
          getData();
          if (!request?.error) {
            getData();
            return MySwal.fire({
              title: 'Excelente',
              text: 'Proceso completado',
              icon: 'success'
            })
          } else {
            getData();
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

  const customStyles = {
    table: {
      style: {
        minHeight: '200px',
      },
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
      selector: row => row.idUserAttemptsQuiz,
    },
    {
      name: 'Nombre',
      selector: row => row.User.name,
    },
    {
      name: 'Módulo',
      selector: row => row.Quiz.title,
    },
    {
      name: 'Oportunidades',
      selector: row => row.attempts,
    },
    {
      name: 'Estado',
      selector: row => row.state,
    },
    {
      name: 'Acción',
      minWidth: "100px",
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
                onClick={() => handleClickAnswer(row.idUserAttemptsQuiz)}
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
  console.log({
    userSelected,
    quizSelected,
    attemptsValue
  });
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
            data={dataAnswers}
            columns={columns}
            noDataComponent={<div className='text-center'>{"No se encontrarón datos"}</div>}
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

      {/* CREAR */}
      <div className="modal fade" id="create-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Agregar Oportunidad</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="my-1">
                <label className="form-label fw-semibold">Usuario</label>
                <select
                  className="form-select rounded-pill"
                  aria-label="Default select example"
                  onChange={(e) => setUserSelected(e.target.value)}
                >
                  <option key={"U-0"} value={null} onClick={() => setUserSelected(null)}>
                    <span className="dropdown-item"></span>
                  </option>
                  {
                    dataUsers.map((item) => (
                      <option key={`U-${item.idUser}`} value={item.idUser} onClick={() => setUserSelected(item.idUser)}>
                        <span className="dropdown-item">{item.name}</span>
                      </option>
                    ))
                  }
                </select>
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Módulo</label>
                <select
                  className="form-select rounded-pill"
                  aria-label="Default select example"
                  onChange={(e) => setQuizSelected(e.target.value)}
                >
                  <option key={"Q-0"} value={null} onClick={() => setQuizSelected(null)}>
                    <span className="dropdown-item"></span>
                  </option>
                  {
                    dataQuizzes.map((item) => (
                      <option key={`U-${item.idQuiz}`} value={item.idQuiz} onClick={() => setQuizSelected(item.idQuiz)}>
                        <span className="dropdown-item">{item.title}</span>
                      </option>
                    ))
                  }
                </select>
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Oportunidades</label>
                <input
                  className="form-control form-control-md rounded-pill"
                  type="number"
                  min={0}
                  placeholder="Oportunidades"
                  aria-label=".form-control-sm example"
                  value={attemptsValue}
                  onChange={({ target }) => setAttemptsValue(target.value)}
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

      {/* UPDATE */}
      <div className="modal fade" id="update-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Actualizar Oportunidad</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="my-1">
                <label className="form-label fw-semibold">Usuario</label>
                <select
                  className="form-select rounded-pill"
                  aria-label="Default select example"
                  onChange={(e) => setUserSelected(e.target.value)}
                >
                  <option key={"U-0"} value={null} onClick={() => setUserSelected(null)}>
                    <span className="dropdown-item"></span>
                  </option>
                  {
                    dataUsers.map((item) => (
                      <option
                        selected={item.idUser === userSelected}
                        key={`U-${item.idUser}`}
                        value={item.idUser}
                        onClick={() => setUserSelected(item.idUser)}
                      >
                        <span className="dropdown-item">{item.name}</span>
                      </option>
                    ))
                  }
                </select>
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Módulo</label>
                <select
                  className="form-select rounded-pill"
                  aria-label="Default select example"
                  onChange={(e) => setQuizSelected(e.target.value)}
                >
                  <option key={"Q-0"} value={null} onClick={() => setQuizSelected(null)}>
                    <span className="dropdown-item"></span>
                  </option>
                  {
                    dataQuizzes.map((item) => (
                      <option
                        selected={item.idQuiz === quizSelected}
                        key={`U-${item.idQuiz}`}
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
                <label className="form-label fw-semibold">Oportunidades</label>
                <input
                  className="form-control form-control-md rounded-pill"
                  type="number"
                  min={0}
                  placeholder="Oportunidades"
                  aria-label=".form-control-sm example"
                  value={attemptsValue}
                  onChange={({ target }) => setAttemptsValue(target.value)}
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
    </div>
  )
}

export default AttemptsExtra;