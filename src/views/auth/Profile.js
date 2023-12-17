import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FORM from "../../assets/img/Form.png";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import HeaderComponent from "../components/HeaderComponent";
import MenuComponent from "../components/MenuComponent";
import { cleanLocalModuleData } from "../../utils";
import "./style.css"

const MySwal = withReactContent(Swal)

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState()

  const loader = async () => {
    const user = JSON.parse(localStorage.getItem("@user"))
    if (!user) {
      return navigate("/login");
    }
    setUserData(user)
    return null;
  };

  useEffect(() => {
    loader()
  }, [])
  return (
    <>
      <HeaderComponent />
      <MenuComponent />
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
                  <div>
                    <div className="bg-info profile-header" style={{ backgroundImage: `url("https://placehold.co/600x400")` }}>
                      <div className="user">
                        <div className="profile" style={{ marginTop: "120px", marginLeft: "20px" }}>
                          <img src="https://placehold.co/75x75" className="rounded-circle img-fluid border border-5 border-light bg-dark-subtle" width="80" />
                        </div>
                      </div>
                    </div>
                    <div className="m-5">
                      <div>
                        <label className="form-label fw-semibold">Nombre Completo</label>
                        <input
                          className="form-control form-control-md rounded-pill"
                          type="text"
                          placeholder="Nombre Completo"
                          aria-label=".form-control-sm example"
                          defaultValue={userData?.name}
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
                          defaultValue={userData?.dpi}
                        />
                      </div>
                      <div className="mt-2">
                        <label className="form-label fw-semibold">Usuario</label>
                        <input
                          className="form-control form-control-md rounded-pill"
                          type="text"
                          placeholder="Usuario"
                          aria-label=".form-control-sm example"
                          defaultValue={userData?.user}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default Profile;