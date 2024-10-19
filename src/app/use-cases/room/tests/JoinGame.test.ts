import RoomController from "@/domain/game/controllers/room_controller";
import { GameModel } from "@/domain/game/models/game";
import { RoomModel } from "@/domain/game/models/room";
import { GameServices } from "@/domain/service/GameServices";
import JoinGame from "../JoinGame";

jest.mock("@/domain/game/controllers/room_controller");
jest.mock("@/domain/game/controllers/game_controller");
describe("JoinGameUseCase", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Client should join game", async () => {
        jest.spyOn(RoomController.prototype, "loadRoomById").mockResolvedValue();
        jest
            .spyOn(RoomController.prototype, "getGame")
            .mockReturnValue(new GameModel());
        jest.spyOn(RoomController.prototype, "getUuid").mockReturnValueOnce("uuid");
        jest.spyOn(RoomController.prototype, "save").mockResolvedValueOnce();
        jest
            .spyOn(RoomController.prototype, "isRoomFull")
            .mockReturnValueOnce(false);
        jest
            .spyOn(RoomController.prototype, "gameStart")
            .mockResolvedValueOnce(true);
        jest.spyOn(GameServices, "preparePublicResponse").mockReturnValue({
            room_uuid: "roomUUID",
            room: new RoomModel(0),
            player_turn_uuid: "playerUUID",
        });
        jest
            .spyOn(RoomController.prototype, "getPlayerBySocketId")
            .mockReturnValue({
                uuid: 'string',
                ...{} as any // Don't care the rest
            });

        let response = await JoinGame.execute("123", {
            socketId: "1234",
            username: "4321",
        });
        expect(RoomController.prototype.loadRoomById).toHaveBeenCalledTimes(1);
        expect(RoomController.prototype.save).toHaveBeenCalledTimes(1);
        expect(response).toHaveProperty("roomUuid");
        expect(response).toHaveProperty("userUuid");

        jest
            .spyOn(RoomController.prototype, "isRoomFull")
            .mockReturnValueOnce(true);
        response = await JoinGame.execute("123", {
            socketId: "1234",
            username: "4321",
        });
    });
});
