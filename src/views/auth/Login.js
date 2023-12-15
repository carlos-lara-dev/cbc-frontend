import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FORM from "../../assets/img/Form.png";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from "axios";
import { getAgencyService, getAreasByDivisionService, getAreasService, getDivisionService, loginService, registerService } from "../services/userFnc";
const MySwal = withReactContent(Swal)

const Login = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const [userName, setUserName] = useState("")
    const [dpiValue, setDpiValue] = useState("")
    const [userValue, setUserValue] = useState("")
    const [passwordValue, setPasswordValue] = useState("")
    const [password2Value, setPassword2Value] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isRegister, setIsRegister] = useState(false)
    const [dataDivision, setDataDivision] = useState([])
    const [divisionSelected, setDivisionSelected] = useState(null)
    const [dataArea, setDataArea] = useState([])
    const [areaSelected, setAreaSelected] = useState(null)
    const [dataAgency, setDataAgency] = useState([])
    const [agencySelected, setAgencySelected] = useState(null)

    const cleanInputs = () => {
        setUserName("")
        setDpiValue("")
        setUserValue("")
        setPasswordValue("")
        setPassword2Value("")
        setDivisionSelected(null)
        setAreaSelected(null)
        setAgencySelected(null)
    }

    const handleLogin = async () => {
        try {
            setIsLoading(true)
            const login = await loginService(user, password)
            console.log("LOGIN", login.data.userData.dataUser);
            if (!login.data?.error) {
                localStorage.setItem("@user", JSON.stringify(login.data.userData.dataUser));
                setIsLoading(false);
                navigate("/home");
            } else {
                setIsLoading(false)
                MySwal.fire({
                    title: "¡Atención!",
                    text: login.data.message || "comuniquese con el administrador",
                    icon: "info"
                });
            }
        } catch (error) {
            setIsLoading(false)
            console.log("[ ERROR LOGIN ] =>", error)
            MySwal.fire({
                title: "¡Atención!",
                text: "No se pudo inciar sesión",
                icon: "info"
            });
        }
    }

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
                setIsLoading(true)
                const register = await registerService({
                    // idRole: 1,
                    name: data.userName,
                    user: data.userValue,
                    password: data.passwordValue,
                    idAgency: data.agencySelected
                })
                console.log("[ REGISTER ]", register.data);
                cleanInputs()
                if (!register.data?.error) {
                    setIsLoading(false)
                    MySwal.fire({
                        title: "Completado",
                        text: "El usuario fue creado con exito",
                        icon: "success"
                    });
                } else {
                    setIsLoading(false)
                    MySwal.fire({
                        title: "¡Atención!",
                        text: register.data.message || "comuniquese con el administrador",
                        icon: "info"
                    });
                }
            }
        } catch (error) {
            cleanInputs()
            console.log("[ REGISTER ERROR ]", error);
        }
    }

    const getDivisions = async () => {
        try {
            const request = await getDivisionService();
            if (!request.data?.error) {
                console.log("[ DIVISIONS ] =>", request.data)
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
        if (isRegister) {
            getDivisions()
        }
    }, [isRegister])

    useEffect(() => {
        if (divisionSelected !== null && parseInt(divisionSelected) !== 0) {
            getAreas()
        } else setAreaSelected(null)
        if (areaSelected !== null && parseInt(areaSelected) !== 0) {
            getAgency()
        } else setAgencySelected(null)
    }, [areaSelected, divisionSelected])

    return (
        <>
            <header className="text-center text-white d-none d-lg-flex position-relative" style={{ backgroundColor: "#E70202" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-11 offset-md-1 position-relative">
                            <img src={"/assets/HEADER.png"} className="img-fluid" alt="Header" />
                            <div className="position-absolute end-0 translate-middle" style={{ top: "70%", transform: 'translate(-50%, -20%)' }}>
                                <h1 className="fs-1">LÍDERES DEL MERCADO</h1>
                                <h3 className="fs-3">LIDERANDO GRANDES MARCAS</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="d-flex d-flex justify-content-center" style={{ backgroundColor: "#E70202" }}>
                <div style={{ paddingBottom: "100vh" }} className="container my-5">
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="mb-3 border border-3 border-withe">
                            <div className="row g-0">
                                <div className="col-md-5 d-flex align-items-center">
                                    <div>
                                        <img src={FORM} className="img-fluid" alt="..." />
                                        <h3 className="text-white text-center">Líderes del Mercado</h3>
                                        <h3 className="text-white text-center">Liderando grandes marcas</h3>
                                    </div>
                                </div>
                                <div className="col-md-7" style={{ backgroundColor: "#CCCCCC" }}>
                                    {
                                        !isRegister ? (
                                            <div className="card-body">
                                                <h3 className="fw-bold m-5">Login</h3>
                                                <div className="m-5">
                                                    <div>
                                                        <label className="form-label">Usuario</label>
                                                        <input
                                                            className="form-control form-control-md rounded-pill"
                                                            aria-label=".form-control-sm example"
                                                            type="text"
                                                            placeholder="Usuario"
                                                            value={user}
                                                            onChange={({ target }) => setUser(target.value)}
                                                        />
                                                    </div>
                                                    <div className="mt-2">
                                                        <label className="form-label">Contraseña</label>
                                                        <input
                                                            className="form-control form-control-md rounded-pill"
                                                            type="password"
                                                            placeholder="Contraseña"
                                                            aria-label=".form-control-sm example"
                                                            value={password}
                                                            onChange={({ target }) => setPassword(target.value)}
                                                        />
                                                    </div>
                                                    {/* <div className="form-check mt-2">
                                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                                        <label className="form-check-label">
                                                            Mantener conectado
                                                        </label>
                                                    </div> */}
                                                    <div className="text-center">
                                                        <button
                                                            type="button"
                                                            style={{ backgroundColor: "#810000", borderColor: "#810000", paddingInline: "20%" }}
                                                            className="btn btn-primary btn-md mt-4"
                                                            onClick={handleLogin}
                                                            disabled={isLoading}
                                                        >
                                                            {
                                                                isLoading ? (
                                                                    <div className="d-flex justify-content-center fs-6">
                                                                        <div className="spinner-border text-light" role="status">
                                                                            <span className="visually-hidden">Loading...</span>
                                                                        </div>
                                                                    </div>
                                                                ) : ("Ingresar")
                                                            }
                                                        </button>
                                                    </div>
                                                    <div className="text-center mt-5 d-grid gap-2">
                                                        <h6 className="fw-bold">¿Aún no tienes cuenta?</h6>
                                                        <button
                                                            type="button"
                                                            style={{ backgroundColor: "#810000", borderColor: "#810000" }}
                                                            className="btn btn-primary btn-md px-5 rounded-pill"
                                                            onClick={() => setIsRegister(true)}
                                                        >
                                                            Crea una aquí
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="card-body">
                                                <h3 className="fw-bold m-5">Registro de usuario</h3>
                                                <div className="m-5">
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
                                                    <div className="text-center mt-5">
                                                        <button
                                                            type="button"
                                                            style={{ backgroundColor: "#810000", borderColor: "#810000", paddingInline: "20%" }}
                                                            className="btn btn-primary btn-md"
                                                            onClick={handleRegister}
                                                        >
                                                            Registrar
                                                        </button>
                                                    </div>
                                                    <div className="text-center mt-5 d-grid gap-2">
                                                        <h6 className="fw-bold">¿Ya tienes cuenta?</h6>
                                                        <button
                                                            type="button"
                                                            style={{ backgroundColor: "#810000", borderColor: "#810000" }}
                                                            className="btn btn-primary btn-md px-5 rounded-pill"
                                                            onClick={() => setIsRegister(false)}
                                                        >
                                                            Ingresar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default Login;