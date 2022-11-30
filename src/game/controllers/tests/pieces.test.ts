import { EarthModel } from "@/game/models/elements/earth";
import { ElementTypes } from "@/game/models/elements/elements";
import { FireModel } from "@/game/models/elements/fire";
import { WaterModel } from "@/game/models/elements/water";
import { WindModel } from "@/game/models/elements/wind";
import { EmptyModel } from "@/game/models/pieces/empty";
import { PieceModel } from "@/game/models/pieces/pieces";
import { SageModel } from "@/game/models/pieces/sage";
import { ElementPieceCreator, EmptyPieceCreator, SagePieceCreator } from "@/game/models/pieces_factory";
import { Position } from "@/game/utils/position_utils";
import { SageController } from "../pieces/sage_controller";

describe('Pieces', () => {
    it('Pieces factory: Can create SageModel pieces', async () => {
        const sage_factory = new SagePieceCreator().createPieceModel();
        const sage = new SageModel();

        expect(sage_factory instanceof SageModel && sage instanceof SageModel).toBe(true);
    })

    it('Pieces factory: Can create Empty pieces', async () => {
        const empty_factory = new EmptyPieceCreator().createPieceModel();
        const empty = new EmptyModel();

        expect(empty_factory).toStrictEqual(empty);
    })

    it('Pieces factory: Can create all Element pieces', async () => {
        let element_factory = new ElementPieceCreator(ElementTypes.Fire).createPieceModel();
        let element: PieceModel = new FireModel();

        expect(element_factory).toStrictEqual(element);

        element_factory = new ElementPieceCreator(ElementTypes.Water).createPieceModel();
        element = new WaterModel();

        expect(element_factory).toStrictEqual(element);

        element_factory = new ElementPieceCreator(ElementTypes.Earth).createPieceModel();
        element = new EarthModel();

        expect(element_factory).toStrictEqual(element);

        element_factory = new ElementPieceCreator(ElementTypes.Wind).createPieceModel();
        element = new WindModel();

        expect(element_factory).toStrictEqual(element);
        
    })

    it('updatePosition: Pieces subclasses can update their position', async () => {
        const sage = new SagePieceCreator().createPieceModel() as SageModel;
        const sage_controller = new SageController(sage);
        const position: Position = {row: 1, column: 2}
        sage_controller.updatePosition(position);

        expect(sage.position.row).toStrictEqual(1);
        expect(sage.position.column).toStrictEqual(2);
    })
})
  