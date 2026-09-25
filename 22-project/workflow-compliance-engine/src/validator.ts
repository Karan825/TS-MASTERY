/**
 * Boundary Validator for Incoming Communication Events
 */

import type { CommunicationEvent, ComplianceEventId, Result } from "./types.js";

export function validateIncomingEvent(data: unknown): Result<CommunicationEvent, string> {
  if (typeof data !== "object" || data === null) {
    return { ok: false, error: "Event payload must be a non-null object" };
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.id !== "string" || !obj.id.startsWith("evt_")) {
    return { ok: false, error: "Invalid 'id': must be string starting with 'evt_'" };
  }

  if (typeof obj.recipientPhone !== "string" || !/^\+[1-9]\d{1,14}$/.test(obj.recipientPhone)) {
    return { ok: false, error: "Invalid 'recipientPhone': must be E.164 formatted (+1234567890)" };
  }

  if (obj.channel !== "voicemail" && obj.channel !== "sms" && obj.channel !== "call") {
    return { ok: false, error: "Invalid 'channel': must be 'voicemail', 'sms', or 'call'" };
  }

  if (typeof obj.timestamp !== "string" && !(obj.timestamp instanceof Date)) {
    return { ok: false, error: "Invalid 'timestamp': must be ISO string or Date" };
  }

  const parsedDate = new Date(obj.timestamp as string | Date);
  if (isNaN(parsedDate.getTime())) {
    return { ok: false, error: "Invalid date timestamp value" };
  }

  if (obj.jurisdiction !== "US" && obj.jurisdiction !== "EU" && obj.jurisdiction !== "CA") {
    return { ok: false, error: "Invalid 'jurisdiction': must be 'US', 'EU', or 'CA'" };
  }

  if (typeof obj.hasExplicitConsent !== "boolean") {
    return { ok: false, error: "Invalid 'hasExplicitConsent': must be a boolean" };
  }

  return {
    ok: true,
    value: {
      id: obj.id as ComplianceEventId,
      recipientPhone: obj.recipientPhone,
      channel: obj.channel,
      timestamp: parsedDate,
      jurisdiction: obj.jurisdiction,
      hasExplicitConsent: obj.hasExplicitConsent,
    },
  };
}
