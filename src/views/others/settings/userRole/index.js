import { useEffect, useState } from "react"
import { FiMoreVertical, FiPlus } from "react-icons/fi";
import { getRoleUsersServices, getRolesServices, postRoleUsersServices, putRoleUsersServices } from "../../../services/settingsFnc";
import DataTable from 'react-data-table-component';
import HeaderComponent from "../../../components/HeaderComponent"
import MenuComponent from "../../../components/MenuComponent"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import "../tableStyle.css";
import { getAllUsersService } from "../../../services/userFnc";

const MySwal = withReactContent(Swal);
const UserRoleCatalog = () => {
  const [dataRoleUser, setDataRoleUser] = useState([])
  const [dataUser, setDataUser] = useState([])
  const [dataRole, setDataRole] = useState([])
  const [roleUserSelected, setRoleUserSelected] = useState(null)
  const [roleSelected, setRoleSelected] = useState(null)
  const [userSelected, setUserSelected] = useState(null)

  const getData = async () => {
    try {
      const data = await getRoleUsersServices()
      if (data?.data) {
        if (data.data.length > 0) {
          let tmpArray = data.data.sort((a, b) => b.idRoleUser - a.idRoleUser)
          setDataRoleUser(tmpArray)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getUserData = async () => {
    try {
      const data = await getAllUsersService()
      if (data?.data) {
        setDataUser(data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getRoleData = async () => {
    try {
      const data = await getRolesServices()
      if (data?.data) {
        setDataRole(data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData();
    getUserData();
    getRoleData();
  }, [])

  const clearInputs = () => {
    setUserSelected(null)
    setUserSelected(null)
    setRoleSelected(null)
  }

  const handleClickSave = async () => {
    try {
      const request = await postRoleUsersServices({
        idRole: roleSelected,
        idUser: userSelected,
      })
      clearInputs();
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
      clearInputs();
      console.log(error)
    }
  }

  const handleClickUpdate = async () => {
    try {
      const request = putRoleUsersServices(roleUserSelected, {
        idRole: roleSelected,
        idUser: userSelected,
      })
      clearInputs();
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
      clearInputs();
      console.log(error)
    }
  }

  const handleClickRoleUser = async (id) => {
    try {
      const searchRole = dataRoleUser.find(role => role.idRoleUser === id);
      setRoleUserSelected(id)
      setRoleSelected(searchRole.idRole)
      setUserSelected(searchRole.idUser)
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
          const request = putRoleUsersServices(row.idRoleUser, {
            state: row.state === "Activo" ? "Inactivo" : "Activo"
          })
          if (!request?.error) {
            getData();
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

  const columns = [
  {
    name: 'id',
    maxWidth: "100px",
    selector: row => row.idRoleUser,
  },
  {
    name: 'Usuario',
    selector: row => row.User.name,
  },
  {
    name: 'Rol',
    selector: row => row.Role.name,
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
              onClick={() => handleClickRoleUser(row.idRoleUser)}
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
            data={dataRoleUser}
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
              <h1 className="modal-title fs-5" id="exampleModalLabel">Asignar Rol a Usuario</h1>
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
                    <option key={"D-0"} value={null} onClick={() => setUserSelected(null)}>
                        <span className="dropdown-item"></span>
                    </option>
                    {
                        dataUser.map((item) => (
                            <option
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
                <label className="form-label fw-semibold">Rol</label>
                <select
                    className="form-select rounded-pill"
                    aria-label="Default select example"
                    onChange={(e) => setRoleSelected(e.target.value)}
                >
                    <option key={"R-0"} value={null} onClick={() => setRoleSelected(null)}>
                        <span className="dropdown-item"></span>
                    </option>
                    {
                        dataRole.map((item) => (
                            <option
                              key={`U-${item.idRole}`}
                              value={item.idRole}
                              onClick={() => setRoleSelected(item.idRole)}
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
              <h1 className="modal-title fs-5" id="exampleModalLabel">Actualizar Rol</h1>
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
                    <option key={"D-0"} value={null} onClick={() => setUserSelected(null)}>
                        <span className="dropdown-item"></span>
                    </option>
                    {
                        dataUser.map((item) => (
                            <option
                              key={`U-${item.idUser}`}
                              selected={userSelected === item.idUser}
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
                <label className="form-label fw-semibold">Rol</label>
                <select
                    className="form-select rounded-pill"
                    aria-label="Default select example"
                    onChange={(e) => setRoleSelected(e.target.value)}
                >
                    <option key={"R-0"} value={null} onClick={() => setRoleSelected(null)}>
                        <span className="dropdown-item"></span>
                    </option>
                    {
                        dataRole.map((item) => (
                            <option
                              key={`U-${item.idRole}`}
                              selected={roleSelected === item.idRole}
                              value={item.idRole}
                              onClick={() => setRoleSelected(item.idRole)}
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

export default UserRoleCatalog