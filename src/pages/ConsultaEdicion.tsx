import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import SectionCard from '../components/ui/SectionCard';
import { Dependency, Project } from '../types';
import { useProjects } from '../hooks/useProjects';
import { useSnackbar } from 'notistack';

const ConsultaEdicion = () => {
  const { projects, loading, update, getById, fetchProjects } = useProjects();
  const { enqueueSnackbar } = useSnackbar();
  const [modeProyecto, setModeProyecto] = useState(true);
  const [selectedId, setSelectedId] = useState('');
  const [current, setCurrent] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (selectedId) {
      getById(selectedId).then(setCurrent);
    }
  }, [selectedId, getById]);

  const summary = useMemo(() => {
    if (!current) return null;
    const total = current.dependencies.length;
    const totalL = current.dependencies.filter((d) => d.status === 'L').length;
    const totalP = total - totalL;
    const coverage = total === 0 ? 0 : Math.round((totalP / total) * 100);
    return { total, totalL, totalP, coverage };
  }, [current]);

  const updateDependency = (index: number, field: keyof Dependency, value: string) => {
    if (!current) return;
    setCurrent({ ...current, dependencies: current.dependencies.map((dep, i) => (i === index ? { ...dep, [field]: value } : dep)) });
  };

  const saveChanges = async () => {
    if (!current) return;
    setSaving(true);
    try {
      await update(current.id, { progress: current.progress, estimate: current.estimate, dependencies: current.dependencies });
      enqueueSnackbar('Proyecto actualizado', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar((err as Error).message, { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard
      title="Consulta / Edición"
      subheader="Visualiza por proyecto o por equipo y actualiza dependencias"
      action={
        <FormControlLabel
          control={<Switch checked={modeProyecto} onChange={() => setModeProyecto((prev) => !prev)} />}
          label={modeProyecto ? 'Modo Proyecto' : 'Modo Equipo'}
        />
      }
    >
      {modeProyecto ? (
        <>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Proyecto"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                {projects.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    [{p.q_rad}] #{p.id} · {p.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {loading && (
              <Grid item>
                <CircularProgress size={24} />
              </Grid>
            )}
          </Grid>

          {current && (
            <Box mt={2}>
              <Typography variant="subtitle1" fontWeight={600}>
                {current.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Q {current.q_rad} · {current.area} · Priorizado: {current.prioritized || '-'}
              </Typography>
              <Divider sx={{ my: 2 }} />
              {summary && (
                <Box display="flex" gap={2} mb={2}>
                  <Chip label={`Total deps: ${summary.total}`} />
                  <Chip label={`L: ${summary.totalL}`} color="success" variant="outlined" />
                  <Chip label={`P: ${summary.totalP}`} color="warning" variant="outlined" />
                  <Chip label={`% sin negociar: ${summary.coverage}%`} color="info" />
                </Box>
              )}
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <TextField
                    type="number"
                    label="Avance"
                    value={current.progress ?? 0}
                    inputProps={{ min: 0, max: 1, step: 0.05 }}
                    onChange={(e) => setCurrent({ ...current, progress: Number(e.target.value) })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    type="number"
                    label="Estimado"
                    value={current.estimate ?? 0}
                    inputProps={{ min: 0, max: 1, step: 0.05 }}
                    onChange={(e) => setCurrent({ ...current, estimate: Number(e.target.value) })}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" mt={3} gutterBottom>
                Dependencias
              </Typography>
              {current.dependencies.map((dep, index) => (
                <Grid container spacing={2} key={index} alignItems="center" mb={1}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Equipo"
                      value={dep.team}
                      onChange={(e) => updateDependency(index, 'team', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <TextField
                      select
                      label="Flag"
                      fullWidth
                      value={dep.status}
                      onChange={(e) => updateDependency(index, 'status', e.target.value)}
                    >
                      <MenuItem value="P">P</MenuItem>
                      <MenuItem value="L">L</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Descripción"
                      value={dep.description}
                      onChange={(e) => updateDependency(index, 'description', e.target.value)}
                    />
                  </Grid>
                </Grid>
              ))}

              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button variant="contained" onClick={saveChanges} disabled={saving} data-testid="guardar-edicion">
                  Guardar cambios
                </Button>
              </Box>
            </Box>
          )}
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Selecciona un proyecto para mostrar dependencias por equipo. El modo equipo será extendido en siguientes iteraciones.
        </Typography>
      )}
    </SectionCard>
  );
};

export default ConsultaEdicion;
