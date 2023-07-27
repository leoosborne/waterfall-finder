// import {Chart} from 'chart.js';

(async function() {
    const data = [
        { date: 'July 24', rain: 0.1 },
        { date: 'July 25', rain: 0.2 },
        { date: 'July 26', rain: 0.5 },
        { date: 'July 27', rain: 0.1 },
        { date: 'July 28', rain: 0.0 }
    ];

    let options = {
        maintainAspectRatio: false,
        scales: {
          y: {
            stacked: true,
            grid: {
              display: true,
              color: "hsl(36, 48%, 76%)"
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      };
      

    new Chart(
        document.getElementById('rainDataChart'),
        {
            type: 'bar',
            options: options,
            data: {
                labels: data.map(row => row.date),
                datasets: [
                    {
                        label: 'Recent Rain',
                        data: data.map(row => row.rain)
                    }
                ]
            }
        }
    )
})();