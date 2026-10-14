import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Dashboard from './Pages/Dashboard/Dashboard'
import { Projetos } from './Pages/Projetos/Projetos'
import { Tarefas } from './Pages/Tarefas/Tarefas'
import { Cronograma } from './Pages/Cronograma/Cronograma'
import { Cadastro } from './Pages/Cadastro/Cadastro'

export function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projetos" element={<Projetos />} />
        <Route path="/tarefas" element={<Tarefas />} />
        <Route path="/cronograma" element={<Cronograma />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/*" element={<Dashboard />} />
      </Routes>
    </>
  )
}