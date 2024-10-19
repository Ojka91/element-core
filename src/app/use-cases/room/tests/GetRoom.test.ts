import RoomController from "@/domain/game/controllers/room_controller";
import { Queue } from "@/infra/socket/socketUtils";
import CreateRoom from "../CreateRoom";
import GetRoom from "../GetRoom";

jest.mock("@/domain/game/controllers/room_controller");
jest.mock("@/domain/game/controllers/game_controller");
describe("GetRoomUseCase", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("Should get a room model", async () => {
        const roomId = await CreateRoom.execute(Queue.queue2);
        jest.spyOn(RoomController.prototype, "loadRoomById").mockResolvedValue();

        const response = await GetRoom.execute(roomId);
        expect(response).not.toBeNull();
        expect(RoomController.prototype.loadRoomById).toHaveBeenCalledTimes(1);
    });
});
