/**
 * Workflow Compliance Execution Engine
 */

import type {
  CommunicationEvent,
  ComplianceRule,
  EvaluationResult,
  AuditRecord,
  AuditLogId,
} from "./types.js";
import type { IRepository } from "./repository.js";

function assertNever(x: never): never {
  throw new Error(`Unhandled compliance rule variant: ${JSON.stringify(x)}`);
}

export class ComplianceEngine {
  constructor(
    private readonly rules: readonly ComplianceRule[],
    private readonly auditRepo: IRepository<AuditRecord>
  ) {}

  async evaluateEvent(
    event: CommunicationEvent,
    historicalDailyCount: number = 0
  ): Promise<EvaluationResult> {
    const evaluatedAt = new Date();

    for (const rule of this.rules) {
      switch (rule.kind) {
        case "TIME_WINDOW": {
          const hourUtc = event.timestamp.getUTCHours();
          if (hourUtc < rule.startHourUtc || hourUtc >= rule.endHourUtc) {
            const outcome: EvaluationResult = {
              status: "REJECTED",
              evaluatedAt,
              failingRuleId: rule.id,
              violationMessage: `Event scheduled outside legal UTC time window (${rule.startHourUtc}:00 - ${rule.endHourUtc}:00). Current: ${hourUtc}:00.`,
            };
            await this.recordAudit(event.id, outcome);
            return outcome;
          }
          break;
        }

        case "CONSENT_VERIFICATION": {
          if (rule.requireExplicitOptIn && !event.hasExplicitConsent) {
            const outcome: EvaluationResult = {
              status: "REJECTED",
              evaluatedAt,
              failingRuleId: rule.id,
              violationMessage: "Recipient lacks required explicit opt-in consent for communication.",
            };
            await this.recordAudit(event.id, outcome);
            return outcome;
          }
          break;
        }

        case "FREQUENCY_LIMIT": {
          if (historicalDailyCount >= rule.maxPerDay) {
            const outcome: EvaluationResult = {
              status: "REJECTED",
              evaluatedAt,
              failingRuleId: rule.id,
              violationMessage: `Daily touch frequency limit exceeded. Max: ${rule.maxPerDay}, attempts: ${historicalDailyCount + 1}.`,
            };
            await this.recordAudit(event.id, outcome);
            return outcome;
          }
          break;
        }

        default:
          return assertNever(rule);
      }
    }

    const approvedOutcome: EvaluationResult = {
      status: "APPROVED",
      evaluatedAt,
      rulesCheckedCount: this.rules.length,
    };

    await this.recordAudit(event.id, approvedOutcome);
    return approvedOutcome;
  }

  private async recordAudit(
    eventId: CommunicationEvent["id"],
    outcome: EvaluationResult
  ): Promise<void> {
    const auditRecord: AuditRecord = {
      id: `audit_${Math.random().toString(36).substring(2, 10)}` as AuditLogId,
      eventId,
      outcome,
      recordedAt: new Date(),
    };
    await this.auditRepo.save(auditRecord);
  }
}
