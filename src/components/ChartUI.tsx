import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';

import DataFetcher from '../functions/DataFetcher';

export default function ChartUI() {
   const { data, loading, error } = DataFetcher();

   if (loading) return <Typography sx={{ p: 2 }}>Cargando datos...</Typography>;
   if (error) return <Typography sx={{ p: 2, color: 'red' }}>Error: {error}</Typography>;
   if (!data) return <Typography sx={{ p: 2 }}>Sin datos.</Typography>;

   const arrLabels = data.hourly.time.slice(0, 50);
   const arrValues1 = data.hourly.temperature_2m.slice(0, 50);
   const arrValues2 = data.hourly.wind_speed_10m.slice(0, 50);

   return (
      <>
         <Typography variant="h5" component="div">
            Temperatura y Viento por Hora
         </Typography>
         <LineChart
            height={300}
            series={[

               { data: arrValues1, label: 'Temperatura (°C)' },
               { data: arrValues2, label: 'Viento (km/h)' },
            ]}
            xAxis={[{ scaleType: 'point', data: arrLabels }]}
         />
      </>
   );
}