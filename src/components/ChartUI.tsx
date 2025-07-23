import { LineChart } from '@mui/x-charts/LineChart';
import { Typography, Paper, Box, Chip, Stack, CircularProgress } from '@mui/material';
import DataFetcher from '../functions/DataFetcher';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AirIcon from '@mui/icons-material/Air';
import ErrorIcon from '@mui/icons-material/Error';

interface ChartUIProps {
  lat: number;
  lon: number;
}

export default function ChartUI({ lat, lon }: ChartUIProps) {
  const { data, loading, error } = DataFetcher(lat, lon);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={40} thickness={4} color="primary" />
        <Typography sx={{ ml: 2 }}>Cargando datos del clima...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', color: 'error.main' }}>
        <ErrorIcon sx={{ mr: 1 }} />
        <Typography>Error al cargar datos: {error}</Typography>
      </Box>
    );
  }

  if (!data || !data.hourly || !data.hourly.time) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No hay datos disponibles para esta ubicación.</Typography>
      </Box>
    );
  }

  // Procesar datos de la API para las próximas 24 horas
  const maxHours = Math.min(24, data.hourly.time.length);
  const horas = data.hourly.time.slice(0, maxHours).map(dateStr => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', hour12: false });
  });
  const temperaturas = data.hourly.temperature_2m.slice(0, maxHours);
  const vientos = data.hourly.wind_speed_10m.slice(0, maxHours);

  // Estadísticas para los chips
  const maxTemp = Math.max(...temperaturas).toFixed(1);
  const maxWind = Math.max(...vientos).toFixed(1);

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <Paper elevation={1} sx={{ p: 1, px: 2, borderRadius: 6, display: 'flex', alignItems: 'center', bgcolor: '#ffebee' }}>
          <ThermostatIcon color="error" sx={{ mr: 1 }} />
          <Typography variant="subtitle2" color="error" fontWeight={600}>
            Temperatura (°C)
          </Typography>
          <Chip label={`Máx: ${maxTemp}°`} size="small" color="error" variant="outlined" sx={{ ml: 1 }} />
        </Paper>
        <Paper elevation={1} sx={{ p: 1, px: 2, borderRadius: 6, display: 'flex', alignItems: 'center', bgcolor: '#e3f2fd' }}>
          <AirIcon color="info" sx={{ mr: 1 }} />
          <Typography variant="subtitle2" color="info" fontWeight={600}>
            Viento (km/h)
          </Typography>
          <Chip label={`Máx: ${maxWind}`} size="small" color="info" variant="outlined" sx={{ ml: 1 }} />
        </Paper>
      </Stack>
      <Paper elevation={1} sx={{ borderRadius: 3, p: 1, bgcolor: 'rgba(255, 255, 255, 0.7)' }}>
        <LineChart
          height={300}
          series={[
            {
              data: temperaturas,
              label: 'Temperatura (°C)',
              color: '#f44336',
              curve: 'natural',
              showMark: true,
              valueFormatter: (value) => `${value?.toFixed(1)}°C`,
              
            },
            {
              data: vientos,
              label: 'Viento (km/h)',
              color: '#2196f3',
              curve: 'natural',
              showMark: true,
              valueFormatter: (value) => `${value?.toFixed(1)} km/h`,
              
            },
          ]}
          xAxis={[{
            scaleType: 'point',
            data: horas,
            tickLabelStyle: {
              fontSize: 12,
              fontWeight: 600
            }
          }]}
          sx={{
            '.MuiLineElement-root': { strokeWidth: 3 },
            '.MuiMarkElement-root': { strokeWidth: 2, r: 4 },
            '.MuiChartsLegend-root': { display: 'none' },
          }}
          slots={{
            legend: () => null
          }}
        />
      </Paper>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
        * Datos reales por hora de temperatura y viento de Open-Meteo.
      </Typography>
    </Box>
  );
}