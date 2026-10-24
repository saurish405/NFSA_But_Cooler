// Local Voice Synthesis Engine using Web Speech API

class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private isSpeakingState = false;
  private onStateChangeListeners: ((speaking: boolean) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public subscribe(listener: (speaking: boolean) => void) {
    this.onStateChangeListeners.push(listener);
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter((l) => l !== listener);
    };
  }

  private setSpeaking(speaking: boolean) {
    this.isSpeakingState = speaking;
    this.onStateChangeListeners.forEach((l) => l(speaking));
  }

  public isAvailable(): boolean {
    return this.synth !== null;
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.setSpeaking(false);
    }
  }

  public speak(text: string, lang: 'en' | 'hi' = 'en', onComplete?: () => void) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this environment.');
      if (onComplete) onComplete();
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Slightly slower for low-literacy clarity
    utterance.pitch = 1.0;

    // Try to find matching voice
    const voices = this.synth.getVoices();
    if (lang === 'hi') {
      const hindiVoice = voices.find((v) => v.lang.includes('hi') || v.lang.includes('IN'));
      if (hindiVoice) utterance.voice = hindiVoice;
      utterance.lang = 'hi-IN';
    } else {
      const enVoice = voices.find((v) => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en'));
      if (enVoice) utterance.voice = enVoice;
      utterance.lang = 'en-IN';
    }

    utterance.onstart = () => {
      this.setSpeaking(true);
    };

    utterance.onend = () => {
      this.setSpeaking(false);
      if (onComplete) onComplete();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      this.setSpeaking(false);
      if (onComplete) onComplete();
    };

    this.synth.speak(utterance);
  }

  // Pre-formatted helper to read quota aloud
  public speakQuota(riceKg: number, wheatKg: number, grainKg: number, lang: 'en' | 'hi' = 'en') {
    if (lang === 'hi') {
      const text = `आपके राशन कार्ड पर आज कुल अनाज: चावल ${riceKg} किलोग्राम, गेहूं ${wheatKg} किलोग्राम, अन्य अनाज ${grainKg} किलोग्राम उपलब्ध है।`;
      this.speak(text, 'hi');
    } else {
      const text = `Ration entitlement for your household: Rice ${riceKg} kilograms, Wheat ${wheatKg} kilograms, Coarse Grains ${grainKg} kilograms.`;
      this.speak(text, 'en');
    }
  }

  // Speak simulation warning
  public speakSimulationAlert(headline: string, warning: string, lang: 'en' | 'hi' = 'en') {
    const text = `${headline}. ${warning}`;
    this.speak(text, lang);
  }
}

export const speechEngine = new SpeechEngine();
