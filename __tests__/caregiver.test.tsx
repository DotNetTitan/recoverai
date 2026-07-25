import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CaregiverPage from '../app/caregiver/page';

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

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Caregiver Hub', () => {
  it('renders the main hub with "What do I say right now?" card', () => {
    render(<CaregiverPage />);
    expect(screen.getByText('What do I say right now?')).toBeInTheDocument();
  });

  it('renders the emergency checklist card', () => {
    render(<CaregiverPage />);
    expect(screen.getByText('Are they in crisis right now?')).toBeInTheDocument();
  });

  it('renders essential reading articles', () => {
    render(<CaregiverPage />);
    expect(screen.getByText('How to talk about a relapse')).toBeInTheDocument();
    expect(screen.getByText('Setting healthy boundaries')).toBeInTheDocument();
    expect(screen.getByText('Understanding what they are going through')).toBeInTheDocument();
  });

  it('renders the share card', () => {
    render(<CaregiverPage />);
    expect(screen.getByText('Share RecoverAI')).toBeInTheDocument();
  });

  it('shows guidance view when "What do I say" is clicked', () => {
    render(<CaregiverPage />);
    fireEvent.click(screen.getByText('What do I say right now?'));
    expect(screen.getByText('What Do I Say?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/they just told me they relapsed/i)).toBeInTheDocument();
  });

  it('calls AI when guidance is submitted', async () => {
    mockCallGemini.mockResolvedValueOnce('Stay calm and listen without judgment.');

    render(<CaregiverPage />);
    fireEvent.click(screen.getByText('What do I say right now?'));

    const textarea = screen.getByPlaceholderText(/they just told me they relapsed/i);
    fireEvent.change(textarea, { target: { value: 'They relapsed last night.' } });
    fireEvent.click(screen.getByText('Get Guidance'));

    await waitFor(() => {
      expect(mockCallGemini).toHaveBeenCalledTimes(1);
    });

    expect(mockCallGemini).toHaveBeenCalledWith(
      expect.objectContaining({ userMessage: 'They relapsed last night.' })
    );
  });

  it('displays guidance after AI responds', async () => {
    mockCallGemini.mockResolvedValueOnce('Acknowledge their honesty and ask how you can help.');

    render(<CaregiverPage />);
    fireEvent.click(screen.getByText('What do I say right now?'));

    const textarea = screen.getByPlaceholderText(/they just told me they relapsed/i);
    fireEvent.change(textarea, { target: { value: 'They relapsed.' } });
    fireEvent.click(screen.getByText('Get Guidance'));

    await waitFor(() => {
      expect(screen.getByText('Acknowledge their honesty and ask how you can help.')).toBeInTheDocument();
    });
  });

  it('renders a read aloud button on the guidance', async () => {
    mockCallGemini.mockResolvedValueOnce('Be present and listen.');

    render(<CaregiverPage />);
    fireEvent.click(screen.getByText('What do I say right now?'));

    const textarea = screen.getByPlaceholderText(/they just told me they relapsed/i);
    fireEvent.change(textarea, { target: { value: 'Help.' } });
    fireEvent.click(screen.getByText('Get Guidance'));

    await waitFor(() => {
      expect(screen.getByText('Read aloud')).toBeInTheDocument();
    });
  });
});
