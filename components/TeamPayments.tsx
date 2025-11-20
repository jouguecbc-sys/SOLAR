
import React, { useState } from 'react';
import { 
  Banknote, 
  Filter, 
  Printer, 
  Download, 
  Search,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { Installation, ScheduleStatus, GridConnectionType } from '../types';

// Mock source of Completed Installations (This would usually come from the Installations Context/API)
const MOCK_COMPLETED_INSTALLATIONS: Installation[] = [
  {
    id: '101',
    displayId: 'INST 05',
    clientId: '1',
    clientName: 'Carlos Oliveira',
    clientPhone: '(11) 99999-8888',
    clientAddress: 'Rua das Flores, 123',
    teamId: 't1',
    teamName: 'Roberto (Alpha)',
    panelQty: 12,
    powerKwp: 6.6,
    gridType: GridConnectionType.MONOFASICO,
    breakerStandardAmp: '40',
    breakerInverterAmp: '32',
    laborPricePerPanel: 50,
    totalCost: 600.00,
    scheduledDate: '2023-10-10',
    completionDate: '2023-10-11',
    status: ScheduleStatus.RESOLVIDO
  },
  {
    id: '102',
    displayId: 'INST 08',
    clientId: '3',
    clientName: 'Empresa XYZ',
    clientPhone: '(11) 91111-2222',
    clientAddress: 'Av. Industrial, 500',
    teamId: 't2',
    teamName: 'Marcos (Beta)',
    panelQty: 100,
    powerKwp: 55.0,
    gridType: GridConnectionType.TRIFASICO,
    breakerStandardAmp: '100',
    breakerInverterAmp: '80',
    laborPricePerPanel: 40,
    totalCost: 4000.00,
    scheduledDate: '2023-10-15',
    completionDate: '2023-10-18',
    status: ScheduleStatus.RESOLVIDO
  },
  {
    id: '103',
    displayId: 'INST 10',
    clientId: '4',
    clientName: 'João Silva',
    clientPhone: '(11) 97777-1234',
    clientAddress: 'Rua do Campo, 50',
    teamId: 't1',
    teamName: 'Roberto (Alpha)',
    panelQty: 20,
    powerKwp: 11.0,
    gridType: GridConnectionType.BIFASICO,
    breakerStandardAmp: '63',
    breakerInverterAmp: '50',
    laborPricePerPanel: 50,
    totalCost: 1000.00,
    scheduledDate: '2023-10-20',
    completionDate: '2023-10-21',
    status: ScheduleStatus.RESOLVIDO
  }
];

const TeamPayments: React.FC = () => {
  const [payments, setPayments] = useState<Installation[]>(MOCK_COMPLETED_INSTALLATIONS);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    team: '',
    startDate: '',
    endDate: ''
  });

  // Logic: Filter completed installations to determine payments
  const filteredPayments = payments.filter(inst => {
    const matchTeam = filters.team ? inst.teamName.includes(filters.team) : true;
    const matchStart = filters.startDate ? (inst.completionDate || '') >= filters.startDate : true;
    const matchEnd = filters.endDate ? (inst.completionDate || '') <= filters.endDate : true;
    return matchTeam && matchStart && matchEnd;
  });

  const totalPayment = filteredPayments.reduce((acc, curr) => acc + curr.totalCost, 0);

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      setPayments(prev => prev.filter(p => p.id !== id));
    }
  };

  // Export to XLS (CSV)
  const handleExportXLS = () => {
    const headers = ["Data Conclusao", "Equipe", "Cliente", "Endereco", "Qtd Placas", "Potencia kWp", "Valor Total"];
    const rows = filteredPayments.map(p => [
      p.completionDate ? new Date(p.completionDate).toLocaleDateString('pt-BR') : '-',
      p.teamName,
      p.clientName,
      `"${p.clientAddress}"`, // Quote address to handle commas
      p.panelQty,
      p.powerKwp,
      p.totalCost.toFixed(2).replace('.', ',')
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(r => r.join(';'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pagamentos_equipe_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF (Print View)
  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const rows = filteredPayments.map(p => `
        <tr>
          <td style="padding:8px; border-bottom:1px solid #ddd;">${p.completionDate ? new Date(p.completionDate).toLocaleDateString('pt-BR') : '-'}</td>
          <td style="padding:8px; border-bottom:1px solid #ddd;">${p.teamName}</td>
          <td style="padding:8px; border-bottom:1px solid #ddd;">${p.clientName}</td>
          <td style="padding:8px; border-bottom:1px solid #ddd;">${p.panelQty}</td>
          <td style="padding:8px; border-bottom:1px solid #ddd;">${p.powerKwp}</td>
          <td style="padding:8px; border-bottom:1px solid #ddd; text-align:right;">R$ ${p.totalCost.toFixed(2)}</td>
        </tr>
      `).join('');

      printWindow.document.write(`
        <html>
          <head>
            <title>Relatório de Pagamentos - Equipes</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
              th { background: #f4f4f4; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }
              .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; padding-top: 10px; border-top: 2px solid #333; }
              .header { text-align: center; margin-bottom: 30px; }
              .filter-info { font-size: 12px; color: #666; margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Relatório de Pagamentos de Equipes</h2>
              <p>Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            <div class="filter-info">
               Filtros: ${filters.team || 'Todas Equipes'} | Período: ${filters.startDate || 'Início'} até ${filters.endDate || 'Hoje'}
            </div>
            <table>
              <thead>
                <tr>
                  <th>Data Conclusão</th>
                  <th>Equipe</th>
                  <th>Cliente</th>
                  <th>Placas</th>
                  <th>Potência (kWp)</th>
                  <th style="text-align:right;">Valor</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
            <div class="total">Total a Pagar: R$ ${totalPayment.toFixed(2)}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Banknote className="text-blue-600" />
            Pagamentos das Equipes
          </h2>
          <p className="text-slate-500 text-sm">Relatório automático baseado em instalações concluídas</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Filter size={18} className="mr-2" />
            Filtros
          </button>
          <button 
            onClick={handleExportXLS}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-md transition-colors"
          >
            <Download size={18} className="mr-2" />
            Exportar XLS
          </button>
          <button 
            onClick={handlePrintReport}
            className="flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 shadow-md transition-colors"
          >
            <Printer size={18} className="mr-2" />
            Imprimir PDF
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 grid grid-cols-1 md:grid-cols-3 gap-4">
           <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Filtrar Equipe</label>
              <div className="relative">
                 <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Nome da equipe..."
                   className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                   value={filters.team}
                   onChange={(e) => setFilters({...filters, team: e.target.value})}
                 />
              </div>
           </div>
           <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Data Conclusão (Início)</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              />
           </div>
           <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Data Conclusão (Fim)</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              />
           </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Conclusão</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Equipe</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Cliente / Endereço</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Placas</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Potência</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Valor</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {item.completionDate ? new Date(item.completionDate).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                       {item.teamName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-800">{item.clientName}</div>
                    <div className="text-xs text-slate-500 truncate max-w-[200px]">{item.clientAddress}</div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-slate-600">{item.panelQty}</td>
                  <td className="px-6 py-4 text-center text-sm text-slate-600">{item.powerKwp} kWp</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-700">
                    R$ {item.totalCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      type="button"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleDelete(item.id); 
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={16} className="pointer-events-none" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredPayments.length > 0 ? (
                <tr className="bg-blue-50 font-bold border-t-2 border-blue-100">
                  <td colSpan={5} className="px-6 py-4 text-right text-blue-800 uppercase text-xs">Total Geral</td>
                  <td className="px-6 py-4 text-right text-blue-800 text-lg">
                    R$ {totalPayment.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              ) : (
                <tr>
                   <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      Nenhum pagamento encontrado para o filtro selecionado.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamPayments;
