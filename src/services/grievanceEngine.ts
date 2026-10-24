import type { GrievanceRecord } from '../types';
import { sanitizeUserInput } from './sanitizer';

export function evaluateGrievanceSla(grievance: GrievanceRecord): GrievanceRecord {
  const isBreached = grievance.daysElapsed > grievance.slaDays && grievance.status !== 'RESOLVED';
  const status = isBreached ? 'SLA_BREACHED' : grievance.status;

  if (!isBreached) {
    return {
      ...grievance,
      status,
    };
  }

  // Auto-draft Tier-2 Appeal Memo to District Collector under Section 15 of NFSA 2013 (EC-08)
  const addressedTo = `District Collector & District Grievance Redressal Officer (DGRO), ${grievance.district}`;
  const legalSectionCited = 'National Food Security Act (NFSA) 2013, Section 15 & Bihar PDS (Control) Order';

  const bodyText = `MEMORANDUM OF STATUTORY APPEAL UNDER SECTION 15 OF NFSA 2013

TO:
The District Collector & DGRO,
District Administrative Complex, ${grievance.district}, ${grievance.state}

SUBJECT:
Urgent Tier-2 Statutory Escalation: Non-Resolution of PDS Grievance #${grievance.tokenNumber} within Mandated 14-Day SLA

RESPECTED SIR/MADAM,

This is a formal statutory escalation on behalf of citizen ${grievance.citizenName} (Ration Card: ${grievance.rationCardNumber}).

1. FACTUAL BACKGROUND:
A primary grievance was formally registered on ${new Date(grievance.filingDate).toLocaleDateString()} regarding: "${grievance.subject}".
Summary: "${grievance.sanitizedDescription}".

2. STATUTORY SLA BREACH:
Under the Citizen Charter of the Department of Food and Consumer Protection, the statutory timeframe for inquiry and redressal by the Taluk Supply Officer is 14 business days.
As of today, ${grievance.daysElapsed} days have elapsed with zero administrative disposition or verified ground verification logged.

3. PRAYER FOR RELIEF:
In exercise of powers conferred upon the District Grievance Redressal Officer under Section 15 of NFSA 2013, the appellant respectfully prays for:
(a) Immediate spot inspection of FPS counter records.
(b) Release of entitled grain quota with compensatory food security allowance under Section 8.
(c) Action on concerned field verification officials for statutory default.

DATED: ${new Date().toLocaleDateString()}
APPELLANT: ${grievance.citizenName} (Phone: ${grievance.citizenPhone})
SYSTEM TRACKING HASH: SHA256-${grievance.tokenNumber.replace(/[^A-Z0-9]/g, '')}`;

  const whatsappPayload = encodeURIComponent(
    `🚨 *STATUTORY ESCALATION: PDS GRIEVANCE #${grievance.tokenNumber}*\n` +
      `To: District Collector & DGRO ${grievance.district}\n` +
      `Citizen: ${grievance.citizenName} (${grievance.rationCardNumber})\n` +
      `SLA Days Elapsed: ${grievance.daysElapsed} days (Mandated SLA: 14 days - BREACHED)\n` +
      `Issue: ${grievance.subject}\n` +
      `Citation: Violation of NFSA 2013 Sec 15. Appeal memo auto-generated. Please initiate spot inquiry.`
  );

  const smsPayload = `URGENT APPEAL: NFSA Grievance #${grievance.tokenNumber} breached 14-day SLA (${grievance.daysElapsed} days elapsed). Citizen ${grievance.citizenName}, Card ${grievance.rationCardNumber}. Addressed to DM ${grievance.district}.`;

  return {
    ...grievance,
    status: 'SLA_BREACHED',
    tier2MemoDraft: {
      addressedTo,
      authorityJurisdiction: `${grievance.district} District Administration`,
      legalSectionCited,
      bodyText,
      whatsappPayload,
      smsPayload,
    },
  };
}

export function createNewGrievance(
  citizenName: string,
  citizenPhone: string,
  rationCardNumber: string,
  district: string,
  state: string,
  subject: string,
  rawDescription: string
): GrievanceRecord {
  // Check and sanitize against Prompt Injection (EC-14)
  const sanitization = sanitizeUserInput(rawDescription);
  const tokenNumber = `GRV-${new Date().getFullYear()}-${district.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const grv: GrievanceRecord = {
    id: `GRV-${Date.now()}`,
    tokenNumber,
    filingDate: new Date().toISOString(),
    daysElapsed: 0,
    slaDays: 14,
    status: 'OPEN',
    citizenName,
    citizenPhone,
    rationCardNumber,
    district,
    state,
    subject,
    description: rawDescription,
    sanitizedDescription: sanitization.sanitizedText,
    hadAdversarialPayload: sanitization.hadAdversarialPayload,
  };

  return grv;
}
