import { Box, Button, CircularProgress, FormControlLabel, Switch, TextField, Typography, Stack, Divider } from '@mui/material';
import { useState } from 'react';
import SectionCard from '../components/ui/SectionCard';
import { useFeedback } from '../hooks/useFeedback';
import { useSnackbar } from 'notistack';

const Feedback = () => {
  const { entries, loading, submit, fetchFeedback } = useFeedback();
  const { enqueueSnackbar } = useSnackbar();
  const [usuario, setUsuario] = useState('');
  const [texto, setTexto] = useState('');
  const [showList, setShowList] = useState(true);

  const handleSubmit = async () => {
    if (!usuario || !texto) {
      enqueueSnackbar('Completa nombre y sugerencia', { variant: 'warning' });
      return;
    }
    await submit(usuario, texto);
    setTexto('');
    enqueueSnackbar('¡Gracias por tu sugerencia!', { variant: 'success' });
  };

  return (
    <SectionCard title="Feedback" subheader="Cuéntanos cómo mejorar la herramienta">
      <Stack spacing={2}>
        <TextField label="Nombre" value={usuario} onChange={(e) => setUsuario(e.target.value)} fullWidth />
        <TextField
          label="Sugerencia"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          fullWidth
          multiline
          minRows={3}
        />
        <Box display="flex" gap={2}>
          <Button variant="contained" onClick={handleSubmit} data-testid="enviar-feedback">
            Enviar
          </Button>
          <Button variant="outlined" onClick={() => setTexto('')}>
            Limpiar
          </Button>
        </Box>
      </Stack>

      <Divider sx={{ my: 3 }} />
      <FormControlLabel
        control={<Switch checked={showList} onChange={() => setShowList((prev) => !prev)} />}
        label="Ver últimas sugerencias"
      />
      {loading && <CircularProgress size={24} />}
      {showList && (
        <Box mt={2}>
          {entries.map((entry) => (
            <Box key={entry.id} mb={1}>
              <Typography variant="subtitle2">{entry.usuario}</Typography>
              <Typography variant="body2" color="text.secondary">
                {entry.texto}
              </Typography>
            </Box>
          ))}
          {entries.length === 0 && !loading && (
            <Typography color="text.secondary">Aún no hay sugerencias.</Typography>
          )}
        </Box>
      )}
      <Button variant="text" onClick={fetchFeedback} sx={{ mt: 2 }}>
        Recargar sugerencias
      </Button>
    </SectionCard>
  );
};

export default Feedback;
