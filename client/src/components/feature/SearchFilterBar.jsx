import { Search } from 'lucide-react'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

// Reused by both the Services and Resources browse pages -
// one search box plus a category dropdown.
export function SearchFilterBar({ search, onSearchChange, category, onCategoryChange, categories = [] }) {
  const categoryOptions = [{ value: '', label: 'All categories' }, ...categories.map((c) => ({ value: c._id, label: c.name }))]

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="sm:w-52">
        <Select value={category} onChange={(e) => onCategoryChange(e.target.value)} options={categoryOptions} />
      </div>
    </div>
  )
}
