import { useEffect, useState } from "react";
import CourseCard from "../components/courseCard";
import HeaderComponent from "../components/HeaderComponent";
import MenuComponent from "../components/MenuComponent";
import { getModulesService } from "../services/userFnc";
import { cleanLocalModuleData, getRoles } from "../../utils";

import "./styles.css"

const Home = () => {
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

    useEffect(() => {
        cleanLocalModuleData()
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