import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, Chip, LinearProgress } from '@mui/material';
import type { ReactNode } from 'react';

interface IndicatorUIProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
}

export default function IndicatorUI(props: IndicatorUIProps) {
  const { title, description, icon } = props;
  
  // Determinar el progreso basado en el valor numérico
  const getProgressValue = () => {
    if (!description) return 0;
    const numValue = parseFloat(description.replace(/[^\d.-]/g, ''));
    if (isNaN(numValue)) return 0;
    
    // Escalar el valor según el tipo de indicador
    if (title?.includes('Temperatura')) {
      // Escala ajustada para temperatura (-10°C a 45°C)
      return Math.min(Math.max(((numValue + 10) / 55) * 100, 0), 100);
    } else if (title?.includes('Humedad')) {
      return numValue; // Ya está en porcentaje
    } else if (title?.includes('Velocidad')) {
      return Math.min((numValue / 30) * 100, 100); // 30 km/h como referencia
    }
    return 50; // Valor por defecto
  };
  
  // Color basado en el tipo de indicador
  const getColor = () => {
    if (!description) return 'primary';
    
    if (title?.includes('Temperatura')) {
      const temp = parseFloat(description.replace(/[^\d.-]/g, ''));
      if (isNaN(temp)) return 'primary';
      
      // Colores basados en rangos de temperatura
      if (temp >= 30) return 'error'; // Calor extremo
      if (temp >= 25) return 'warning'; // Calor
      if (temp <= 5) return 'info'; // Frío
      return 'success'; // Temperatura agradable
    }
    
    if (title?.includes('Humedad')) return 'info';
    if (title?.includes('Velocidad')) return 'success';
    
    return 'primary'; // Color por defecto
  };
  
  return (
    <Card sx={{ 
      borderRadius: 3, 
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      height: '100%'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          {icon && <Box sx={{ mr: 1 }}>{icon}</Box>}
          <Typography 
            variant="subtitle2" 
            component="div" 
            color="text.secondary"
            fontWeight={600}
          >
            {title}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Chip label="Actualizado" size="small" color="success" variant="outlined" />
        </Box>
        
        <Typography 
          variant="h3" 
          component="div" 
          sx={{ 
            fontWeight: 700, 
            mb: 1.5,
            fontSize: '2rem',
            color: 'text.primary' 
          }}
        >
          {description}
        </Typography>
        
        <LinearProgress 
          variant="determinate" 
          value={getProgressValue()} 
          color={getColor() as any}
          sx={{ 
            height: 8, 
            borderRadius: 4,
            backgroundColor: 'rgba(0,0,0,0.05)'
          }} 
        />
      </CardContent>
    </Card>
  );
}