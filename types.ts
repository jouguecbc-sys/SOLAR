
export enum Salesperson {
  ISA = "Isa",
  LAYS = "Lays",
  YASMIN = "Yasmin",
  ROBERTA = "Roberta",
  PEDRO = "Pedro",
  EMANOEL = "Emanoel",
  EDMIR = "Edmir",
  OUTROS = "Outros"
}

export enum InstallStatus {
  PENDENTE = "Pendente",
  EM_ANDAMENTO = "Em Andamento",
  CONCLUIDA = "Concluída",
  CANCELADA = "Cancelada"
}

export enum SatisfactionLevel {
  MUITO_INSATISFEITO = "Muito Insatisfeito",
  INSATISFEITO = "Insatisfeito",
  REGULAR = "Regular",
  SATISFEITO = "Satisfeito",
  MUITO_SATISFEITO = "Muito Satisfeito"
}

export enum ServiceStatus {
  A_RESOLVER = "A Resolver",
  RESOLVENDO = "Resolvendo",
  RESOLVIDO = "Resolvido"
}

export enum Attendant {
  RAFAEL = "Rafael",
  BRUNA = "Bruna",
  CLARA = "Clara",
  JULIO = "Júlio",
  OUTROS = "Outros"
}

export enum ServiceType {
  CONFIG_INVERSOR = "Configuração do Inversor",
  VERIFICAR_GERACAO = "Verificar Geração",
  INSPECAO = "Inspeção",
  TELHADO_INFILTRACAO = "Telhado / Infiltração",
  FALHA_SISTEMA = "Falha do Sistema",
  PASSAR_CARTAO = "Passar Cartão",
  OUTROS = "Outros"
}

export enum ServicePriority {
  PEQUENA = "Pequena",
  MEDIA = "Média",
  ALTA = "Alta",
  URGENTE = "Urgente"
}

export enum ScheduleStatus {
  PENDENTE = "Pendente",
  ANDAMENTO = "Em Andamento",
  RESOLVIDO = "Resolvido"
}

export enum GridConnectionType {
  MONOFASICO = "Monofásico",
  BIFASICO = "Bifásico",
  TRIFASICO = "Trifásico"
}

export enum HomologationStatus {
  AGUARDANDO = "Aguardando",
  AGENDADA = "Agendada",
  HOMOLOGADO = "Homologado"
}

export interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
  salesperson: Salesperson;
  salespersonOther?: string; 
  panelQty: number;
  powerKwp: number;
  contractDate: string; 
  observation: string;
  installStatus: InstallStatus;
  assignedTeam?: string; 
  // Optional property for simulation of auto-fill in Homologation
  installationCompletionDate?: string;
}

export interface TeamFeedback {
  id: string;
  date: string;
  comment: string;
  level: SatisfactionLevel;
}

export interface Team {
  id: string;
  leaderName: string;
  pixKey: string;
  feedbacks: TeamFeedback[];
}

export interface ServiceTicket {
  id: string; // Format: "01", "02"...
  displayId: string;
  date: string;
  clientId: string;
  clientName: string;
  clientAddress: string;
  salesperson: string;
  issue: string;
  status: ServiceStatus;
  attendant: Attendant;
  attendantOther?: string;
  finishedDate?: string;
}

export interface ServiceSchedule {
  id: string;
  displayId: string; // Format: "SERV 01"
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  salesperson: string;
  serviceType: ServiceType;
  serviceTypeOther?: string;
  description: string;
  assignedTeam: string;
  priority: ServicePriority;
  scheduledDate: string;
  cost: number;
  status: ScheduleStatus;
  observation: string;
}

export interface Installation {
  id: string;
  displayId: string; // Format: "INST 01"
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  teamId: string;
  teamName: string;
  
  // System Data (Auto-filled from Client)
  panelQty: number;
  powerKwp: number;

  // Electrical Data (New)
  gridType: GridConnectionType;
  breakerStandardAmp: string; // Disjuntor Padrão
  breakerInverterAmp: string; // Disjuntor Inversor

  // Financials
  laborPricePerPanel: number; // 0, 50, 60, 70 or other
  totalCost: number; // Auto-calc

  // Dates & Status
  scheduledDate: string;
  completionDate?: string;
  status: ScheduleStatus; // Reuse PENDENTE, ANDAMENTO, RESOLVIDO
}

export interface Homologation {
  id: string;
  clientId: string;
  clientName: string;
  installationCompletionDate: string;
  enteredContract: boolean; // Entrada no Contrato (Sim/Não)
  status: HomologationStatus;
}

export interface FinancialRecord {
  id: string;
  date: string;
  teamId: string;
  teamName: string;
  description: string;
  value: number;
}

export interface DashboardStats {
  totalClients: number;
  completedInstalls: number;
  totalPanels: number;
  totalCommission: number;
  topTeam: { name: string; panels: number };
  satisfaction: number;
}

export type PageView = 'dashboard' | 'clients' | 'teams' | 'services' | 'schedules' | 'installations' | 'homologations' | 'financial' | 'payments' | 'settings';
