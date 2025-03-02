'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Falha {
  id: number
  [key: string]: any
}

export default function Home() {
  const [falhas, setFalhas] = useState<Falha[]>([])
  const [colunas, setColunas] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      const fetchData = async () => {
        try {
          console.log('Iniciando conexão com Supabase...')
          const { data, error } = await supabase
            .from('curated_intelifalhas')
            .select('*')
            .limit(10)
          
          if (error) {
            console.error('Erro ao buscar dados:', error)
            throw error
          }

          console.log('Dados recebidos:', data)

          if (data && data.length > 0) {
            setFalhas(data)
            setColunas(Object.keys(data[0]))
            console.log('Colunas encontradas:', Object.keys(data[0]))
          } else {
            console.log('Nenhum dado encontrado na tabela')
          }
        } catch (err) {
          console.error('Erro capturado:', err)
          setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
        } finally {
          setLoading(false)
        }
      }

      fetchData()
    }
  }, [mounted])

  // Não renderiza nada até que o componente esteja montado no cliente
  if (!mounted) return null

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg">Carregando...</p>
    </div>
  )

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg text-red-500">Erro: {error}</p>
    </div>
  )

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Dashboard de Telemetria - Conexão Supabase
      </h1>

      {falhas.length === 0 ? (
        <div className="text-center text-gray-500">
          Nenhum dado encontrado
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {colunas.map((coluna) => (
                  <th key={coluna} className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-b">
                    {coluna}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {falhas.map((falha, index) => (
                <tr key={falha.id || index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  {colunas.map((coluna) => (
                    <td key={`${falha.id}-${coluna}`} className="px-6 py-4 text-sm text-gray-500 border-b">
                      {String(falha[coluna])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
