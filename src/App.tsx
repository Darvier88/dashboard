import { useState } from 'react';
import { Grid, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './App.css'
import HeaderUI from './Components/HeaderUI';
import AlertUI from './Components/AlertUI';
import SelectorUI from './Components/SelectorUI';
import IndicatorUI from './Components/IndicatorUI';
import DataFetcher from './functions/DataFetcher';
import ChartUI from './Components/ChartUI';
import TableUI from './Components/TableUI';

const cities = [
  { value: "guayaquil", label: "Guayaquil", lat: -2.170998, lon: -79.922359 },
  { value: "quito", label: "Quito", lat: -0.180653, lon: -78.467834 },
  { value: "manta", label: "Manta", lat: -0.967653, lon: -80.708910 },
  { value: "cuenca", label: "Cuenca", lat: -2.900128, lon: -79.005896 }
];

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: "#181c20",
      paper: "#23272f"
    },
    text: {
      primary: "#fff",
      secondary: "#b0b3b8"
    }
  }
});

function App() {
   // Estado para la ciudad seleccionada
   const [selectedCity, setSelectedCity] = useState(cities[0]);

   // Pasa lat/lon a DataFetcher
   const dataFetcherOutput = DataFetcher(selectedCity.value);

  /* if (dataFetcherOutput.loading) {
      return <div>Cargando datos del clima...</div>;
   }

   if (dataFetcherOutput.error) {
      return <div>Error: {dataFetcherOutput.error}</div>;
   }*/

   return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Grid 
         container 
         spacing={5} 
         justifyContent="center" 
         alignItems="center"
         sx={{ minHeight: "100vh", backgroundColor: "background.default" }}
      >

         {/* Encabezado */}
         <Grid><HeaderUI /></Grid>

         {/* Alertas */}
         <Grid 
            container 
            justifyContent="flex-end" 
            alignItems="center"
         >
            <AlertUI description="No se preveen lluvias" />
         </Grid>

         {/* Selector */}
         <Grid>
           <SelectorUI
             cities={cities}
             selectedCity={selectedCity}
             setSelectedCity={setSelectedCity}
           />
         </Grid>

         {/* Indicadores */}
         <Grid container>
            <Grid>
               <IndicatorUI
                  title='Temperatura (2m)'
                  description={
                     dataFetcherOutput.data
                        ? `${dataFetcherOutput.data?.current.temperature_2m}°C`
                        : '--'
                  }
               />
            </Grid>
            <Grid>
               <IndicatorUI
                  title='Temperatura aparente'
                  description={
                     dataFetcherOutput.data
                        ? `${dataFetcherOutput.data?.current.apparent_temperature}°C`
                        : '--'
                  }
               />
            </Grid>
            <Grid>
               <IndicatorUI
                  title='Velocidad del viento'
                  description={
                     dataFetcherOutput.data
                        ? `${dataFetcherOutput.data?.current.wind_speed_10m} km/h`
                        : '--'
                  }
               />
            </Grid>
            <Grid>
               <IndicatorUI
                  title='Humedad relativa'
                  description={
                     dataFetcherOutput.data
                        ? `${dataFetcherOutput.data?.current.relative_humidity_2m}%`
                        : '--'
                  }
               />
            </Grid>
         </Grid>

         {/* Gráfico */}
         <Grid >
            <ChartUI
              key={selectedCity.value}
              lat={selectedCity.lat}
              lon={selectedCity.lon}
            />
         </Grid>

         {/* Tabla */}
         <Grid>
            <TableUI
              key={selectedCity.value}
              lat={selectedCity.lat}
              lon={selectedCity.lon}
            />
         </Grid>

      </Grid>
    </ThemeProvider>
   );
}

export default App;