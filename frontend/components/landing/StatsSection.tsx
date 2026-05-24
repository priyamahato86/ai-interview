const stats = [
  { value: "2,000+", label: "Engineers prepared"   },
  { value: "94%",    label: "Avg. match score"      },
  { value: "50+",    label: "Companies represented" },
  { value: "4.9 ★",  label: "User rating"           },
];

export function StatsSection() {
  return (
    <div className="bg-indigo-950 border-t border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p
              className="text-3xl sm:text-4xl font-normal text-white mb-1.5"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              {s.value}
            </p>
            <p className="text-sm text-indigo-300/70">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
