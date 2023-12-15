import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import HeaderComponent from "../../../components/HeaderComponent"
import MenuComponent from "../../../components/MenuComponent"
import { getModulesService } from "../../../services/userFnc"
import "../tableStyle.css";
import { FiMoreVertical, FiPlus } from "react-icons/fi";
import { postQuizService, putQuizService } from "../../../services/settingsFnc";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const ModuleCatalog = () => {
  const navigate = useNavigate ()
  const [dataModule, setDataModule] = useState([])
  const [nameModule, setNameModule] = useState("")
  const [descriptionModule, setDescriptionModule] = useState("")
  const [imageModule, setImageModule] = useState("")
  const [durationTime, setDurationTime] = useState(15)
  const [attemptsModule, setAttemptsModule] = useState(1)
  const [moduleSelected, setModuleSelected] = useState(null)

  const getData = async () => {
    try {
      const data = await getModulesService()
      if (data?.data) {
        if (data.data.length > 0) {
          let tmpArray = data.data.sort((a, b) => a.idQuiz - b.idQuiz)
          setDataModule(tmpArray)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData();
  }, [])

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

  const clearInputs = () => {
    setNameModule("")
    setDescriptionModule("")
    setDurationTime(15)
    setAttemptsModule(1)
  }

  const handleClickSave = async () => {
    try {
      if (nameModule !== "" && descriptionModule !== "" && durationTime > 0 && imageModule !== "" && attemptsModule > 0) {
        const request = await postQuizService({
          name: nameModule,
          description: descriptionModule,
          durationTime,
          image: imageModule,
          attempts: attemptsModule
        });
        clearInputs();
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
      console.log(error)
    }
  }

  const handleClickModule = async (id) => {
    try {
      const searchModule = dataModule.find(item => item.idQuiz === id)
      setModuleSelected(searchModule.idQuiz)
      setNameModule(searchModule.title)
      setDescriptionModule(searchModule.description)
      setDurationTime(searchModule.durationTime)
      setAttemptsModule(searchModule.attempts)
    } catch (error) {
      console.log(error)
    }
  }

  const handleClickUpdate = () => {
    try {
      if (nameModule !== "" && descriptionModule !== "" && durationTime > 0 && imageModule !== "" && attemptsModule > 0) {
        const request = putQuizService(moduleSelected, {
          title: nameModule,
          description: descriptionModule,
          durationTime,
          description: imageModule,
          attempts: attemptsModule
        })
        clearInputs();
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
          const request = putQuizService(row.idQuiz, {
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
      selector: row => row.idQuiz,
    },
    {
      name: 'Nombre',
      selector: row => row.title,
    },
    {
      name: 'Descripción',
      selector: row => row.description,
    },
    {
      name: 'URI',
      selector: row => row.image,
    },
    {
      name: 'Duración',
      selector: row => row.durationTime,
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
                onClick={() => handleClickModule(row.idQuiz)}
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
            data={dataModule}
            columns={columns}
            noDataComponent={<div className='text-center'>{"cargando..."}</div>}
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
              <h1 className="modal-title fs-5" id="exampleModalLabel">Crear Módulo</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="my-1">
                <label className="form-label fw-semibold">Nombre módulo</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="text"
                    placeholder="Nombre módulo"
                    aria-label=".form-control-sm example"
                    value={nameModule}
                    onChange={({ target }) => setNameModule(target.value)}
                />
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Descripción</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="text"
                    placeholder="descripción"
                    aria-label=".form-control-sm example"
                    value={descriptionModule}
                    onChange={({ target }) => setDescriptionModule(target.value)}
                />
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Imagen</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="text"
                    placeholder="Ruta imagen"
                    aria-label=".form-control-sm example"
                    onChange={({target}) => setImageModule(target.value)}
                />
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Duración prueba (en minutos)</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="number"
                    placeholder="Duración de prueba"
                    aria-label=".form-control-sm example"
                    value={durationTime}
                    onChange={({ target }) => setDurationTime(target.value)}
                />
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Intentos permitidos</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="number"
                    placeholder="Intentos permitidos"
                    aria-label=".form-control-sm example"
                    value={attemptsModule}
                    onChange={({ target }) => setAttemptsModule(target.value)}
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
              <h1 className="modal-title fs-5" id="exampleModalLabel">Actualizar Módulo</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="my-1">
                <label className="form-label fw-semibold">Nombre módulo</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="text"
                    placeholder="Nombre módulo"
                    aria-label=".form-control-sm example"
                    value={nameModule}
                    onChange={({ target }) => setNameModule(target.value)}
                />
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Descripción</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="text"
                    placeholder="descripción"
                    aria-label=".form-control-sm example"
                    value={descriptionModule}
                    onChange={({ target }) => setDescriptionModule(target.value)}
                />
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Imagen</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="text"
                    placeholder="Ruta imagen"
                    aria-label=".form-control-sm example"
                    onChange={({target}) => setImageModule(target.value)}
                />
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Duración prueba (en minutos)</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="number"
                    placeholder="Duración de prueba"
                    aria-label=".form-control-sm example"
                    value={durationTime}
                    onChange={({ target }) => setDurationTime(target.value)}
                />
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Intentos permitidos</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="number"
                    placeholder="Intentos permitidos"
                    aria-label=".form-control-sm example"
                    value={attemptsModule}
                    onChange={({ target }) => setAttemptsModule(target.value)}
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

export default ModuleCatalog