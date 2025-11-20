
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Wallet,
  Printer,
  Calendar
} from 'lucide-react';
import { FinancialRecord, Team } from '../types';

// Mock Data
const MOCK_TEAMS: Team[] = [
  { id: 't1', leaderName: 'Roberto (Alpha)', pixKey: '', feedbacks: [] },
  { id: 't2', leaderName: 'Marcos (Beta)', pixKey: '', feedbacks: [] },
  { id: 't3', leaderName: 'Júlio (Gamma)', pixKey: '', feedbacks: [] }
];

const MOCK_FINANCIALS: FinancialRecord[] = [
  { id: '1', date: '2023-10-20', teamId: 't1', teamName: 'Roberto (Alpha)', description: 'Reembolso Combustível - Obra Rua Flores', value: 150.00 },
  { id: '2', date: '2023-10-21', teamId: 't2', teamName: 'Marcos (Beta)', description: 'Compra de parafusos extras', value: 45.50 }
];

const Financials: React.FC = () => {
  const [records, setRecords] = useState<FinancialRecord[]>(MOCK_FINANCIALS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    teamId: ''
  });

  // Form
  const [formData, setFormData] = useState<Partial<FinancialRecord>>({
    date: new Date().toISOString().split('T')[0],
    value: 0
  });

  const handleOpenModal = (record?: FinancialRecord) => {
    if (record) {
      setEditingId(record.id);
      setFormData({ ...record });
    } else {
      setEditingId(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        value: 0,
        description: '',
        teamId: '',
        teamName: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleTeamSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const teamId = e.target.value;
    const team = MOCK_TEAMS.find(t => t.id === teamId);
    if (team) {
      setFormData(prev => ({ ...prev, teamId: team.id, teamName: team.leaderName }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setRecords(prev => prev.map(r => r.id === editingId ? { ...r, ...formData } as FinancialRecord : r));
    } else {
      const newRecord = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9)
      } as FinancialRecord;
      setRecords(prev => [...prev, newRecord]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  // Print Report Logic
  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const total = filteredRecords.reduce((acc, curr) => acc + curr.value, 0);
      
      const rows = filteredRecords.map(r => `
        <tr>
          <td style="padding:8px; border-bottom:1px solid #ddd;">${new Date(r.date).toLocaleDateString('pt-BR')}</td>
          <td style="padding:8px; border-bottom:1px solid #ddd;">${r.teamName}</td>
          <td style="padding:8px; border-bottom:1px solid #ddd;">${r.description}</td>
          <td style="padding:8px; border-bottom:1px solid #ddd; text-align:right;">R$ ${r.value.toFixed(2)}</td>
        </tr>
      `).join('');

      printWindow.document.write(`
        <html>
          <head>
            <title>Relatório de Reembolso/Despesas</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th { background: #f4f4f4; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }
              .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; padding-top: 10px; border-top: 2px solid #333; }
              .header { text-align: center; margin-bottom: 30px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Relatório de Reembolso e Despesas</h2>
              <p>Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Equipe</th>
                  <th>Descrição</th>
                  <th style="text-align:right;">Valor</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
            <div class="total">Total: R$ ${total.toFixed(2)}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const filteredRecords = records.filter(r => {
    const matchTeam = filters.teamId ? r.teamId === filters.teamId : true;
    const matchStart = filters.startDate ? r.date >= filters.startDate : true;
    const matchEnd = filters.endDate ? r.date <= filters.endDate : true;
    return matchTeam && matchStart && matchEnd;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Wallet className="text-emerald-600" />
            Controle Financeiro
          </h2>
          <p className="text-slate-500 text-sm">Gestão de despesas e reembolsos de equipes</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Filter size={18} className="mr-2" />
            Filtro
          </button>
          <button 
            onClick={handlePrintReport}
            className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 shadow-sm transition-colors"
          >
            <Printer size={18} className="mr-2" />
            Relatório PDF
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-md transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Novo Lançamento
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Data Início</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Data Fim</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Equipe</label>
            <select 
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={filters.teamId}
              onChange={(e) => setFilters({...filters, teamId: e.target.value})}
            >
              <option value="">Todas</option>
              {MOCK_TEAMS.map(t => <option key={t.id} value={t.id}>{t.leaderName}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Table List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Data</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Equipe</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Descrição</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Valor</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(r.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{r.teamName}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{r.description}</td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600 text-right">
                    R$ {r.value.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(r); }} 
                        className="p-2 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50"
                      >
                        <Edit2 size={16} className="pointer-events-none" />
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleDelete(r.id); 
                        }} 
                        className="p-2 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                      >
                        <Trash2 size={16} className="pointer-events-none" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRecords.length > 0 && (
                <tr className="bg-slate-50 font-bold">
                  <td colSpan={3} className="px-6 py-4 text-right text-slate-700 uppercase text-xs">Total do Período</td>
                  <td className="px-6 py-4 text-right text-emerald-700">
                    R$ {filteredRecords.reduce((acc, curr) => acc + curr.value, 0).toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">
                {editingId ? 'Editar Despesa' : 'Nova Despesa'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                 <input 
                   type="date" 
                   className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                   value={formData.date}
                   onChange={(e) => setFormData({...formData, date: e.target.value})}
                   required
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Equipe</label>
                 <select 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.teamId}
                    onChange={handleTeamSelect}
                    required
                 >
                    <option value="">Selecione...</option>
                    {MOCK_TEAMS.map(t => <option key={t.id} value={t.id}>{t.leaderName}</option>)}
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                 <input 
                   type="text" 
                   className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                   value={formData.description}
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                   required
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
                 <input 
                   type="number" 
                   step="0.01"
                   className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                   value={formData.value}
                   onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value)})}
                   required
                 />
               </div>
               <div className="flex justify-end pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg mr-2">Cancelar</button>
                  <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-md">Salvar</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financials;
