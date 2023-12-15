import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import HeaderComponent from "../../components/HeaderComponent"
import MenuComponent from "../../components/MenuComponent"
import CATALOGS from "./catalogs.json"

const Settings = () => {
  const navigate = useNavigate()

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

  return(
    <div>
      <HeaderComponent />
      <MenuComponent />
      <div className="container">
        <div className="row justify-content-center">
          {
            CATALOGS.map(item => (
              <div className="col-lg-3 col-md-4 col-sm-12 my-4">
                <div style={{ height: 150 }} className="card shadow-lg px-3 mb-3 bg-body rounded-4 d-flex justify-content-around text-center">
                  <h3>{item.title}</h3>
                  <button type="button" onClick={() => navigate(item.route)} className="btn btn-view-presentation btn-md px-5 rounded-pill">Ver</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Settings