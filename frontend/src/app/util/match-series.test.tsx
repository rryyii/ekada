import { describe, expect, it } from 'vitest';
import { groupMatches, groupPlayersIntoTeams, parsePlayersIntoRoles } from './match-series';

describe('groupMatches', () => {
    it('groups games by GameId', () => {
        const map = groupMatches([
            { GameId: 'a', Name: 'p1' },
            { GameId: 'b', Name: 'p2' },
            { GameId: 'a', Name: 'p3' },
        ]);
        expect(map.get('a')).toHaveLength(2);
        expect(map.get('b')).toHaveLength(1);
    });

    it('returns an empty map for no games', () => {
        expect(groupMatches([]).size).toBe(0);
    });
});

describe('groupPlayersIntoTeams', () => {
    it('groups players by team and then by game', () => {
        const map = groupPlayersIntoTeams([
            { Team: 'T1', GameId: 'g1', Name: 'Faker' },
            { Team: 'T1', GameId: 'g1', Name: 'Oner' },
            { Team: 'T1', GameId: 'g2', Name: 'Faker' },
            { Team: 'Gen.G', GameId: 'g1', Name: 'Chovy' },
        ]);
        expect([...map.keys()]).toEqual(['T1', 'Gen.G']);
        expect(map.get('T1').get('g1')).toHaveLength(2);
        expect(map.get('T1').get('g2')).toHaveLength(1);
        expect(map.get('Gen.G').get('g1')[0].Name).toBe('Chovy');
    });
});

describe('parsePlayersIntoRoles', () => {
    it('splits coaches from players', () => {
        const [players, coaches] = parsePlayersIntoRoles('Faker;;Oner;;kkOma', 'Mid;;Jungle;;Coach');
        expect(players.get('Faker')).toBe('Mid');
        expect(players.get('Oner')).toBe('Jungle');
        expect(players.has('kkOma')).toBe(false);
        expect(coaches.get('kkOma')).toBe('Coach');
    });
});
