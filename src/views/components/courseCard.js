import { useNavigate } from "react-router-dom";
import "./styles.css"

const CourseCard = ({ item }) => {
    const navigate = useNavigate();
    return (
        <div className="col-lg-4 col-md-6 col-sm-12 my-4">
            <div key={item.idQuiz} style={{ height: 400 }} className="card shadow-lg p-3 mb-3 bg-body rounded-4">
                <img src={item.image} className="card-img-top" alt="..." />
                <div className="card-body d-flex justify-content-center align-items-center">
                    <div className="text-center">
                        <h4 className="card-title">{item.title}</h4>
                    </div>
                </div>
                <button type="button" onClick={() => navigate(`/course/${item.idQuiz}`)} className="btn btn-view-presentation btn-md px-5 rounded-pill">Ver presentación</button>
            </div>
        </div>
    )
}

export default CourseCard