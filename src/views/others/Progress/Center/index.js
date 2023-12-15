import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Accordion from "../../../components/Accordion";
import HeaderComponent from "../../../components/HeaderComponent";
import MenuComponent from "../../../components/MenuComponent";
import ChartComponent from "./components/ChartComponent";
import { getDataCenterDivisionAreaAgency, getGeneralDataByArea, getUsersByArea } from "../../../services/dashboardFnc";
import Chart from 'react-apexcharts'
import { getDivisionService } from "../../../services/userFnc";
import { getSessionRoles } from "../../../../utils";

const ProgressCenter = () => {
  const navigate = useNavigate()
  const [active, setActive] = useState(0)
  const [divisionActive, setDivisionActive] = useState(null);
  const [dataArea, setDataArea] = useState([]);
  const [dataByArea, setDataByArea] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [dataDivision, setDataDivision] = useState([])
  const [roles, setRoles] = useState([]);

  const getRoles = async () => {
    const data = getSessionRoles()
    setRoles(data)
  }

  const RenderContent = () => {
    return (
      <div className="m-3">
        {
          dataArea.length > 0 && (
            dataArea.map((item, index) => (
              (item) && (
                <div key={`ACR-${index}`} className="m-3">
                  <Accordion
                    title={item?.name || "-"}
                    content={<ChartComponent name={item?.name || "-"} serie={[item.total_users]} />}
                  />
                </div>
              )
            ))
          )
        }
      </div>
    )
  }

  const getDataArea = async () => {
    const response = await getUsersByArea();
    if (response?.data) {
      if (response.data?.usersByArea) {
        console.log(response.data.usersByArea);
        let finalArray = []
        if (response.data.usersByArea.length > 0) {
          for (let rol of roles) {
            if (rol === 1 || rol === 2 || rol === 3 || rol === 5) {
              finalArray.push(...response.data.usersByArea)
              break;
            } else {
              switch (rol) {
                case 6:
                  let dataCentro = response.data.usersByArea.find(item => item.name === "Centro - Centro");
                  finalArray.push(dataCentro)
                  break;
                case 7:
                  let dataNorte = response.data.usersByArea.find(item => item.name === "Centro - Norte");
                  finalArray.push(dataNorte)
                  break;
                case 8:
                  let dataSor = response.data.usersByArea.find(item => item.name === "Centro - Sor");
                  finalArray.push(dataSor)
                  break;
                case 9:
                  let dataOccidente = response.data.usersByArea.find(item => item.name === "Centro - Occidente");
                  finalArray.push(dataOccidente)
                  break;
                case 10:
                  let dataClave = response.data.usersByArea.find(item => item.name === "Centro Clave");
                  finalArray.push(dataClave)
                  break;
              }
            }
          }
        }
        setDataArea(finalArray)
      }
    }
  }

  const getDataDivision = async () => {
    const responseData = await getDivisionService()
    if (responseData?.data) {
      setDivisionOptions(responseData.data)
    }
  }

  const getDataByDivision = async (id) => {
    const request = await getDataCenterDivisionAreaAgency(id)
    console.log(`DIVISION: ${id}`, request.data);
    if (!request?.error) {
      let data = request.data
      let arrayTmp = [];
      if (data.length > 0) {
        data.forEach(division => {
          console.log("DIVSION SELECT ---> ", division);
          for (let rol of roles) {
            if (rol === 1 || rol === 2 || rol === 3 || rol === 5) {
              division.areas.forEach(area => {
                let resultsAgency = []
                area.agencies.forEach(agency => {
                  resultsAgency.push({
                    x: `Aprobados ${agency.agency_name || ""}`,
                    y: agency.approved
                  }, {
                    x: `Reprobados ${agency.agency_name || ""}`,
                    y: agency.reproved
                  })
                })
                arrayTmp.push({
                  title: `División: ${division.division_name} - ${area.area_name} - Agencias`,
                  data: resultsAgency
                })
              })
              break;
            } else {
              let resultsAgency = []
              switch (rol) {
                case 6:
                  let dataCentro = division.areas.find(area => area.area_name === "Centro - Centro")
                  if (dataCentro) {
                    dataCentro.agencies.forEach(agency => {
                      resultsAgency.push({
                        x: `Aprobados ${agency.agency_name || ""}`,
                        y: agency.approved
                      }, {
                        x: `Reprobados ${agency.agency_name || ""}`,
                        y: agency.reproved
                      })
                    })

                    arrayTmp.push({
                      title: `División: ${division.division_name} - ${dataCentro.area_name} - Agencias`,
                      data: resultsAgency
                    })
                  }
                  break;
                case 7:
                  let dataNorte = division.areas.find(area => area.area_name === "Centro - Norte")
                  if (dataNorte) {
                    dataNorte.agencies.forEach(agency => {
                      resultsAgency.push({
                        x: `Aprobados ${agency.agency_name || ""}`,
                        y: agency.approved
                      }, {
                        x: `Reprobados ${agency.agency_name || ""}`,
                        y: agency.reproved
                      })
                    })
                    arrayTmp.push({
                      title: `División: ${division.division_name} - ${dataNorte.area_name} - Agencias`,
                      data: resultsAgency
                    })
                  }
                  break;
                case 8:
                  let dataSor = division.areas.find(area => area.area_name === "Centro - Sor")
                  if (dataSor) {
                    dataSor.agencies.forEach(agency => {
                      resultsAgency.push({
                        x: `Aprobados ${agency.agency_name || ""}`,
                        y: agency.approved
                      }, {
                        x: `Reprobados ${agency.agency_name || ""}`,
                        y: agency.reproved
                      })
                    })
                    arrayTmp.push({
                      title: `División: ${division.division_name} - ${dataSor.area_name} - Agencias`,
                      data: resultsAgency
                    })
                  }
                  break;
                case 9:
                  let dataOccidente = division.areas.find(area => area.area_name === "Centro - Occidente")
                  if (dataOccidente) {
                    dataOccidente.agencies.forEach(agency => {
                      resultsAgency.push({
                        x: `Aprobados ${agency.agency_name || ""}`,
                        y: agency.approved
                      }, {
                        x: `Reprobados ${agency.agency_name || ""}`,
                        y: agency.reproved
                      })
                    })
                    arrayTmp.push({
                      title: `División: ${division.division_name} - ${dataOccidente.area_name} - Agencias`,
                      data: resultsAgency
                    })
                  }
                  break;
                case 10:
                  let dataClave = division.areas.find(area => area.area_name === "Centro Clave")
                  if (dataClave) {
                    dataClave.agencies.forEach(agency => {
                      resultsAgency.push({
                        x: `Aprobados ${agency.agency_name || ""}`,
                        y: agency.approved
                      }, {
                        x: `Reprobados ${agency.agency_name || ""}`,
                        y: agency.reproved
                      })
                    })
                    arrayTmp.push({
                      title: `División: ${division.division_name} - ${dataClave.area_name} - Agencias`,
                      data: resultsAgency
                    })
                  }
                  break;
              }
            }
          }
        })
        setDataDivision(arrayTmp)
      }
    }
  }

  const getDataByArea = async () => {
    try {
      const data = await getGeneralDataByArea()
      if (!data?.error) {
        if (data.data?.usersByDivisionAndArea) {
          let arrayTmp = []
          data.data.usersByDivisionAndArea.forEach(item => {
            let results = []
            if (item.results.length > 0) {
              for (let rol of roles) {
                if (rol === 1 || rol === 2 || rol === 3 || rol === 5) {
                  item.results.forEach(area => {
                    results.push({
                      x: `Aprobados ${area.area_name || ""}`,
                      y: area.approved
                    }, {
                      x: `Reprobados ${area.area_name || ""}`,
                      y: area.reproved
                    })
                  })
                  break;
                } else {
                  switch (rol) {
                    case 6:
                      let dataCentro = item.results.find(area => area.area_name === "Centro - Centro");
                      if (dataCentro) {
                        results.push({
                          x: `Aprobados ${dataCentro.area_name || ""}`,
                          y: dataCentro.approved
                        }, {
                          x: `Reprobados ${dataCentro.area_name || ""}`,
                          y: dataCentro.reproved
                        })
                      }
                      break;
                    case 7:
                      let dataNorte = item.results.find(area => area.area_name === "Centro - Norte");
                      if (dataNorte) {
                        results.push({
                          x: `Aprobados ${dataNorte.area_name || ""}`,
                          y: dataNorte.approved
                        }, {
                          x: `Reprobados ${dataNorte.area_name || ""}`,
                          y: dataNorte.reproved
                        })
                      }
                      break;
                    case 8:
                      let dataSor = item.results.find(area => area.area_name === "Centro - Sor");
                      if (dataSor) {
                        results.push({
                          x: `Aprobados ${dataSor.area_name || ""}`,
                          y: dataSor.approved
                        }, {
                          x: `Reprobados ${dataSor.area_name || ""}`,
                          y: dataSor.reproved
                        })
                      }
                      break;
                    case 9:
                      let dataOccidente = item.results.find(area => area.area_name === "Centro - Occidente");
                      if (dataOccidente) {
                        results.push({
                          x: `Aprobados ${dataOccidente.area_name || ""}`,
                          y: dataOccidente.approved
                        }, {
                          x: `Reprobados ${dataOccidente.area_name || ""}`,
                          y: dataOccidente.reproved
                        })
                      }
                      break;
                    case 10:
                      let dataClave = item.results.find(area => area.area_name === "Centro Clave");
                      if (dataClave) {
                        results.push({
                          x: `Aprobados ${dataClave.area_name || ""}`,
                          y: dataClave.approved
                        }, {
                          x: `Reprobados ${dataClave.area_name || ""}`,
                          y: dataClave.reproved
                        })
                      }
                      break;
                  }
                }
              }
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

  useEffect(() => {
    getDataDivision()
    getRoles()
  }, [])

  useEffect(() => {
    if (roles.length > 0) {
      getDataArea()
    }
  }, [roles])

  useEffect(() => {
    if (active === 1) {
      getDataByArea()
    }
  }, [active])

  useEffect(() => {
    if (divisionActive !== null) {
      getDataByDivision(divisionActive)
    }
  }, [divisionActive])

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
          title={"Datos por Centro"}
          content={<div className="conatiner border"><RenderContent /></div>}
        />
      </div>
      <div className="container d-flex justify-content-center mb-5">
        <button
          type="button"
          onClick={() => setActive(active === 1 ? 0 : 1)}
          style={{ backgroundColor: "#810000", borderColor: "#810000", paddingInline: "5%" }}
          className="btn btn-primary btn-md mt-4 rounded-pill"
        >
          <b>{"Ver Datos por Divisiones"}</b>
        </button>
      </div>

      <div className="container">
        {
          active !== 0 && (
            active === 1 && (
              <div className="conatiner border my-2 p-2">
                <div className="row">
                  <div className="">
                    <h2>{"Reporte General: Área : Agencia"}</h2>
                    <div className="">
                      {
                        divisionOptions.length > 0 && (
                          divisionOptions.map((item, i) => (
                            <div
                              key={`opt-div-${i}`}
                              className="rounded-pill btn my-2 mx-1 py-2 px-5 text-white"
                              style={divisionActive === item.idDivision ? {backgroundColor: "#810000"} : {backgroundColor: "#CCCCCC"}}
                              onClick={() => setDivisionActive(divisionActive === item.idDivision ? null : item.idDivision)}
                            >
                              <h4 className={divisionActive === item.idDivision ? "text-white" : "text-black"}>{item.name}</h4>
                            </div>
                          ))
                        )
                      }
                    </div>
                    <div>
                      {
                        divisionActive !== null && (
                          dataDivision.length > 0 && (
                            dataDivision.map((chart, index) => (
                              <div key={`DBDBA-${index}`} className="col-lg-12 col-md-12 col-sm-12 my-2">
                                <div className='cointainer rounded-4 my-5 py-2 px-3' style={{ backgroundColor: "#CCCCCC" }}>
                                  <div className='rounded-pill my-2 d-flex justify-content-center' style={{ backgroundColor: "#555555" }}>
                                    <h5 className='text-white my-2 text-center'>{chart.title}</h5>
                                  </div>
                                  <Chart options={options} series={[{ data: chart.data }]} type='bar' height={500} />
                                </div>
                              </div>
                            ))
                          )
                        )
                      }
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <h2>{"Reporte General por División"}</h2>
                    {
                      dataByArea.length > 0 && (
                        dataByArea.map((chart, index) => (
                          <div key={`DBDBA-${index}`} className="col-lg-12 col-md-12 col-sm-12 my-2">
                            <div className='cointainer rounded-4 my-5 py-2 px-3' style={{ backgroundColor: "#CCCCCC" }}>
                              <div className='rounded-pill my-2 d-flex justify-content-center' style={{ backgroundColor: "#555555" }}>
                                <h5 className='text-white my-2 text-center'>División: {chart.division} - Por Centro</h5>
                              </div>
                              <Chart options={options} series={[{ data: chart.data }]} type='bar' height={500} />
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
  )
}

export default ProgressCenter;