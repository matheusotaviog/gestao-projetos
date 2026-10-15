import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute'
import Dashboard from './Pages/Dashboard/Dashboard'
import { Projetos } from './Pages/Projetos/Projetos'
import { Tarefas } from './Pages/Tarefas/Tarefas'
import { Cronograma } from './Pages/Cronograma/Cronograma'
import { Cadastro } from './Pages/Cadastro/Cadastro'
import { Login } from './Pages/Login/Login'
import { ProjetoDetalhes } from './Pages/ProjetoDetalhes/ProjetoDetalhes'
import { Perfil } from './Pages/Perfil/Perfil'

export function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/perfil/:username" element={<Perfil />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/projetos" element={<Projetos />} />
            <Route path="/projetos/:projetoId" element={<ProjetoDetalhes />} />
            <Route path="/tarefas" element={<Tarefas />} />
            <Route path="/cronograma" element={<Cronograma />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
