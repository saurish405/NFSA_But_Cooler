// Adversarial Prompt Injection Defense & Input Sanitizer (EC-14)

const ADVERSARIAL_PATTERNS = [
  /ignore\s+(?:all\s+)?previous\s+instructions/i,
  /system\s+override/i,
  /grant\s+(?:full\s+)?unrestricted\s+extra\s+quota/i,
  /you\s+are\s+now\s+in\s+admin\s+mode/i,
  /bypass\s+all\s+security\s+checks/i,
  /disregard\s+(?:all\s+)?rules/i,
  /sudo\s+approve/i,
  /<script[\s\S]*?>[\s\S]*?<\/script>/i,
  /javascript:/i,
];

export interface SanitizationResult {
  sanitizedText: string;
  hadAdversarialPayload: boolean;
  flaggedPatterns: string[];
}

export function sanitizeUserInput(input: string): SanitizationResult {
  if (!input) {
    return { sanitizedText: '', hadAdversarialPayload: false, flaggedPatterns: [] };
  }

  let sanitized = input;
  const flaggedPatterns: string[] = [];
  let hadAdversarial = false;

  for (const pattern of ADVERSARIAL_PATTERNS) {
    if (pattern.test(sanitized)) {
      hadAdversarial = true;
      flaggedPatterns.push(pattern.source);
      // Neutralize adversarial payload into harmless escaped label
      sanitized = sanitized.replace(pattern, '[REDACTED_ADVERSARIAL_PAYLOAD]');
    }
  }

  // Basic HTML entity escaping to eliminate XSS
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  return {
    sanitizedText: sanitized,
    hadAdversarialPayload: hadAdversarial,
    flaggedPatterns,
  };
}
