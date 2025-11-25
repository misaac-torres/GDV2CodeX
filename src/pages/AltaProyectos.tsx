import {
  Box,
  Button,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Divider,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import SectionCard from '../components/ui/SectionCard';
import { Dependency } from '../types';
import { useProjects } from '../hooks/useProjects';

const estados = ['Nuevo', 'En curso', 'En pausa', 'Cerrado'];
const celulas_dep = ['Analytics', 'Core BSS', 'Canales', 'Seguridad'];
const CELULA_TREN_MAP: Record<string, string> = {
  Analytics: 'Digital',
  'Core BSS': 'Core',
  Canales: 'Comercial',
  Seguridad: 'Seguridad'
};

const AltaProyectos = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { create } = useProjects();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    status: estados[0],
    q_rad: 'Q3',
    prioritized: 'SI' as 'SI' | 'NO' | '',
    owner: '',
    area: '',
    initiative: '',
    description: '',
    startDate: '',
    endDate: '',
    baseline: 0.4
  });
  const [dependencies, setDependencies] = useState<Dependency[]>([
    { team: celulas_dep[0], status: 'P', description: '' }
  ]);

  const onChange = (field: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addDependency = () => setDependencies((prev) => [...prev, { team: '', status: 'P', description: '' }]);

  const updateDependency = (index: number, field: keyof Dependency, value: string) =>
    setDependencies((prev) => prev.map((dep, i) => (i === index ? { ...dep, [field]: value } : dep)));

  const removeDependency = (index: number) => setDependencies((prev) => prev.filter((_, i) => i !== index));

  const validate = () => {
    if (!form.name || !form.startDate || !form.endDate) return 'Nombre y fechas son obligatorios';
    if (new Date(form.startDate) > new Date(form.endDate)) return 'La fecha de inicio no puede ser mayor a la de cierre';
    if (dependencies.length === 0) return 'Debe agregar al menos una dependencia';
    if (dependencies.some((d) => !d.team || !d.description)) return 'Complete los datos de cada dependencia';
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      enqueueSnackbar(error, { variant: 'warning' });
      return;
    }
    setSaving(true);
    try {
      await create({ ...form, dependencies });
      enqueueSnackbar('Proyecto creado correctamente', { variant: 'success' });
      setForm({ ...form, name: '', description: '', owner: '', area: '', initiative: '', startDate: '', endDate: '' });
    } catch (err) {
      enqueueSnackbar((err as Error).message, { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const trenDetectado = dependencies.map((d) => CELULA_TREN_MAP[d.team] ?? '').filter(Boolean).join(', ');

  return (
    <SectionCard title="Alta de proyectos" subheader="Carga inicial con dependencias">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField label="Nombre" fullWidth required value={form.name} onChange={(e) => onChange('name', e.target.value)} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField select label="Estado" fullWidth value={form.status} onChange={(e) => onChange('status', e.target.value)}>
            {estados.map((estado) => (
              <MenuItem key={estado} value={estado}>
                {estado}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField label="Q radicado" fullWidth value={form.q_rad} onChange={(e) => onChange('q_rad', e.target.value)} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            select
            label="Priorizado"
            fullWidth
            value={form.prioritized}
            onChange={(e) => onChange('prioritized', e.target.value)}
          >
            {['SI', 'NO', ''].map((v) => (
              <MenuItem key={v} value={v}>
                {v === '' ? 'Sin asignar' : v}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField label="Responsable" fullWidth value={form.owner} onChange={(e) => onChange('owner', e.target.value)} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField label="Área solicitante" fullWidth value={form.area} onChange={(e) => onChange('area', e.target.value)} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="Iniciativa estratégica"
            fullWidth
            value={form.initiative}
            onChange={(e) => onChange('initiative', e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Descripción"
            fullWidth
            multiline
            minRows={2}
            value={form.description}
            onChange={(e) => onChange('description', e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            type="date"
            label="Fecha inicio"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={form.startDate}
            onChange={(e) => onChange('startDate', e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            type="date"
            label="Fecha cierre"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={form.endDate}
            onChange={(e) => onChange('endDate', e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Línea base"
            type="number"
            inputProps={{ min: 0, max: 1, step: 0.05 }}
            fullWidth
            value={form.baseline}
            onChange={(e) => onChange('baseline', Number(e.target.value))}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="h6">Dependencias</Typography>
        <Button startIcon={<AddIcon />} onClick={addDependency} variant="outlined">
          Agregar dependencia
        </Button>
      </Stack>
      <Stack spacing={2}>
        {dependencies.map((dep, index) => (
          <Grid container spacing={2} key={index} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                select
                label="Célula/Equipo"
                fullWidth
                value={dep.team}
                onChange={(e) => updateDependency(index, 'team', e.target.value)}
              >
                {celulas_dep.map((celula) => (
                  <MenuItem key={celula} value={celula}>
                    {celula}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                select
                label="Estado"
                fullWidth
                value={dep.status}
                onChange={(e) => updateDependency(index, 'status', e.target.value)}
              >
                <MenuItem value="P">P (Pendiente)</MenuItem>
                <MenuItem value="L">L (Negociada)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="Descripción"
                fullWidth
                value={dep.description}
                onChange={(e) => updateDependency(index, 'description', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <IconButton aria-label="Eliminar" onClick={() => removeDependency(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Stack>

      <Box mt={2}>
        <Typography variant="body2" color="text.secondary">
          Tren detectado: {trenDetectado || 'Pendiente de selección'}
        </Typography>
      </Box>

      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={saving} data-testid="guardar-proyecto">
          Guardar
        </Button>
      </Box>
    </SectionCard>
  );
};

export default AltaProyectos;
