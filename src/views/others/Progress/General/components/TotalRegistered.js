import Chart from 'react-apexcharts'
import { useNavigate } from 'react-router-dom';
const TotalRegistered = ({data}) => {
  const navigation = useNavigate()
  console.log(data);
  const options = {
    chart: {
      type: 'pie',
      height: 350
    },
    grid: {
      show: true,
    },
    labels: ['Inscritos'],
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

  return (
    <div className="border">
      <div className="container">
        <div className="row g-0">
          <div className="col-md-5 p-3">
            <h6><b className="text-muted">Total de Usuarios Registrados:</b> {data?.totaInscritos || 0}</h6>
            <h6><b className="text-muted">Usuarios activos (al menos 1 cuestionario completado):</b> {data?.activeUsers?.totalActiveUsers || 0}</h6>
            <h6><b className="text-muted">Cuestionarios Aprobados:</b> {data?.aproved || 0}</h6>
            <h6><b className="text-muted">Cuestionarios Reprobados:</b> {data?.reproved || 0}</h6>

            <h4 className="fw-bold">Resumen por Área</h4>
            {
              data.usersByArea.map((item, index) => (
                <h6 key={`tU-${index}`}><b className="text-muted">Usuarios en {item.name}:</b> {item.total_usuarios}</h6>
              ))
            }
          </div>
          <div className="col-md-7 p-3">
            <div className='cointainer rounded-4 py-2 px-3' style={{ backgroundColor: "#CCCCCC" }}>
              <div className='rounded-pill my-2 d-flex justify-content-center' style={{ backgroundColor: "#555555" }}>
                <h5 className='text-white my-2 text-center'>{"Total inscritos"}</h5>
              </div>
              <Chart options={options} series={[data?.totaInscritos || 0]} type='pie' height={400} />
              <div onClick={() => navigation("/avances/general/detail")} className='btn rounded-pill my-2 d-flex justify-content-center btn' style={{ backgroundColor: "#810000" }}>
                <h5 className='text-white my-1 text-center'>{"Avances generales"}</h5>
              </div>
              <div onClick={() => navigation("/avances")} className='btn rounded-pill d-flex justify-content-center' style={{ backgroundColor: "#810000" }}>
                <h5 className='text-white my-1 text-center'>{"Regresar"}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TotalRegistered