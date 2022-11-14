
import { Sage } from "../pieces";
import Player, { GameType, PlayerNumber } from "../player";


describe('Player', () => {
    it('getSage: sage is returned upon new player is created ', async () => {
        let player_1 = new Player(PlayerNumber.player_1, GameType.TwoPlayersGame);
        let sage = player_1.getSage();
        let result = sage instanceof Sage;
        
        expect(result).toBe(true);

        player_1 = new Player(PlayerNumber.player_1, GameType.FourPlayersGame);
        sage = player_1.getSage();
        result = sage instanceof Sage;

        expect(result).toBe(true);
    });

    it('getSage: should throw an error if game type is two players and player number is greater than 2 ', async () => {
        expect(() => {
            new Player(PlayerNumber.player_3, GameType.TwoPlayersGame);
        }).toThrow('Player number cannot be greater than allowed players in a Game');
                
    })

    it('getUuid: should return an uuid', async () => {
        const player_1 = new Player(PlayerNumber.player_1, GameType.TwoPlayersGame);
        const uuid = player_1.getUuid();
        const result = uuid == "";

        expect(result).toBe(false);
    })
})
  