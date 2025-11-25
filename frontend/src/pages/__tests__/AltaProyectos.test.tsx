import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { MemoryRouter } from 'react-router-dom';
import AltaProyectos from '../AltaProyectos';
import theme from '../../theme';

const renderWithProviders = () =>
  render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={1}>
        <MemoryRouter>
          <AltaProyectos />
        </MemoryRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );

describe('AltaProyectos', () => {
  it('crea un proyecto con dependencias', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    await user.type(screen.getByLabelText('Nombre'), 'Proyecto Test');
    await user.type(screen.getByLabelText('Responsable'), 'QA');
    await user.type(screen.getByLabelText('Área solicitante'), 'Digital');
    await user.type(screen.getByLabelText('Iniciativa estratégica'), 'Eficiencia');
    await user.type(screen.getByLabelText('Descripción'), 'Descripción de prueba');
    await user.type(screen.getByLabelText('Fecha inicio'), '2024-09-01');
    await user.type(screen.getByLabelText('Fecha cierre'), '2024-12-01');

    const depDesc = screen.getAllByLabelText('Descripción')[1];
    await user.type(depDesc, 'Dependencia de canales');

    await user.click(screen.getByTestId('guardar-proyecto'));

    await waitFor(() => expect(screen.getByText(/Proyecto creado correctamente/i)).toBeInTheDocument());
  });
});
