import { renderHook, act } from '@testing-library/react';
import { useGemini } from '../hooks/useGemini';

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockClear();
});

describe('useGemini', () => {
  it('returns text on successful API call', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ text: 'Breathe slowly. You are safe.' }),
    });

    const { result } = renderHook(() => useGemini());

    let output: string | undefined;
    await act(async () => {
      output = await result.current.callGemini({
        systemPrompt: 'You are a crisis companion.',
        userMessage: 'I feel overwhelmed',
      });
    });

    expect(output).toBe('Breathe slowly. You are safe.');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns fallback message on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network failure'));

    const { result } = renderHook(() => useGemini());

    let output: string | undefined;
    await act(async () => {
      output = await result.current.callGemini({
        systemPrompt: 'You are a crisis companion - NETWORK TEST',
        userMessage: 'I feel very anxious',
      });
    });

    expect(output).toBe("I'm here for you. Please call 988 if you need immediate help.");
    expect(result.current.error).toBe('Could not reach AI. Please try again.');
  });

  it('returns fallback message on empty/ malformed response', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({}),
    });

    const { result } = renderHook(() => useGemini());

    let output: string | undefined;
    await act(async () => {
      output = await result.current.callGemini({
        systemPrompt: 'You are a crisis companion - EMPTY TEST',
        userMessage: 'Tell me something',
      });
    });

    expect(output).toBe("I'm here for you. Please call 988 if you need immediate help.");
  });

  it('sets loading state correctly during API call', async () => {
    let resolvePromise!: (value: unknown) => void;
    mockFetch.mockReturnValueOnce(new Promise((resolve) => { resolvePromise = resolve; }));

    const { result } = renderHook(() => useGemini());

    let promise: Promise<string>;
    act(() => {
      promise = result.current.callGemini({
        systemPrompt: 'You are a crisis companion - LOADING TEST',
        userMessage: 'Help me',
      });
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise({ json: async () => ({ text: 'OK' }) });
      await promise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('returns cached response for duplicate prompts', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ text: 'First response.' }),
    });

    const { result } = renderHook(() => useGemini());

    let first: string | undefined;
    await act(async () => {
      first = await result.current.callGemini({
        systemPrompt: 'Cache test prompt',
        userMessage: 'Cache test message',
      });
    });

    expect(first).toBe('First response.');
    expect(mockFetch).toHaveBeenCalledTimes(1);

    mockFetch.mockResolvedValueOnce({
      json: async () => ({ text: 'Should NOT be called.' }),
    });

    let second: string | undefined;
    await act(async () => {
      second = await result.current.callGemini({
        systemPrompt: 'Cache test prompt',
        userMessage: 'Cache test message',
      });
    });

    expect(second).toBe('First response.');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
