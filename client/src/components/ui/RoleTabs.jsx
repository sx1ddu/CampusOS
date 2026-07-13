// Small pill-style tab switcher, used for "As Client / As Provider" and
// "As Renter / As Owner" views on the Bookings and Rentals pages.
export function RoleTabs({ tabs, active, onChange }) {
  return (
    <div className="flex w-fit gap-1 rounded-lg bg-surface-alt p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            active === tab.key ? 'bg-surface text-text-primary shadow-sm' : 'text-text-secondary'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
