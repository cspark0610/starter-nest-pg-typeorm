/* eslint-disable no-shadow */
export enum SERVICES {
  ETHEREAL = 'ethereal',
  GMAIL = 'gmail',
  OUTLOOK = 'outlook',
}

export class EmailConfig {
  from: string;

  password: string;

  service: SERVICES;

  host?: string;

  port?: number = 25;

  secure?: boolean = false;

  cc?: string;
}
