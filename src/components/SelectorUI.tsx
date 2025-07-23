import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Box, Chip, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface City {
  value: string;
  label: string;
  lat: number;
  lon: number;
}

interface SelectorUIProps {
  cities: City[];
  selectedCity: City;
  setSelectedCity: (city: City) => void;
}

export default function SelectorUI({ cities, selectedCity, setSelectedCity }: SelectorUIProps) {
  const handleChange = (event: SelectChangeEvent<string>) => {
    const city = cities.find(c => c.value === event.target.value);
    if (city) setSelectedCity(city);
  };

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Box>
      <FormControl fullWidth sx={{ 
        '& .MuiOutlinedInput-root': { 
          borderRadius: 2,
          backgroundColor: '#fff'
        } 
      }}>
        <InputLabel id="city-select-label">Ubicación Actual</InputLabel>
        <Select
          labelId="city-select-label"
          id="city-simple-select"
          value={selectedCity.value}
          label="Ubicación Actual"
          onChange={handleChange}
        >
          <MenuItem disabled value=""><em>Seleccione una ciudad</em></MenuItem>
          {cities.map(city => (
            <MenuItem key={city.value} value={city.value}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon fontSize="small" color="error" sx={{ mr: 1 }} />
                {capitalizeFirstLetter(city.label)}, Ecuador
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {selectedCity && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Coordenadas de {capitalizeFirstLetter(selectedCity.label)}: {selectedCity.lat.toFixed(4)}, {selectedCity.lon.toFixed(4)}
          </Typography>
          <Chip 
            icon={<AccessTimeIcon fontSize="small" />}
            label="ECT(UTC-5)" 
            size="small" 
            color="info" 
            variant="outlined"
          />
        </Box>
      )}
    </Box>
  );
}
