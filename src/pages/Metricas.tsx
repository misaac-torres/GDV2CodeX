import { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import SectionCard from '../components/ui/SectionCard';
import { useMetrics } from '../hooks/useMetrics';

const trenes = ['Digital', 'Core', 'Comercial', 'Seguridad'];
const celulas = ['Analytics', 'Core BSS', 'Canales', 'Seguridad'];

const Metricas = () => {
  const { metrics, loading, error, fetchMetrics } = useMetrics();
  const [scope, setScope] = useState<'all' | 'area' | 'celula'>('all');
  const [filter, setFilter] = useState('');

  const onSubmit = () => fetchMetrics(scope, filter);

  return (
    <SectionCard title="Métricas" subheader="Indicadores agregados de cobertura y avance">
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="scope-label">Scope</InputLabel>
            <Select
              labelId="scope-label"
              label="Scope"
              value={scope}
              onChange={(e) => setScope(e.target.value as typeof scope)}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="area">Por Tren/Área</MenuItem>
              <MenuItem value="celula">Por Célula</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {scope === 'area' && (
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="tren-label">Tren / Área</InputLabel>
              <Select labelId="tren-label" label="Tren / Área" value={filter} onChange={(e) => setFilter(e.target.value)}>
                {trenes.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        {scope === 'celula' && (
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="celula-label">Célula</InputLabel>
              <Select labelId="celula-label" label="Célula" value={filter} onChange={(e) => setFilter(e.target.value)}>
                {celulas.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        <Grid item>
          <Button variant="contained" onClick={onSubmit} disabled={loading}>
            Calcular
          </Button>
        </Grid>
        {loading && (
          <Grid item>
            <CircularProgress size={24} />
          </Grid>
        )}
      </Grid>

      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}

      {metrics && (
        <Box mt={3}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Resumen {metrics.label ? `· ${metrics.label}` : ''}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography>Total proyectos: {metrics.totalProjects}</Typography>
              <Typography>Total dependencias: {metrics.totalDependencies}</Typography>
              <Typography>L: {metrics.totalL} · P: {metrics.totalP}</Typography>
              <Typography>Cobertura: {metrics.coverage}%</Typography>
              <Typography>Avance promedio: {metrics.avgProgress}</Typography>
              <Typography>Avance priorizados: {metrics.avgProgressPri}</Typography>
              <Typography>Avance no priorizados: {metrics.avgProgressNoPri}</Typography>
              <Typography>Proyectos priorizados: {metrics.prioritizedProjects}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} height={260}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: 'Dependencias', L: metrics.totalL, P: metrics.totalP }]}> 
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="L" fill="#22c55e" />
                  <Bar dataKey="P" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </Box>
      )}
    </SectionCard>
  );
};

export default Metricas;
