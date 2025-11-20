
import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Download, 
  Upload, 
  RefreshCw, 
  Trash2, 
  FileText, 
  FileSpreadsheet, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Database
} from 'lucide-react';

const Settings: React.FC = () => {
  const [autoBackup, setAutoBackup] = useState(true);
  const [lastBackup, setLastBackup] = useState<string>('Hoje, 09:00');
  const [isResetting, setIsResetting] = useState(false);

  // Simulate Automatic Backup Timer
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      // Check if it's 09:00 AM (simple simulation)
      if (autoBackup && now.getHours() === 9 && now.getMinutes() === 0 && now.getSeconds() === 0) {
        console.log("Iniciando backup automático...");
        setLastBackup(`Hoje, ${now.toLocaleTimeString()}`);
        // In a real app, this would trigger the download/save function
      }
    };
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [autoBackup]);

  const handleExportExcel = () => {
    // Simulating Data Aggregation from all modules
    const data = [
      ["Tipo", "ID", "Nome", "Data", "Status", "Valor"],
      ["Cliente", "1", "Carlos Oliveira", "2023-10-01", "Concluída", "-"],
      ["Cliente", "2", "Ana Souza", "2023-10-15", "Em Andamento", "-"],
      ["Instalação", "INST 01", "Carlos Oliveira", "2023-10-10", "Resolvido", "600.00"],
      ["Financeiro", "FIN 01", "Pagamento Alpha", "2023-10-20", "Pago", "600.00"],
      ["Equipe", "1", "Roberto Alpha", "-", "Ativo", "-"]
    ];
    
    const csvContent = data.map(e => e.join(";")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `backup_sistema_completo_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Backup Completo do Sistema</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              h1 { border-bottom: 2px solid #333; padding-bottom: 10px; }
              .section { margin-bottom: 30px; border: 1px solid #eee; padding: 15px; border-radius: 5px; }
              .section h3 { margin-top: 0; color: #333; }
              .timestamp { color: #666; font-size: 12px; margin-bottom: 20px; }
              .warning { background: #fff3cd; padding: 10px; border: 1px solid #ffeeba; color: #856404; margin-bottom: 20px; }
              pre { background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 11px; }
            </style>
          </head>
          <body>
            <h1>Backup do Sistema SolarFlow</h1>
            <div class="timestamp">Gerado em: ${new Date().toLocaleString()}</div>
            <div class="warning">Este documento contém um resumo técnico de todos os dados ativos no sistema para fins de arquivamento.</div>
            
            <div class="section">
              <h3>Estatísticas Gerais</h3>
              <ul>
                <li>Clientes Registrados: 2</li>
                <li>Equipes Ativas: 3</li>
                <li>Instalações: 3 (2 Concluídas)</li>
                <li>Registros Financeiros: 2</li>
              </ul>
            </div>
            
            <div class="section">
              <h3>Dados Brutos (JSON Formatado)</h3>
              <p>Abaixo segue a estrutura de dados para restauração técnica:</p>
              <pre>${JSON.stringify({ 
                  system: "SolarFlow", 
                  version: "1.0", 
                  exportedAt: new Date().toISOString(),
                  modules: ["clients", "teams", "financial", "installations"],
                  checksum: "abc-123-mock" 
                }, null, 2)}</pre>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulation of import process
      const confirmImport = window.confirm(`Deseja restaurar o backup a partir de "${file.name}"? Os dados atuais serão sobrescritos.`);
      if (confirmImport) {
        alert(`Arquivo ${file.name} carregado com sucesso. O sistema foi restaurado para a versão do backup.`);
        // Here you would parse the CSV/JSON and update the state in a real app
      }
    }
  };

  const handleResetSystem = () => {
    if (window.confirm("ATENÇÃO: Esta ação apagará TODOS os dados do sistema (Clientes, Financeiro, Histórico). Esta ação é irreversível.")) {
      const verification = prompt("Para confirmar, digite 'ZERAR SISTEMA' na caixa abaixo:");
      if (verification === "ZERAR SISTEMA") {
        setIsResetting(true);
        // Simulate API call / Processing delay
        setTimeout(() => {
          alert("Sistema reiniciado com sucesso! Todos os dados foram limpos.");
          setIsResetting(false);
          window.location.reload(); // Reload to reset state in this demo
        }, 1500);
      } else {
        alert("Confirmação incorreta. Ação cancelada.");
      }
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Database className="text-slate-600" />
          Configuração do Sistema
        </h2>
        <p className="text-slate-500">Backup, Restauração e Manutenção de Dados</p>
      </div>

      {/* Automatic Backup Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Clock size={20} className="text-blue-500" />
              Backup Automático
            </h3>
            <p className="text-sm text-slate-500">O sistema gera um backup PDF/Dados diariamente às 09:00.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">Último: {lastBackup}</span>
            <button 
              onClick={() => setAutoBackup(!autoBackup)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoBackup ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoBackup ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
        {autoBackup && (
           <div className="p-4 bg-blue-50 flex items-center gap-3 text-blue-700 text-sm border-t border-blue-100">
              <CheckCircle size={18} />
              <span>O agendamento está ativo. Mantenha o sistema aberto para garantir a execução no horário programado.</span>
           </div>
        )}
      </div>

      {/* Import/Export Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Download size={20} className="text-emerald-600" />
              Exportar Dados (Backup)
            </h3>
            <p className="text-sm text-slate-500 mt-1">Baixe uma cópia completa de todos os dados do sistema (Planilha Completa).</p>
          </div>
          
          <div className="space-y-3 mt-auto">
            <button 
              onClick={handleExportExcel}
              className="w-full flex items-center justify-center px-4 py-3 bg-white border border-slate-300 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 rounded-lg transition-all font-medium group"
            >
              <FileSpreadsheet size={18} className="mr-3 text-emerald-500 group-hover:text-emerald-700" />
              Exportar Excel / CSV
            </button>
            <button 
              onClick={handleExportPDF}
              className="w-full flex items-center justify-center px-4 py-3 bg-white border border-slate-300 text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 rounded-lg transition-all font-medium group"
            >
              <FileText size={18} className="mr-3 text-red-500 group-hover:text-red-700" />
              Exportar PDF (Relatório)
            </button>
          </div>
        </div>

        {/* Import */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Upload size={20} className="text-blue-600" />
              Importar / Restaurar
            </h3>
            <p className="text-sm text-slate-500 mt-1">Restaure o sistema a partir de um arquivo de backup anterior (.csv, .xlsx ou .pdf).</p>
          </div>
          
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors relative group flex-1 min-h-[150px]">
            <Upload size={32} className="text-slate-300 mb-3 group-hover:text-blue-500 transition-colors" />
            <p className="text-sm font-medium text-slate-600 mb-1">Clique para selecionar o arquivo</p>
            <p className="text-xs text-slate-400">Suporta Excel e PDF</p>
            <input 
              type="file" 
              onChange={handleImport}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
              accept=".csv, .xlsx, .pdf, .json"
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-xl shadow-sm border border-red-100 p-6">
        <h3 className="text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
          <AlertTriangle size={20} />
          Zona de Perigo
        </h3>
        <p className="text-sm text-red-600 mb-6">
          Ações nesta área são destrutivas e não podem ser desfeitas. Tenha certeza absoluta antes de prosseguir.
        </p>
        
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-red-200 shadow-sm">
          <div>
            <h4 className="font-bold text-slate-800">Zerar Sistema</h4>
            <p className="text-xs text-slate-500 mt-1">Apaga todos os clientes, equipes, financeiro e configurações.</p>
          </div>
          <button 
            onClick={handleResetSystem}
            disabled={isResetting}
            className="flex items-center px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed font-medium"
          >
            {isResetting ? <RefreshCw size={18} className="animate-spin mr-2" /> : <Trash2 size={18} className="mr-2" />}
            {isResetting ? 'Resetando...' : 'Zerar Tudo'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
