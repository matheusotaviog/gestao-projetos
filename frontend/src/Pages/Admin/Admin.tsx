import { useEffect, useState } from 'react'
import { useAuth } from '../../Context/AuthContext'
import { alterarPapel, listarUsuarios, removerUsuario, type Papel, type UsuarioAdmin } from '../../services/usuarios'
import { SkeletonLinhas } from '../../components/Skeleton/Skeleton'

const PAPEIS: { valor: Papel; rotulo: string }[] = [
  { valor: 'GESTOR', rotulo: 'Gestor' },
  { valor: 'RECRUTADOR', rotulo: 'Recrutador' },
  { valor: 'ADMIN', rotulo: 'Admin' },
]

export function Admin() {
  const { token } = useAuth()
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([])
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!token) return
    listarUsuarios(token)
      .then(setUsuarios)
      .catch(() => setErro('Não foi possível carregar os usuários.'))
      .finally(() => setCarregando(false))
  }, [token])

  async function mudarPapel(usuario: UsuarioAdmin, papel: Papel) {
    if (!token) return
    setErro(null)
    try {
      const atualizado = await alterarPapel(token, usuario.id, papel)
      setUsuarios((atuais) => atuais.map((u) => (u.id === usuario.id ? atualizado : u)))
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível alterar o papel.')
    }
  }

  async function remover(usuario: UsuarioAdmin) {
    if (!token) return
    if (!window.confirm(`Remover a conta de ${usuario.nome}? Os projetos dela também serão apagados.`)) return
    setErro(null)
    try {
      await removerUsuario(token, usuario.id)
      setUsuarios((atuais) => atuais.filter((u) => u.id !== usuario.id))
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível remover a conta.')
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-4xl font-semibold tracking-tight">Usuários</h1>
      <p className="mt-2 text-base text-[#6e6e73]">Gerencie os papéis e as contas da plataforma.</p>

      {erro && <p role="alert" className="mt-6 text-sm text-[#d70015]">{erro}</p>}
      {carregando && <SkeletonLinhas />}

      {!carregando && (
        <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#e8e8ed] text-xs uppercase tracking-wide text-[#86868b]">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Profissão</th>
                <th className="px-4 py-3 font-medium">Papel</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-b border-[#f5f5f7] last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1d1d1f]">{usuario.nome}</p>
                    {usuario.username && <p className="text-xs text-[#86868b]">@{usuario.username}</p>}
                  </td>
                  <td className="px-4 py-3 text-[#6e6e73]">{usuario.email}</td>
                  <td className="px-4 py-3 text-[#6e6e73]">{usuario.profissao ?? '—'}</td>
                  <td className="px-4 py-3">
                    <select
                      value={usuario.papel}
                      onChange={(e) => mudarPapel(usuario, e.target.value as Papel)}
                      aria-label={`Papel de ${usuario.nome}`}
                      className="h-9 rounded-lg border border-[#d2d2d7] bg-white px-2 text-sm"
                    >
                      {PAPEIS.map((p) => (
                        <option key={p.valor} value={p.valor}>{p.rotulo}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => remover(usuario)}
                      className="text-sm font-medium text-[#d70015] hover:underline"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
