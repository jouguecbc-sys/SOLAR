
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Edit2, 
  Trash2, 
  Zap, 
  MapPin,
  Save,
  X,
  Users
} from 'lucide-react';
import { Client, Salesperson, InstallStatus } from '../types';

// Helper to format currency/numbers
const formatKwp = (val: number) => val.toFixed(2).replace('.', ',') + ' kWp';

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
    observation: 'Telhado cerâmico, acesso difícil.',
    installStatus: InstallStatus.CONCLUIDA,
    assignedTeam: 'Equipe Alpha'
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

// Date Calculation Helpers
const addDays = (dateStr: string, days: number): string => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days + 1); // +1 for timezone adjustment
  return date.toLocaleDateString('pt-BR');
};

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  // Filter State
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    salesperson: '',
    dateStart: '',
    dateEnd: ''
  });

  // Form State
  const [formData, setFormData] = useState<Partial<Client>>({
    salesperson: Salesperson.ISA,
    installStatus: InstallStatus.PENDENTE
  });

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({ ...client });
    } else {
      setEditingClient(null);
      setFormData({
        salesperson: Salesperson.ISA,
        installStatus: InstallStatus.PENDENTE,
        panelQty: 0,
        powerKwp: 0,
        name: '',
        address: '',
        phone: '',
        contractDate: '',
        observation: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-assign team if status is concluded
    let finalData = { ...formData };
    if (finalData.installStatus === InstallStatus.CONCLUIDA && !finalData.assignedTeam) {
      finalData.assignedTeam = "Equipe Padrão (Auto)";
    }

    if (editingClient) {
      setClients(prev => prev.map(c => c.id === editingClient.id ? { ...c, ...finalData } as Client : c));
    } else {
      const newClient = {
        ...finalData,
        id: Math.random().toString(36).substr(2, 9),
      } as Client;
      setClients(prev => [...prev, newClient]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      setClients(prev => prev.filter(c => c.id !== id));
    }
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      c.address.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = filters.status ? c.installStatus === filters.status : true;
    const matchesSales = filters.salesperson ? c.salesperson === filters.salesperson : true;
    
    let matchesDate = true;
    if (filters.dateStart && c.contractDate < filters.dateStart) matchesDate = false;
    if (filters.dateEnd && c.contractDate > filters.dateEnd) matchesDate = false;

    return matchesSearch && matchesStatus && matchesSales && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-800 self-start sm:self-center">Clientes</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center px-4 py-2 border rounded-lg transition-colors flex-1 sm:flex-none ${
                showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Filter size={18} className="mr-2" />
              Filtro Avançado
            </button>
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-colors flex-1 sm:flex-none"
            >
              <Plus size={18} className="mr-2" />
              Novo Cliente
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">Buscar Nome/Endereço</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Buscar..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Vendedor Responsável</label>
              <select 
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={filters.salesperson}
                onChange={(e) => setFilters({...filters, salesperson: e.target.value})}
              >
                <option value="">Todos</option>
                {Object.values(Salesperson).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Status da Instalação</label>
              <select 
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">Todos</option>
                {Object.values(InstallStatus).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Contrato (De - Até)</label>
              <div className="flex gap-2">
                 <input 
                  type="date" 
                  className="w-1/2 px-2 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={filters.dateStart}
                  onChange={(e) => setFilters({...filters, dateStart: e.target.value})}
                />
                <input 
                  type="date" 
                  className="w-1/2 px-2 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={filters.dateEnd}
                  onChange={(e) => setFilters({...filters, dateEnd: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sistema</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Prazos Contratuais</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Responsável</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800">{client.name}</span>
                      <div className="flex items-center text-xs text-slate-500 mt-1">
                        <MapPin size={12} className="mr-1" />
                        <span className="truncate max-w-[150px]" title={client.address}>{client.address}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{client.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">
                      <span className="font-semibold">{client.panelQty}</span> Placas
                    </div>
                    <div className="flex items-center text-xs text-blue-600 font-medium mt-1">
                      <Zap size={12} className="mr-1" />
                      {formatKwp(client.powerKwp)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-xs space-y-1">
                      <div className="flex justify-between w-32">
                         <span className="text-slate-500">Contrato:</span>
                         <span className="font-medium">{new Date(client.contractDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between w-32">
                        <span className="text-amber-600">Prazo 60d:</span>
                        <span className="font-medium">{addDays(client.contractDate, 60)}</span>
                      </div>
                      <div className="flex justify-between w-32">
                        <span className="text-red-600">Prazo 90d:</span>
                        <span className="font-medium">{addDays(client.contractDate, 90)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mr-2">
                        {client.salesperson.charAt(0)}
                      </div>
                      <span className="text-sm text-slate-700">
                        {client.salesperson === Salesperson.OUTROS ? client.salespersonOther : client.salesperson}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${client.installStatus === InstallStatus.CONCLUIDA ? 'bg-emerald-100 text-emerald-800' : 
                        client.installStatus === InstallStatus.EM_ANDAMENTO ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {client.installStatus}
                    </span>
                    {client.installStatus === InstallStatus.CONCLUIDA && (
                      <div className="flex items-center text-[10px] text-slate-500 mt-1 bg-slate-100 px-2 py-0.5 rounded">
                        <Users size={10} className="mr-1"/>
                        {client.assignedTeam || 'Não atribuído'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(client); }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={18} className="pointer-events-none" />
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleDelete(client.id); 
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} className="pointer-events-none" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Nenhum cliente encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">
                {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                  <input 
                    required
                    type="text" 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
                  <input 
                    required
                    type="text" 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                  <input 
                    required
                    type="tel" 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data do Contrato</label>
                  <input 
                    required
                    type="date" 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.contractDate}
                    onChange={e => setFormData({...formData, contractDate: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Qtd. Placas</label>
                  <input 
                    required
                    type="number" 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.panelQty}
                    onChange={e => setFormData({...formData, panelQty: Number(e.target.value)})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Potência (kWp)</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.powerKwp}
                    onChange={e => setFormData({...formData, powerKwp: Number(e.target.value)})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vendedor Responsável</label>
                  <select 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.salesperson}
                    onChange={e => setFormData({...formData, salesperson: e.target.value as Salesperson})}
                  >
                    {Object.values(Salesperson).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {formData.salesperson === Salesperson.OUTROS && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Vendedor</label>
                    <input 
                      type="text" 
                      placeholder="Preencher nome..."
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.salespersonOther || ''}
                      onChange={e => setFormData({...formData, salespersonOther: e.target.value})}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status Instalação</label>
                  <select 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.installStatus}
                    onChange={e => setFormData({...formData, installStatus: e.target.value as InstallStatus})}
                  >
                    {Object.values(InstallStatus).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                
                {/* Auto-Calculation Read-only Section */}
                {formData.contractDate && (
                  <div className="col-span-2 grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-xs text-slate-500 uppercase font-bold">Prazo 60 Dias</span>
                      <div className="text-sm font-medium text-slate-700">{addDays(formData.contractDate, 60)}</div>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 uppercase font-bold">Prazo 90 Dias</span>
                      <div className="text-sm font-medium text-slate-700">{addDays(formData.contractDate, 90)}</div>
                    </div>
                  </div>
                )}

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Observação</label>
                  <textarea 
                    rows={3}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.observation || ''}
                    onChange={e => setFormData({...formData, observation: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg mr-3 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
