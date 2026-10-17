import { Link } from 'react-router'
import { AuthCard } from '../components/AuthCard'
import { CadastroForm } from '../components/CadastroForm'
import styles from '../components/AuthLayout.module.css'

export function CadastroPage() {
  return (
    <AuthCard
      title="Criar conta"
      subtitle="Comece a organizar seus estudos, projetos e prazos."
      footer={
        <span>
          Já possui uma conta?{' '}
          <Link to="/login" className={styles.footerLink}>
            Entrar
          </Link>
        </span>
      }
    >
      <CadastroForm />
    </AuthCard>
  )
}
