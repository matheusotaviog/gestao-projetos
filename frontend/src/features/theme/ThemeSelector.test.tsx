import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { ThemeSelector } from '../../components/ui/ThemeSelector'

describe('ThemeSelector', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('renderiza o seletor com todas as opções de tema', () => {
    render(<ThemeSelector />)

    const select = screen.getByRole('combobox', {
      name: 'Selecionar tema visual',
    })
    expect(select).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: 'Padrão (Azul)' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: 'Dark Teal (Oceano)' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: 'Rich Mahogany (Mogno)' }),
    ).toBeInTheDocument()
  })

  it('atualiza o tema no documento e no localStorage ao selecionar uma opção', async () => {
    const user = userEvent.setup()
    render(<ThemeSelector />)

    const select = screen.getByRole('combobox', {
      name: 'Selecionar tema visual',
    })

    await user.selectOptions(select, 'dark-teal')

    expect(document.documentElement.getAttribute('data-theme')).toBe(
      'dark-teal',
    )
    expect(localStorage.getItem('gestao_projetos_theme')).toBe('dark-teal')

    await user.selectOptions(select, 'rich-mahogany')

    expect(document.documentElement.getAttribute('data-theme')).toBe(
      'rich-mahogany',
    )
    expect(localStorage.getItem('gestao_projetos_theme')).toBe('rich-mahogany')
  })
})
