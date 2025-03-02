'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

interface Failure {
  id: string
  datetime: string
  data_hora: string
  [key: string]: string | number | boolean | null
}

interface Metrics {
  totalRecords: number
  totalColumns: number
  last24hRecords: number
}

export default function Home() {
  const [failures, setFailures] = useState<Failure[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [metrics, setMetrics] = useState<Metrics | null>(null)
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
          const { data: tableData, error: tableError } = await supabase
            .from('curated_intelifalhas')
            .select('*')
            .order('data_hora', { ascending: false })
            .limit(10)
          
          if (tableError) throw tableError

          const { count: totalRecords, error: countError } = await supabase
            .from('curated_intelifalhas')
            .select('*', { count: 'exact', head: true })

          if (countError) throw countError

          const last24Hours = new Date()
          last24Hours.setDate(last24Hours.getDate() - 1)

          const { count: recentRecords } = await supabase
            .from('curated_intelifalhas')
            .select('*', { count: 'exact', head: true })
            .gte('data_hora', last24Hours.toISOString())

          if (tableData && tableData.length > 0) {
            setFailures(tableData)
            const columnArray = Object.keys(tableData[0])
            setColumns(columnArray)
            
            setMetrics({
              totalRecords: totalRecords || 0,
              totalColumns: columnArray.length,
              last24hRecords: recentRecords || 0
            })
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
        } finally {
          setLoading(false)
        }
      }

      fetchData()
    }
  }, [mounted])

  if (!mounted) return null

  if (loading) return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="text-3xl font-bold mb-8 text-center text-gray-800">
        <Skeleton className="h-8 w-96 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )

  if (error) return (
    <main className="min-h-screen p-8 bg-gray-50">
      <Alert variant="destructive" className="max-w-xl mx-auto mt-8">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Erro ao carregar dados</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    </main>
  )

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Dashboard de Telemetria - Conexão Supabase
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total de Registros</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{metrics?.totalRecords || '0'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total de Colunas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{metrics?.totalColumns || '0'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Registros (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{metrics?.last24hRecords || '0'}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimos Registros</CardTitle>
        </CardHeader>
        <CardContent>
          {failures.length === 0 ? (
            <div className="text-center text-gray-700">
              Nenhum dado encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column}>
                        {column}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {failures.map((failure) => (
                    <TableRow key={failure.id}>
                      {columns.map((column) => (
                        <TableCell key={`${failure.id}-${column}`}>
                          {String(failure[column] || '-')}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
