import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { championList } from './champion-images';

describe('championList', () => {
    it('renders an image per champion', () => {
        render(<>{championList('Ahri,Azir,Jinx')}</>);
        expect(screen.getAllByRole('img')).toHaveLength(3);
    });

    it('maps special champion names to their CDN ids', () => {
        render(<>{championList("Wukong,Kai'Sa,Renata Glasc,LeBlanc")}</>);
        const sources = screen.getAllByRole('img').map((img) => img.getAttribute('src'));
        expect(sources[0]).toContain('/MonkeyKing.png');
        expect(sources[1]).toContain('/Kaisa.png');
        expect(sources[2]).toContain('/Renata.png');
        expect(sources[3]).toContain('/Leblanc.png');
    });

    it('strips spaces and apostrophes from names', () => {
        render(<>{championList("Lee Sin,Kog'Maw")}</>);
        const sources = screen.getAllByRole('img').map((img) => img.getAttribute('src'));
        expect(sources[0]).toContain('/LeeSin.png');
        expect(sources[1]).toContain('/KogMaw.png');
    });

    it('renders nothing for an empty string', () => {
        expect(championList('')).toBeUndefined();
    });
});
