export default function AdminStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Lands"
        value={stats?.totalLands || 0}
        icon="🏞️"
        color="blue"
        change="+12%"
      />
      <StatCard
        title="Farmer Shares"
        value={stats?.totalFarmerShares || 0}
        icon="🌾"
        color="green"
        change="+8%"
      />
      <StatCard
        title="Total Investment"
        value={`₹${((stats?.totalInvestment || 0) / 100000).toFixed(1)}L`}
        icon="💰"
        color="yellow"
        change="+15%"
      />
      <StatCard
        title="Total Investors"
        value={stats?.totalInvestors || 0}
        icon="👥"
        color="purple"
        change="+10%"
      />
    </div>
  );
}

function StatCard({ title, value, icon, color, change }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm opacity-90">{title}</p>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-xs opacity-75">{change} from last month</p>
    </div>
  );
}
