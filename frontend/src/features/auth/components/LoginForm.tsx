import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { authService } from '../services/authService'
import { FormInput } from './FormInput'
import styles from './AuthLayout.module.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface FormErrors {
  email?: string
  senha?: string
  general?: string
}

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  function validate(): boolean {
    const newErrors: FormErrors = {}

    if (!email.trim()) {
      newErrors.email = 'O e-mail é obrigatório.'
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Informe um endereço de e-mail válido.'
    }

    if (!senha) {
      newErrors.senha = 'A senha é obrigatória.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!validate()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      await authService.login({ email: email.trim(), senha })
      if (onSuccess) {
        onSuccess()
      } else {
        navigate('/')
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Falha ao autenticar. Tente novamente.'
      setErrors({ general: message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      {errors.general && (
        <div role="alert" className={styles.alertError}>
          {errors.general}
        </div>
      )}

      <FormInput
        id="email"
        label="E-mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        placeholder="seu.email@exemplo.com"
        autoComplete="email"
        disabled={isLoading}
        required
      />

      <FormInput
        id="senha"
        label="Senha"
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        error={errors.senha}
        placeholder="Digite sua senha"
        autoComplete="current-password"
        disabled={isLoading}
        required
      />

      <button type="submit" disabled={isLoading} className={styles.button}>
        {isLoading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
