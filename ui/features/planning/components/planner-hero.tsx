import { Compass, Plane } from "lucide-react"

export function PlannerHero() {
  return (
    <div className="text-center mb-12" data-animate>
      <div className="flex items-center justify-center gap-3 mb-4">
        <Compass className="w-8 h-8 text-travel-sky" />
        <h1 className="text-5xl font-bold text-gray-900 text-balance">Create Your Own Travel Plan</h1>
        <Plane className="w-8 h-8 text-travel-green" />
      </div>
      <p className="text-xl text-gray-600 font-light text-pretty">Customize your journey with budget, dates, and plans.</p>
    </div>
  )
}
