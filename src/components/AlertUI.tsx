import Alert from '@mui/material/Alert';
import { AlertTitle, Box, Stack, CircularProgress } from '@mui/material';
import DataFetcher from '../functions/DataFetcher';
import { useState, useEffect } from 'react';

interface AlertConfig {
  description: string;
  severity?: "error" | "warning" | "info" | "success";
  title?: string;
}

interface AlertUIProps {
  lat: number;
  lon: number;
}

// Función para formatear la hora
const formatTime = (isoString: string): string => {
  return new Date(isoString).toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};

// Función para verificar alertas de temperatura alta
const checkHighTemperatureAlerts = (temperatures: number[], times: string[]): AlertConfig[] => {
  const alerts: AlertConfig[] = [];
  const maxTemp = Math.max(...temperatures);
  
  if (maxTemp > 30) {
    const maxTempIndex = temperatures.indexOf(maxTemp);
    const maxTempTime = formatTime(times[maxTempIndex]);
    
    alerts.push({
      description: `Temperatura muy alta de ${maxTemp.toFixed(1)}°C esperada alrededor de las ${maxTempTime}. Se recomienda hidratación frecuente.`,
      severity: "error",
      title: "Alerta de Calor Extremo"
    });
  } else if (maxTemp > 28) {
    alerts.push({
      description: `Temperatura elevada de hasta ${maxTemp.toFixed(1)}°C en las próximas horas. Manténgase hidratado.`,
      severity: "warning",
      title: "Aviso de Temperatura Elevada"
    });
  }
  
  return alerts;
};

// Función para verificar alertas de temperatura baja
const checkLowTemperatureAlerts = (temperatures: number[], times: string[]): AlertConfig[] => {
  const alerts: AlertConfig[] = [];
  const minTemp = Math.min(...temperatures);
  
  if (minTemp < 5) {
    const minTempIndex = temperatures.indexOf(minTemp);
    const minTempTime = formatTime(times[minTempIndex]);
    
    alerts.push({
      description: `Temperatura muy baja de ${minTemp.toFixed(1)}°C esperada alrededor de las ${minTempTime}. Se recomienda abrigarse adecuadamente.`,
      severity: "error",
      title: "Alerta de Frío Extremo"
    });
  } else if (minTemp < 10) {
    alerts.push({
      description: `Temperatura baja de hasta ${minTemp.toFixed(1)}°C en las próximas horas. Se recomienda llevar abrigo.`,
      severity: "warning",
      title: "Aviso de Temperatura Baja"
    });
  }
  
  return alerts;
};

// Función para verificar alertas de viento
const checkWindAlerts = (windSpeeds: number[], times: string[]): AlertConfig[] => {
  const alerts: AlertConfig[] = [];
  const maxWind = Math.max(...windSpeeds);
  
  if (maxWind > 30) {
    const maxWindIndex = windSpeeds.indexOf(maxWind);
    const maxWindTime = formatTime(times[maxWindIndex]);
    
    alerts.push({
      description: `Viento muy fuerte de ${maxWind.toFixed(1)} km/h esperado alrededor de las ${maxWindTime}. Se recomienda precaución en exteriores.`,
      severity: "error",
      title: "Alerta de Viento Fuerte"
    });
  } else if (maxWind > 20) {
    alerts.push({
      description: `Viento moderado a fuerte de hasta ${maxWind.toFixed(1)} km/h en las próximas horas.`,
      severity: "warning",
      title: "Aviso de Viento"
    });
  }
  
  return alerts;
};

// Función para verificar cambios bruscos de temperatura
const checkTemperatureChanges = (temperatures: number[], times: string[]): AlertConfig[] => {
  const alerts: AlertConfig[] = [];
  let maxTempChange = 0;
  let tempChangeHour = "";
  
  for (let i = 1; i < temperatures.length; i++) {
    const tempChange = Math.abs(temperatures[i] - temperatures[i-1]);
    if (tempChange > maxTempChange) {
      maxTempChange = tempChange;
      tempChangeHour = formatTime(times[i]);
    }
  }
  
  if (maxTempChange > 5) {
    alerts.push({
      description: `Cambio brusco de temperatura de ${maxTempChange.toFixed(1)}°C esperado alrededor de las ${tempChangeHour}.`,
      severity: "info",
      title: "Aviso de Cambio de Temperatura"
    });
  }
  
  return alerts;
};

// Función para validar datos
const validateData = (data: any): boolean => {
  if (!data || !data.hourly || !data.hourly.time || !data.hourly.temperature_2m || !data.hourly.wind_speed_10m) {
    console.log("AlertUI - Datos incompletos:", data);
    return false;
  }
  
  if (data.hourly.time.length === 0) {
    console.log("AlertUI - No hay datos horarios disponibles");
    return false;
  }
  
  return true;
};

// Función principal para generar todas las alertas
const generateAlerts = (data: any): AlertConfig[] => {
  if (!validateData(data)) {
    return [];
  }
  
  try {
    const nextHours = Math.min(12, data.hourly.time.length);
    const temperatures = data.hourly.temperature_2m.slice(0, nextHours);
    const windSpeeds = data.hourly.wind_speed_10m.slice(0, nextHours);
    const times = data.hourly.time.slice(0, nextHours);
    
    // Verificar que los arrays tienen elementos
    if (!temperatures.length || !windSpeeds.length || !times.length) {
      console.log("AlertUI - Arrays de datos vacíos");
      return [];
    }
    
    // Combinar todas las alertas
    return [
      ...checkHighTemperatureAlerts(temperatures, times),
      ...checkLowTemperatureAlerts(temperatures, times),
      ...checkWindAlerts(windSpeeds, times),
      ...checkTemperatureChanges(temperatures, times)
    ];
  } catch (err) {
    console.error("Error al procesar datos meteorológicos:", err);
    return [];
  }
};

export default function AlertUI({ lat, lon }: AlertUIProps) {
  const { data, loading, error } = DataFetcher(lat, lon);
  const [alerts, setAlerts] = useState<AlertConfig[]>([]);
  
  // Generar alertas cuando cambian los datos
  useEffect(() => {
    if (!loading && !error && data) {
      const newAlerts = generateAlerts(data);
      setAlerts(newAlerts);
    }
  }, [data, loading, error]);
  
  // Mostrar indicador de carga
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={20} thickness={4} />
      </Box>
    );
  }
  
  // Mostrar mensaje de error si hay un problema con los datos
  if (error) {
    return (
      <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
        Error al cargar alertas: {error}
      </Alert>
    );
  }
  
  // Cambiamos esta parte - En lugar de no mostrar nada cuando no hay alertas,
  // mostramos un mensaje informativo
  if (alerts.length === 0) {
    return (
      <Alert 
        severity="success" 
        variant="outlined" 
        sx={{ 
          borderRadius: 2,
          '& .MuiAlert-icon': {
            fontSize: '1.5rem'
          }
        }}
      >
        <AlertTitle sx={{ fontWeight: 600 }}>Sin alertas meteorológicas</AlertTitle>
        Las condiciones meteorológicas actuales son estables y no presentan ninguna situación que requiera especial atención:
        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
          <li>Temperaturas dentro de rangos confortables (entre 10°C y 28°C)</li>
          <li>Velocidad del viento por debajo de niveles de precaución (menos de 20 km/h)</li>
          <li>No se prevén cambios bruscos de temperatura</li>
        </ul>
      </Alert>
    );
  }
  
  return (
    <Stack spacing={2}>
      {alerts.map((alert, index) => (
        <Alert 
          key={index}
          variant="outlined" 
          severity={alert.severity}
          sx={{
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
        >
          <AlertTitle sx={{ fontWeight: 600 }}>{alert.title}</AlertTitle>
          {alert.description}
        </Alert>
      ))}
    </Stack>
  );
}