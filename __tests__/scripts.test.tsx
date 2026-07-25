import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ScriptsPage from '../app/scripts/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockCallGemini = jest.fn();
jest.mock('@/hooks/useGemini', () => ({
  useGemini: () => ({ callGemini: mockCallGemini, loading: false, error: null }),
}));

const mockSpeak = jest.fn();
const mockStopSpeaking = jest.fn();

jest.mock('@/hooks/useSpeech', () => ({
  useSpeech: () => ({
    speak: mockSpeak,
    stopSpeaking: mockStopSpeaking,
  }),
}));

jest.mock('@/hooks/useProfile', () => ({
  useProfile: () => ({
    profile: {
      name: 'Alex',
      substances: ['Alcohol'],
      triggers: ['Stress'],
      emergencyContactName: 'Mom',
    },
    isOnboarded: true,
    isLoaded: true,
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Emergency Scripts', () => {
  it('renders all 4 script type options', () => {
    render(<ScriptsPage />);
    expect(screen.getByText('Call Your Sponsor')).toBeInTheDocument();
    expect(screen.getByText('Talk to Family')).toBeInTheDocument();
    expect(screen.getByText('Self-Talk Grounding')).toBeInTheDocument();
    expect(screen.getByText('Refuse Peer Pressure')).toBeInTheDocument();
  });

  it('shows context tags after selecting a script type', () => {
    render(<ScriptsPage />);
    fireEvent.click(screen.getByText('Call Your Sponsor'));

    expect(screen.getByText("What's the situation?")).toBeInTheDocument();
    expect(screen.getByText('after an argument')).toBeInTheDocument();
  });

  it('selecting a type and context triggers an AI call', async () => {
    mockCallGemini.mockResolvedValueOnce('Here is your script...');

    render(<ScriptsPage />);
    fireEvent.click(screen.getByText('Call Your Sponsor'));
    fireEvent.click(screen.getByText('after an argument'));

    await waitFor(() => {
      expect(mockCallGemini).toHaveBeenCalledTimes(1);
    });

    expect(mockCallGemini).toHaveBeenCalledWith(
      expect.objectContaining({ maxTokens: 250 })
    );
  });

  it('displays the generated script in large readable text', async () => {
    mockCallGemini.mockResolvedValueOnce('Call your sponsor right now.\n\nTell them how you feel.');

    render(<ScriptsPage />);
    fireEvent.click(screen.getByText('Talk to Family'));
    fireEvent.click(screen.getByText('stressed'));

    await waitFor(() => {
      expect(screen.getByText(/Call your sponsor/)).toBeInTheDocument();
    });
  });

  it('renders listen all and copy buttons after generation', async () => {
    mockCallGemini.mockResolvedValueOnce('Sample script content.');

    render(<ScriptsPage />);
    fireEvent.click(screen.getByText('Self-Talk Grounding'));
    fireEvent.click(screen.getByText('at a party'));

    await waitFor(() => {
      expect(screen.getByText('Listen All')).toBeInTheDocument();
      expect(screen.getByText('Copy')).toBeInTheDocument();
    });
  });

  it('includes a "read aloud" / tap-to-read interaction on generated script', async () => {
    mockCallGemini.mockResolvedValueOnce('Paragraph one.\n\nParagraph two.');

    render(<ScriptsPage />);
    fireEvent.click(screen.getByText('Refuse Peer Pressure'));
    fireEvent.click(screen.getByText('at a party'));

    await waitFor(() => {
      expect(screen.getByText('Tap any paragraph to hear it out loud.')).toBeInTheDocument();
    });
  });
});
