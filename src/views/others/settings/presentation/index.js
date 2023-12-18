import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import HeaderComponent from "../../../components/HeaderComponent"
import MenuComponent from "../../../components/MenuComponent"
import ReactPlayer from "react-player";
import { getPresentationsService, postPresentationItemService, postPresentationService, putPresentationItemService, putPresentationService } from "../../../services/settingsFnc";
import { FiEdit, FiMoreVertical, FiPlus, FiTrash } from "react-icons/fi";
import { FaTrashRestore } from "react-icons/fa";
import { getModulesService } from "../../../services/userFnc";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import "../tableStyle.css";

const MySwal = withReactContent(Swal);
const PresentationCatalog = () => {
  const navigate = useNavigate()
  const [dataPresentation, setDataPresentation] = useState([])
  const [dataQuiz, setDataQuiz] = useState([])
  const [quizSelected, setQuizSelected] = useState([])
  const [presentationSelected, setPresentationSelected] = useState([])
  const [presentationSelectedItem, setPresentationSelectedItem] = useState([])
  const [position, setPosition] = useState("")
  const [filePresentation, setFilePresentation] = useState(null)
  const [typePresentation, setTypePresentation] = useState(null)

  const getData = async () => {
    try {
      const data = await getPresentationsService()
      if (data?.data) {
        if (data.data.length > 0) {
          let tmpArray = data.data.sort((a, b) => a.idPresentation - b.idPresentation)
          setDataPresentation(tmpArray)
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
    setQuizSelected(null)
    setPresentationSelected(null)
    setPosition("")
    setFilePresentation(null)
    setTypePresentation(null)
  }

  const handleClickSave = async () => {
    try {
      if (quizSelected !== null) {
        const request = await postPresentationService({
          idQuiz: quizSelected
        })
        clearInputs()
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
      console.log(error);
    }
  }

  const handleClickPresentation = async (id) => {
    try {
      const searchPresentation = dataPresentation.find(pres => pres.idPresentation === id)
      setQuizSelected(searchPresentation.idQuiz)
      setPresentationSelected(searchPresentation.idPresentation)
    } catch (error) {
      console.log("[ ERROR ] => ", error)
    }
  }

  const handleClickUpdate = async () => {
    try {
      if (quizSelected !== null) {
        const request = await putPresentationService(presentationSelected, {
          idQuiz: quizSelected
        })
        clearInputs()
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
      console.log(error);
    }
  }

  const handleClickSaveElement = async () => {
    try {
      if (presentationSelected !== null && filePresentation !== "" && typePresentation !== null) {
        const request = await postPresentationItemService({
          idPresentation: presentationSelected,
          position,
          url: filePresentation,
          idTypePresentation: typePresentation,
        })
        clearInputs()
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
      console.log(error);
    }
  }

  const handleClickElement = async (idPresentation, idItem) => {
    try {
      const searchPresentation = dataPresentation.find(pres => pres.idPresentation === idPresentation)
      if (searchPresentation) {
        const searchPresentationItem = searchPresentation?.PresentationItems.find(presI => presI.idPresentationItem === idItem)
        setPresentationSelectedItem(searchPresentationItem.idPresentationItem)
        setPosition(searchPresentationItem.position)
        setTypePresentation(searchPresentationItem.idTypePresentation)
        setFilePresentation(searchPresentationItem.url)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleClickUpdateElement = async () => {
    try {
      if (presentationSelected !== null && filePresentation !== "" && typePresentation !== null) {
        const request = await putPresentationItemService(presentationSelectedItem, {
          position,
          url: filePresentation,
          idTypePresentation: typePresentation,
        })
        clearInputs()
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
      console.log(error);
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
          const request = putPresentationService(row.idPresentation, {
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

  const handleClickInactiveElement = async (idPresentation, idPresentationItem) => {
    try {
      const searchPresentation = dataPresentation.find(pres => pres.idPresentation === idPresentation)
      if (searchPresentation) {
        const row = searchPresentation?.PresentationItems.find(presI => presI.idPresentationItem === idPresentationItem)
        let title = `¿Esta suguro de ${row.state === "Activo" ? "Inactivar" : "Activar"} el registro?`
        MySwal.fire({
          title,
          icon: "question"
        }).then(({isConfirmed}) => {
          if (isConfirmed) {
            const request = putPresentationItemService(row.idPresentationItem, {
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
      }
    } catch (error) {
      console.log(error)
    }
  }

  const ExpandedComponent = ({data}) => {
    const {PresentationItems} = data;
    return (
      <div className='container'>
        <div className="d-flex justify-content-end">
          <div
            onClick={() => setPresentationSelected(data.idPresentation)}
            className="btn btn-primary btn-md m-3"
            style={{ backgroundColor: "#810000", borderColor: "#810000" }}
            data-bs-toggle="modal"
            data-bs-target="#create-modal-item"
          >
            <FiPlus />
          </div>
        </div>
        <div className="row">
          {
            PresentationItems.length > 0 ? (
              PresentationItems.map(item => (
                <div className="col-lg-4 col-md-6 col-sm-12 my-4">
                  <div className="position-absolute z-3" style={{backgroundColor: "rgba(128, 128, 128, 0.5)"}}>
                    <div className="btn"
                      onClick={() => handleClickElement(data.idPresentation, item.idPresentationItem)}
                      data-bs-toggle="modal"
                      data-bs-target="#update-modal-item"
                    >
                      <FiEdit color={"#FFF"} />
                    </div>
                    <div className="btn"
                      onClick={() => handleClickInactiveElement(data.idPresentation, item.idPresentationItem)}
                    >
                      {
                        item.state === "Activo"  ? (
                          <FiTrash color={"#FFF"} />
                        ) : (
                          <FaTrashRestore color={"#FFF"} />
                        )
                      }
                    </div>
                  </div>
                  {
                    (item.idTypePresentation === "video") ? (
                      <div key={`VID-${item.idPresentationItem}`} className="precarga">
                        <ReactPlayer
                            url={item.url}
                            controls={true}
                            width={"100%"}
                            height={"100%"}
                        />
                      </div>
                    ) : (
                      <div key={`IMG-${item.idPresentationItem}`} className="precarga">
                        <img
                          className="img-fluid"
                          loading="lazy"
                          src={item.url}
                          alt="PRESENTATION"
                        />
                      </div>
                    )
                  }
                </div>
              ))
            ) : (
              <div className='text-center my-5'>
                <h6 className='text-muted'>{`No se encontraron elementos`}</h6>
              </div>
            )
          }
        </div>
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
      selector: row => row.idPresentation,
    },
    {
      name: 'Nombre',
      selector: row => row?.Quiz.title,
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
                onClick={() => handleClickPresentation(row.idPresentation)}
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
            data={dataPresentation}
            columns={columns}
            noDataComponent={<div className='text-center'>{"cargando..."}</div>}
            customStyles={customStyles}
            expandableRows
            expandableRowsComponent={ExpandedComponent}
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
              <h1 className="modal-title fs-5" id="exampleModalLabel">Crear Presentación</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="my-1">
                <label className="form-label fw-semibold">Selecciona un módulo</label>
                <select
                    className="form-select rounded-pill"
                    aria-label="Default select example"
                    onChange={(e) => setQuizSelected(e.target.value)}
                >
                    <option key={"QC-0"} value={null} onClick={() => setQuizSelected(null)}>
                        <span className="dropdown-item"></span>
                    </option>
                    {
                        dataQuiz.map((item) => (
                            <option key={`QC-${item.idQuiz}`} value={item.idQuiz} onClick={() => setQuizSelected(item.idQuiz)}>
                                <span className="dropdown-item">{item.title}</span>
                            </option>
                        ))
                    }
                </select>
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
              <h1 className="modal-title fs-5" id="exampleModalLabel">Actualizar Presentación</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="my-1">
                <label className="form-label fw-semibold">Selecciona un módulo</label>
                <select
                    className="form-select rounded-pill"
                    aria-label="Default select example"
                    onChange={(e) => setQuizSelected(e.target.value)}
                >
                    <option key={"QU-0"} value={null} onClick={() => setQuizSelected(null)}>
                        <span className="dropdown-item"></span>
                    </option>
                    {
                        dataQuiz.map((item) => (
                            <option
                              selected={item.idQuiz === quizSelected}
                              key={`QU-${item.idQuiz}`}
                              value={item.idQuiz}
                              onClick={() => setQuizSelected(item.idQuiz)}
                            >
                                <span className="dropdown-item">{item.title}</span>
                            </option>
                        ))
                    }
                </select>
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

      {/* CREAR TAREA */}
      <div className="modal fade" id="create-modal-item" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Agregar Elemento</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="my-1">
                <label className="form-label fw-semibold">Archivo</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="text"
                    placeholder="Ruta de archivo"
                    aria-label=".form-control-sm example"
                    onChange={({ target }) => setFilePresentation(target.value)}
                />
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Tipo de presentación</label>
                <select
                    className="form-select rounded-pill"
                    aria-label="Default select example"
                    onChange={(e) => setTypePresentation(e.target.value)}
                >
                    <option key={"D-0"} value={null} onClick={() => setTypePresentation(null)}>
                        <span className="dropdown-item"></span>
                    </option>
                    <option key={"D-0"} value={"video"} onClick={() => setTypePresentation("video")}>
                        <span className="dropdown-item">Imagen</span>
                    </option>
                    <option key={"D-0"} value={"image"} onClick={() => setTypePresentation("image")}>
                        <span className="dropdown-item">Video</span>
                    </option>
                </select>
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Posición</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="number"
                    aria-label=".form-control-sm example"
                    value={position}
                    onChange={({ target }) => setPosition(target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <div className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</div>
              <div
                style={{ backgroundColor: "#810000", borderColor: "#810000" }}
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleClickSaveElement}
              >
                Crear
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UPDATE ITEM */}
      <div className="modal fade" id="update-modal-item" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Actualizar Elemento</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="my-1">
                <label className="form-label fw-semibold">Archivo</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="text"
                    placeholder="Ruta de archivo"
                    aria-label=".form-control-sm example"
                    value={filePresentation}
                    onChange={({ target }) => setFilePresentation(target.value)}
                />
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Tipo de presentación</label>
                <select
                    className="form-select rounded-pill"
                    aria-label="Default select example"
                    value={typePresentation || null}
                    onChange={(e) => setTypePresentation(e.target.value)}
                >
                    <option value={null} onClick={() => setTypePresentation(null)}>
                        <span className="dropdown-item"></span>
                    </option>
                    <option value={"video"} onClick={() => setTypePresentation("video")}>
                        <span className="dropdown-item">Imagen</span>
                    </option>
                    <option value={"image"} onClick={() => setTypePresentation("image")}>
                        <span className="dropdown-item">Video</span>
                    </option>
                </select>
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Posición</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="number"
                    aria-label=".form-control-sm example"
                    value={position || 0}
                    onChange={({ target }) => setPosition(target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <div className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</div>
              <div
                style={{ backgroundColor: "#810000", borderColor: "#810000" }}
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleClickUpdateElement}
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

export default PresentationCatalog