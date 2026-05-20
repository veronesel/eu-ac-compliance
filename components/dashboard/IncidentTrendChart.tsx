'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartData {
  month: string
  incidents: number
}

export function IncidentTrendChart({ data }: { data: ChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} allowDecimals={false} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
          labelStyle={{ color: '#0F172A', fontWeight: 600 }}
        />
        <Area
          type="monotone"
          dataKey="incidents"
          stroke="#1D5FAB"
          fill="#E8F2FB"
          strokeWidth={2}
          name="Incidents"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
