
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  CheckCircle, 
  Grid, 
  DollarSign, 
  Users, 
  Wrench, 
  Award,
  Filter,
  Calendar,
  Search
} from 'lucide-react';

// Mock Data - Updated to reflect integration with Teams data conceptually
const DATA_HOMOLOGATION = [
  { name: 'Pendente', value: 12, color: '#f59e0b' },
  { name: 'Andamento', value: 8, color: '#3b82f6' },
  { name: 'Resolvido', value: 45, color: '#10b981' },
];

const DATA_TEAM_PERFORMANCE = [
  { name: 'Eq. Alpha', placas: 120, satisfacao: 4.8 },
  { name: 'Eq. Beta', placas: 95, satisfacao: 4.5 },
  { name: 'Eq. Gamma', placas: 150, satisfacao: 5.0 },
  { name: 'Eq. Delta', placas: 80, satisfacao: 4.2 },
];

const DATA_SERVICES = [
  { name: 'Pendente', value: 5, color: '#ef4444' },
  { name: 'Andamento', value: 3, color: '#f59e0b' },
  { name: 'Resolvido', value: 28, color: '#10b981' },
];

const MetricCard = ({ title, value, subtext, icon: Icon, colorClass }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between transition-transform hover:scale-[1.02]">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
    </div>
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard de Gestão</h2>
          <p className="text-slate-500">Visão geral de instalações e pós-venda</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Filter size={18} className="mr-2" />
            Filtro Avançado
          </button>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Período (Início)</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="date" 
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Período (Fim)</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="date" 
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Equipe</label>
            <select className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">Todas as Equipes</option>
              <option value="Alpha">Equipe Alpha</option>
              <option value="Beta">Equipe Beta</option>
              <option value="Gamma">Equipe Gamma</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Atendimento ao Cliente" 
          value="142" 
          subtext="+12% vs mês anterior" 
          icon={Users} 
          colorClass="bg-blue-500" 
        />
        <MetricCard 
          title="Instalações Concluídas" 
          value="45" 
          subtext="Meta: 50" 
          icon={CheckCircle} 
          colorClass="bg-emerald-500" 
        />
        <MetricCard 
          title="Placas Instaladas" 
          value="840" 
          subtext="~320 kWp total" 
          icon={Grid} 
          colorClass="bg-indigo-500" 
        />
        <MetricCard 
          title="Comissão Total" 
          value="R$ 28.450" 
          subtext="Previsão fechamento" 
          icon={DollarSign} 
          colorClass="bg-amber-500" 
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Teams */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Top Equipe (Placas)</h3>
            <Award className="text-amber-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA_TEAM_PERFORMANCE} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="placas" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Satisfaction */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Top de Satisfação</h3>
          <div className="text-5xl font-black text-blue-600 mb-2">5.0</div>
          <div className="flex mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <TrendingUp key={s} size={20} className="text-amber-400" />
            ))}
          </div>
          <p className="text-slate-600 font-medium">Equipe Gamma</p>
          <p className="text-xs text-slate-400 text-center mt-4">Status: Muito Satisfeito</p>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Services Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">Serviços e Manutenção</h3>
            <div className="flex items-center gap-2">
              <Wrench className="text-slate-400" size={20} />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DATA_SERVICES}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {DATA_SERVICES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Homologation Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">Homologação</h3>
            <div className="px-2 py-1 bg-purple-100 text-purple-600 rounded text-xs font-bold">Status</div>
          </div>
          <div className="h-64 flex items-center justify-center text-slate-400 italic">
            <div className="w-full space-y-4">
                {DATA_HOMOLOGATION.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600">{item.name}</span>
                        <div className="flex-1 mx-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${(item.value / 65) * 100}%`, backgroundColor: item.color }}></div>
                        </div>
                        <span className="text-sm font-bold text-slate-700">{item.value}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
