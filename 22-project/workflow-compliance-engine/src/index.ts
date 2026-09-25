/**
 * CLI Entrypoint & Demonstration for Workflow Compliance Engine
 * Run with: npm run project:run
 */

import { validateIncomingEvent } from "./validator.js";
import { InMemoryRepository } from "./repository.js";
import { ComplianceEngine } from "./engine.js";
import type { ComplianceRule, AuditRecord, PolicyId } from "./types.js";

async function main() {
  console.log("==============================================================");
  console.log("=== ENTERPRISE WORKFLOW & COMPLIANCE ENGINE STARTING ===");
  console.log("==============================================================\n");

  // 1. Configure Compliance Policies:
  const activePolicies: ComplianceRule[] = [
    {
      kind: "TIME_WINDOW",
      id: "policy_time_tcpa" as PolicyId,
      startHourUtc: 12, // 8am EST
      endHourUtc: 22,   // 6pm EST
    },
    {
      kind: "CONSENT_VERIFICATION",
      id: "policy_consent_optin" as PolicyId,
      requireExplicitOptIn: true,
    },
    {
      kind: "FREQUENCY_LIMIT",
      id: "policy_freq_daily_limit" as PolicyId,
      maxPerDay: 2,
    },
  ];

  // 2. Initialize Audit Repository & Engine:
  const auditRepo = new InMemoryRepository<AuditRecord>();
  const engine = new ComplianceEngine(activePolicies, auditRepo);

  // 3. Process Event 1: Valid & Compliant Event
  console.log("-> Evaluating Event 1 (Compliant Lead)...");
  const rawEvent1 = {
    id: "evt_lead_001",
    recipientPhone: "+15551234567",
    channel: "voicemail",
    timestamp: "2026-09-24T14:30:00Z", // 14:30 UTC -> inside 12-22 window
    jurisdiction: "US",
    hasExplicitConsent: true,
  };

  const validation1 = validateIncomingEvent(rawEvent1);
  if (!validation1.ok) {
    console.error("Validation failed:", validation1.error);
    return;
  }

  const result1 = await engine.evaluateEvent(validation1.value, 0);
  console.log("Evaluation Result 1:", result1);

  // 4. Process Event 2: Non-compliant Event (Lacks consent)
  console.log("\n-> Evaluating Event 2 (Missing Opt-In Consent)...");
  const rawEvent2 = {
    id: "evt_cold_lead_002",
    recipientPhone: "+15559876543",
    channel: "call",
    timestamp: "2026-09-24T15:00:00Z",
    jurisdiction: "US",
    hasExplicitConsent: false, // VIOLATION!
  };

  const validation2 = validateIncomingEvent(rawEvent2);
  if (validation2.ok) {
    const result2 = await engine.evaluateEvent(validation2.value, 0);
    console.log("Evaluation Result 2:", result2);
  }

  // 5. Inspect Immutable Audit Log:
  const allLogs = await auditRepo.findAll();
  console.log("\n📋 Audit Logs Recorded in Repository:", allLogs.length);
  for (const log of allLogs) {
    console.log(` - [${log.id}] Event ${log.eventId} => ${log.outcome.status}`);
  }

  console.log("\n[PASS] Compliance Run Completed Successfully.");
}

main().catch(console.error);
