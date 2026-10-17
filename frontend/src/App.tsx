import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
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
import { EditarPerfil } from './Pages/EditarPerfil/EditarPerfil'

const DURACAO_SAIDA = 260

export function App() {
  const location = useLocation()
  const [exibida, setExibida] = useState(location)
  const [saindo, setSaindo] = useState(false)

  useEffect(() => {
    if (location.pathname === exibida.pathname) {
      setExibida(location)
      return
    }
    setSaindo(true)
    const timer = setTimeout(() => {
      setExibida(location)
      setSaindo(false)
      window.scrollTo({ top: 0 })
    }, DURACAO_SAIDA)
    return () => clearTimeout(timer)
  }, [location, exibida.pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div key={exibida.pathname} className={saindo ? 'page-out' : 'page-in'}>
        <Routes location={exibida}>
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
          <Route element={<ProtectedRoute />}>
            <Route path="/editar-perfil" element={<EditarPerfil />} />
          </Route>
          <Route element={<ProtectedRoute papeis={['ADMIN']} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </div>
      </main>
      <Footer />
    </div>
  )
}
