import Typography from '@mui/material/Typography';
import { Box, Button, Stack } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function HeaderUI() {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
            <Typography
                variant="h3"
                component="h1"
                sx={{
                    fontWeight: 'bold',
                    color: '#3f51b5',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                <WbSunnyIcon sx={{ mr: 1, fontSize: '2rem' }} />
                Centro de Información Climática
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Stack direction="row" spacing={1}>
                <Button 
                    variant="contained" 
                    startIcon={<DashboardIcon />}
                    color="primary"
                    size="small"
                >
                    Dashboard
                </Button>
                <Button 
                    variant="outlined" 
                    startIcon={<BarChartIcon />}
                    color="primary"
                    size="small"
                >
                    Analytics
                </Button>
            </Stack>
        </Box>
    );
}