import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/courseCard";
import HeaderComponent from "../components/HeaderComponent";
import MenuComponent from "../components/MenuComponent";
import { getModulesService } from "../services/userFnc";
import { cleanLocalModuleData, getRoles } from "../../utils";

import "./styles.css"

const Home = () => {
    const navigate = useNavigate()
    const [modules, setModules] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const getDataModules = async () => {
        try {
            const request = await getModulesService();
            setModules(request.data)
            setIsLoading(false)
        } catch (error) {
            console.log("[ GET MODEULES ERROR ]", error)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getDataModules()
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

    return (
        <main>
            <HeaderComponent />
            <MenuComponent />
            <div className="container">
                <div className="row">
                    {
                        isLoading ? (
                            <div className="d-flex justify-content-center py-5">
                                <div className="spinner-border text-danger" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            modules.length > 0 ? (
                                modules.map((item, index) => <CourseCard key={index} item={item} />)
                            ) : (
                                <div className="d-flex justify-content-center py-5">
                                    <h3 className="text-muted fst-italic">No se encontraron módulos</h3>
                                </div>
                            )
                        )
                    }
                </div>
            </div>
        </main>
    );
}

export default Home;