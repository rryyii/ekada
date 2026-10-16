import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import MatchCard from './MatchCard';

describe('MatchCard', () => {
    it('shows the score and links to the match details', () => {
        render(
            <MemoryRouter>
                <MatchCard matches={{ SeriesKey: 'LCK 2026_1', Team1: 'T1', Team2: 'Gen.G', Team1Score: 2, Team2Score: 1 }} />
            </MemoryRouter>
        );
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute('href', '/match_details/LCK%202026_1');
    });

    it('renders nothing when no match is passed', () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});
        const { container } = render(
            <MemoryRouter>
                <MatchCard matches={null} />
            </MemoryRouter>
        );
        expect(container).toBeEmptyDOMElement();
        error.mockRestore();
    });
});
