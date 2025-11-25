import { Tabs, Tab, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const routes = [
  { label: 'Alta de proyectos', path: '/' },
  { label: 'Consulta / Edición', path: '/consulta' },
  { label: 'Métricas', path: '/metricas' },
  { label: 'Mesa de Expertos', path: '/mesa-expertos' },
  { label: 'Mesa de Alistamiento', path: '/mesa-po-sync' },
  { label: 'Feedback', path: '/feedback' }
];

const NavigationTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const current = routes.findIndex((route) => route.path === location.pathname);

  return (
    <Paper elevation={0} sx={{ px: 2, position: 'sticky', top: 72, zIndex: 1 }}>
      <Tabs
        value={current === -1 ? 0 : current}
        variant="scrollable"
        scrollButtons="auto"
        onChange={(_, value) => navigate(routes[value].path)}
        textColor="primary"
        indicatorColor="primary"
      >
        {routes.map((route) => (
          <Tab key={route.path} label={route.label} />
        ))}
      </Tabs>
    </Paper>
  );
};

export default NavigationTabs;
