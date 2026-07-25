import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EducationPage from '../app/education/page';

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

describe('Educational Resources', () => {
  it('renders the search input and submit button', () => {
    render(<EducationPage />);
    expect(screen.getByPlaceholderText('E.g., What are common withdrawal signs?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('renders curated topic categories', () => {
    render(<EducationPage />);
    expect(screen.getByText('Understanding Addiction')).toBeInTheDocument();
    expect(screen.getByText('Recovery Stages')).toBeInTheDocument();
    expect(screen.getByText('Supporting a Loved One')).toBeInTheDocument();
    expect(screen.getByText('Treatment Options')).toBeInTheDocument();
    expect(screen.getByText('Local Resources')).toBeInTheDocument();
  });

  it('disables submit when query is empty', () => {
    render(<EducationPage />);
    const submitBtn = screen.getByRole('button', { name: /search/i });
    expect(submitBtn).toBeDisabled();
  });

  it('calls AI when a question is submitted', async () => {
    mockCallGemini.mockResolvedValueOnce('Withdrawal signs vary by substance.');

    render(<EducationPage />);
    const input = screen.getByPlaceholderText('E.g., What are common withdrawal signs?');
    fireEvent.change(input, { target: { value: 'What is addiction?' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(mockCallGemini).toHaveBeenCalledTimes(1);
    });

    expect(mockCallGemini).toHaveBeenCalledWith(
      expect.objectContaining({ userMessage: 'What is addiction?' })
    );
  });

  it('displays the answer after AI responds', async () => {
    mockCallGemini.mockResolvedValueOnce('Addiction is a chronic brain condition.');

    render(<EducationPage />);
    const input = screen.getByPlaceholderText('E.g., What are common withdrawal signs?');
    fireEvent.change(input, { target: { value: 'What is addiction?' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText('Addiction is a chronic brain condition.')).toBeInTheDocument();
    });
  });

  it('renders a read aloud button on the answer', async () => {
    mockCallGemini.mockResolvedValueOnce('Recovery is a journey.');

    render(<EducationPage />);
    const input = screen.getByPlaceholderText('E.g., What are common withdrawal signs?');
    fireEvent.change(input, { target: { value: 'Tell me about recovery' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText('Read aloud')).toBeInTheDocument();
    });
  });
});
