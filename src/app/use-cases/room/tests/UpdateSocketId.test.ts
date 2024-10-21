import RoomController from "@/domain/game/controllers/room_controller";
import { RoomModel } from "@/domain/game/models/room";
import UpdateSocketId from "../UpdateSocketId";

jest.mock("@/domain/game/controllers/room_controller");
jest.mock("@/domain/game/controllers/game_controller");
describe("UpdateSocketIdUseCase", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("Should update the socket id", async () => {
        jest.spyOn(RoomController.prototype, "save").mockResolvedValueOnce();

        await UpdateSocketId.execute(
            new RoomModel(0),
            "RoomUUID",
            "NewSocketId"
        );
        expect(RoomController.prototype.save).toHaveBeenCalledTimes(1);
    });
});
