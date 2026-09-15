import { useState } from 'react'

interface Props {
  onSearch: (term: string) => void
  loading: boolean
}

export default function SearchBar({ onSearch, loading }: Props) {
  const [term, setTerm] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (term.trim()) onSearch(term.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Pesquisar skin… ex: AK-47 Redline"
        className="flex-1 bg-zinc-800 text-zinc-100 px-4 py-2.5 rounded-lg border border-zinc-700 focus:outline-none focus:border-emerald-500 text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
      >
        {loading ? '…' : 'Pesquisar'}
      </button>
    </form>
  )
}