import type { WorkflowSpec } from '@/lib/workflow';

/* ============================================================================
   THE WORKFLOW PATTERNS — the shape of the work, drawn (4 November 2026).

   Each is a small graph the canvas plays and the card chains: a trigger, a
   step or two, sometimes an agent, and an end that is a person deciding or
   a record kept. They illustrate the patterns the service pages describe
   (content/services.ts); none is a deployment, and every place that draws
   one says so in its caption. The words are the site's own: the steps of
   the Contraxis schematic, the OPS facts, the service pages' patterns.
   ========================================================================= */

export const WORKFLOWS: readonly WorkflowSpec[] = [
  {
    key: 'document-review',
    title: 'Contract and document review',
    meta: 'PATTERN · AGENTIC AI',
    description:
      'A workflow pattern: a document arrives, an agent reads it and surfaces findings, a proposed action goes to a person who decides, and the record is kept.',
    nodes: [
      { id: 'in', kind: 'trigger', icon: 'mail', label: 'Document arrives', sub: 'contract, tender, invoice', col: 0, row: 0 },
      { id: 'read', kind: 'ai', icon: 'agent', label: 'Read and extract', sub: 'clauses, dates, obligations', col: 1, row: 0 },
      { id: 'check', kind: 'step', icon: 'table', label: 'Checked against the rules', col: 2, row: 0 },
      { id: 'propose', kind: 'step', icon: 'document', label: 'Action proposed', sub: 'with its evidence', col: 2, row: 1 },
      { id: 'decide', kind: 'end', icon: 'person', label: 'A person decides', col: 3, row: 0 },
      { id: 'record', kind: 'end', icon: 'database', label: 'Record kept', sub: 'the trail', col: 3, row: 1 },
    ],
    edges: [
      { from: 'in', to: 'read' },
      { from: 'read', to: 'check' },
      { from: 'read', to: 'propose' },
      { from: 'check', to: 'decide' },
      { from: 'propose', to: 'decide' },
      { from: 'propose', to: 'record', dashed: true },
    ],
  },
  {
    key: 'permit-alert',
    title: 'Permit renewal alert',
    meta: 'PATTERN · OPERATIONAL ALERTS',
    description:
      'A workflow pattern: the permit register is read, a permit about to lapse is found, the site lead is notified with the context, and the renewal is recorded.',
    nodes: [
      { id: 'register', kind: 'trigger', icon: 'database', label: 'Permit register', sub: 'per zone, with dates', col: 0, row: 0 },
      { id: 'lapse', kind: 'step', icon: 'clock', label: 'Lapses in seven days', col: 1, row: 0 },
      { id: 'notify', kind: 'alert', icon: 'alert', label: 'Site lead notified', sub: 'with the permit attached', col: 2, row: 0 },
      { id: 'renew', kind: 'end', icon: 'check', label: 'Renewed and recorded', col: 3, row: 0 },
    ],
    edges: [
      { from: 'register', to: 'lapse' },
      { from: 'lapse', to: 'notify' },
      { from: 'notify', to: 'renew' },
    ],
  },
  {
    key: 'daily-report',
    title: 'The daily report, offline',
    meta: 'PATTERN · FIELD OPERATIONS',
    description:
      'A workflow pattern: the shift closes, the report is signed on site, it queues on the device until coverage returns, and the office register is updated.',
    nodes: [
      { id: 'shift', kind: 'trigger', icon: 'clock', label: 'Shift closes', col: 0, row: 0 },
      { id: 'sign', kind: 'step', icon: 'check', label: 'Signed on site', sub: 'hours, crew, observations', col: 1, row: 0 },
      { id: 'queue', kind: 'step', icon: 'offline', label: 'Queued offline', sub: 'until coverage returns', col: 2, row: 0 },
      { id: 'office', kind: 'end', icon: 'database', label: 'Office register updated', col: 3, row: 0 },
    ],
    edges: [
      { from: 'shift', to: 'sign' },
      { from: 'sign', to: 'queue' },
      { from: 'queue', to: 'office' },
    ],
  },
  {
    key: 'supplier-qualification',
    title: 'Supplier qualification',
    meta: 'PATTERN · DOCUMENT INTELLIGENCE',
    description:
      'A workflow pattern: a tender pack arrives, the documents are read, the gaps are listed, and a person decides what is sent.',
    nodes: [
      { id: 'pack', kind: 'trigger', icon: 'mail', label: 'Tender pack arrives', col: 0, row: 0 },
      { id: 'read', kind: 'ai', icon: 'agent', label: 'Documents read', sub: 'certifications, records', col: 1, row: 0 },
      { id: 'gaps', kind: 'step', icon: 'table', label: 'Gaps listed', col: 2, row: 0 },
      { id: 'decide', kind: 'end', icon: 'person', label: 'A person decides', col: 3, row: 0 },
    ],
    edges: [
      { from: 'pack', to: 'read' },
      { from: 'read', to: 'gaps' },
      { from: 'gaps', to: 'decide' },
    ],
  },
];

/** The full-width canvas on the Advanced Solutions page: two kinds of
 *  input, the agent, three outputs, and the two ends the firm's rules put
 *  at the end of everything — a person, and a record. */
export const CANVAS: WorkflowSpec = {
  key: 'operations',
  title: 'How an automated operation runs',
  meta: 'PATTERN · ADVANCED SOLUTIONS',
  description:
    'A workflow pattern: documents and field reports come in, an agent reads them, findings, a proposed action and alerts come out, a person decides anything that carries weight, and every step is recorded.',
  nodes: [
    { id: 'doc', kind: 'trigger', icon: 'document', label: 'Documents', sub: 'contracts, permits, invoices', col: 0, row: 0 },
    { id: 'field', kind: 'trigger', icon: 'photo', label: 'Field reports', sub: 'signed on site', col: 0, row: 1 },
    { id: 'agent', kind: 'ai', icon: 'agent', label: 'The agent', sub: 'reads, checks, drafts', col: 1, row: 0 },
    { id: 'findings', kind: 'step', icon: 'table', label: 'Findings', col: 2, row: 0 },
    { id: 'action', kind: 'step', icon: 'document', label: 'Proposed action', sub: 'with its evidence', col: 2, row: 1 },
    { id: 'alert', kind: 'alert', icon: 'alert', label: 'Alert raised', sub: 'to the person who can act', col: 2, row: 2 },
    { id: 'person', kind: 'end', icon: 'person', label: 'A person decides', sub: 'money, safety, commitments', col: 3, row: 0 },
    { id: 'record', kind: 'end', icon: 'database', label: 'Record kept', sub: 'one source of truth', col: 3, row: 1 },
  ],
  edges: [
    { from: 'doc', to: 'agent' },
    { from: 'field', to: 'agent' },
    { from: 'agent', to: 'findings' },
    { from: 'agent', to: 'action' },
    { from: 'agent', to: 'alert' },
    { from: 'findings', to: 'person' },
    { from: 'action', to: 'person' },
    { from: 'alert', to: 'person', dashed: true },
    { from: 'action', to: 'record', dashed: true },
  ],
};

/** The 404's card: the one workflow on the site that ends badly. */
export const NOT_FOUND_FLOW: WorkflowSpec = {
  key: 'not-found',
  title: 'This address',
  meta: '404 · ROUTE NOT FOUND',
  description: 'A workflow pattern for this address: the request came in, the router looked, and no route was found.',
  nodes: [
    { id: 'req', kind: 'trigger', icon: 'route', label: 'Request received', col: 0, row: 0 },
    { id: 'router', kind: 'step', icon: 'table', label: 'Routes checked', col: 1, row: 0 },
    { id: 'none', kind: 'alert', icon: 'alert', label: 'Route not found', col: 2, row: 0 },
  ],
  edges: [
    { from: 'req', to: 'router' },
    { from: 'router', to: 'none' },
  ],
};

export const WORKFLOW_CAPTION = 'Pattern — not a deployment';

export function workflowByKey(key: string): WorkflowSpec | undefined {
  return WORKFLOWS.find((w) => w.key === key);
}
