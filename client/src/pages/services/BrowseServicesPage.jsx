import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PackageSearch } from 'lucide-react'
import { ServiceCard } from '../../components/feature/ServiceCard'
import { SearchFilterBar } from '../../components/feature/SearchFilterBar'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { Pagination } from '../../components/ui/Pagination'
import { serviceApi } from '../../api/serviceApi'
import { categoryApi } from '../../api/categoryApi'
import { useDebounce } from '../../hooks/useDebounce'

export function BrowseServicesPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search)

  const { data: categoriesData } = useQuery({
    queryKey: ['categories', 'service'],
    queryFn: () => categoryApi.getCategories('service'),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['services', { search: debouncedSearch, category, page }],
    queryFn: () => serviceApi.getServices({ search: debouncedSearch, category, page, limit: 9 }),
  })

  const services = data?.data?.data?.services || []
  const totalPages = data?.data?.data?.totalPages || 1

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-heading text-2xl font-bold text-text-primary">Browse Services</h1>
      <p className="mt-1 text-sm text-text-secondary">Find help from students on your campus.</p>

      <div className="mt-6">
        <SearchFilterBar
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          category={category}
          onCategoryChange={(v) => { setCategory(v); setPage(1) }}
          categories={categoriesData?.data?.data || []}
        />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
        {!isLoading && services.map((service) => <ServiceCard key={service._id} service={service} />)}
      </div>

      {!isLoading && services.length === 0 && (
        <EmptyState icon={PackageSearch} title="No services found" description="Try a different search or category." />
      )}

      <div className="mt-10">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  )
}
