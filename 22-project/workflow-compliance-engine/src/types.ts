/**
 * Domain Types for Workflow Compliance Engine
 */

declare const BrandTag: unique symbol;
export type Brand<T, B extends string> = T & { readonly [BrandTag]: B };

export type ComplianceEventId = Brand<string, "ComplianceEventId">;
export type PolicyId = Brand<string, "PolicyId">;
export type AuditLogId = Brand<string, "AuditLogId">;

export interface CommunicationEvent {
  readonly id: ComplianceEventId;
  readonly recipientPhone: string;
  readonly channel: "voicemail" | "sms" | "call";
  readonly timestamp: Date;
  readonly jurisdiction: "US" | "EU" | "CA";
  readonly hasExplicitConsent: boolean;
}

// Discriminated Union for Compliance Rules
export interface TimeWindowRule {
  readonly kind: "TIME_WINDOW";
  readonly id: PolicyId;
  readonly startHourUtc: number; // e.g. 13 (8 AM EST)
  readonly endHourUtc: number;   // e.g. 26 (9 PM PST next day)
}

export interface ConsentRule {
  readonly kind: "CONSENT_VERIFICATION";
  readonly id: PolicyId;
  readonly requireExplicitOptIn: boolean;
}

export interface FrequencyLimitRule {
  readonly kind: "FREQUENCY_LIMIT";
  readonly id: PolicyId;
  readonly maxPerDay: number;
}

export type ComplianceRule = TimeWindowRule | ConsentRule | FrequencyLimitRule;

// Audit & Evaluation Outcome
export type EvaluationResult =
  | {
      readonly status: "APPROVED";
      readonly evaluatedAt: Date;
      readonly rulesCheckedCount: number;
    }
  | {
      readonly status: "REJECTED";
      readonly evaluatedAt: Date;
      readonly failingRuleId: PolicyId;
      readonly violationMessage: string;
    };

export interface AuditRecord {
  readonly id: AuditLogId;
  readonly eventId: ComplianceEventId;
  readonly outcome: EvaluationResult;
  readonly recordedAt: Date;
}

export type Result<T, E = Error> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };
