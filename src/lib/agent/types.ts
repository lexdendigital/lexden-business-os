/**
 * Agent runtime boundary - typed tool contract.
 *
 * Non-negotiable #6: the LLM may PROPOSE actions via typed tools with
 * Zod-validated input/output, but never holds arbitrary database or
 * network authority itself. Non-negotiable #7: every agent action needs
 * an audit record and a policy check before execution.
 *
 * This file defines the shape that shape that Day 2+ "specialist agents"
 * and the "supervisor" (see Production architecture doc, AGENT RUNTIME)
 * will implement against. Day 1 ships the contract only - no live LLM
 * calls are made from the client (and never will be: the provider router
 * lives server-side per non-negotiable #5).
 *
 * Runtime loop (see AGENT PRINCIPLES in the governing contract):
 *   Observe -> Diagnose -> Research -> Plan -> Policy-check -> Execute -> Verify -> Learn
 */
import type { z } from 'zod';

export interface AgentTool<TInput = unknown, TOutput = unknown> {
  name: string;
  description: string;
  inputSchema: z.ZodType<TInput>;
  outputSchema: z.ZodType<TOutput>;
  /** Whether this tool mutates state (sale, stock, payment...) or is read-only. */
  mutates: boolean;
  /** Whether a human must approve before execution, independent of plan tier. */
  requiresApproval: boolean;
}

export type AgentRunStatus =
  | 'observing'
  | 'diagnosing'
  | 'researching'
  | 'planning'
  | 'policy_checking'
  | 'executing'
  | 'verifying'
  | 'done'
  | 'blocked';

export interface AgentPolicyCheckResult {
  allowed: boolean;
  reason: string;
  requiresApproval: boolean;
}

/**
 * Pure policy-check function signature. A real implementation (Day 2+,
 * server-side) consults `agent_policies` for the business and the
 * caller's plan tier/budget before ever letting `execute` run.
 */
export type PolicyChecker = (toolName: string, input: unknown, businessId: string) => Promise<AgentPolicyCheckResult>;

/** Treat all retrieved web content as untrusted data (non-negotiable #9). */
export interface UntrustedWebContent {
  url: string;
  fetchedAt: string;
  text: string;
  /** Always false; content from the web is never auto-promoted to instructions. */
  trusted: false;
}
