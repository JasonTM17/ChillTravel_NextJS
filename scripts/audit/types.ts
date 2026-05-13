export interface AuditMetric {
  name: string;
  currentValue: number | string;
  target: string;
  automated: boolean;
  command?: string;
  manualProcedure?: string;
}

export interface SecurityBlocker {
  type: string;
  description: string;
  requirement: string;
}

export interface BaselineReport {
  generatedAt: string;
  metrics: AuditMetric[];
  blockers: SecurityBlocker[];
}
