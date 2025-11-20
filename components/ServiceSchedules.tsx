
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
  User, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Save,
  X,
  Copy,
  Briefcase
} from 'lucide-react';
import { 
  ServiceSchedule, 
  ServiceType, 
  ServicePriority, 
  ScheduleStatus, 
  Client, 
  Salesperson, 
  InstallStatus 
} from '../types';

// Mock Data Sources (Ideally from Context/API)
const MOCK_CLIENTS_SOURCE: Client[] = [
  {
    id: '1',
    name: 'Carlos Oliveira',
    address: 'Rua das Flores, 123 - Jardim Sol',
    phone: '(11) 99999-8888',
    salesperson: Salesperson.ISA,
    panelQty: 12,
    powerKwp: 6.6,
    contractDate: '2023-10-01',
    observation: '',
    installStatus: InstallStatus.CONCLUIDA
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
    observation: '',
    installStatus: InstallStatus.EM_ANDAMENTO
  }
];

const MOCK_TEAMS = ['Equipe Alpha', 'Equipe Beta', 'Equipe Gamma'];

const MOCK_SCHEDULES: ServiceSchedule[] = [
  {
    id: 'sch1',
    displayId: 'SERV 01',
    clientId: '1',
    clientName: 'Carlos Oliveira',
    clientPhone: '(11) 99999-8888',
    clientAddress: 'Rua das Flores, 123',
    salesperson: 'Isa',
    serviceType: ServiceType.CONFIG_INVERSOR,
    description: 'Configuração de Wi-Fi',
    assignedTeam: 'Equipe Alpha',
    priority: ServicePriority.MEDIA,
    scheduledDate: '2023-10-25',
    cost: 0,
    status: ScheduleStatus.PENDENTE,
    observation: ''
  }
];

const ServiceSchedules: React.FC = () => {
  const [schedules, setSchedules] = useState<ServiceSchedule[]>(MOCK_SCHEDULES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ServiceSchedule | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    priority: '',
    status: ''
  });

  // Form State
  const [formData, setFormData] = useState<Partial<ServiceSchedule>>({
    priority: ServicePriority.PEQUENA,
    status: ScheduleStatus.PENDENTE,
    serviceType: ServiceType.CONFIG_INVERSOR,
    cost: 0
  });

  // ID Generation: SERV 01, SERV 02...
  const generateDisplayId = () => {
    const maxId = schedules.reduce((max, s) => {
      const num = parseInt(s.displayId.replace('SERV ', ''));
      return num > max ? num : max;
    }, 0);
    return `SERV ${(maxId + 1).toString().padStart(2, '0')}`;
  };

  const handleOpenModal = (schedule?: ServiceSchedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({ ...schedule });
    } else {
      setEditingSchedule(null);
      setFormData({
        displayId: generateDisplayId(),
        priority: ServicePriority.PEQUENA,
        status: ScheduleStatus.PENDENTE,
        serviceType: ServiceType.CONFIG_INVERSOR,
        scheduledDate: new Date().toISOString().split('T')[0],
        cost: 0,
        description: '',
        observation: '',
        clientId: '',
        clientName: '',
        clientPhone: '',
        clientAddress: '',
        salesperson: '',
        assignedTeam: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    const client = MOCK_CLIENTS_SOURCE.find(c => c.id === clientId);
    
    if (client) {
      setFormData(prev => ({
        ...prev,
        clientId: client.id,
        clientName: client.name,
        clientAddress: client.address,
        clientPhone: client.phone,
        salesperson: client.salesperson === Salesperson.OUTROS ? client.salespersonOther : client.salesperson
      }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSchedule) {
      setSchedules(prev => prev.map(s => s.id === editingSchedule.id ? { ...s, ...formData } as ServiceSchedule : s));
    } else {
      const newSchedule = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as ServiceSchedule;
      setSchedules(prev => [...prev, newSchedule]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      setSchedules(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleStatusChange = (id: string, newStatus: ScheduleStatus) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  // --- Export & Tools Functions ---

  const copyToClipboard = (s: ServiceSchedule) => {
    const text = `
*AGENDAMENTO DE SERVIÇO*
🆔 *${s.displayId}*
📅 Data: ${new Date(s.scheduledDate).toLocaleDateString('pt-BR')}
👤 Cliente: ${s.clientName}
📍 Endereço: ${s.clientAddress}
📞 Tel: ${s.clientPhone}
👨‍💼 Vendedor: ${s.salesperson}

🔧 Serviço: ${s.serviceType === ServiceType.OUTROS ? s.serviceTypeOther : s.serviceType}
📝 Detalhes: ${s.description}
👷 Equipe: ${s.assignedTeam || 'Não definida'}
⚠️ Prioridade: ${s.priority}
💰 Valor: R$ ${s.cost.toFixed(2)}
📊 Status: ${s.status}

ℹ️ Obs: ${s.observation || '-'}
    `.trim();

    navigator.clipboard.writeText(text).then(() => alert('Texto copiado para área de transferência!'));
  };

  const handlePrintPDF = (s: ServiceSchedule) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      // print content
      printWindow.document.write('<html><body><h1>Ordem de Serviço</h1></body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleGeneratePNG = async (id: string) => {
    if (typeof window !== 'undefined' && (window as any).html2canvas) {
      const element = document.getElementById(`schedule-card-${id}`);
      if (element) {
        try {
          const canvas = await (window as any).html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
          const link = document.createElement('a');
          link.download = `OS-${id}.png`;
          link.href = canvas.toDataURL();
          link.click();
        } catch (error) {
          console.error(error);
          alert("Erro ao gerar imagem.");
        }
      }
    }
  };

  // --- Filtering Logic ---
  const filteredSchedules = schedules.filter(s => {
    const matchesSearch = 
      s.clientName.toLowerCase().includes(filters.search.toLowerCase()) ||
      s.displayId.toLowerCase().includes(filters.search.toLowerCase());
    const matchesPriority = filters.priority ? s.priority === filters.priority : true;
    const matchesStatus = filters.status ? s.status === filters.status : true;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  // --- Helpers ---
  const getPriorityColor = (p: ServicePriority) => {
    switch(p) {
      case ServicePriority.URGENTE: return 'border-l-red-500';
      case ServicePriority.ALTA: return 'border-l-orange-500';
      case ServicePriority.MEDIA: return 'border-l-yellow-500';
      default: return 'border-l-blue-500'; // Pequena
    }
  };

  const getPriorityBadge = (p: ServicePriority) => {
    switch(p) {
      case ServicePriority.URGENTE: return 'bg-red-100 text-red-700';
      case ServicePriority.ALTA: return 'bg-orange-100 text-orange-700';
      case ServicePriority.MEDIA: return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Agendamento de Serviço</h2>
          <p className="text-slate-500">Controle de visitas técnicas e manutenção</p>
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
            Novo Agendamento
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
           <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Buscar (Cliente/ID)</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input 
                  type="text" 
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: SERV 01 ou Nome"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
           </div>
           <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Prioridade</label>
              <select 
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={filters.priority}
                onChange={(e) => setFilters({...filters, priority: e.target.value})}
              >
                <option value="">Todas</option>
                {Object.values(ServicePriority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
           </div>
           <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
              <select 
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">Todos</option>
                {Object.values(ScheduleStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
           </div>
        </div>
      )}

      {/* List View */}
      <div className="space-y-4">
        {filteredSchedules.map(s => (
          <div 
            id={`schedule-card-${s.id}`}
            key={s.id} 
            className={`bg-white rounded-xl shadow-sm border border-slate-200 border-l-4 ${getPriorityColor(s.priority)} overflow-hidden`}
          >
            <div className="p-5">
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                
                {/* Left Section: Basic Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">{s.displayId}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${getPriorityBadge(s.priority)}`}>
                       {s.priority}
                    </span>
                    <span className="flex items-center text-xs font-medium text-slate-500">
                      <Calendar size={12} className="mr-1" />
                      {new Date(s.scheduledDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{s.clientName}</h3>
                  <div className="text-sm text-slate-600 flex items-center mb-3">
                    <MapPin size={14} className="mr-1 text-slate-400" />
                    {s.clientAddress}
                  </div>
                  
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-3">
                    <div className="text-sm font-semibold text-slate-700 mb-1">
                      {s.serviceType === ServiceType.OUTROS ? s.serviceTypeOther : s.serviceType}
                    </div>
                    <p className="text-sm text-slate-600 italic">{s.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    <div className="flex items-center">
                      <User size={14} className="mr-1" /> Vendedor: <b>{s.salesperson}</b>
                    </div>
                    <div className="flex items-center">
                      <Briefcase size={14} className="mr-1" /> Equipe: <b>{s.assignedTeam}</b>
                    </div>
                    <div className="flex items-center text-emerald-600 font-bold">
                      <DollarSign size={14} className="mr-1" /> R$ {s.cost.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Right Section: Status & Actions */}
                <div className="flex flex-row md:flex-col items-end justify-between gap-4 pl-4 md:border-l border-slate-100 min-w-[160px]">
                  <div className="w-full">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 text-right md:text-left">Status Atual</label>
                    <select 
                      value={s.status}
                      onChange={(e) => handleStatusChange(s.id, e.target.value as ScheduleStatus)}
                      className={`w-full text-xs font-bold px-3 py-2 rounded-lg border-0 cursor-pointer outline-none ring-1 ring-inset appearance-none text-center ${
                        s.status === ScheduleStatus.RESOLVIDO ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
                        s.status === ScheduleStatus.ANDAMENTO ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                        'bg-amber-50 text-amber-700 ring-amber-600/20'
                      }`}
                    >
                       {Object.values(ScheduleStatus).map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>

                  <div className="flex gap-2">
                     <button type="button" title="Copiar Texto" onClick={(e) => { e.preventDefault(); e.stopPropagation(); copyToClipboard(s); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Copy size={18}/></button>
                     <button type="button" title="Gerar PNG" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleGeneratePNG(s.id); }} className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded"><Download size={18}/></button>
                     <button type="button" title="Imprimir" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePrintPDF(s); }} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded"><Printer size={18}/></button>
                     <button type="button" title="Editar" onClick={(e) => { e.stopPropagation(); handleOpenModal(s); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={18} className="pointer-events-none"/></button>
                     <button 
                        type="button" 
                        title="Excluir" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleDelete(s.id); 
                        }} 
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={18} className="pointer-events-none"/>
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredSchedules.length === 0 && (
           <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
             Nenhum agendamento encontrado.
           </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">
                {editingSchedule ? 'Editar Agendamento' : 'Novo Agendamento'} <span className="text-slate-400 text-sm ml-2">({formData.displayId})</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Client Selection */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cliente Solicitante</label>
                    <select 
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      onChange={handleClientSelect}
                      value={formData.clientId || ''}
                      disabled={!!editingSchedule}
                    >
                      <option value="">Selecione o cliente...</option>
                      {MOCK_CLIENTS_SOURCE.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  {/* Auto-filled Readonly */}
                  <div className="col-span-2 bg-slate-50 p-4 rounded-lg border border-slate-100 grid grid-cols-3 gap-4">
                     <div>
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Vendedor</span>
                       <div className="text-sm font-medium">{formData.salesperson || '-'}</div>
                     </div>
                     <div>
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Telefone</span>
                       <div className="text-sm font-medium">{formData.clientPhone || '-'}</div>
                     </div>
                     <div>
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Endereço</span>
                       <div className="text-sm font-medium truncate" title={formData.clientAddress}>{formData.clientAddress || '-'}</div>
                     </div>
                  </div>

                  {/* Service Details */}
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Serviço</label>
                     <select 
                       className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                       value={formData.serviceType}
                       onChange={e => setFormData({...formData, serviceType: e.target.value as ServiceType})}
                     >
                       {Object.values(ServiceType).map(t => <option key={t} value={t}>{t}</option>)}
                     </select>
                  </div>

                  {formData.serviceType === ServiceType.OUTROS && (
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Especifique (Outros)</label>
                        <input 
                          type="text"
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                          value={formData.serviceTypeOther || ''}
                          onChange={e => setFormData({...formData, serviceTypeOther: e.target.value})}
                          placeholder="Digite o tipo de serviço..."
                        />
                     </div>
                  )}

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Especificação do Serviço</label>
                    <textarea 
                      rows={3}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Detalhes técnicos do que precisa ser feito..."
                      required
                    />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Equipe Responsável</label>
                     <select 
                       className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                       value={formData.assignedTeam}
                       onChange={e => setFormData({...formData, assignedTeam: e.target.value})}
                     >
                       <option value="">Selecione a equipe...</option>
                       {MOCK_TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                     </select>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Prioridade</label>
                     <select 
                       className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                       value={formData.priority}
                       onChange={e => setFormData({...formData, priority: e.target.value as ServicePriority})}
                     >
                       {Object.values(ServicePriority).map(p => <option key={p} value={p}>{p}</option>)}
                     </select>
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
                     <label className="block text-sm font-medium text-slate-700 mb-1">Valor do Serviço (R$)</label>
                     <input 
                       type="number"
                       step="0.01"
                       className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                       value={formData.cost}
                       onChange={e => setFormData({...formData, cost: parseFloat(e.target.value)})}
                     />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Observações Gerais</label>
                    <textarea 
                      rows={2}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.observation}
                      onChange={e => setFormData({...formData, observation: e.target.value})}
                    />
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
                  Salvar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceSchedules;
