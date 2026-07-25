import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CrisisPage from '../app/crisis/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

const mockCallGemini = jest.fn();
jest.mock('@/hooks/useGemini', () => ({
  useGemini: () => ({ callGemini: mockCallGemini, loading: false, error: null }),
}));

const mockSpeak = jest.fn();
const mockStopSpeaking = jest.fn();
const mockStartListening = jest.fn();
const mockStopListening = jest.fn();

jest.mock('@/hooks/useSpeech', () => ({
  useSpeech: () => ({
    transcript: '',
    listening: false,
    startListening: mockStartListening,
    stopListening: mockStopListening,
    speak: mockSpeak,
    stopSpeaking: mockStopSpeaking,
    supported: false,
  }),
}));

jest.mock('@/hooks/useProfile', () => ({
  useProfile: () => ({
    profile: {
      name: 'Alex',
      triggers: ['Stress', 'Loneliness'],
      emergencyContactName: 'Mom',
      emergencyContactPhone: '+15551234567',
    },
    isOnboarded: true,
    isLoaded: true,
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Crisis Mode', () => {
  it('renders the emergency help button on crisis page', () => {
    render(<CrisisPage />);
    expect(screen.getByText("What's happening right now?")).toBeInTheDocument();
  });

  it('renders all 5 tap-card options', () => {
    render(<CrisisPage />);
    expect(screen.getByText("I'm having a craving")).toBeInTheDocument();
    expect(screen.getByText("I'm about to use")).toBeInTheDocument();
    expect(screen.getByText('I feel overwhelmed')).toBeInTheDocument();
    expect(screen.getByText('I need to call someone')).toBeInTheDocument();
    expect(screen.getByText('I need a grounding exercise')).toBeInTheDocument();
  });

  it('displays the 112 emergency number button', () => {
    render(<CrisisPage />);
    expect(screen.getByText('112 Emergency')).toBeInTheDocument();
  });

  it('displays the 14416 Tele-MANAS mental health helpline button', () => {
    render(<CrisisPage />);
    expect(screen.getByText('14416 (Tele-MANAS)')).toBeInTheDocument();
  });

  it('displays the emergency contact button when profile has contact', () => {
    render(<CrisisPage />);
    expect(screen.getByText('Mom')).toBeInTheDocument();
  });

  it('selecting a tap card triggers an AI call', async () => {
    mockCallGemini.mockResolvedValueOnce('Take a deep breath. You are not alone.');

    render(<CrisisPage />);

    fireEvent.click(screen.getByText("I'm having a craving"));

    await waitFor(() => {
      expect(mockCallGemini).toHaveBeenCalledTimes(1);
    });

    expect(mockCallGemini).toHaveBeenCalledWith(
      expect.objectContaining({ userMessage: "I'm having a craving" })
    );
  });

  it('shows fallback message when AI call fails', async () => {
    mockCallGemini.mockResolvedValueOnce("I'm here for you. Please call 14416 (Tele-MANAS) if you need immediate help.");

    render(<CrisisPage />);

    fireEvent.click(screen.getByText("I'm having a craving"));

    await waitFor(() => {
      expect(screen.getByText(/I'm here for you/i)).toBeInTheDocument();
    });
  });

  it('shows no text keyboard input field in crisis mode', () => {
    render(<CrisisPage />);
    const textInputs = screen.queryAllByRole('textbox');
    expect(textInputs).toHaveLength(0);
  });

  it('speaks the response automatically when received', async () => {
    mockCallGemini.mockResolvedValueOnce('You are safe. Breathe with me.');

    render(<CrisisPage />);

    fireEvent.click(screen.getByText("I'm having a craving"));

    // Wait for the typing animation to complete (text length * 20ms + buffer)
    await waitFor(() => {
      expect(mockSpeak).toHaveBeenCalledWith('You are safe. Breathe with me.');
    }, { timeout: 2000 }); // Increased timeout for typing animation
  });

  it('renders a read aloud button on the response', async () => {
    mockCallGemini.mockResolvedValueOnce('Stay calm. You are doing great.');

    render(<CrisisPage />);

    fireEvent.click(screen.getByText("I'm having a craving"));

    await waitFor(() => {
      expect(screen.getByText('Read aloud')).toBeInTheDocument();
    });
  });
});
