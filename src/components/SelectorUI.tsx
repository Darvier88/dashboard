import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Typography } from '@mui/material';

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
    <>
      <FormControl fullWidth>
        <InputLabel id="city-select-label">Ciudad</InputLabel>
        <Select
          labelId="city-select-label"
          id="city-simple-select"
          value={selectedCity.value}
          label="Ciudad"
          onChange={handleChange}
        >
          <MenuItem disabled value=""><em>Seleccione una ciudad</em></MenuItem>
          {cities.map(city => (
            <MenuItem key={city.value} value={city.value}>{city.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {selectedCity && (
        <Typography sx={{ marginTop: 2 }}>
          Información del clima en <strong>{capitalizeFirstLetter(selectedCity.label)}</strong>
        </Typography>
      )}
    </>
  )
}
\