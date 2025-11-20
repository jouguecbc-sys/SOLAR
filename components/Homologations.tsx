
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Check, 
  X as XIcon,
  Save,
  Calendar,
  FileCheck,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { 
  Homologation, 
  HomologationStatus, 
  Client, 
  Salesperson, 
  InstallStatus 
} from '../types';

// Mock Data Sources
const MOCK_CLIENTS_SOURCE: Client[] = [
  {
    id: '1',
    name: 'Carlos Oliveira',
    address: 'Rua das Flores, 123',
    phone: '(11) 99999-8888',
    salesperson: Salesperson.ISA,
    panelQty: 12,
    powerKwp: 6.6,
    contractDate: '2023-10-01',
    observation: '',
    installStatus: InstallStatus.CONCLUIDA,
    installationCompletionDate: '2023-10-20' // Simulated data
  },
  {
    id: '2',
    name: 'Ana Souza',
    address: 'Av. Paulista, 2000',
    phone: '(11) 97777-6666',
    salesperson: Salesperson.PEDRO,
    panelQty: 24,
    powerKwp: 13.2,
    contractDate: '2023-10-15',
    observation: '',
    installStatus: InstallStatus.CONCLUIDA,
    installationCompletionDate: '2023-11-05'
  },
  {
    id: '3',
    name: 'Roberto Justus',
    address: 'Rua Oscar Freire, 500',
    phone: '(11) 91111-2222',
    salesperson: Salesperson.LAYS,
    panelQty: 50,
    powerKwp: 25.0,
    contractDate: '2023-11-01',
    observation: '',
    installStatus: InstallStatus.EM_ANDAMENTO
  }
];

const MOCK_HOMOLOGATIONS: Homologation[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Carlos Oliveira',
    installationCompletionDate: '2023-10-20',
    enteredContract: true,
    status: HomologationStatus.HOMOLOGADO
  }
];

const Homologations: React.FC = () => {
  const [homologations, setHomologations] = useState<Homologation[]>(MOCK_HOMOLOGATIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    contractEntry: '' // 'true', 'false' or ''
  });

  // Form State
  const [formData, setFormData] = useState<Partial<Homologation>>({
    status: HomologationStatus.AGUARDANDO,
    enteredContract: false
  });

  const handleOpenModal = (item?: Homologation) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ ...item });
    } else {
      setEditingId(null);
      setFormData({
        status: HomologationStatus.AGUARDANDO,
        enteredContract: false,
        clientId: '',
        clientName: '',
        installationCompletionDate: ''
      });
    }
    setIsModalOpen(true);
  };

  // Auto-fill logic
  const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    const client = MOCK_CLIENTS_SOURCE.find(c => c.id === clientId);
    
    if (client) {
      setFormData(prev => ({
        ...prev,
        clientId: client.id,
        clientName: client.name,
        installationCompletionDate: client.installationCompletionDate || new Date().toISOString().split('T')[0]
      }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setHomologations(prev => prev.map(h => h.id === editingId ? { ...h, ...formData } as Homologation : h));
    } else {
      const newItem = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9)
      } as Homologation;
      setHomologations(prev => [...prev, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      setHomologations(prev => prev.filter(h => h.id !== id));
    }
  };

  // Card Direct Actions
  const toggleContractEntry = (id: string, currentVal: boolean) => {
    setHomologations(prev => prev.map(h => h.id === id ? { ...h, enteredContract: !currentVal } : h));
  };

  const changeStatus = (id: string, newStatus: HomologationStatus) => {
    setHomologations(prev => prev.map(h => h.id === id ? { ...h, status: newStatus } : h));
  };

  // Filter Logic
  const filteredList = homologations.filter(h => {
    const matchesSearch = h.clientName.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status ? h.status === filters.status : true;
    const matchesContract = filters.contractEntry 
      ? (filters.contractEntry === 'true' ? h.enteredContract : !h.enteredContract)
      : true;
    return matchesSearch && matchesStatus && matchesContract;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileCheck className="text-purple-600" />
            Homologação
          </h2>
          <p className="text-slate-500 text-sm">Acompanhamento de Vistoria Neoenergia</p>
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
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-md transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Nova Homologação
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-100 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Buscar Cliente</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                placeholder="Nome do cliente..."
              />
            </div>
          </div>
          <div>
             <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
             <select 
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
             >
                <option value="">Todos</option>
                {Object.values(HomologationStatus).map(s => <option key={s} value={s}>{s}</option>)}
             </select>
          </div>
          <div>
             <label className="block text-xs font-medium text-slate-500 mb-1">Entrada no Contrato</label>
             <select 
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                value={filters.contractEntry}
                onChange={(e) => setFilters({...filters, contractEntry: e.target.value})}
             >
                <option value="">Todos</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
             </select>
          </div>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="p-5 border-b border-slate-50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-slate-800 truncate pr-2">{item.clientName}</h3>
                <button 
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleOpenModal(item); }}
                  className="text-slate-300 hover:text-purple-600 transition-colors"
                >
                  <Edit2 size={16} className="pointer-events-none" />
                </button>
              </div>
              <div className="flex items-center text-sm text-slate-500">
                 <Calendar size={14} className="mr-1" />
                 <span>Instalação: {new Date(item.installationCompletionDate).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            {/* Body Actions */}
            <div className="p-5 flex-1 space-y-4">
               {/* Contract Entry Toggle */}
               <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">Entrada no Contrato?</span>
                  <button 
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleContractEntry(item.id, item.enteredContract); }}
                    className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      item.enteredContract 
                        ? 'bg-emerald-100 text-emerald-700 pr-2 pl-3' 
                        : 'bg-slate-200 text-slate-500 pr-3 pl-2'
                    }`}
                  >
                    {item.enteredContract ? (
                      <>SIM <Check size={14} className="ml-1" /></>
                    ) : (
                      <><XIcon size={14} className="mr-1" /> NÃO</>
                    )}
                  </button>
               </div>

               {/* Status Selector */}
               <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Status Atual</label>
                  <select 
                    value={item.status}
                    onChange={(e) => changeStatus(item.id, e.target.value as HomologationStatus)}
                    className={`w-full font-bold text-sm px-3 py-2.5 rounded-lg border-0 cursor-pointer outline-none ring-1 ring-inset transition-all ${
                      item.status === HomologationStatus.HOMOLOGADO ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
                      item.status === HomologationStatus.AGENDADA ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                      'bg-amber-50 text-amber-700 ring-amber-600/20'
                    }`}
                    onClick={(e) => { e.stopPropagation(); }}
                  >
                    {Object.values(HomologationStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
               </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-5 py-3 flex justify-end border-t border-slate-100">
               <button 
                 type="button"
                 onClick={(e) => { 
                   e.stopPropagation(); 
                   handleDelete(item.id); 
                 }}
                 className="text-slate-400 hover:text-red-500 flex items-center text-xs font-medium transition-colors"
               >
                 <Trash2 size={14} className="mr-1 pointer-events-none" /> Excluir
               </button>
            </div>
          </div>
        ))}

        {filteredList.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
            Nenhum registro encontrado.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">
                {editingId ? 'Editar Homologação' : 'Nova Homologação'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XIcon size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cliente (Preenchimento Automático)</label>
                  <select 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    onChange={handleClientSelect}
                    value={formData.clientId || ''}
                    disabled={!!editingId}
                  >
                    <option value="">Selecione...</option>
                    {MOCK_CLIENTS_SOURCE.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
               </div>

               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data Conclusão Instalação</label>
                  <input 
                    type="date" 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50"
                    value={formData.installationCompletionDate}
                    onChange={(e) => setFormData({...formData, installationCompletionDate: e.target.value})}
                  />
               </div>

               <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg">
                  <div 
                    onClick={() => setFormData({...formData, enteredContract: !formData.enteredContract})}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${formData.enteredContract ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                     <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.enteredContract ? 'left-7' : 'left-1'}`} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Entrada no Contrato</span>
               </div>

               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status Inicial</label>
                  <select 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as HomologationStatus})}
                  >
                    {Object.values(HomologationStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
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
                  className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 shadow-sm transition-colors flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homologations;
