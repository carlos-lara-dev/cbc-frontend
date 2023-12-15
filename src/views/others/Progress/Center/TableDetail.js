import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts'
import DataTable from 'react-data-table-component';
import HeaderComponent from '../../../components/HeaderComponent';
import MenuComponent from '../../../components/MenuComponent';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { getDataGeneralAdvances, getDataGeneralAdvancesByArea, getDataResultsByAreaName } from '../../../services/dashboardFnc';
import "./tableStyle.css";
import { getAgencyByAreaNameService, getDivisionService } from '../../../services/userFnc';

const MySwal = withReactContent(Swal);
const TableDetail = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const {area_name} = location.state;
  const [agencySelect, setAgencySelect] = useState("all")
  const [divisionSelect, setDivisionSelect] = useState(null)
  const [divisionActive, setDivisionActive] = useState(false)
  const [data, setData] = useState([])
  const [dataChart, setDataChart] = useState([])
  const [dataTmp, setDataTmp] = useState([])
  const [areaOptions, setAreaOptions] = useState([])
  const [divisionOptions, setDivisionOptions] = useState([])
  const columns = [
    {
      name: 'id',
      selector: row => row.idUser,
    },
    {
      name: 'Usuario',
      selector: row => row.user,
    },
    {
      name: 'DPI',
      selector: row => row?.dpi || "N/A",
    },
    {
      name: 'División',
      selector: row => row?.Agency?.Area?.Division.name || "N/A",
    },
    {
      name: 'Agencia',
      selector: row => row?.Agency.name || "N/A",
    },
    {
      name: 'Centro',
      selector: row => row?.Agency?.Area.name || "N/A",
    },
  ];

  const getData = async () => {
    try {
      const requestData = await getDataGeneralAdvancesByArea(area_name)
      const dataChart = await getDataResultsByAreaName(area_name)
      if (!dataChart?.error) {
        setDataChart(dataChart.data)
      }
      if (requestData?.data) {
        setData(requestData.data)
        setDataTmp(requestData.data)
        getAgency()
        getDivision()
      }
    } catch (error) {
      console.log(error)
    }
  }
console.log("CHART ---->", dataChart);
  const getAgency = async () => {
    const data = await getAgencyByAreaNameService(area_name)
    if (data?.data) {
      setAreaOptions(data.data)
    }
  }

  const getDivision = async () => {
    const data = await getDivisionService()
    if (data?.data) {
      setDivisionOptions(data.data)
    }
  }

  const ExpandedComponent = ({data}) => {
    return(
      <div className='container'>
        <div className='row'>
          {
            data.UserQuiz.length > 0 ? (
              (data.UserQuiz.some(q => q.aproved === 1)) ? (
                data.UserQuiz.map((quiz, index) => {
                  if (quiz.aproved === 1) {
                    return (
                      <div key={`MOD-${data.user}-${index}`} className='col-lg-3 col-md-6 col-sm-12 my-2'>
                        <div className='card'>
                          <div className='card-body'>
                            <div className='text-center'>
                              <h6><span className='fw-bold'>{quiz.Quiz.title}</span></h6>
                              <h5>{(quiz?.UserScoreQuiz?.score) || 80} pts</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                })
              ) : (
                <div className='text-center my-5'>
                  <h6 className='text-muted'>{`${data.user} no tiene ningún módulo aprovado`}</h6>
                </div>
              )
            ) : (
              <div className='text-center my-5'>
                <h6 className='text-muted'>{`${data.user} no ha realizado ningún custionario`}</h6>
              </div>
            )
          }
        </div>
      </div>
    )
  }

  useEffect(() => {
    getData()
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

  const handleClickAgency = (agency) => {
    setAgencySelect(agency)
    if (divisionActive) {
      setDivisionActive(false)
    }
    if (agency === "all") {
      setDataTmp(data)
    } else {
      const dataByAgency = data.filter(item => (item?.Agency.name || "") === agency);
      if (dataByAgency.length > 0) {
        setDataTmp(dataByAgency);
      } else {
        setDataTmp(data)
        MySwal.fire({
          icon: "info",
          title: "¡Atención!",
          text: `No se encontraron datos de la angencia ${agency}`
        })
      }
    }
  }

  const handleClickDivision = (division) => {
    setAgencySelect("division")
    if (division === "active") {
      setDivisionActive(true)
      setDivisionSelect(divisionOptions[0].name)
      const dataFilter = data.filter(item => (item?.Agency?.Area?.Division.name || "") === divisionOptions[0].name)
      if (dataFilter.length > 0) {
        setDataTmp(dataFilter)
      } else {
        setDataTmp(data)
        MySwal.fire({
          icon: "info",
          title: "¡Atención!",
          text: `No se encontraron datos de la division ${divisionOptions[0].name}`
        })
      }
    } else {
      setDivisionSelect(division)
      const dataFilter = data.filter(item => (item?.Agency?.Area?.Division.name || "") === division)
      if (dataFilter.length > 0) {
        setDataTmp(dataFilter)
      } else {
        setDataTmp(data)
        MySwal.fire({
          icon: "info",
          title: "¡Atención!",
          text: `No se encontraron datos de la division ${division}`
        })
      }
    }

  }

  const customStyles = {
    table: {
    },
  };

  const options1 = {
    chart: {
      type: 'pie',
      height: 350
    },
    grid: {
      show: true,
    },
    labels: [`Total usuarios Aprovados`],
    colors: ['#3366cc'],
    legend: {
      position: 'bottom',
    },
    dataLabels: {
      enabled: true,
      formatter: (data, da) => {
        console.log(data, da);
        return da.w.seriesTotals
      },
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
      }
    }]
  };

  const options2 = {
    chart: {
      type: 'pie',
      height: 350
    },
    grid: {
      show: true,
    },
    labels: [`Total usuarios Reprovados`],
    colors: ['#810000'],
    legend: {
      position: 'bottom',
    },
    dataLabels: {
      enabled: true,
      formatter: (data, da) => {
        console.log(data, da);
        return da.w.seriesTotals
      },
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
      }
    }]
  };

  const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
  };

  return (
    <div>
      <HeaderComponent />
      <MenuComponent />
      <div className="container">
        <h1 className='text-center mt-5'>{`Área ${area_name}`}</h1>
        <div className='row mt-5'>
          <div>
            <div
              onClick={() => handleClickAgency("all")}
              className="rounded-pill btn my-2 mx-1 py-2 px-5"
              style={agencySelect === "all" ? {backgroundColor: "#810000", color: "#FFF"} : {backgroundColor: "#CCCCCC", color: "#000"}}
            >
              <b>{`General ${area_name}`}</b>
            </div>
            {
              areaOptions.length > 0 && (
                areaOptions.map((option, i) => (
                  <div key={`opt-ag-${i}`}
                    onClick={() => handleClickAgency(option.name)}
                    className="rounded-pill btn my-2 mx-1 py-2 px-5"
                    style={agencySelect === option.name ? {backgroundColor: "#810000", color: "#FFF"} : {backgroundColor: "#CCCCCC", color: "#000"}}
                  >
                    <b>{option.name}</b>
                  </div>
                ))
              )
            }
            <div
              onClick={() => handleClickDivision("active")}
              className="rounded-pill btn my-2 mx-1 py-2 px-5"
              style={divisionActive ? {backgroundColor: "#810000", color: "#FFF"} : {backgroundColor: "#CCCCCC", color: "#000"}}
            >
              <b>{`Por División`}</b>
            </div>
            {
              divisionActive && (
                divisionOptions.length > 0 && (
                  divisionOptions.map((option, i) => (
                    <div key={`opt-dv-${i}`}
                      onClick={() => handleClickDivision(option.name)}
                      className="rounded-pill btn my-2 mx-1 py-2 px-5"
                      style={divisionSelect === option.name ? {backgroundColor: "#810000", color: "#FFF"} : {backgroundColor: "#CCCCCC", color: "#000"}}
                    >
                      <b>{option.name}</b>
                    </div>
                  ))
                )
              )
            }
          </div>
        </div>
        {
          agencySelect === "all" && (
            <div className='row my-5'>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <div className='card shadow bg-body rounded-4'>
                  <div className='card-body rounded-4' style={{backgroundColor: "#dee2e6"}}>
                    <Chart options={options1} series={[dataChart.length > 0 ? dataChart[0].aproved : 0]} type='pie' height={250} />
                  </div>
                </div>
              </div>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <div className='card shadow bg-body rounded-4'>
                  <div className='card-body rounded-4' style={{backgroundColor: "#dee2e6"}}>
                    <Chart options={options2} series={[dataChart.length > 0 ? dataChart[0].reproved : 0]} type='pie' height={250} />
                  </div>
                </div>
              </div>
            </div>
          )
        }
        <div className='react-dataTable'>
          <DataTable
            noHeader
            sortServer
            responsive
            pagination
            paginationComponentOptions={paginationComponentOptions}
            data={dataTmp}
            columns={columns}
            noDataComponent={<div className='text-center'>{"cargando..."}</div>}
            expandableRows
            expandableRowsComponent={ExpandedComponent}
            customStyles={customStyles}
          />
        </div>
      </div>
    </div>
  )
}

export default TableDetail