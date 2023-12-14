import { useEffect, useState } from "react"
import DataTable from 'react-data-table-component';
import HeaderComponent from "../../../components/HeaderComponent"
import MenuComponent from "../../../components/MenuComponent"
import { getAgencyService, getAllUsersService, getAreasByDivisionService, getDivisionService, registerService } from "../../../services/userFnc";
import { FiPlus } from "react-icons/fi";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import "../tableStyle.css";

const MySwal = withReactContent(Swal);
const UserCatalog = () => {
  const [dataUser, setDataUser] = useState([])
  const [userName, setUserName] = useState("")
  const [dpiValue, setDpiValue] = useState("")
  const [userValue, setUserValue] = useState("")
  const [passwordValue, setPasswordValue] = useState("")
  const [password2Value, setPassword2Value] = useState("")
  const [dataDivision, setDataDivision] = useState([])
  const [divisionSelected, setDivisionSelected] = useState(null)
  const [dataArea, setDataArea] = useState([])
  const [areaSelected, setAreaSelected] = useState(null)
  const [dataAgency, setDataAgency] = useState([])
  const [agencySelected, setAgencySelected] = useState(null)

  const getData = async () => {
    try {
      const data = await getAllUsersService()
      if (data?.data) {
        if (data.data.length > 0) {
          let tmpArray = data.data.sort((a, b) => a.idUser - b.idUser)
          setDataUser(tmpArray)
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
      } else {
        MySwal.fire({
          title: "¡Atención!",
          text: request.data.message || "comuniquese con el administrador",
          icon: "info"
        });
      }
    } catch (error) {
      console.log("[ ERROR LOGIN ] =>", error)
    }
  }

  const getAreas = async () => {
    try {
      const request = await getAreasByDivisionService(divisionSelected)
      if (!request.data?.error) {
        console.log("[ AREAS ] =>", request.data)
        setDataArea(request.data)
      } else {
        MySwal.fire({
          title: "¡Atención!",
          text: request.data.message || "comuniquese con el administrador",
          icon: "info"
        });
      }
    } catch (error) {
      console.log("[ ERROR LOGIN ] =>", error)
    }
  }

  const getAgency = async () => {
    try {
      const request = await getAgencyService(areaSelected)
      if (!request.data?.error) {
        console.log("[ AGENCY AREAS ] =>", request.data)
        setDataAgency(request.data)
      } else {
        MySwal.fire({
          title: "¡Atención!",
          text: request.data.message || "comuniquese con el administrador",
          icon: "info"
        });
      }
    } catch (error) {
      console.log("[ ERROR LOGIN ] =>", error)
    }
  }

  useEffect(() => {
    getData();
    getDivisions();
  }, [])

  useEffect(() => {
    if (divisionSelected !== null && parseInt(divisionSelected) !== 0) {
      getAreas()
    } else setAreaSelected(null)
    if (areaSelected !== null && parseInt(areaSelected) !== 0) {
      getAgency()
    } else setAgencySelected(null)
  }, [areaSelected, divisionSelected])

  const handleRegister = async () => {
    try {
        let stringArray = ["userName", "dpiValue", "userValue", "passwordValue", "password2Value"]
        let nullArray = ["divisionSelected", "areaSelected", "agencySelected"]
        let data = {
            userName,
            dpiValue,
            userValue,
            passwordValue,
            password2Value,
            divisionSelected,
            areaSelected,
            agencySelected
        };
        if (
            stringArray.filter((item) => data[item] === "").length > 0 ||
            nullArray.filter((item) => data[item] === null).length > 0
        ) {
            MySwal.fire({
                title: "¡Atención!",
                text: "Todos los campos son obligatorios",
                icon: "info"
            });
        } else if (passwordValue !== password2Value) {
            MySwal.fire({
                title: "¡Atención!",
                text: "La contraseña no coincide",
                icon: "info"
            });
        } else {
            const register = await registerService({
                // idRole: 1,
                name: data.userName,
                user: data.userValue,
                password: data.passwordValue,
                idAgency: data.agencySelected
            })
            if (!register.data?.error) {
                MySwal.fire({
                    title: "Completado",
                    text: "El usuario fue creado con exito",
                    icon: "success"
                });
            } else {
                MySwal.fire({
                    title: "¡Atención!",
                    text: register.data.message || "comuniquese con el administrador",
                    icon: "info"
                });
            }
        }
    } catch (error) {
        console.log("[ REGISTER ERROR ]", error);
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
      selector: row => row.idUser,
    },
    {
      name: 'Nombre',
      selector: row => row?.name,
    },
    {
      name: 'Usuario',
      selector: row => row?.user,
    },
    {
      name: 'DPI',
      selector: row => row?.dpi || "N/A",
    },
    {
      name: 'Agencia',
      selector: row => row?.Agency.name,
    },
    {
      name: 'Estado',
      maxWidth: "100px",
      selector: row => row.state,
    },
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
            data={dataUser}
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

      {/* CREATE */}
      <div className="modal fade" id="create-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Crear Usuario</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div>
                <label className="form-label fw-semibold">Nombre Completo</label>
                <input
                  className="form-control form-control-md rounded-pill"
                  type="text"
                  placeholder="Nombre Completo"
                  aria-label=".form-control-sm example"
                  value={userName}
                  onChange={({ target }) => setUserName(target.value)}
                />
              </div>
              <div className="mt-2">
                <label className="form-label fw-semibold">DPI</label>
                <input
                  className="form-control form-control-md rounded-pill"
                  type="tel"
                  pattern="[0-9]"
                  placeholder="DPI"
                  aria-label=".form-control-sm example"
                  value={dpiValue}
                  onChange={({ target }) => setDpiValue(target.value)}
                />
              </div>
              <div className="mt-2">
                <label className="form-label fw-semibold">Usuario</label>
                <input
                  className="form-control form-control-md rounded-pill"
                  type="text"
                  placeholder="Usuario"
                  aria-label=".form-control-sm example"
                  value={userValue}
                  onChange={({ target }) => setUserValue(target.value)}
                />
              </div>
              <div className="mt-2">
                <label className="form-label fw-semibold">Contraseña</label>
                <input
                  className="form-control form-control-md rounded-pill"
                  type="password"
                  placeholder="constraseña"
                  aria-label=".form-control-sm example"
                  value={passwordValue}
                  onChange={({ target }) => setPasswordValue(target.value)}
                />
              </div>
              <div className="mt-2">
                <label className="form-label fw-semibold">Confirmar la contraseña</label>
                <input
                  className="form-control form-control-md rounded-pill"
                  type="password"
                  placeholder="confirmar contraseña"
                  aria-label=".form-control-sm example"
                  value={password2Value}
                  onChange={({ target }) => setPassword2Value(target.value)}
                />
              </div>
              <div className="mt-2">
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
              {
                divisionSelected !== null && parseInt(divisionSelected) !== 0 && (
                  <div className="mt-2">
                    <label className="form-label fw-semibold">Area</label>
                    <select
                      className="form-select rounded-pill"
                      aria-label="Default select example"
                      onChange={(e) => setAreaSelected(e.target.value)}
                    >
                      <option key={"A-0"} value={0} onClick={() => setAreaSelected(null)}>
                        <span className="dropdown-item"></span>
                      </option>
                      {
                        dataArea.map((item) => (
                          <option key={`A-${item.idArea}`} value={item.idArea} onClick={() => setAreaSelected(item.idArea)}>
                            <span className="dropdown-item">{item.name}</span>
                          </option>
                        ))
                      }
                    </select>
                  </div>
                )
              }
              {
                areaSelected !== null && parseInt(areaSelected) !== 0 && (
                  <div className="mt-2">
                    <label className="form-label fw-semibold">Agencia</label>
                    <select
                      className="form-select rounded-pill"
                      aria-label="Default select example"
                      onChange={(e) => setAgencySelected(e.target.value)}
                    >
                      <option key={"AG-0"} value={0} onClick={() => setAgencySelected(null)}>
                        <span className="dropdown-item"></span>
                      </option>
                      {
                        dataAgency.map((item) => (
                          <option key={`AG-${item.idAgency}`} value={item.idAgency} onClick={() => setAreaSelected(item.idAgency)}>
                            <span className="dropdown-item">{item.name}</span>
                          </option>
                        ))
                      }
                    </select>
                  </div>
                )
              }
            </div>
            <div className="modal-footer">
              <div className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</div>
              <div
                style={{ backgroundColor: "#810000", borderColor: "#810000" }}
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleRegister}
              >
                Crear
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default UserCatalog