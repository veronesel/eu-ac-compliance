import Link from 'next/link'

interface MetricCardProps {
  label: string
  value: string | number
  subtext: string
  icon: React.ReactNode
  colour: 'red' | 'amber' | 'green' | 'purple' | 'blue'
  href: string
}

const colourMap = {
  red:    { bg: '#FEF2F2', text: '#B91C1C', iconBg: '#FEE2E2' },
  amber:  { bg: '#FFFBEB', text: '#B45309', iconBg: '#FEF3C7' },
  green:  { bg: '#F0FDF4', text: '#15803D', iconBg: '#DCFCE7' },
  purple: { bg: '#F5F3FF', text: '#6D28D9', iconBg: '#EDE9FE' },
  blue:   { bg: '#E8F2FB', text: '#1D5FAB', iconBg: '#BFDBFE' },
}

export default function MetricCard({ label, value, subtext, icon, colour, href }: MetricCardProps) {
  const c = colourMap[colour]
  return (
    <Link href={href} className="block">
      <div
        className="rounded-xl border p-4 hover:shadow-sm transition-shadow cursor-pointer"
        style={{ backgroundColor: c.bg, borderColor: c.text + '30' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: c.iconBg, color: c.text }}>
            {icon}
          </div>
        </div>
        <p className="text-3xl font-bold" style={{ color: c.text, fontFamily: 'Syne, sans-serif' }}>{value}</p>
        <p className="text-xs font-semibold mt-1" style={{ color: c.text }}>{label}</p>
        <p className="text-xs text-[#64748B] mt-0.5">{subtext}</p>
      </div>
    </Link>
  )
}
