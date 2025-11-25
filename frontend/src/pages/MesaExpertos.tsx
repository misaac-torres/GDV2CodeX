import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import SectionCard from '../components/ui/SectionCard';
import TrafficLight from '../components/ui/TrafficLight';
import { useExpertBoard } from '../hooks/useExpertBoard';

const trenes = ['Digital', 'Core', 'Comercial', 'Seguridad'];
const qs = ['Q1', 'Q2', 'Q3', 'Q4'];

const MesaExpertos = () => {
  const { projects, loading, fetchBoard, saveDecision } = useExpertBoard();
  const [tren, setTren] = useState('');
  const [q, setQ] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [decision, setDecision] = useState<'SI' | 'NO' | ''>('');
  const selected = useMemo(() => projects.find((p) => p.id === selectedId), [projects, selectedId]);

  useEffect(() => {
    fetchBoard();
  }, []);

  useEffect(() => {
    setDecision(selected?.prioritized ?? '');
  }, [selected]);

  const handleSave = async () => {
    if (!selected) return;
    await saveDecision(selected.id, decision);
    const next = projects[projects.findIndex((p) => p.id === selected.id) + 1];
    setSelectedId(next ? next.id : selected.id);
  };

  const resumen = useMemo(() => {
    const conDecision = projects.filter((p) => p.prioritized === 'SI' || p.prioritized === 'NO').length;
    return {
      total: projects.length,
      conDecision,
      pendientes: projects.length - conDecision
    };
  }, [projects]);

  return (
    <SectionCard title="Mesa de Expertos" subheader="Priorización rápida de proyectos">
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={12} sm={4}>
          <TextField select label="Tren" value={tren} onChange={(e) => setTren(e.target.value)} fullWidth>
            <MenuItem value="">Todos</MenuItem>
            {trenes.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField select label="Q" value={q} onChange={(e) => setQ(e.target.value)} fullWidth>
            <MenuItem value="">Todos</MenuItem>
            {qs.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => fetchBoard(tren, q)} disabled={loading}>
            Cargar tablero
          </Button>
        </Grid>
        {loading && (
          <Grid item>
            <CircularProgress size={24} />
          </Grid>
        )}
      </Grid>

      <Box mt={2} display="flex" gap={2}>
        <Chip label={`Proyectos: ${resumen.total}`} />
        <Chip label={`Con decisión: ${resumen.conDecision}`} color="success" variant="outlined" />
        <Chip label={`Pendientes: ${resumen.pendientes}`} color="warning" variant="outlined" />
      </Box>

      <Grid container spacing={2} mt={2} alignItems="center">
        <Grid item xs={12} sm={7}>
          <TextField
            select
            fullWidth
            label="Proyecto"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {projects.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                [{p.q_rad}] #{p.id} · {p.name} · PRI={p.prioritized || '-'}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {selected && (
          <Grid item xs={12} sm={5}>
            <TrafficLight total_dep={selected.total_dep} total_L={selected.total_L} total_P={selected.total_P} />
          </Grid>
        )}
      </Grid>

      {selected && (
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            [{selected.q_rad}] #{selected.id} · {selected.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Priorizado actual: {selected.prioritized || '-'} · Contribución: {selected.contribution}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Iniciativa estratégica: {selected.initiative}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight={600}>Pendientes</Typography>
              {selected.pendingDeps.map((dep) => (
                <Typography key={dep.description} variant="body2">
                  • {dep.team} – {dep.description}
                </Typography>
              ))}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight={600}>Negociadas</Typography>
              {selected.negotiatedDeps.map((dep) => (
                <Typography key={dep.description} variant="body2">
                  • {dep.team} – {dep.description}
                </Typography>
              ))}
            </Grid>
          </Grid>

          <Box mt={2}>
            <ToggleButtonGroup value={decision} exclusive onChange={(_, val) => setDecision(val)}>
              <ToggleButton value="">Sin asignar</ToggleButton>
              <ToggleButton value="SI">Priorizado</ToggleButton>
              <ToggleButton value="NO">No priorizado</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleSave} data-testid="guardar-expertos">
              Guardar y siguiente
            </Button>
          </Box>
        </Box>
      )}
    </SectionCard>
  );
};

export default MesaExpertos;
