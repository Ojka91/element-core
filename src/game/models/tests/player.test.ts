import { Sage } from "../pieces/pieces";
import Player from "../player";


describe('Player', () => {
    it('getSage: sage should be returned or throw an error ', async () => {
        let player_1 = new Player(0);
        
        expect(() => {player_1.getSage();}).toThrow("Player has no assigned sage")
        
        const sage: Sage = new Sage();
        player_1.setSage(sage);

        expect(player_1.getSage()).toStrictEqual(sage);
    });

    it('getUuid: should return an uuid', async () => {
        const player_1 = new Player(0);
        const uuid = player_1.getUuid();
        const result = uuid == "";

        expect(result).toBe(false);
    })
})
  