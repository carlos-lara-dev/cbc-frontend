import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ReactPlayer from "react-player";
import Carousel from "nuka-carousel"
import "../styles.css"
const Presentation = ({ files = [] }) => {
    return (
        <div className="border">
            <div className="container">
                {
                    files.length > 0 ? (
                        <Carousel
                            cellAlign="center"
                            // beforeSlide={(currentSlide) => setCurrentSlide(currentSlide)}
                            defaultControlsConfig={{
                                nextButtonText: <FiChevronRight />,
                                prevButtonText: <FiChevronLeft />,
                                pagingDotsClassName: "d-none",
                            }}
                            style={{ justifyContent: "center" }}
                        >
                            {
                                files.map(item => (
                                    item.idTypePresentation === "image" ? (
                                        <div key={`IMG-${item.idPresentationItem}`} className="precarga">
                                            <img
                                                className="img-fluid"
                                                loading="lazy"
                                                src={item.url}
                                                alt="PRESENTATION"
                                            />
                                        </div>
                                    ) : (
                                        <div key={`VID-${item.idPresentationItem}`} className="precarga">
                                            <ReactPlayer
                                                url={item.url}
                                                controls={true}
                                                width={"100%"}
                                                height={"100%"}
                                            />
                                        </div>
                                    )
                                ))
                            }
                        </Carousel>
                    ) : (
                        <div className="d-flex justify-content-center py-5">
                            <h6 className="text-muted fst-italic">No se encontró ningúna presentación</h6>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Presentation;