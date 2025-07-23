import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Chip, Typography, Tooltip } from '@mui/material';
import DataFetcher from '../functions/DataFetcher';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AirIcon from '@mui/icons-material/Air';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import SummarizeIcon from '@mui/icons-material/Summarize';

interface TableUIProps {
  lat: number;
  lon: number;
}

// Función para convertir fecha ISO a objeto Date
const parseISODate = (isoString: string) => {
  return new Date(isoString);
};

// Función para formatear hora de 24h a AM/PM
const formatHour = (dateString: string) => {
  const date = parseISODate(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Función para calcular el índice UV aproximado basado en la temperatura
const calculateUVIndex = (temp: number) => {
  if (temp > 30) return { level: 'Muy Alto*', color: 'error' };
  if (temp > 25) return { level: 'Alto*', color: 'warning' };
  if (temp > 20) return { level: 'Moderado*', color: 'info' };
  return { level: 'Bajo*', color: 'success' };
};

// Función para determinar la condición climática basada en los datos
const calculateCondition = (temp: number, wind: number) => {
  if (temp > 30) return { condition: 'Caluroso', color: 'error' };
  if (temp > 25 && wind < 10) return { condition: 'Soleado', color: 'success' };
  if (wind > 20) return { condition: 'Ventoso', color: 'warning' };
  if (temp < 15) return { condition: 'Fresco', color: 'info' };
  return { condition: 'Agradable', color: 'success' };
};

// Función para generar un resumen más detallado de las condiciones climáticas
const generateSummary = (temp: number,  wind: number) => {
  const parts = [];
  
  // Temperatura
  if (temp > 32) {
    parts.push("• Temperatura extremadamente alta");
    parts.push("• Evite actividades al aire libre");
  } else if (temp > 28) {
    parts.push("• Temperatura muy cálida");
    parts.push("• Hidratación frecuente recomendada");
  } else if (temp > 23) {
    parts.push("• Temperatura cálida y agradable");
    parts.push("• Ideal para actividades exteriores");
  } else if (temp > 18) {
    parts.push("• Temperatura moderada");
    parts.push("• Perfecta para cualquier actividad");
  } else if (temp > 12) {
    parts.push("• Temperatura fresca");
    parts.push("• Se recomienda ropa ligera");
  } else {
    parts.push("• Temperatura baja");
    parts.push("• Abríguese adecuadamente");
  }
  

  
  // Viento
  if (wind > 40) {
    parts.push("• Viento muy fuerte");
    parts.push("• Precaución con objetos ligeros");
  } else if (wind > 25) {
    parts.push("• Viento fuerte");
    parts.push("• Dificulta actividades exteriores");
  } else if (wind > 15) {
    parts.push("• Brisa moderada");
  } else if (wind > 5) {
    parts.push("• Viento ligero");
  } else {
    parts.push("• Condiciones de calma");
  }
  
  if (temp > 28 && wind < 5) {
    parts.push("\n• Recomendación: Busque sombra en horas pico");
  } else if (wind > 20 && temp < 15) {
    parts.push("\n• Recomendación: La sensación térmica es menor");
  }
  
  // Usamos \n para el formato de texto y <br> para el formato HTML
  return parts.join('\n');
};

// Genera las filas con datos reales de la API
function generateRows(data: any) {
  if (!data || !data.hourly || !data.hourly.time) return [];
  
  const rows = [];
  const limit = Math.min(6, data.hourly.time.length);
  
  for (let i = 0; i < limit; i++) {
    const temp = data.hourly.temperature_2m[i];
    const wind = data.hourly.wind_speed_10m[i];
    const hour = formatHour(data.hourly.time[i]);
    

    
    const uvData = calculateUVIndex(temp);
    const conditionData = calculateCondition(temp, wind);
    const summary = generateSummary(temp,  wind);
    
    rows.push({
      id: i,
      label: hour,
      value1: temp,
      value2: wind,
      uv: uvData.level,
      uvColor: uvData.color,
      condition: conditionData.condition,
      conditionColor: conditionData.color,
      summary: summary
    });
  }
  
  return rows;
}

// 1. Primero, ajustamos el ancho de las columnas (reduciendo algunos)
const columns: GridColDef[] = [
   { 
      field: 'label', 
      headerName: 'Hora', 
      width: 85,
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#e0e0e0', mr: 1 }}>
            <Typography variant="caption" fontWeight="bold">⌚</Typography>
          </Box>
          <Typography variant="subtitle2" fontWeight="bold">Hora</Typography>
        </Box>
      ),
   },
   { 
      field: 'value1', 
      headerName: 'Temperatura (°C)', 
      width: 175, 
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ThermostatIcon fontSize="small" color="error" />
          <Typography variant="subtitle2" fontWeight="bold" sx={{ ml: 0.5 }}>Temperatura (°C)</Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Typography sx={{ color: params.value > 28 ? '#f44336' : (params.value < 15 ? '#2196f3' : '#333333'), fontWeight: 500 }}>
          {params.value.toFixed(1)}°
        </Typography>
      ),
   },
   { 
      field: 'value2', 
      headerName: 'Viento (km/h)', 
      width: 100, // Reducido de 110
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AirIcon fontSize="small" color="success" />
          <Typography variant="subtitle2" fontWeight="bold" sx={{ ml: 0.5 }}>Viento</Typography>
        </Box>
      ),
      renderCell: (params) => (
        <Typography sx={{ 
          fontWeight: 500,
          color: params.value > 20 ? '#f57c00' : '#333333'
        }}>
          {params.value.toFixed(1)}
        </Typography>
      ),
   },
   { 
      field: 'uv', 
      headerName: 'UV (?)', // Acortamos el texto
      width: 100, // Reducido de 120
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <WbSunnyIcon fontSize="small" color="warning" />
          <Typography variant="subtitle2" fontWeight="bold" sx={{ ml: 0.5 }}>UV</Typography>
          <Tooltip title="Aproximación basada en temperatura. No es una medición real.">
            <Typography variant="caption" sx={{ ml: 0.5, color: 'text.secondary' }}>(?)</Typography>
          </Tooltip>
        </Box>
      ),
      renderCell: (params) => (
        <Tooltip title="Valor aproximado basado en la temperatura">
          <Chip 
            label={params.value} 
            size="small" 
            color={params.row.uvColor}
            variant="outlined"
          />
        </Tooltip>
      ),
   },
   { 
      field: 'condition', 
      headerName: 'Condición (?)', // Mantenemos el mismo formato
      width: 110, // Reducido de 120
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2" fontWeight="bold">Condición</Typography>
          <Tooltip title="Estimación basada en temperatura y viento">
            <Typography variant="caption" sx={{ ml: 0.5, color: 'text.secondary' }}>(?)</Typography>
          </Tooltip>
        </Box>
      ),
      renderCell: (params) => (
        <Tooltip title="Condición calculada a partir de temperatura y viento">
          <Chip 
            label={params.value} 
            size="small" 
            color={params.row.conditionColor} 
            sx={{ fontWeight: 500 }}
          />
        </Tooltip>
      ),
   },
   { 
      field: 'summary', 
      headerName: 'Resumen Detallado', 
      width: 250, // Fijamos un ancho específico
      flex: 0, // Quitamos flex para que no se expanda
      minWidth: 250, // Establecemos un ancho mínimo
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SummarizeIcon fontSize="small" color="primary" />
          <Typography variant="subtitle2" fontWeight="bold" sx={{ ml: 0.5 }}>Resumen Detallado</Typography>
        </Box>
      ),
      renderCell: (params) => (
        <div style={{ 
          overflow: 'auto', 
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '8px',
          paddingRight: '8px'
        }}>
          <div style={{
            whiteSpace: 'pre-wrap', // Crucial para preservar saltos de línea
            overflowWrap: 'break-word',
            fontSize: '0.85rem',
            lineHeight: '1.4',
            fontWeight: 400,
            color: '#424242'
          }}>
            {params.value}
          </div>
        </div>
      ),
   },
];

export default function TableUI({lat, lon}: TableUIProps ) {
   const { data, loading, error } = DataFetcher(lat, lon);

   if (loading) return <Box sx={{ p: 2 }}>Cargando datos...</Box>;
   if (error) return <Box sx={{ p: 2, color: 'red' }}>Error: {error}</Box>;
   if (!data) return <Box sx={{ p: 2 }}>Sin datos.</Box>;

   // Generamos las filas con datos reales
   const rows = generateRows(data);

   return (
      <Box sx={{ 
         height: 450, 
         maxWidth: '100%', // Importante para que no se desborde
         width: 'auto', // Cambiamos a 'auto' para que se ajuste al contenido
         overflowX: 'auto' // Permitimos scroll horizontal si es necesario
      }}>
         <Box sx={{ mb: 1 }}>
           <Typography variant="caption" color="text.secondary">
             * Tanto el indice UV como las condiciones climáticas son aproximados y no deben ser considerados como mediciones precisas.
           </Typography>
         </Box>
         <DataGrid
            rows={rows}
            columns={columns}
            disableColumnMenu
            disableRowSelectionOnClick
            hideFooterPagination
            hideFooter
            rowHeight={100}
            getRowHeight={() => 'auto'}
            autoHeight // Añadimos esto para que se ajuste a las filas disponibles
            sx={{
              boxShadow: 2,
              borderRadius: 4,
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                borderRadius: '12px 12px 0 0',
              },
              '& .MuiDataGrid-row:nth-of-type(even)': {
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
              },
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-cell': {
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                padding: '8px',
              },
              border: 'none',
              // Fijamos un ancho para la tabla completa
              maxWidth: 900, // Esto evita que la tabla se expanda demasiado
              margin: '0 auto', // Centra la tabla si es más pequeña que el contenedor
            }}
         />
      </Box>
   );
}