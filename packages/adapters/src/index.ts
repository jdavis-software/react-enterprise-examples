export interface BackupProvider {
  id: string;
  displayName: string;
  capabilities: {
    snapshots: boolean;
    immutability: boolean;
  };
  listJobs(): Promise<any[]>;
  createPolicy(input: any): Promise<any>;
}

export interface TicketProvider {
  id: string;
  displayName: string;
  capabilities: {
    comments: boolean;
    attachments: boolean;
  };
  listTickets(): Promise<any[]>;
  createTicket(input: any): Promise<any>;
}
