import Chart from 'react-apexcharts'
import { useNavigate } from 'react-router-dom';

const ResultsQuiz = ({title, aprobados = 0, reprobados = 0, buttons = true}) => {
  const navigate = useNavigate()
  const options = {
    chart: {
      type: 'bar',
      height: 350
    },
    grid: {
      show: true,

    },
    labels: ['Total Usuarios Aprobados', 'Total Usuarios Reprobados'],
    colors: ['#810000'],
    xaxis: {
      categories: ['Total Usuarios Aprobados', 'Total Usuarios Reprobados'],
    },
  };

  return (
    <div className="container border">
      <div className='cointainer rounded-4 my-5 py-2 px-3' style={{ backgroundColor: "#CCCCCC" }}>
        <div className='rounded-pill my-2 d-flex justify-content-center' style={{ backgroundColor: "#555555" }}>
          <h5 className='text-white my-2 text-center'>{title}</h5>
        </div>
        <Chart options={options} series={[{
          data: [{
            x: 'Total Usuarios Aprobados',
            y: aprobados
          }, {
            x: 'Total Usuarios Reprobados',
            y: reprobados
          }]
        }]} type='bar' height={400} />
        {
          buttons && (
            <>
              <div className='btn rounded-pill my-2 d-flex justify-content-center' style={{ backgroundColor: "#810000" }}>
                <h5 className='text-white my-1 text-center'>{"Avances generales"}</h5>
              </div>
              <div className='btn rounded-pill d-flex justify-content-center' style={{ backgroundColor: "#810000" }}>
                <h5 className='text-white my-1 text-center'>{"Regresar"}</h5>
              </div>
            </>
          )
        }
      </div>
    </div>
  )
}

export default ResultsQuiz