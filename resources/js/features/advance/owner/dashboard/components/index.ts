export * from "./chart-skeleton"
export * from "./delta-badge"
export * from "./kpi-card"
export * from "./metric-toggle"
export * from "./payment-breakdown"
export * from "./quick-actions-card"
export * from "./recent-transactions-card"
export * from "./status-badge"
export * from "./top-products-card"

// Komponen chart (recharts) sengaja tidak di-re-export sebagai nilai dari barrel ini:
// halaman memuatnya secara lazy (React.lazy + import()) supaya chunk 'charts' yang besar
// tidak ikut termuat statis. Hanya tipenya yang di-share (terhapus saat build).
export type { CategorySlice } from "./category-donut"
export type { HourPoint } from "./hourly-sales-chart"
export type { TrendMetric, TrendPoint } from "./sales-trend-chart"
