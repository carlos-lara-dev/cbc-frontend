import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSessionRoles } from "../../utils";
import "./styles.css"

const MenuComponent = () => {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const getRoles = async () => {
        const data = getSessionRoles()
        setRoles(data)
    }

    useEffect(() => {
        getRoles()
    }, [])
console.log(roles);
    return (
        <div className="navbar navbar-expand-lg" style={{ backgroundColor: "#DCDCDC", width: "100%" }}>
            <div className="container-fluid d-flex justify-content-end text-center">
                <div className="collapse navbar-collapse text-center justify-content-center" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto mb-2 mb-lg-0">
                        <li className="nav-item px-5 border-2 border-end border-black">
                            <a id="option-principal" className="nav-link fs-4 fw-bold text-black active option" aria-current="page" href="#!" onClick={() => navigate("/home")}>Principal</a>
                        </li>
                        <li className="nav-item px-5 border-2 border-end border-black">
                            <a className="nav-link fs-4 fw-bold text-black option" href="#" onClick={() => navigate("/profile")}>Perfil</a>
                        </li>
                        {
                            (roles.some(rol => [1, 2, 3, 5, 6, 7, 8, 9, 10].includes(rol))) && (
                                <li className="nav-item px-5 border-2 border-end border-black">
                                    <a className="nav-link fs-4 fw-bold text-black option" href="#" onClick={() => navigate("/avances")}>Avances</a>
                                </li>)
                        }
                        {
                            (roles.some(rol => [1, 2, 3, 5].includes(rol))) && (
                                <li className="nav-item px-5 border-2 border-end border-black">
                                    <a className="nav-link fs-4 fw-bold text-black option" href="#" onClick={() => navigate("/settings")}>Configuraciones</a>
                                </li>)
                        }
                        <li className="nav-item px-5">
                            <a className="nav-link fs-4 fw-bold text-black option" href="#!" onClick={() => {
                                localStorage.clear()
                                sessionStorage.clear()
                                navigate("/login")
                            }}>Salir</a>
                        </li>
                    </ul>
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
            </div>
        </div>
    )
}

export default MenuComponent;