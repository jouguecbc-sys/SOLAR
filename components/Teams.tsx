
import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Star, 
  Save, 
  X, 
  MessageSquare, 
  Wallet, 
  User
} from 'lucide-react';
import { Team, TeamFeedback, SatisfactionLevel } from '../types';

// Mock Data
const MOCK_TEAMS: Team[] = [
  {
    id: '1',
    leaderName: 'Roberto Silva (Alpha)',
    pixKey: '123.456.789-00',
    feedbacks: [
      {
        id: 'f1',
        date: '2023-10-10',
        comment: 'Equipe muito educada e rápida.',
        level: SatisfactionLevel.MUITO_SATISFEITO
      },
      {
        id: 'f2',
        date: '2023-10-15',
        comment: 'Deixaram um pouco de sujeira no quintal.',
        level: SatisfactionLevel.REGULAR
      }
    ]
  },
  {
    id: '2',
    leaderName: 'Marcos Santos (Beta)',
    pixKey: 'marcos.beta@email.com',
    feedbacks: [
      {
        id: 'f3',
        date: '2023-10-20',
        comment: 'Instalação perfeita.',
        level: SatisfactionLevel.SATISFEITO
      }
    ]
  },
  {
    id: '3',
    leaderName: 'Júlio Cesar (Gamma)',
    pixKey: '11999998888',
    feedbacks: [
      {
        id: 'f4',
        date: '2023-10-22',
        comment: 'Excelente trabalho, muito profissionais.',
        level: SatisfactionLevel.MUITO_SATISFEITO
      },
      {
        id: 'f5',
        date: '2023-10-25',
        comment: 'Chegaram no horário e explicaram tudo.',
        level: SatisfactionLevel.MUITO_SATISFEITO
      }
    ]
  }
];

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Team>>({
    leaderName: '',
    pixKey: '',
    feedbacks: []
  });

  // New Feedback Form State inside Modal
  const [newFeedback, setNewFeedback] = useState<{comment: string, level: SatisfactionLevel}>({
    comment: '',
    level: SatisfactionLevel.SATISFEITO
  });

  const handleOpenModal = (team?: Team) => {
    if (team) {
      setEditingTeam(team);
      setFormData({ ...team });
    } else {
      setEditingTeam(null);
      setFormData({
        leaderName: '',
        pixKey: '',
        feedbacks: []
      });
    }
    setNewFeedback({ comment: '', level: SatisfactionLevel.SATISFEITO });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeam(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeam) {
      setTeams(prev => prev.map(t => t.id === editingTeam.id ? { ...t, ...formData } as Team : t));
    } else {
      const newTeam = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as Team;
      setTeams(prev => [...prev, newTeam]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      setTeams(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleAddFeedback = () => {
    if (!newFeedback.comment) return alert("Preencha o comentário");
    
    const feedback: TeamFeedback = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      comment: newFeedback.comment,
      level: newFeedback.level
    };

    setFormData({
      ...formData,
      feedbacks: [feedback, ...(formData.feedbacks || [])]
    });

    setNewFeedback({ comment: '', level: SatisfactionLevel.SATISFEITO });
  };

  const removeFeedback = (fid: string) => {
    setFormData({
      ...formData,
      feedbacks: formData.feedbacks?.filter(f => f.id !== fid)
    });
  };

  // Calculate Average Satisfaction for Display
  const getSatisfactionScore = (feedbacks: TeamFeedback[] | undefined) => {
    if (!feedbacks || feedbacks.length === 0) return 0;
    const map: Record<SatisfactionLevel, number> = {
      [SatisfactionLevel.MUITO_INSATISFEITO]: 1,
      [SatisfactionLevel.INSATISFEITO]: 2,
      [SatisfactionLevel.REGULAR]: 3,
      [SatisfactionLevel.SATISFEITO]: 4,
      [SatisfactionLevel.MUITO_SATISFEITO]: 5,
    };
    const total = feedbacks.reduce((acc, curr) => acc + map[curr.level], 0);
    return (total / feedbacks.length).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Gestão de Equipes</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Nova Equipe
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => (
          <div key={team.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{team.leaderName}</h3>
                    <div className="flex items-center text-slate-500 text-sm mt-1">
                      <Wallet size={14} className="mr-1" />
                      <span className="truncate max-w-[150px]">{team.pixKey}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg">
                    <Star size={14} className="text-amber-500 fill-amber-500 mr-1" />
                    <span className="text-sm font-bold text-amber-700">{getSatisfactionScore(team.feedbacks)}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">{team.feedbacks?.length || 0} avaliações</span>
                </div>
              </div>

              {/* Feedback Preview */}
              <div className="bg-slate-50 rounded-lg p-3 mb-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center">
                  <MessageSquare size={12} className="mr-1" />
                  Última Avaliação
                </h4>
                {team.feedbacks && team.feedbacks.length > 0 ? (
                  <div className="text-sm text-slate-600 italic">
                    "{team.feedbacks[0].comment}"
                    <div className="mt-1 text-xs text-slate-400 text-right">
                       - {team.feedbacks[0].level}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 text-center py-2">Sem avaliações registradas</div>
                )}
              </div>

              <div className="flex gap-2 mt-4 border-t border-slate-100 pt-4">
                 <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleOpenModal(team); }}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Edit2 size={16} className="mr-2 pointer-events-none" />
                  Editar
                </button>
                <button 
                  type="button"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleDelete(team.id); 
                  }}
                  className="flex items-center justify-center px-3 py-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={18} className="pointer-events-none" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">
                {editingTeam ? 'Editar Equipe & Satisfação' : 'Nova Equipe'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Líder da Equipe</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Nome do líder"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.leaderName}
                    onChange={e => setFormData({...formData, leaderName: e.target.value})}
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Chave Pix</label>
                  <input 
                    required
                    type="text" 
                    placeholder="CPF, Email ou Telefone"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.pixKey}
                    onChange={e => setFormData({...formData, pixKey: e.target.value})}
                  />
                </div>
              </div>

              {/* Satisfaction Section */}
              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                   <h4 className="font-semibold text-slate-800 flex items-center">
                     <Star size={18} className="mr-2 text-amber-500" />
                     Histórico de Satisfação
                   </h4>
                   <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      {formData.feedbacks?.length || 0} registros
                   </span>
                </div>

                {/* Add New Feedback */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
                   <p className="text-xs font-bold text-slate-500 uppercase mb-3">Adicionar Nova Avaliação</p>
                   <div className="grid grid-cols-1 gap-3">
                      <select 
                        className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={newFeedback.level}
                        onChange={e => setNewFeedback({...newFeedback, level: e.target.value as SatisfactionLevel})}
                      >
                        {Object.values(SatisfactionLevel).map(lvl => (
                          <option key={lvl} value={lvl}>{lvl}</option>
                        ))}
                      </select>
                      <textarea 
                        rows={2}
                        placeholder="Digite o elogio, crítica ou reclamação..."
                        className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={newFeedback.comment}
                        onChange={e => setNewFeedback({...newFeedback, comment: e.target.value})}
                      />
                      <button 
                        type="button"
                        onClick={handleAddFeedback}
                        className="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Adicionar Registro
                      </button>
                   </div>
                </div>

                {/* List Feedbacks */}
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {formData.feedbacks?.map((fb) => (
                    <div key={fb.id} className="flex justify-between items-start p-3 bg-white border border-slate-100 rounded-lg hover:bg-slate-50">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                           <span className={`text-xs font-bold px-2 py-0.5 rounded-full 
                             ${fb.level === SatisfactionLevel.MUITO_SATISFEITO ? 'bg-emerald-100 text-emerald-700' :
                               fb.level === SatisfactionLevel.SATISFEITO ? 'bg-green-100 text-green-700' :
                               fb.level === SatisfactionLevel.REGULAR ? 'bg-yellow-100 text-yellow-700' :
                               'bg-red-100 text-red-700'}`}>
                             {fb.level}
                           </span>
                           <span className="text-[10px] text-slate-400">{new Date(fb.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <p className="text-sm text-slate-600">{fb.comment}</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeFeedback(fb.id)}
                        className="text-slate-300 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {(!formData.feedbacks || formData.feedbacks.length === 0) && (
                    <div className="text-center text-slate-400 text-sm py-2">Nenhuma avaliação registrada ainda.</div>
                  )}
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
                  Salvar Equipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
