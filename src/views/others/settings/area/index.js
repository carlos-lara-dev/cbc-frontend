import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { getAreasService, getDivisionService } from "../../../services/userFnc"
import { FiMoreVertical, FiPlus } from "react-icons/fi";
import { postAreaService, putAreaService } from "../../../services/settingsFnc";
import DataTable from 'react-data-table-component';
import HeaderComponent from "../../../components/HeaderComponent"
import MenuComponent from "../../../components/MenuComponent"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import "../tableStyle.css";

const MySwal = withReactContent(Swal);
const AreaCatalog = () => {
  const navigate = useNavigate()
  const [dataArea, setDataArea] = useState([])
  const [areaName, setAreaName] = useState("")
  const [dataDivision, setDataDivision] = useState([])
  const [areaSelected, setAreaSelected] = useState(null)
  const [divisionSelected, setDivisionSelected] = useState(null)

  const getData = async () => {
    try {
      const data = await getAreasService()
      if (data?.data) {
        if (data.data.length > 0) {
          let tmpArray = data.data.sort((a, b) => b.idArea - a.idArea)
          setDataArea(tmpArray)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getDivisions = async () => {
    try {
        const request = await getDivisionService();
        if (!request.data?.error) {
            setDataDivision(request.data)
        }
    } catch (error) {
        console.log("[ ERROR LOGIN ] =>", error)
    }
  }

  useEffect(() => {
    getData();
    getDivisions();
  }, [])

  const clearInputs = () => {
    setAreaName("")
    setDivisionSelected(null)
    setAreaSelected(null)
  }

  const handleClickSave = async () => {
    try {
      if (areaName !== "" && divisionSelected !== 0 && divisionSelected !== null) {
        const request = await postAreaService({
          name: areaName,
          idDivision: divisionSelected
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
      clearInputs();
      console.log(error)
    }
  }

  const handleClickUpdate = async () => {
    try {
      if (areaName !== "" && divisionSelected !== 0 && divisionSelected !== null) {
        const request = putAreaService(areaSelected, {
          name: areaName,
          idDivision: divisionSelected
        })
        getData();
        clearInputs();
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
      clearInputs();
      console.log(error)
    }
  }

  const handleClickArea = async (id) => {
    try {
      const searchArea = dataArea.find(area => area.idArea === id);
      setAreaSelected(id)
      setAreaName(searchArea.name)
      setDivisionSelected(searchArea.idDivision)
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
          const request = putAreaService(row.idArea, {
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

  const customStyles = {
    table: {
    },
  };

  const columns = [
  {
    name: 'id',
    maxWidth: "100px",
    selector: row => row.idArea,
  },
  {
    name: 'Usuario',
    selector: row => row.name,
  },
  {
    name: 'Estado',
    selector: row => row.state,
  },
  {
    name: 'División',
    selector: row => row?.Division.name,
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
              onClick={() => handleClickArea(row.idArea)}
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

  const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
  };

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
            data={dataArea}
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
              <h1 className="modal-title fs-5" id="exampleModalLabel">Crear Area</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="my-1">
                <label className="form-label fw-semibold">Nombre de area</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="text"
                    placeholder="Nombre de area"
                    aria-label=".form-control-sm example"
                    value={areaName}
                    onChange={({ target }) => setAreaName(target.value)}
                />
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">División</label>
                <select
                    className="form-select rounded-pill"
                    aria-label="Default select example"
                    onChange={(e) => setDivisionSelected(e.target.value)}
                >
                    <option key={"D-0"} value={0} onClick={() => setDivisionSelected(null)}>
                        <span className="dropdown-item"></span>
                    </option>
                    {
                        dataDivision.map((item) => (
                            <option key={`D-${item.idDivision}`} value={item.idDivision} onClick={() => setDivisionSelected(item.idDivision)}>
                                <span className="dropdown-item">{item.name}</span>
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

      <div className="modal fade" id="update-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Actualizar Area</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="my-1">
                <label className="form-label fw-semibold">Nombre de area</label>
                <input
                    className="form-control form-control-md rounded-pill"
                    type="text"
                    placeholder="Nombre de area"
                    aria-label=".form-control-sm example"
                    value={areaName}
                    onChange={({ target }) => setAreaName(target.value)}
                />
              </div>
              <div className="my-1">
                <label className="form-label fw-semibold">División</label>
                <select
                    className="form-select rounded-pill"
                    aria-label="Default select example"
                    onChange={(e) => setDivisionSelected(e.target.value)}
                >
                    <option key={"D-0"} value={0} onClick={() => setDivisionSelected(null)}>
                        <span className="dropdown-item"></span>
                    </option>
                    {
                        dataDivision.map((item) => (
                            <option
                              key={`D-${item.idDivision}`}
                              selected={divisionSelected === item.idDivision}
                              value={item.idDivision}
                              onClick={() => setDivisionSelected(item.idDivision)}
                            >
                                <span className="dropdown-item">{item.name}</span>
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

export default AreaCatalog