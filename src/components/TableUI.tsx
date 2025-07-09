import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import DataFetcher from '../functions/DataFetcher';

function combineArrays(arrLabels: Array<string>, arrValues1: Array<number>, arrValues2: Array<number>) {
   return arrLabels.map((label, index) => ({
      id: index,
      label: label,
      value1: arrValues1[index],
      value2: arrValues2[index]
   }));
}

const columns: GridColDef[] = [
   { field: 'id', headerName: 'ID', width: 90 },
   { field: 'label', headerName: 'Hora', width: 150 },
   { field: 'value1', headerName: 'Temperatura (°C)', width: 90 },
   { field: 'value2', headerName: 'Velocidad Viento (km/h)', width: 90 },
   {
      field: 'resumen',
      headerName: 'Resumen',
      description: 'No es posible ordenar u ocultar esta columna.',
      sortable: false,
      hideable: false,
      width: 220,
      valueGetter: (_, row) => `${row.label || ''} ${row.value1 || ''} ${row.value2 || ''}`,
   },
];

export default function TableUI() {
   const { data, loading, error } = DataFetcher();

   if (loading) return <Box sx={{ p: 2 } }>Cargando datos...</Box>;
   if (error) return <Box sx={{ p: 2, color: 'red' }}>Error: {error}</Box>;
   if (!data) return <Box sx={{ p: 2 }}>Sin datos.</Box>;

   // Tomamos las primeras 7 horas para mostrar
   const arrLabels = data.hourly.time.slice(0, 50);
   const arrValues1 = data.hourly.temperature_2m.slice(0, 50);
   const arrValues2 = data.hourly.wind_speed_10m.slice(0, 50);

   const rows = combineArrays(arrLabels, arrValues1, arrValues2);

   return (
      <Box sx={{ height: 350, width: '100%' }}>
         <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
               pagination: {
                  paginationModel: {
                     pageSize: 5,
                  },
               },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
         />
      </Box>
   );
}