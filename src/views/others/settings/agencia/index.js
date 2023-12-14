import { useEffect, useState } from "react"
import DataTable from 'react-data-table-component';
import HeaderComponent from "../../../components/HeaderComponent"
import MenuComponent from "../../../components/MenuComponent"
import { getAreasService } from "../../../services/userFnc"
import { getAgencyService, postAgencyService, putAgencyService } from "../../../services/settingsFnc";
import { FiMoreVertical, FiPlus } from "react-icons/fi";
import "../tableStyle.css";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const AgencyCatalog = () => {
  const [dataAgency, setDataAgency] = useState([])
  const [dataArea, setDataArea] = useState([])
  const [agencyName, setAgencyName] = useState("")
  const [agencySelected, setAgencySelected] = useState(null)
  const [areaSelected, setAreaSelected] = useState(null)

  const getData = async () => {
    try {
      const data = await getAgencyService()
      if (data?.data) {
        if (data.data.length > 0) {
          let tmpArray = data.data.sort((a, b) => b.idAgency - a.idAgency)
          setDataAgency(tmpArray)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getDataArea = async () => {
    try {
      const data = await getAreasService()
      if (data?.data) {
        if (data?.data) {
          if (data.data.length > 0) {
            let tmpArray = data.data.sort((a, b) => b.idArea - a.idArea)
            setDataArea(tmpArray)
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData();
    getDataArea();
  }, [])

  const clearInputs = () => {
    setAgencyName("")
    setAgencySelected(null)
    setAreaSelected(null)
  }

  const handleClickSave = async () => {
    try {
      const request = await postAgencyService({
        name: agencyName,
        idArea: areaSelected
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

  const handleClickUpdate = async () => {
    try {
      const request = putAgencyService(agencySelected, {
        name: agencyName,
        idArea: areaSelected
      })

      clearInputs();
      getData();
      if (!request?.error) {
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
      clearInputs();
      console.log(error)
    }
  }

  const handleClickAgency = async (id) => {
    try {
      const searchAgency = dataAgency.find(agency => agency.idAgency === id);
      setAgencySelected(id)
      setAgencyName(searchAgency.name)
      setAreaSelected(searchAgency.idArea)
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
          const request = putAgencyService(row.idAgency, {
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
      selector: row => row.idAgency,
    },
    {
      name: 'Nombre',
      selector: row => row.name,
    },
    {
      name: 'Area',
      selector: row => row?.Area.name,
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
                onClick={() => handleClickAgency(row.idAgency)}
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
            data={dataAgency}
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
              <h1 className="modal-title fs-5" id="exampleModalLabel">Crear Agencia</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="my-1">
                <label className="form-label fw-semibold">Nombre de agencia</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="text"
                    placeholder="Nombre de area"
                    aria-label=".form-control-sm example"
                    value={agencyName}
                    onChange={({ target }) => setAgencyName(target.value)}
                />
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Area</label>
                <select
                    className="form-select rounded-pill"
                    aria-label="Default select example"
                    onChange={(e) => setAreaSelected(e.target.value)}
                >
                    <option key={"D-0"} value={0} onClick={() => setAreaSelected(null)}>
                        <span className="dropdown-item"></span>
                    </option>
                    {
                        dataArea.map((item) => (
                            <option key={`D-${item.idArea}`} value={item.idArea} onClick={() => setAreaSelected(item.idArea)}>
                                <span className="dropdown-item">{item.name} / {item.Division.name}</span>
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
              <h1 className="modal-title fs-5" id="exampleModalLabel">Actualizar Agencia</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="my-1">
                <label className="form-label fw-semibold">Nombre de agencia</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="text"
                    placeholder="Nombre de area"
                    aria-label=".form-control-sm example"
                    value={agencyName}
                    onChange={({ target }) => setAgencyName(target.value)}
                />
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">Area</label>
                <select
                    className="form-select rounded-pill"
                    aria-label="Default select example"
                    onChange={(e) => setAreaSelected(e.target.value)}
                >
                    <option key={"D-0"} value={0} onClick={() => setAreaSelected(null)}>
                        <span className="dropdown-item"></span>
                    </option>
                    {
                        dataArea.map((item) => (
                            <option
                              selected={areaSelected === item.idArea}
                              key={`D-${item.idArea}`}
                              value={item.idArea}
                              onClick={() => setAreaSelected(item.idArea)}
                            >
                                <span className="dropdown-item">{item.name} / {item.Division.name}</span>
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

export default AgencyCatalog