
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Menu, 
  X, 
  Sun, 
  Settings as SettingsIcon, 
  LogOut,
  HardHat,
  HeadphonesIcon,
  CalendarClock,
  Zap,
  FileCheck,
  Wallet,
  Banknote
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Clients from './components/Clients';
import Teams from './components/Teams';
import Services from './components/Services';
import ServiceSchedules from './components/ServiceSchedules';
import Installations from './components/Installations';
import Homologations from './components/Homologations';
import Financials from './components/Financials';
import TeamPayments from './components/TeamPayments';
import Settings from './components/Settings';
import { PageView } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <Clients />;
      case 'teams':
        return <Teams />;
      case 'services':
        return <Services />;
      case 'schedules':
        return <ServiceSchedules />;
      case 'installations':
        return <Installations />;
      case 'homologations':
        return <Homologations />;
      case 'financial':
        return <Financials />;
      case 'payments':
        return <TeamPayments />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const NavItem = ({ page, icon: Icon, label }: { page: PageView, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentPage(page);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center w-full px-4 py-3 mb-2 rounded-lg transition-colors ${
        currentPage === page 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={20} className="mr-3" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shadow-sm z-10">
        <div className="p-6 flex items-center border-b border-slate-100">
          <div className="bg-blue-600 p-2 rounded-lg mr-3">
            <Sun size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">SolarFlow</h1>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">
            Menu Principal
          </div>
          <NavItem page="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem page="clients" icon={Users} label="Clientes" />
          <NavItem page="teams" icon={HardHat} label="Equipes" />
          <NavItem page="installations" icon={Zap} label="Instalações" />
          <NavItem page="homologations" icon={FileCheck} label="Homologação" />
          <NavItem page="services" icon={HeadphonesIcon} label="Atendimentos" />
          <NavItem page="schedules" icon={CalendarClock} label="Agendamentos" />
          
          <div className="mt-8 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">
            Financeiro
          </div>
          <NavItem page="financial" icon={Wallet} label="Despesas/Reembolso" />
          <NavItem page="payments" icon={Banknote} label="Pagamento Equipes" />

          <div className="mt-8 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">
            Sistema
          </div>
          <button 
            onClick={() => {
              setCurrentPage('settings');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center w-full px-4 py-3 mb-2 rounded-lg transition-colors ${
              currentPage === 'settings' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <SettingsIcon size={20} className="mr-3" />
            <span className="font-medium">Configurações</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={20} className="mr-3" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={toggleMobileMenu}></div>
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center">
            <Sun size={24} className="text-blue-600 mr-2" />
            <span className="text-xl font-bold text-slate-800">SolarFlow</span>
          </div>
          <button onClick={toggleMobileMenu}>
            <X size={24} className="text-slate-500" />
          </button>
        </div>
        <nav className="p-4">
          <NavItem page="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem page="clients" icon={Users} label="Clientes" />
          <NavItem page="teams" icon={HardHat} label="Equipes" />
          <NavItem page="installations" icon={Zap} label="Instalações" />
          <NavItem page="homologations" icon={FileCheck} label="Homologação" />
          <NavItem page="services" icon={HeadphonesIcon} label="Atendimentos" />
          <NavItem page="schedules" icon={CalendarClock} label="Agendamentos" />
          <NavItem page="financial" icon={Wallet} label="Despesas" />
          <NavItem page="payments" icon={Banknote} label="Pagamentos" />
          <NavItem page="settings" icon={SettingsIcon} label="Configurações" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 shadow-sm z-10">
          <button onClick={toggleMobileMenu} className="p-2 text-slate-600">
            <Menu size={24} />
          </button>
          <span className="font-semibold text-slate-800">
            {currentPage === 'dashboard' ? 'Dashboard Geral' : 
             currentPage === 'clients' ? 'Gestão de Clientes' : 
             currentPage === 'teams' ? 'Gestão de Equipes' : 
             currentPage === 'installations' ? 'Instalações' :
             currentPage === 'homologations' ? 'Homologação' :
             currentPage === 'services' ? 'Atendimento ao Cliente' : 
             currentPage === 'financial' ? 'Controle Financeiro' : 
             currentPage === 'payments' ? 'Pagamento de Equipes' :
             currentPage === 'settings' ? 'Configurações' : 'Agendamentos'}
          </span>
          <div className="w-8" /> {/* Spacer */}
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
           {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
