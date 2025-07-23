import { useState } from 'react';
import { 
  Box, CssBaseline, ThemeProvider, createTheme, 
  Paper, Typography, Chip, Stack, Container
} from '@mui/material';
import './App.css';
import HeaderUI from './components/HeaderUI';
import AlertUI from './components/AlertUI';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';
import DataFetcher from './functions/DataFetcher';
import ChartUI from './components/ChartUI';
import TableUI from './components/TableUI';

// Importamos iconos
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import AirIcon from '@mui/icons-material/Air';
import WarningIcon from '@mui/icons-material/Warning';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import TimelineIcon from '@mui/icons-material/Timeline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';



const cities = [
  { value: "guayaquil", label: "Guayaquil", lat: -2.170998, lon: -79.922359 },
  { value: "quito", label: "Quito", lat: -0.180653, lon: -78.467834 },
  { value: "manta", label: "Manta", lat: -0.967653, lon: -80.708910 },
  { value: "cuenca", label: "Cuenca", lat: -2.900128, lon: -79.005896 }
];

// Creamos un tema claro similar a las capturas
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#7b1fa2',
    },
    background: {
      default: "#f6f8fa",
      paper: "#ffffff"
    },
    text: {
      primary: "#333333",
      secondary: "#666666"
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Segoe UI', Arial, sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        }
      }
    }
  }
});

function App() {
   // Estado para la ciudad seleccionada
   const [selectedCity, setSelectedCity] = useState(cities[0]);

   // Pasa lat/lon a DataFetcher
   const dataFetcherOutput = DataFetcher(selectedCity.lat, selectedCity.lon);

   return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: "100vh", 
        backgroundColor: "background.default",
        py: 4
      }}>
        <Container maxWidth="xl">
          {/* Reemplazar el header con el componente HeaderUI */}
          <Paper elevation={3} sx={{ 
            p: 4, mb: 4, 
            borderRadius: 4, 
            background: "linear-gradient(90deg, #ede7f6 0%, #e3f2fd 100%)"
          }}>
            <HeaderUI />
            <Typography variant="subtitle1" sx={{ mt: 3, color: "#555" }}>
              Dashboard interactivo para el monitoreo y análisis de condiciones climáticas en
              tiempo real. Accede a datos actualizados, pronósticos y alertas meteorológicas.
            </Typography>
          </Paper>

          {/* Selector de ubicación */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3, background: "#f3e5f5" }}>
            <Typography variant="h6" sx={{ color: "#7b1fa2", fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
              <CalendarMonthIcon sx={{ mr: 1 }} /> Selector de Ubicación
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: '300px', mr: 3 }}>
                <SelectorUI
                  cities={cities}
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                />
              </Box>
            </Box>
          </Paper>

          {/* Alertas activas */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3, background: "#fff8e1" }}>
            <Typography variant="h6" sx={{ color: "#e65100", fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
              <WarningIcon sx={{ mr: 1 }} /> Alertas Activas <Chip label="2 Activas" color="error" size="small" sx={{ ml: 1 }} />
            </Typography>
            <Stack spacing={2}>
              <AlertUI lat={selectedCity.lat} lon={selectedCity.lon} />
            </Stack>
          </Paper>
          
          {/* Indicadores principales usando Stack */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3, background: "#e8f5e9" }}>
            <Typography variant="h6" sx={{ color: "#2e7d32", fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
              <TimelineIcon sx={{ mr: 1 }} /> Indicadores Principales <Chip label="En Vivo" color="success" size="small" sx={{ ml: 1 }} />
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3} 
              flexWrap="wrap"
              useFlexGap
            >
              {/* Temperatura */}
              <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: '45%', md: '22%' }, minWidth: { md: '220px' } }}>
                <IndicatorUI
                  icon={<ThermostatIcon fontSize="large" color="error" />}
                  title='Temperatura Actual'
                  description={
                    dataFetcherOutput.data
                      ? `${dataFetcherOutput.data.current.temperature_2m}°C`
                      : '--'
                  }
                />
              </Box>
              
              {/* Humedad */}
              <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: '45%', md: '22%' }, minWidth: { md: '220px' } }}>
                <IndicatorUI
                  icon={<OpacityIcon fontSize="large" color="info" />}
                  title='Humedad Relativa'
                  description={
                    dataFetcherOutput.data
                      ? `${dataFetcherOutput.data.current.relative_humidity_2m}%`
                      : '--'
                  }
                />
              </Box>
              
              {/* Presión */}
              <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: '45%', md: '22%' }, minWidth: { md: '220px' } }}>
                <IndicatorUI
                  icon={<ThermostatIcon fontSize="large" color="secondary" />}
                  title='Temperatura Aparente'
                  description={
                    dataFetcherOutput.data
                      ? `${dataFetcherOutput.data.current.apparent_temperature} °C`
                      : '--'
                  }
                />
              </Box>
              
              {/* Viento */}
              <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: '45%', md: '22%' }, minWidth: { md: '220px' } }}>
                <IndicatorUI
                  icon={<AirIcon fontSize="large" color="success" />}
                  title='Velocidad del Viento'
                  description={
                    dataFetcherOutput.data
                      ? `${dataFetcherOutput.data.current.wind_speed_10m} km/h`
                      : '--'
                  }
                />
              </Box>
            </Stack>
          </Paper>

          {/* Tendencias climáticas */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3, background: "#fff3e0" }}>
            <Typography variant="h6" sx={{ color: "#e65100", fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
              <TimelineIcon sx={{ mr: 1 }} /> Tendencias Climáticas - Próximos 7 Días <Chip label="Pronóstico" color="info" size="small" sx={{ ml: 1 }} />
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
              <LocationOnIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'text-bottom' }} />
              Evolución de temperatura, humedad y precipitaciones con análisis predictivo
            </Typography>
            <ChartUI
              key={selectedCity.value}
              lat={selectedCity.lat}
              lon={selectedCity.lon}
            />
          </Paper>

          {/* Información detallada */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3, background: "#e3f2fd" }}>
            <Typography variant="h6" sx={{ color: "#0277bd", fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
              <ScheduleIcon sx={{ mr: 1 }} /> Información Detallada - Hoy <Chip label="6 Horarios" color="primary" size="small" sx={{ ml: 1 }} />
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
              <LocationOnIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'text-bottom' }} />
              Condiciones climáticas por hora para {selectedCity.label}
            </Typography>
            <TableUI
              key={selectedCity.value}
              lat={selectedCity.lat}
              lon={selectedCity.lon}
            />
          </Paper>
          
          {/* Información adicional y recomendaciones - USANDO STACK EN LUGAR DE GRID */}
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={3} 
            sx={{ mb: 3 }}
          >
            {/* Información Adicional */}
            <Box sx={{ flexGrow: 1, width: { xs: '100%', md: '50%' } }}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3, background: "#e8eaf6", height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <CalendarMonthIcon color="primary" />
                  <Typography variant="h6" sx={{ color: "#3f51b5", fontWeight: 600 }}>
                    Información Adicional
                  </Typography>
                  <Chip label="Datos Reales" color="success" size="small" />
                </Stack>
                <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'text-bottom' }} />
                  Datos meteorológicos para {selectedCity.label} ({dataFetcherOutput.data?.current.time ? new Date(dataFetcherOutput.data.current.time).toLocaleString('es-EC') : 'Cargando...'})
                </Typography>
                
                {/* Anidamos otro Stack para las dos tarjetas pequeñas */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2}
                >
                  <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: '50%' } }}>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                      <Typography variant="subtitle2" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} /> Zona Horaria
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {dataFetcherOutput.data ? dataFetcherOutput.data.timezone_abbreviation : 'ECT'} (UTC{dataFetcherOutput.data ? (dataFetcherOutput.data.utc_offset_seconds/3600 >= 0 ? '+' : '') + (dataFetcherOutput.data.utc_offset_seconds/3600) : '-5'})
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ecuador/Quito
                      </Typography>
                    </Paper>
                  </Box>
                  <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: '50%' } }}>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                      <Typography variant="subtitle2" color="success" sx={{ display: 'flex', alignItems: 'center' }}>
                        <ThermostatIcon fontSize="small" sx={{ mr: 0.5 }} /> Sensación Térmica
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {dataFetcherOutput.data ? `${dataFetcherOutput.data.current.apparent_temperature}°C` : '--'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dataFetcherOutput.data ? 
                          (dataFetcherOutput.data.current.apparent_temperature > dataFetcherOutput.data.current.temperature_2m ? 
                          'Se siente más caluroso' : 
                          'Se siente más fresco') : 
                          'Calculando...'}
                      </Typography>
                    </Paper>
                  </Box>
                </Stack>

                <Box sx={{ mt: 2 }}>
                  <Paper elevation={1} sx={{ p: 2, bgcolor: '#fce4ec', borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} /> Elevación
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {dataFetcherOutput.data ? `${dataFetcherOutput.data.elevation} metros` : '--'} 
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sobre el nivel del mar
                    </Typography>
                  </Paper>
                </Box>
              </Paper>
            </Box>
            
            {/* Consejos y Recomendaciones */}
            <Box sx={{ flexGrow: 1, width: { xs: '100%', md: '50%' } }}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3, background: "#e0f7fa", height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <WbSunnyIcon color="warning" />
                  <Typography variant="h6" sx={{ color: "#00838f", fontWeight: 600 }}>
                    Consejos y Recomendaciones
                  </Typography>
                  <Chip label="Automáticos" color="info" size="small" />
                </Stack>
                <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                  Sugerencias basadas en las condiciones meteorológicas actuales de {selectedCity.label}
                </Typography>
                
                <Stack spacing={2}>
                  {/* Consejo dinámico basado en temperatura */}
                  <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: dataFetcherOutput.data && dataFetcherOutput.data.current.temperature_2m > 28 ? '#fff3e0' : '#e3f2fd' }}>
                    <Typography variant="subtitle1" 
                      color={dataFetcherOutput.data && dataFetcherOutput.data.current.temperature_2m > 28 ? "warning" : "info"} 
                      sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}
                    >
                      <WbSunnyIcon fontSize="small" sx={{ mr: 0.5 }} /> 
                      {dataFetcherOutput.data && dataFetcherOutput.data.current.temperature_2m > 28 ? 'Protección Solar' : 
                        dataFetcherOutput.data && dataFetcherOutput.data.current.temperature_2m < 10 ? 'Protección contra el Frío' : 'Temperatura Ambiente'}
                    </Typography>
                    <Typography variant="body2">
                      {dataFetcherOutput.data && dataFetcherOutput.data.current.temperature_2m > 28 
                        ? 'Las temperaturas son elevadas. Use protector solar, vístase con ropa ligera y evite la exposición directa al sol entre 12:00-16:00h.'
                        : dataFetcherOutput.data && dataFetcherOutput.data.current.temperature_2m < 10
                        ? 'Las temperaturas son bajas. Abríguese bien, use varias capas de ropa y mantenga extremidades protegidas.'
                        : 'La temperatura es agradable. Disfrute de actividades al aire libre con normalidad.'}
                    </Typography>
                  </Paper>
                  
                  {/* Consejo dinámico basado en humedad */}
                  <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: dataFetcherOutput.data && dataFetcherOutput.data.current.relative_humidity_2m > 70 ? '#e8f5e9' : '#e3f2fd' }}>
                    <Typography variant="subtitle1" 
                      color={dataFetcherOutput.data && dataFetcherOutput.data.current.relative_humidity_2m > 70 ? "success" : "info"} 
                      sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}
                    >
                      <OpacityIcon fontSize="small" sx={{ mr: 0.5 }} /> 
                      {dataFetcherOutput.data && dataFetcherOutput.data.current.relative_humidity_2m > 70 ? 'Humedad Elevada' : 'Hidratación'}
                    </Typography>
                    <Typography variant="body2">
                      {dataFetcherOutput.data && dataFetcherOutput.data.current.relative_humidity_2m > 70
                        ? 'La humedad es alta. Puede sentir mayor sensación de calor. Use ropa transpirable y evite ejercicio intenso en exteriores.'
                        : dataFetcherOutput.data && dataFetcherOutput.data.current.relative_humidity_2m < 30
                        ? 'La humedad es baja. Mantenga una hidratación adecuada y proteja la piel con crema hidratante.'
                        : 'Mantenga una hidratación regular con al menos 2 litros de agua al día.'}
                    </Typography>
                  </Paper>

                  {/* Consejo dinámico basado en viento */}
                  <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: dataFetcherOutput.data && dataFetcherOutput.data.current.wind_speed_10m > 20 ? '#fff8e1' : '#f3e5f5' }}>
                    <Typography variant="subtitle1" 
                      color={dataFetcherOutput.data && dataFetcherOutput.data.current.wind_speed_10m > 20 ? "error" : "secondary"} 
                      sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}
                    >
                      <AirIcon fontSize="small" sx={{ mr: 0.5 }} /> 
                      {dataFetcherOutput.data && dataFetcherOutput.data.current.wind_speed_10m > 20 ? 'Viento Fuerte' : 'Condiciones de Viento'}
                    </Typography>
                    <Typography variant="body2">
                      {dataFetcherOutput.data && dataFetcherOutput.data.current.wind_speed_10m > 20
                        ? 'Viento considerable. Asegure objetos ligeros en exteriores y tenga precaución al conducir vehículos altos.'
                        : dataFetcherOutput.data && dataFetcherOutput.data.current.wind_speed_10m > 10
                        ? 'Viento moderado. Ideal para actividades como volar cometas. Puede sentir algo de brisa fresca.'
                        : 'Condiciones de viento suave. Perfectas para cualquier actividad al aire libre.'}
                    </Typography>
                  </Paper>
                </Stack>
              </Paper>
            </Box>
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
   );
}

export default App;
