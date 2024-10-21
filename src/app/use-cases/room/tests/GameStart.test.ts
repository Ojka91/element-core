import RoomController from "@/domain/game/controllers/room_controller";
import { RoomModel } from "@/domain/game/models/room";
import { GameServices } from "@/domain/service/GameServices";
import GameStart from "../GameStart";

jest.mock("@/domain/game/controllers/room_controller");
jest.mock("@/domain/game/controllers/game_controller");
describe("GameStartUseCase", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("Should start a game", async () => {
        jest.spyOn(RoomController.prototype, "loadRoomById").mockResolvedValue();
        jest
            .spyOn(RoomController.prototype, "isRoomFull")
            .mockReturnValueOnce(true);
        jest.spyOn(GameServices, "preparePublicResponse").mockReturnValue({
            room_uuid: "roomUUID",
            room: new RoomModel(0),
            player_turn_uuid: "playerUUID",
        });
        const gameStartUseCase = new GameStart();
        let response = await gameStartUseCase.execute("RoomUUID");
        expect(response).not.toBeNull();
        expect(RoomController.prototype.gameStart).toHaveBeenCalledTimes(1);

        jest
            .spyOn(RoomController.prototype, "isRoomFull")
            .mockReturnValueOnce(false);
        response = await gameStartUseCase.execute("RoomUUID");
        expect(response).toBeNull();
    });
});
