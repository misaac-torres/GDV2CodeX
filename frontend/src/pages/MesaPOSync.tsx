import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import SectionCard from '../components/ui/SectionCard';
import StarRating from '../components/ui/StarRating';
import { usePOSyncBoard } from '../hooks/usePOSyncBoard';

const trenes = ['Digital', 'Core', 'Comercial', 'Seguridad'];
const qs = ['Q1', 'Q2', 'Q3', 'Q4'];

const MesaPOSync = () => {
  const { projects, loading, fetchBoard, saveRating } = usePOSyncBoard();
  const [tren, setTren] = useState('');
  const [q, setQ] = useState('');
  const [onlyPri, setOnlyPri] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const selected = useMemo(() => projects.find((p) => p.id === selectedId), [projects, selectedId]);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    fetchBoard();
  }, []);

  useEffect(() => {
    setRating(selected?.rating_po ?? 0);
  }, [selected]);

  const resumen = useMemo(() => {
    const conRating = projects.filter((p) => p.rating_po > 0).length;
    return { total: projects.length, conRating, pendientes: projects.length - conRating };
  }, [projects]);

  const handleSave = async () => {
    if (!selected) return;
    await saveRating(selected.id, rating);
    const next = projects[projects.findIndex((p) => p.id === selected.id) + 1];
    setSelectedId(next ? next.id : selected.id);
  };

  return (
    <SectionCard title="Mesa de Alistamiento (PO Sync)" subheader="Asignación de rating del Product Owner">
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
        <Grid item xs={12} sm={3}>
          <TextField
            select
            label="Solo priorizados"
            value={onlyPri ? 'SI' : 'NO'}
            onChange={(e) => setOnlyPri(e.target.value === 'SI')}
            fullWidth
          >
            <MenuItem value="NO">No</MenuItem>
            <MenuItem value="SI">Sí</MenuItem>
          </TextField>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => fetchBoard(tren, q, onlyPri)} disabled={loading}>
            Cargar tablero PO
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
        <Chip label={`Con rating: ${resumen.conRating}`} color="success" variant="outlined" />
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
                [{p.q_rad}] #{p.id} · {p.name} · Rating = {p.rating_po || '-'}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {selected && (
          <Grid item xs={12} sm={5}>
            <Typography variant="body2">Priorizado: {selected.prioritized}</Typography>
            <Typography variant="body2">Deps L/P: {selected.total_L} / {selected.total_P}</Typography>
          </Grid>
        )}
      </Grid>

      {selected && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            [{selected.q_rad}] #{selected.id} · {selected.name}
          </Typography>
          <StarRating value={rating} onChange={setRating} />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleSave} data-testid="guardar-po">
              Guardar rating y siguiente
            </Button>
          </Box>
        </Box>
      )}
    </SectionCard>
  );
};

export default MesaPOSync;
