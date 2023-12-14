const HeaderComponent = () => (
    <header className="text-center text-white position-relative py-5" style={{ backgroundColor: "#E70202", width: "100%" }}>
        <div className="container">
            <div className="row">
                <div className="col-md-12 position-relative d-flex d-none d-md-block d-xl-block">
                    <img src={"https://res.cloudinary.com/dwjgahuls/image/upload/f_auto,q_auto/v1/CBC/uhp5idkrb3zf0w9n1h0h"} className="d-none d-md-block img-fluid" alt="Header" />
                    <div className="position-absolute end-0" style={{ top: "70%" }}>
                        <h1 style={{ fontSize: 50, fontWeight: "bold" }}>LÍDERES DEL MERCADO</h1>
                        <h3 style={{ fontSize: 36, fontWeight: "bold" }}>LIDERANDO GRANDES MARCAS</h3>
                    </div>
                </div>

                <div className="col-md-12 text-center d-flex flex-column d-sm-block d-md-none">
                    <div>
                        <h1 className="fw-bold text-center ps-3 pe-3">LÍDERES DEL MERCADO</h1>
                        <h4 className="fw-semibold">LIDERANDO GRANDES MARCAS</h4>
                    </div>
                    <img
                        src={"https://res.cloudinary.com/dwjgahuls/image/upload/f_auto,q_auto/v1/CBC/v3x8oiwufecbtxrd5uc8"}
                        className="d-sm-block d-md-none"
                        width={"100%"}
                        alt="Header"
                    />
                </div>
            </div>
        </div>
    </header>
)

export default HeaderComponent;