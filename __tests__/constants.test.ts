import { buildCrisisPrompt, buildScriptPrompt, CRISIS_HOTLINE, EMERGENCY_NUMBER } from '../utils/constants';

describe('Constants and Utilities', () => {
  it('should format a crisis prompt correctly', () => {
    const prompt = buildCrisisPrompt('Alex', ['stress'], 'Mom');
    expect(prompt).toContain('Alex');
    expect(prompt).toContain('stress');
    expect(prompt).toContain('Mom');
  });

  it('should format a script prompt correctly', () => {
    const prompt = buildScriptPrompt('Alex', 'Alcohol', 'Call Your Sponsor', 'at a party');
    expect(prompt).toContain('Alex');
    expect(prompt).toContain('Alcohol');
    expect(prompt).toContain('Call Your Sponsor');
    expect(prompt).toContain('at a party');
  });

  it('should have the correct crisis hotline', () => {
    expect(CRISIS_HOTLINE).toBe('14416');
  });

  it('should have the correct emergency number', () => {
    expect(EMERGENCY_NUMBER).toBe('112');
  });
});
