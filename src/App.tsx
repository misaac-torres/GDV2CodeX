import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import AltaProyectos from './pages/AltaProyectos';
import ConsultaEdicion from './pages/ConsultaEdicion';
import Metricas from './pages/Metricas';
import MesaExpertos from './pages/MesaExpertos';
import MesaPOSync from './pages/MesaPOSync';
import Feedback from './pages/Feedback';

const App = () => (
  <BrowserRouter>
    <AppLayout>
      <Routes>
        <Route path="/" element={<AltaProyectos />} />
        <Route path="/consulta" element={<ConsultaEdicion />} />
        <Route path="/metricas" element={<Metricas />} />
        <Route path="/mesa-expertos" element={<MesaExpertos />} />
        <Route path="/mesa-po-sync" element={<MesaPOSync />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </AppLayout>
  </BrowserRouter>
);

export default App;
