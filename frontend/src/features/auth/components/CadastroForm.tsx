import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { authService } from '../services/authService'
import { FormInput } from './FormInput'
import styles from './AuthLayout.module.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface FormErrors {
  nome?: string
  email?: string
  senha?: string
  confirmarSenha?: string
  general?: string
}

interface CadastroFormProps {
  onSuccess?: () => void
}

function validatePassword(pwd: string): string | null {
  if (!pwd) {
    return 'A senha é obrigatória.'
  }
  if (pwd.length < 8) {
    return 'A senha deve ter pelo menos 8 caracteres.'
  }
  if (!/[a-z]/.test(pwd)) {
    return 'A senha deve conter pelo menos uma letra minúscula.'
  }
  if (!/[A-Z]/.test(pwd)) {
    return 'A senha deve conter pelo menos uma letra maiúscula.'
  }
  if (!/[0-9]/.test(pwd)) {
    return 'A senha deve conter pelo menos um número.'
  }
  if (!/[^A-Za-z0-9]/.test(pwd)) {
    return 'A senha deve conter pelo menos um caractere especial (ex: !@#$%).'
  }
  return null
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function DotIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </svg>
  )
}

export function CadastroForm({ onSuccess }: CadastroFormProps) {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const hasMinLength = senha.length >= 8
  const hasLower = /[a-z]/.test(senha)
  const hasUpper = /[A-Z]/.test(senha)
  const hasNumber = /[0-9]/.test(senha)
  const hasSpecial = /[^A-Za-z0-9]/.test(senha)
  const hasCase = hasLower && hasUpper

  function validate(): boolean {
    const newErrors: FormErrors = {}

    if (!nome.trim()) {
      newErrors.nome = 'O nome é obrigatório.'
    } else if (nome.trim().length < 2) {
      newErrors.nome = 'O nome deve ter pelo menos 2 caracteres.'
    }

    if (!email.trim()) {
      newErrors.email = 'O e-mail é obrigatório.'
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Informe um endereço de e-mail válido.'
    }

    const senhaError = validatePassword(senha)
    if (senhaError) {
      newErrors.senha = senhaError
    }

    if (!confirmarSenha) {
      newErrors.confirmarSenha = 'A confirmação de senha é obrigatória.'
    } else if (senha !== confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas informadas não coincidem.'
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
    setSuccessMessage(null)

    try {
      await authService.cadastrar({
        nome: nome.trim(),
        email: email.trim(),
        senha,
      })

      setSuccessMessage('Conta criada com sucesso! Redirecionando para o login...')

      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        } else {
          navigate('/login')
        }
      }, 1500)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Falha ao realizar cadastro. Tente novamente.'
      setErrors({ general: message })
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      {successMessage && (
        <div role="status" className={styles.alertSuccess}>
          {successMessage}
        </div>
      )}

      {errors.general && (
        <div role="alert" className={styles.alertError}>
          {errors.general}
        </div>
      )}

      <FormInput
        id="nome"
        label="Nome completo"
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        error={errors.nome}
        placeholder="Ex: João da Silva"
        autoComplete="name"
        disabled={isLoading || Boolean(successMessage)}
        required
      />

      <FormInput
        id="email"
        label="E-mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        placeholder="seu.email@exemplo.com"
        autoComplete="email"
        disabled={isLoading || Boolean(successMessage)}
        required
      />

      <div className={styles.field}>
        <FormInput
          id="senha"
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          error={errors.senha}
          placeholder="Digite sua senha"
          autoComplete="new-password"
          disabled={isLoading || Boolean(successMessage)}
          required
        />

        <div className={styles.passwordHints} aria-live="polite">
          <span className={styles.passwordHintsTitle}>
            A senha deve conter:
          </span>
          <ul className={styles.passwordHintsList}>
            <li
              className={`${styles.hintItem} ${hasMinLength ? styles.hintMet : styles.hintPending}`}
            >
              {hasMinLength ? <CheckIcon /> : <DotIcon />}
              Pelo menos 8 caracteres
            </li>
            <li
              className={`${styles.hintItem} ${hasCase ? styles.hintMet : styles.hintPending}`}
            >
              {hasCase ? <CheckIcon /> : <DotIcon />}
              Letras maiúsculas e minúsculas
            </li>
            <li
              className={`${styles.hintItem} ${hasNumber ? styles.hintMet : styles.hintPending}`}
            >
              {hasNumber ? <CheckIcon /> : <DotIcon />}
              Pelo menos um número
            </li>
            <li
              className={`${styles.hintItem} ${hasSpecial ? styles.hintMet : styles.hintPending}`}
            >
              {hasSpecial ? <CheckIcon /> : <DotIcon />}
              Pelo menos um caractere especial (ex: !@#$%)
            </li>
          </ul>
        </div>
      </div>

      <FormInput
        id="confirmarSenha"
        label="Confirmar senha"
        type="password"
        value={confirmarSenha}
        onChange={(e) => setConfirmarSenha(e.target.value)}
        error={errors.confirmarSenha}
        placeholder="Repita a senha digitada"
        autoComplete="new-password"
        disabled={isLoading || Boolean(successMessage)}
        required
      />

      <button
        type="submit"
        disabled={isLoading || Boolean(successMessage)}
        className={styles.button}
      >
        {isLoading ? 'Criando conta...' : 'Criar conta'}
      </button>
    </form>
  )
}
