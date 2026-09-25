/**
 * Vitest Test Suite for Workflow Compliance Engine
 */

import { describe, it, expect, beforeEach } from "vitest";
import { validateIncomingEvent } from "../src/validator.js";
import { ComplianceEngine } from "../src/engine.js";
import { InMemoryRepository } from "../src/repository.js";
import type {
  ComplianceRule,
  AuditRecord,
  CommunicationEvent,
  ComplianceEventId,
  PolicyId,
} from "../src/types.js";

describe("Workflow Compliance Engine", () => {
  let auditRepo: InMemoryRepository<AuditRecord>;
  let engine: ComplianceEngine;

  const defaultPolicies: ComplianceRule[] = [
    {
      kind: "TIME_WINDOW",
      id: "time_policy_1" as PolicyId,
      startHourUtc: 9,
      endHourUtc: 18,
    },
    {
      kind: "CONSENT_VERIFICATION",
      id: "consent_policy_1" as PolicyId,
      requireExplicitOptIn: true,
    },
    {
      kind: "FREQUENCY_LIMIT",
      id: "freq_policy_1" as PolicyId,
      maxPerDay: 2,
    },
  ];

  beforeEach(() => {
    auditRepo = new InMemoryRepository<AuditRecord>();
    engine = new ComplianceEngine(defaultPolicies, auditRepo);
  });

  it("should validate and parse a compliant communication event", () => {
    const raw = {
      id: "evt_100",
      recipientPhone: "+15550001111",
      channel: "voicemail",
      timestamp: "2026-09-24T12:00:00Z",
      jurisdiction: "US",
      hasExplicitConsent: true,
    };

    const res = validateIncomingEvent(raw);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value.id).toBe("evt_100");
      expect(res.value.channel).toBe("voicemail");
    }
  });

  it("should reject an event scheduled outside permissible time window", async () => {
    const event: CommunicationEvent = {
      id: "evt_night_call" as ComplianceEventId,
      recipientPhone: "+15550002222",
      channel: "call",
      timestamp: new Date("2026-09-24T03:00:00Z"), // 3am UTC (outside 9-18)
      jurisdiction: "US",
      hasExplicitConsent: true,
    };

    const outcome = await engine.evaluateEvent(event, 0);
    expect(outcome.status).toBe("REJECTED");
    if (outcome.status === "REJECTED") {
      expect(outcome.failingRuleId).toBe("time_policy_1");
    }

    const audits = await auditRepo.findAll();
    expect(audits.length).toBe(1);
    expect(audits[0]?.outcome.status).toBe("REJECTED");
  });

  it("should reject an event lacking explicit consent", async () => {
    const event: CommunicationEvent = {
      id: "evt_no_consent" as ComplianceEventId,
      recipientPhone: "+15550003333",
      channel: "sms",
      timestamp: new Date("2026-09-24T12:00:00Z"),
      jurisdiction: "US",
      hasExplicitConsent: false, // VIOLATION
    };

    const outcome = await engine.evaluateEvent(event, 0);
    expect(outcome.status).toBe("REJECTED");
    if (outcome.status === "REJECTED") {
      expect(outcome.failingRuleId).toBe("consent_policy_1");
    }
  });

  it("should reject an event exceeding frequency limit", async () => {
    const event: CommunicationEvent = {
      id: "evt_spam_touch" as ComplianceEventId,
      recipientPhone: "+15550004444",
      channel: "voicemail",
      timestamp: new Date("2026-09-24T12:00:00Z"),
      jurisdiction: "US",
      hasExplicitConsent: true,
    };

    // Historical count 2 equals maxPerDay 2
    const outcome = await engine.evaluateEvent(event, 2);
    expect(outcome.status).toBe("REJECTED");
    if (outcome.status === "REJECTED") {
      expect(outcome.failingRuleId).toBe("freq_policy_1");
    }
  });

  it("should approve compliant events and record audit receipts", async () => {
    const event: CommunicationEvent = {
      id: "evt_perfect" as ComplianceEventId,
      recipientPhone: "+15550005555",
      channel: "voicemail",
      timestamp: new Date("2026-09-24T14:00:00Z"),
      jurisdiction: "US",
      hasExplicitConsent: true,
    };

    const outcome = await engine.evaluateEvent(event, 0);
    expect(outcome.status).toBe("APPROVED");
    if (outcome.status === "APPROVED") {
      expect(outcome.rulesCheckedCount).toBe(3);
    }

    const audits = await auditRepo.findAll();
    expect(audits.length).toBe(1);
    expect(audits[0]?.outcome.status).toBe("APPROVED");
  });
});
