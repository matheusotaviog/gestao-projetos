import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute'
import Dashboard from './Pages/Dashboard/Dashboard'
import { Projetos } from './Pages/Projetos/Projetos'
import { Tarefas } from './Pages/Tarefas/Tarefas'
import { Cadastro } from './Pages/Cadastro/Cadastro'
import { Login } from './Pages/Login/Login'
import { ProjetoDetalhes } from './Pages/ProjetoDetalhes/ProjetoDetalhes'
import { Perfil } from './Pages/Perfil/Perfil'
import { Candidatos } from './Pages/Candidatos/Candidatos'
import { Admin } from './Pages/Admin/Admin'

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
          <Route element={<ProtectedRoute papeis={['GESTOR', 'ADMIN']} />}>
            <Route path="/projetos" element={<Projetos />} />
            <Route path="/projetos/:projetoId" element={<ProjetoDetalhes />} />
            <Route path="/tarefas" element={<Tarefas />} />
          </Route>
          <Route element={<ProtectedRoute papeis={['RECRUTADOR', 'ADMIN']} />}>
            <Route path="/candidatos" element={<Candidatos />} />
          </Route>
          <Route element={<ProtectedRoute papeis={['ADMIN']} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
