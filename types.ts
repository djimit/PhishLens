
export interface ScanResult {
  isPhishing: boolean;
  probability: number;
  reasoning: string;
  heatmap: CharacterWeight[];
  summary: {
    criticalFindings: string[];
    adversarialDetected: boolean;
  };
}

export interface CharacterWeight {
  char: string;
  weight: number; // 0 to 1
  label?: string; // e.g., "Lookalike character", "Suspicious TLD"
}

export enum ScanState {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface SimulationConfig {
  adversarialEnabled: boolean;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  content: string;
  config: SimulationConfig;
  result: ScanResult;
}
