import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PackageSearch } from 'lucide-react'
import { ResourceCard } from '../../components/feature/ResourceCard'
import { SearchFilterBar } from '../../components/feature/SearchFilterBar'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { Pagination } from '../../components/ui/Pagination'
import { resourceApi } from '../../api/resourceApi'
import { categoryApi } from '../../api/categoryApi'
import { useDebounce } from '../../hooks/useDebounce'

export function BrowseResourcesPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search)

  const { data: categoriesData } = useQuery({
    queryKey: ['categories', 'resource'],
    queryFn: () => categoryApi.getCategories('resource'),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['resources', { search: debouncedSearch, category, page }],
    queryFn: () => resourceApi.getResources({ search: debouncedSearch, category, page, limit: 9 }),
  })

  const resources = data?.data?.data?.resources || []

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-text-primary">Browse Resources</h1>
      <p className="mt-1 text-sm text-text-secondary">Rent items from students on your campus.</p>

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
        {!isLoading && resources.map((resource) => <ResourceCard key={resource._id} resource={resource} />)}
      </div>

      {!isLoading && resources.length === 0 && (
        <EmptyState icon={PackageSearch} title="No resources found" description="Try a different search or category." />
      )}

      <div className="mt-10">
        <Pagination page={page} totalPages={data?.data?.data?.total ? Math.ceil(data.data.data.total / 9) : 1} onPageChange={setPage} />
      </div>
    </div>
  )
}
