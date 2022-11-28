import { SageModel } from "@/game/models/pieces/sage";
import { PlayerModel } from "@/game/models/player";
import PlayerController from "../player_controller";


describe('Player', () => {
    it('getSage: sage should be returned or throw an error ', async () => {
        const player = new PlayerModel(0);
        const player_controller: PlayerController = new PlayerController(player); 
        expect(() => {player_controller.getSage();}).toThrow("Player has no assigned sage")
        
        const sage: SageModel = new SageModel();
        player_controller.setSage(sage);

        expect(player_controller.getSage()).toStrictEqual(sage);
    });

    it('getUuid: should return an uuid', async () => {
        const player = new PlayerModel(0);
        const player_controller: PlayerController = new PlayerController(player); 
        const uuid = player_controller.getUuid();
        const result = uuid == "";

        expect(result).toBe(false);
    })

    it('getPlayerNumber: should return the player number', async () => {
        const player = new PlayerModel(0);
        const player_controller: PlayerController = new PlayerController(player); 
        const num = player_controller.getPlayerNumber();

        expect(num == 0).toBe(true);
    })
})
  