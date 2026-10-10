import { Link } from 'react-router'
import { AuthCard } from '../components/AuthCard'
import { LoginForm } from '../components/LoginForm'
import styles from '../components/AuthLayout.module.css'

export function LoginPage() {
  return (
    <AuthCard
      title="Entrar"
      subtitle="Acesse sua conta para gerenciar seus estudos e tarefas."
      footer={
        <span>
          Não tem uma conta?{' '}
          <Link to="/cadastro" className={styles.footerLink}>
            Cadastre-se
          </Link>
        </span>
      }
    >
      <LoginForm />
    </AuthCard>
  )
}
