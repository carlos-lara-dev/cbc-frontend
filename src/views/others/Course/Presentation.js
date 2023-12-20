import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ReactPlayer from "react-player";
import Carousel from "nuka-carousel"
import "../styles.css"
import { useState } from "react";
const Presentation = ({ files = [] }) => {
    const [currentSlide, setCurrentSlide] = useState(1);

    const handlePreviousClick = () => {
        // Lógica para el botón "Anterior"
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const handleNextClick = () => {
        // Lógica para el botón "Siguiente"
        if (currentSlide < files.length) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    return (
        <div className="border">
            <div className="container">
                {
                    files.length > 0 ? (
                        <div>
                            <Carousel
                                cellAlign="center"
                                defaultControlsConfig={{
                                    nextButtonText: <FiChevronRight />,
                                    prevButtonText: <FiChevronLeft />,
                                    prevButtonOnClick: handlePreviousClick,
                                    nextButtonOnClick: handleNextClick,
                                    pagingDotsClassName: "d-none",
                                }}
                                style={{ justifyContent: "center" }}
                            >
                                {
                                    files.sort((a, b) => a.position - b.position).map(item => (
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
                            <div className="text-center">
                                <p>{currentSlide} / {files.length}</p>
                            </div>
                        </div>
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