// Small pill-style tab switcher, used for "As Client / As Provider" and
// "As Renter / As Owner" views on the Bookings and Rentals pages.
export function RoleTabs({ tabs, active, onChange }) {
  return (
    <div className="flex w-fit gap-1 rounded-full bg-surface-alt p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
            active === tab.key ? 'bg-surface text-text-primary shadow-[var(--shadow-subtle)]' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
