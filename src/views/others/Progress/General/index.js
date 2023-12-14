import { useEffect, useState } from "react";
import Accordion from "../../../components/Accordion";
import HeaderComponent from "../../../components/HeaderComponent";
import MenuComponent from "../../../components/MenuComponent";
import ResultsQuiz from "./components/ResultsQuiz";
import TotalRegistered from "./components/TotalRegistered";
import Chart from 'react-apexcharts'
import "../styles.css";
import { getGeneralDataByArea, getGeneralDataByDivision, getGeneralDataInscriptionService } from "../../../services/dashboardFnc";

const ProgressGeneral = () => {
  const [active, setActive] = useState(0)
  const [data, setData] = useState(null)
  const [dataByDivision, setDataByDivision] = useState([])
  const [dataByArea, setDataByArea] = useState([])

  const RenderContent = () => (
    <div className="container border">
      <Accordion title={"Total Inscritos"} content={<TotalRegistered data={data} />} />
      <Accordion title={"Totales Aprobados / Reprobados"} content={<ResultsQuiz title={"Totales Aprobados / Reprobados"} buttons={false} aprobados={data?.aproved || 0} reprobados={data?.reproved || 0} />} />
    </div>
  )

  const getData = async () => {
    try {
      const data = await getGeneralDataInscriptionService()
      setData(data.data)
    } catch (error) {
      console.log(error);
    }
  }

  const getDataByDivision = async () => {
    try {
      const data = await getGeneralDataByDivision()
      if (!data?.error) {
        if (data.data?.usersByDivision) {
          setDataByDivision(data.data.usersByDivision)
        } else setDataByDivision([])
      } else setDataByDivision([])
    } catch (error) {
      console.log("[ ERROR ] => ", error)
    }
  }

  const getDataByArea = async () => {
    try {
      const data = await getGeneralDataByArea()
      if (!data?.error) {
        if (data.data?.usersByDivisionAndArea) {
          console.log("[ DATA AREAS ]", data.data.usersByDivisionAndArea)
          let arrayTmp = []
          data.data.usersByDivisionAndArea.forEach(item => {
            let results = []
            if (item.results.length > 0) {
              item.results.forEach(area => {
                results.push({
                  x: `Aprobados ${area.area_name || ""}`,
                  y: area.approved
                }, {
                  x: `Reprobados ${area.area_name || ""}`,
                  y: area.reproved
                })
              })
            }
            arrayTmp.push({
              division: item.division_name,
              data: results
            })
          });
          setDataByArea(arrayTmp)
        } else setDataByArea([])
      } else setDataByArea([])
    } catch (error) {
      console.log("[ ERROR ] => ", error)
    }
  }
console.log("DATA DIVISION CENTREO ===>", dataByArea);
  useEffect(() => {
    if (active === 1) {
      getDataByDivision()
    } else if (active === 2) {
      getDataByArea()
    } else {
      getData()
    }
  }, [active])

  const options = {
    chart: {
      type: 'bar',
    },
    grid: {
      show: true,
    },
    colors: ['#810000'],
  };

  return (
    <div>
      <HeaderComponent />
      <MenuComponent />
      <div className="container">
        <Accordion
          title={"Datos Generales"}
          content={<RenderContent />}
        />
        <div className="d-flex justify-content-center">
          <div
            onClick={() => setActive(active === 1 ? 0 : 1)}
            className={`btn btn-md m-1 rounded-pill ${active === 1 ? "active-btn":"inactive-btn"}`}
          >{"Ver Datos por División"}</div>
          <div
            onClick={() => setActive(active === 2 ? 0 : 2)}
            className={`btn btn-primary btn-md m-1 rounded-pill ${active === 2 ? "active-btn":"inactive-btn"}`}
          >{"Ver Datos por División : Por Centro"}</div>
        </div>
        <div className="container">
          {
            active !== 0 && (
              active === 1 ? (
                <div className="conatiner my-2 py-2">
                  <div className="row">
                    {
                      dataByDivision.length > 0 && (
                        dataByDivision.map((item, index) => (
                          <div key={`DBD-${index}`} className="col-lg-6 col-md-6 col-sm-12 my-2">
                            <ResultsQuiz title={`División: ${item.name} - Reporte General`} aprobados={item.aproved} reprobados={item.reproved} buttons={false} />
                          </div>
                        ))
                      )
                    }
                  </div>
                </div>
              ) : (
                <div className="conatiner border my-2 py-2">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 my-2">
                      {
                        dataByArea.length > 0 && (
                          dataByArea.map((chart, index) => (
                            <div key={`DBDBA-${index}`} className="col-lg-12 col-md-12 col-sm-12 my-2">
                              <div className='cointainer rounded-4 my-5 py-2 px-3' style={{ backgroundColor: "#CCCCCC" }}>
                                <div className='rounded-pill my-2 d-flex justify-content-center' style={{ backgroundColor: "#555555" }}>
                                  <h5 className='text-white my-2 text-center'>División: {chart.division} - Por Centro</h5>
                                </div>
                                <Chart options={options} series={[{data: chart.data}]} type='bar' height={500} />
                              </div>
                            </div>
                          ))
                        )
                      }
                    </div>
                  </div>
                </div>
              )
            )
          }
      </div>
      </div>
    </div>
  )
}

export default ProgressGeneral;