import { useEffect, useRef, useState } from 'react'

export function useReveal<T extends HTMLElement>(limiar = 0.2) {
  const ref = useRef<T>(null)
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const elemento = ref.current
    if (!elemento) return
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true)
          observador.disconnect()
        }
      },
      { threshold: limiar },
    )
    observador.observe(elemento)
    return () => observador.disconnect()
  }, [limiar])

  return { ref, visivel }
}

export function useContador(alvo: number, ativo: boolean, duracao = 1200) {
  const [valor, setValor] = useState(0)

  useEffect(() => {
    if (!ativo) return
    const inicio = performance.now()
    let quadro = 0
    function passo(agora: number) {
      const progresso = Math.min((agora - inicio) / duracao, 1)
      setValor(Math.round(alvo * (1 - Math.pow(1 - progresso, 3))))
      if (progresso < 1) quadro = requestAnimationFrame(passo)
    }
    quadro = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(quadro)
  }, [alvo, ativo, duracao])

  return valor
}
