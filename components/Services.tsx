
import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Download, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  X,
  Save,
  MapPin,
  User,
  Headphones
} from 'lucide-react';
import { ServiceTicket, ServiceStatus, Attendant, Client, Salesperson, InstallStatus } from '../types';

// Helper to simulate client data (In a real app, this would come from a context or API)
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

const MOCK_SERVICES: ServiceTicket[] = [
  {
    id: '1',
    displayId: '01',
    date: '2023-10-25',
    clientId: '1',
    clientName: 'Carlos Oliveira',
    clientAddress: 'Rua das Flores, 123 - Jardim Sol',
    salesperson: 'Isa',
    issue: 'Inversor apresentando erro 403 intermitente.',
    status: ServiceStatus.A_RESOLVER,
    attendant: Attendant.RAFAEL
  },
  {
    id: '2',
    displayId: '02',
    date: '2023-10-26',
    clientId: '2',
    clientName: 'Ana Souza',
    clientAddress: 'Av. Paulista, 2000 - Bela Vista',
    salesperson: 'Pedro',
    issue: 'Cliente solicita explicação sobre o aplicativo de monitoramento.',
    status: ServiceStatus.RESOLVIDO,
    attendant: Attendant.BRUNA,
    finishedDate: '2023-10-26'
  }
];

const Services: React.FC = () => {
  const [services, setServices] = useState<ServiceTicket[]>(MOCK_SERVICES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceTicket | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<ServiceTicket>>({
    date: new Date().toISOString().split('T')[0],
    status: ServiceStatus.A_RESOLVER,
    attendant: Attendant.RAFAEL
  });

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const generateId = () => {
    const maxId = services.reduce((max, s) => Math.max(max, parseInt(s.displayId)), 0);
    return String(maxId + 1).padStart(2, '0');
  };

  const handleOpenModal = (service?: ServiceTicket) => {
    if (service) {
      setEditingService(service);
      setFormData({ ...service });
    } else {
      setEditingService(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        status: ServiceStatus.A_RESOLVER,
        attendant: Attendant.RAFAEL,
        issue: '',
        clientId: '',
        clientName: '',
        clientAddress: '',
        salesperson: ''
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
        salesperson: client.salesperson === Salesperson.OUTROS ? client.salespersonOther : client.salesperson
      }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finishedDate = formData.status === ServiceStatus.RESOLVIDO 
      ? (formData.finishedDate || new Date().toISOString().split('T')[0]) 
      : undefined;

    if (editingService) {
      setServices(prev => prev.map(s => s.id === editingService.id 
        ? { ...s, ...formData, finishedDate } as ServiceTicket 
        : s));
    } else {
      const newService: ServiceTicket = {
        ...formData as ServiceTicket,
        id: Math.random().toString(36).substr(2, 9),
        displayId: generateId(),
        finishedDate
      };
      setServices(prev => [...prev, newService]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      setServices(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleStatusChange = (id: string, newStatus: ServiceStatus) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        const finishedDate = newStatus === ServiceStatus.RESOLVIDO 
          ? new Date().toISOString().split('T')[0] 
          : undefined;
        return { ...s, status: newStatus, finishedDate };
      }
      return s;
    }));
  };

  const handlePrint = (service: ServiceTicket) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      // Print content omitted for brevity
      printWindow.document.write('<html><body><h1>Imprimindo...</h1></body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleGeneratePNG = async (id: string) => {
    if (typeof window !== 'undefined' && (window as any).html2canvas) {
      const element = document.getElementById(`service-card-${id}`);
      if (element) {
        try {
          const canvas = await (window as any).html2canvas(element, { scale: 2 });
          const link = document.createElement('a');
          link.download = `atendimento-${id}.png`;
          link.href = canvas.toDataURL();
          link.click();
        } catch (error) {
          console.error("Error generating PNG:", error);
          alert("Erro ao gerar imagem.");
        }
      }
    } else {
      alert("Biblioteca de imagem carregando... tente novamente em alguns segundos.");
    }
  };

  const filteredServices = services.filter(s => 
    s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter ? s.status === statusFilter : true)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Atendimento ao Cliente</h2>
          <p className="text-slate-500">Gestão de chamados e suporte técnico</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Novo Atendimento
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos Status</option>
          {Object.values(ServiceStatus).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {filteredServices.map(service => (
          <div 
            id={`service-card-${service.displayId}`} 
            key={service.id} 
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col md:flex-row"
          >
            {/* Status Indicator Strip */}
            <div className={`w-full md:w-2 h-2 md:h-auto flex-shrink-0 ${
              service.status === ServiceStatus.RESOLVIDO ? 'bg-emerald-500' : 
              service.status === ServiceStatus.RESOLVENDO ? 'bg-blue-500' : 'bg-amber-500'
            }`} />
            
            <div className="p-6 flex-1 flex flex-col gap-4">
              {/* Header Line */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">#{service.displayId}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-medium text-slate-500 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {new Date(service.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{service.clientName}</h3>
                  <div className="flex items-center text-sm text-slate-500 mt-1">
                    <MapPin size={14} className="mr-1" />
                    {service.clientAddress}
                  </div>
                </div>
                
                {/* Quick Status Action */}
                <div className="flex items-center gap-2">
                   <select
                    value={service.status}
                    onChange={(e) => handleStatusChange(service.id, e.target.value as ServiceStatus)}
                    className={`text-xs font-bold uppercase px-3 py-1.5 rounded-full border-0 cursor-pointer outline-none ring-1 ring-inset ${
                      service.status === ServiceStatus.RESOLVIDO ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
                      service.status === ServiceStatus.RESOLVENDO ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                      'bg-amber-50 text-amber-700 ring-amber-600/20'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                   >
                      {Object.values(ServiceStatus).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                   </select>
                </div>
              </div>

              {/* Issue Content */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-sm text-slate-700 line-clamp-2">
                  <span className="font-semibold text-slate-900">Problema: </span>
                  {service.issue}
                </p>
              </div>

              {/* Footer Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-50">
                <div className="flex gap-4 text-xs text-slate-500">
                  <div className="flex items-center">
                    <Headphones size={14} className="mr-1" />
                    Atendente: <span className="font-medium ml-1 text-slate-700">{service.attendant}</span>
                  </div>
                  <div className="flex items-center">
                    <User size={14} className="mr-1" />
                    Vendedor: <span className="font-medium ml-1 text-slate-700">{service.salesperson}</span>
                  </div>
                  {service.finishedDate && (
                    <div className="flex items-center text-emerald-600">
                      <CheckCircle size={14} className="mr-1" />
                      Concluído em: {new Date(service.finishedDate).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleGeneratePNG(service.displayId); }}
                    className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                    title="Baixar PNG"
                  >
                    <Download size={18} />
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePrint(service); }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                    title="Imprimir PDF"
                  >
                    <Printer size={18} />
                  </button>
                  <div className="w-px h-4 bg-slate-200 mx-1" />
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleOpenModal(service); }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} className="pointer-events-none" />
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleDelete(service.id); 
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={18} className="pointer-events-none" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredServices.length === 0 && (
          <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-slate-200 border-dashed">
            Nenhum atendimento encontrado.
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">
                {editingService ? `Editar Atendimento #${editingService.displayId}` : 'Novo Atendimento'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Auto-Fill Section */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cliente (Auto-preenchimento)</label>
                  <select 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={handleClientSelect}
                    value={formData.clientId || ''}
                    disabled={!!editingService} // Disable client change on edit to prevent data mismatch
                  >
                    <option value="">Selecione um cliente...</option>
                    {MOCK_CLIENTS_SOURCE.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>

                {/* Read-only Auto-filled fields */}
                <div className="bg-slate-50 p-4 rounded-lg col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-100">
                   <div>
                      <span className="text-xs font-bold text-slate-400 uppercase">Vendedor</span>
                      <div className="font-medium text-slate-700">{formData.salesperson || '-'}</div>
                   </div>
                   <div>
                      <span className="text-xs font-bold text-slate-400 uppercase">Endereço</span>
                      <div className="font-medium text-slate-700 truncate" title={formData.clientAddress}>{formData.clientAddress || '-'}</div>
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data Solicitação</label>
                  <input 
                    type="date" 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Atendente</label>
                  <select 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.attendant}
                    onChange={e => setFormData({...formData, attendant: e.target.value as Attendant})}
                  >
                    {Object.values(Attendant).map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Descrição do Problema</label>
                  <textarea 
                    rows={4}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.issue}
                    onChange={e => setFormData({...formData, issue: e.target.value})}
                    placeholder="Descreva o problema relatado pelo cliente..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as ServiceStatus})}
                  >
                    {Object.values(ServiceStatus).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {formData.status === ServiceStatus.RESOLVIDO && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Data Conclusão</label>
                    <input 
                      type="date" 
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.finishedDate || new Date().toISOString().split('T')[0]}
                      onChange={e => setFormData({...formData, finishedDate: e.target.value})}
                    />
                  </div>
                )}
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
                  Salvar Atendimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
