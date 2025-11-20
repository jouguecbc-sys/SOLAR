
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Download, 
  Edit2, 
  Trash2, 
  Calendar, 
  MapPin, 
  Zap, 
  DollarSign,
  CheckCircle,
  Save,
  X,
  Copy,
  HardHat
} from 'lucide-react';
import { 
  Installation, 
  GridConnectionType, 
  ScheduleStatus, 
  Client, 
  Salesperson, 
  InstallStatus,
  Team
} from '../types';

// Mock Data Sources (Simulating Database)
const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Carlos Oliveira',
    address: 'Rua das Flores, 123 - Jardim Sol',
    phone: '(11) 99999-8888',
    salesperson: Salesperson.ISA,
    panelQty: 12,
    powerKwp: 6.6,
    contractDate: '2023-10-01',
    observation: 'Telhado alto',
    installStatus: InstallStatus.PENDENTE
  },
  {
    id: '2',
    name: 'Ana Souza',
    address: 'Av. Paulista, 2000 - Bela Vista',
    phone: '(11) 97777-6666',
    salesperson: Salesperson.PEDRO,
    panelQty: 24,
    powerKwp: 13.2,
    contractDate: '2023-10-15',
    observation: 'Acesso fácil',
    installStatus: InstallStatus.EM_ANDAMENTO
  }
];

const MOCK_TEAMS: Team[] = [
  { id: 't1', leaderName: 'Roberto (Alpha)', pixKey: '', feedbacks: [] },
  { id: 't2', leaderName: 'Marcos (Beta)', pixKey: '', feedbacks: [] },
  { id: 't3', leaderName: 'Júlio (Gamma)', pixKey: '', feedbacks: [] }
];

const MOCK_INSTALLATIONS: Installation[] = [
  {
    id: 'inst1',
    displayId: 'INST 01',
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
    totalCost: 600,
    scheduledDate: '2023-10-10',
    status: ScheduleStatus.RESOLVIDO,
    completionDate: '2023-10-11'
  }
];

const LABOR_OPTIONS = [0, 50, 60, 70];

const Installations: React.FC = () => {
  const [installations, setInstallations] = useState<Installation[]>(MOCK_INSTALLATIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    team: ''
  });

  // Form State
  const [formData, setFormData] = useState<Partial<Installation>>({});

  // ID Generation: INST 01, INST 02...
  const generateDisplayId = () => {
    const maxId = installations.reduce((max, s) => {
      const num = parseInt(s.displayId.replace('INST ', ''));
      return num > max ? num : max;
    }, 0);
    return `INST ${(maxId + 1).toString().padStart(2, '0')}`;
  };

  const handleOpenModal = (inst?: Installation) => {
    if (inst) {
      setEditingId(inst.id);
      setFormData({ ...inst });
    } else {
      setEditingId(null);
      setFormData({
        displayId: generateDisplayId(),
        status: ScheduleStatus.PENDENTE,
        gridType: GridConnectionType.MONOFASICO,
        breakerStandardAmp: '',
        breakerInverterAmp: '',
        laborPricePerPanel: 50,
        totalCost: 0,
        scheduledDate: new Date().toISOString().split('T')[0],
        panelQty: 0,
        powerKwp: 0,
        clientId: '',
        clientName: '',
        clientPhone: '',
        clientAddress: '',
        teamId: '',
        teamName: ''
      });
    }
    setIsModalOpen(true);
  };

  // Handle Client Selection & Auto-fill
  const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    const client = MOCK_CLIENTS.find(c => c.id === clientId);
    
    if (client) {
      const currentLabor = formData.laborPricePerPanel || 50;
      setFormData(prev => ({
        ...prev,
        clientId: client.id,
        clientName: client.name,
        clientAddress: client.address,
        clientPhone: client.phone,
        panelQty: client.panelQty,
        powerKwp: client.powerKwp,
        totalCost: client.panelQty * currentLabor
      }));
    }
  };

  // Handle Team Selection
  const handleTeamSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const teamId = e.target.value;
    const team = MOCK_TEAMS.find(t => t.id === teamId);
    if (team) {
      setFormData(prev => ({ ...prev, teamId: team.id, teamName: team.leaderName }));
    }
  };

  // Handle Labor Cost Change & Recalculation
  const handleLaborChange = (val: number) => {
    setFormData(prev => ({
      ...prev,
      laborPricePerPanel: val,
      totalCost: (prev.panelQty || 0) * val
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Logic for completion date
    const completionDate = formData.status === ScheduleStatus.RESOLVIDO
      ? (formData.completionDate || new Date().toISOString().split('T')[0])
      : undefined;

    if (editingId) {
      setInstallations(prev => prev.map(i => i.id === editingId 
        ? { ...i, ...formData, completionDate } as Installation 
        : i));
    } else {
      const newInst = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        completionDate
      } as Installation;
      setInstallations(prev => [...prev, newInst]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      setInstallations(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleStatusChange = (id: string, newStatus: ScheduleStatus) => {
    setInstallations(prev => prev.map(i => {
      if (i.id === id) {
        const completionDate = newStatus === ScheduleStatus.RESOLVIDO 
          ? new Date().toISOString().split('T')[0] 
          : undefined;
        return { ...i, status: newStatus, completionDate };
      }
      return i;
    }));
  };

  // --- EXPORT TOOLS ---
  const copyToClipboard = (i: Installation) => {
    const text = `
*INSTALAÇÃO AGENDADA*
🆔 *${i.displayId}*
📅 Data: ${new Date(i.scheduledDate).toLocaleDateString('pt-BR')}
👤 Cliente: ${i.clientName}
📍 Endereço: ${i.clientAddress}
📞 Tel: ${i.clientPhone}

👷 Equipe: ${i.teamName}
📊 Sistema: ${i.panelQty} Placas (${i.powerKwp} kWp)
⚡ Padrão: ${i.gridType}
🔌 Disjuntores: Padrão ${i.breakerStandardAmp}A / Inversor ${i.breakerInverterAmp}A

💰 Mão de Obra: R$ ${i.laborPricePerPanel}/placa
💵 Custo Total: R$ ${i.totalCost.toFixed(2)}
🚧 Status: ${i.status}
    `.trim();
    navigator.clipboard.writeText(text).then(() => alert('Texto copiado!'));
  };

  const handleGeneratePNG = async (id: string) => {
    if (typeof window !== 'undefined' && (window as any).html2canvas) {
      const element = document.getElementById(`inst-card-${id}`);
      if (element) {
        try {
          const canvas = await (window as any).html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
          const link = document.createElement('a');
          link.download = `Instalacao-${id}.png`;
          link.href = canvas.toDataURL();
          link.click();
        } catch (error) {
          console.error(error);
          alert("Erro ao gerar imagem.");
        }
      }
    }
  };

  const handlePrintPDF = (i: Installation) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      // Print content
      printWindow.document.write('<html><body><h1>Instalação PDF</h1></body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Filter Logic
  const filteredList = installations.filter(i => {
    const matchesSearch = 
      i.clientName.toLowerCase().includes(filters.search.toLowerCase()) ||
      i.displayId.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status ? i.status === filters.status : true;
    const matchesTeam = filters.team ? i.teamId === filters.team : true;
    return matchesSearch && matchesStatus && matchesTeam;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestão de Instalações</h2>
          <p className="text-slate-500">Controle de obras, custos e dados técnicos</p>
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
            onClick={() => handleOpenModal()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Nova Instalação
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Buscar (Cliente/ID)</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex: INST 01 ou Nome"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
          </div>
          <div>
             <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
             <select 
               className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
               value={filters.status}
               onChange={e => setFilters({...filters, status: e.target.value})}
             >
               <option value="">Todos</option>
               {Object.values(ScheduleStatus).map(s => <option key={s} value={s}>{s}</option>)}
             </select>
          </div>
          <div>
             <label className="block text-xs font-medium text-slate-500 mb-1">Equipe</label>
             <select 
               className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
               value={filters.team}
               onChange={e => setFilters({...filters, team: e.target.value})}
             >
               <option value="">Todas</option>
               {MOCK_TEAMS.map(t => <option key={t.id} value={t.id}>{t.leaderName}</option>)}
             </select>
          </div>
        </div>
      )}

      {/* Card List */}
      <div className="space-y-4">
        {filteredList.map(inst => (
          <div 
            id={`inst-card-${inst.id}`}
            key={inst.id} 
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row"
          >
            {/* Left: Status Strip */}
            <div className={`w-full md:w-3 h-2 md:h-auto flex-shrink-0 ${
               inst.status === ScheduleStatus.RESOLVIDO ? 'bg-emerald-500' :
               inst.status === ScheduleStatus.ANDAMENTO ? 'bg-blue-500' : 'bg-amber-500'
            }`} />

            <div className="p-6 flex-1">
              <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{inst.displayId}</span>
                    <span className="text-xs font-medium text-slate-400 flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {new Date(inst.scheduledDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{inst.clientName}</h3>
                  <div className="text-sm text-slate-500 flex items-center">
                    <MapPin size={14} className="mr-1" /> {inst.clientAddress}
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2 md:mt-0">
                   <select 
                      value={inst.status}
                      onChange={(e) => handleStatusChange(inst.id, e.target.value as ScheduleStatus)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 cursor-pointer outline-none ring-1 ring-inset ${
                        inst.status === ScheduleStatus.RESOLVIDO ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
                        inst.status === ScheduleStatus.ANDAMENTO ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                        'bg-amber-50 text-amber-700 ring-amber-600/20'
                      }`}
                   >
                      {Object.values(ScheduleStatus).map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Technical Data */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                   <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-700 flex items-center"><Zap size={14} className="mr-1"/> Sistema</span>
                      <span className="text-slate-600">{inst.panelQty} Placas / {inst.powerKwp} kWp</span>
                   </div>
                   <div className="text-xs text-slate-500 grid grid-cols-2 gap-2">
                      <div>Padrão: <b>{inst.gridType}</b></div>
                      <div>Disj. Inv: <b>{inst.breakerInverterAmp}A</b></div>
                   </div>
                </div>

                {/* Financial Data */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm">
                   <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-blue-800 flex items-center"><DollarSign size={14} className="mr-1"/> Financeiro</span>
                      <span className="font-bold text-blue-700 text-lg">R$ {inst.totalCost.toFixed(2)}</span>
                   </div>
                   <div className="text-xs text-blue-600 flex justify-between">
                      <span>Mão de obra: R$ {inst.laborPricePerPanel}/placa</span>
                      <span className="flex items-center"><HardHat size={12} className="mr-1"/> {inst.teamName}</span>
                   </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                <div className="text-xs text-slate-400">
                  {inst.completionDate && <span className="flex items-center text-emerald-600"><CheckCircle size={12} className="mr-1"/> Concluído: {new Date(inst.completionDate).toLocaleDateString('pt-BR')}</span>}
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); copyToClipboard(inst); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Copiar p/ Whatsapp"><Copy size={18}/></button>
                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleGeneratePNG(inst.id); }} className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded" title="PNG"><Download size={18}/></button>
                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePrintPDF(inst); }} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded" title="PDF"><Printer size={18}/></button>
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); handleOpenModal(inst); }} 
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Editar"
                    >
                        <Edit2 size={18} className="pointer-events-none"/>
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleDelete(inst.id); 
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={18} className="pointer-events-none" />
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredList.length === 0 && (
          <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
            Nenhuma instalação encontrada.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">
                {editingId ? `Editar Instalação ${formData.displayId}` : `Nova Instalação ${formData.displayId}`}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Selection Section */}
                  <div className="col-span-2 md:col-span-1">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
                     <select 
                       className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                       onChange={handleClientSelect}
                       value={formData.clientId || ''}
                       disabled={!!editingId}
                     >
                       <option value="">Selecione...</option>
                       {MOCK_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                     </select>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Equipe</label>
                     <select 
                       className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                       onChange={handleTeamSelect}
                       value={formData.teamId || ''}
                     >
                       <option value="">Selecione...</option>
                       {MOCK_TEAMS.map(t => <option key={t.id} value={t.id}>{t.leaderName}</option>)}
                     </select>
                  </div>

                  {/* Auto-Filled Info Box */}
                  <div className="col-span-2 bg-slate-50 p-4 rounded-lg border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div>
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Qtd. Placas</span>
                       <div className="font-medium">{formData.panelQty || 0}</div>
                     </div>
                     <div>
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Potência</span>
                       <div className="font-medium">{formData.powerKwp || 0} kWp</div>
                     </div>
                     <div className="col-span-2">
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Endereço</span>
                       <div className="font-medium truncate">{formData.clientAddress || '-'}</div>
                     </div>
                  </div>

                  {/* Electrical Data */}
                  <div className="col-span-2">
                     <h4 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Dados do Sistema & Elétrica</h4>
                  </div>
                  
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Padrão de Entrada</label>
                     <select 
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.gridType}
                        onChange={e => setFormData({...formData, gridType: e.target.value as GridConnectionType})}
                     >
                        {Object.values(GridConnectionType).map(t => <option key={t} value={t}>{t}</option>)}
                     </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                     <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Disj. Padrão (A)</label>
                        <input 
                          type="text" 
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                          value={formData.breakerStandardAmp || ''}
                          onChange={e => setFormData({...formData, breakerStandardAmp: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Disj. Inversor (A)</label>
                        <input 
                          type="text" 
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                          value={formData.breakerInverterAmp || ''}
                          onChange={e => setFormData({...formData, breakerInverterAmp: e.target.value})}
                        />
                     </div>
                  </div>

                  {/* Costs */}
                  <div className="col-span-2">
                     <h4 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Custos & Agendamento</h4>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Mão de Obra (por placa)</label>
                     <div className="relative">
                        <select 
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                          value={LABOR_OPTIONS.includes(formData.laborPricePerPanel || 0) ? formData.laborPricePerPanel : 'custom'}
                          onChange={(e) => {
                             const val = e.target.value;
                             if (val !== 'custom') handleLaborChange(Number(val));
                             else handleLaborChange(0); // Reset to 0 for custom input typing
                          }}
                        >
                          {LABOR_OPTIONS.map(opt => <option key={opt} value={opt}>R$ {opt},00</option>)}
                          <option value="custom">Outro Valor</option>
                        </select>
                     </div>
                     {/* Custom Input if "Other" is conceptualized or selected value not in options */}
                     {(!LABOR_OPTIONS.includes(formData.laborPricePerPanel || 0) && formData.laborPricePerPanel !== undefined) && (
                        <input 
                          type="number"
                          className="mt-2 w-full border border-blue-300 bg-blue-50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Digite o valor..."
                          value={formData.laborPricePerPanel}
                          onChange={(e) => handleLaborChange(Number(e.target.value))}
                        />
                     )}
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Custo Total (Automático)</label>
                     <div className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-bold">
                        R$ {(formData.totalCost || 0).toFixed(2)}
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Data Agendada</label>
                     <input 
                        type="date"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.scheduledDate}
                        onChange={e => setFormData({...formData, scheduledDate: e.target.value})}
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Status Inicial</label>
                     <select 
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value as ScheduleStatus})}
                     >
                        {Object.values(ScheduleStatus).map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                  </div>

               </div>

               <div className="flex justify-end pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg mr-3 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  Salvar Instalação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Installations;
