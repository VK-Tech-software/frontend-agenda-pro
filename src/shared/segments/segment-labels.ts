export type SegmentKey = "beauty-salon" | "nails" | "lashes" | "barbershop" | "law";

type SegmentEntityLabels = {
  clients: { singular: string; plural: string };
  professionals: { singular: string; plural: string };
  services: { singular: string; plural: string };
  appointments: { singular: string; plural: string };
  cases: { singular: string; plural: string };
};

const defaultLabels: SegmentEntityLabels = {
  clients: { singular: "Cliente", plural: "Clientes" },
  professionals: { singular: "Profissional", plural: "Profissionais" },
  services: { singular: "Serviço", plural: "Serviços" },
  appointments: { singular: "Agendamento", plural: "Agendamentos" },
  cases: { singular: "Caso", plural: "Casos" },
};

const segmentLabels: Record<SegmentKey, SegmentEntityLabels> = {
  "beauty-salon": {
    ...defaultLabels,
    services: { singular: "Serviço", plural: "Serviços" },
  },
  nails: {
    ...defaultLabels,
    professionals: { singular: "Especialista", plural: "Especialistas" },
    services: { singular: "Procedimento", plural: "Procedimentos" },
  },
  lashes: {
    ...defaultLabels,
    professionals: { singular: "Especialista", plural: "Especialistas" },
    services: { singular: "Procedimento", plural: "Procedimentos" },
  },
  barbershop: {
    ...defaultLabels,
    professionals: { singular: "Barbeiro", plural: "Barbeiros" },
    services: { singular: "Corte", plural: "Cortes" },
  },
  law: {
    ...defaultLabels,
    professionals: { singular: "Advogado", plural: "Advogados" },
    services: { singular: "Atendimento", plural: "Atendimentos" },
    appointments: { singular: "Atendimento", plural: "Atendimentos" },
  },
};

export const getSegmentLabels = (segment?: string | null): SegmentEntityLabels => {
  if (!segment) return defaultLabels;
  return segmentLabels[segment as SegmentKey] ?? defaultLabels;
};

export const isCasesEnabled = (segment?: string | null) => segment === "law";
