'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useEffect } from 'react'

export function SearchBar({ placeholder = "Buscar..." }: { placeholder?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const initialSearch = searchParams.get('q') || ''
  const [searchTerm, setSearchTerm] = useState(initialSearch)

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '')
  }, [searchParams])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchTerm(val)

    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (val) {
        params.set('q', val)
      } else {
        params.delete('q')
      }
      router.replace(`?${params.toString()}`)
    })
  }

  return (
    <div className="relative max-w-md w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className={`h-5 w-5 ${isPending ? 'text-legal-blue animate-pulse' : 'text-slate-400'}`} />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-legal-blue focus:border-legal-blue sm:text-sm transition-all shadow-sm"
        placeholder={placeholder}
      />
    </div>
  )
}
