import { Earth } from "../elements/earth";
import { ElementTypes } from "../elements/elements";
import { Fire } from "../elements/fire";
import { Water } from "../elements/water";
import { Wind } from "../elements/wind";
import { Empty, Sage } from "../pieces";
import { ElementPieceCreator, EmptyPieceCreator, SagePieceCreator } from "../pieces_factory"


describe('Pieces', () => {
    it('Pieces factory: Can create Sage pieces', async () => {
        const sage_factory = new SagePieceCreator().createPiece();
        const sage = new Sage();

        expect(sage_factory).toStrictEqual(sage);
    })

    it('Pieces factory: Can create Empty pieces', async () => {
        const empty_factory = new EmptyPieceCreator().createPiece();
        const empty = new Empty();

        expect(empty_factory).toStrictEqual(empty);
    })

    it('Pieces factory: Can create all Element pieces', async () => {
        let element_factory = new ElementPieceCreator(ElementTypes.Fire).createPiece();
        let element = new Fire();

        expect(element_factory).toStrictEqual(element);

        element_factory = new ElementPieceCreator(ElementTypes.Water).createPiece();
        element = new Water();

        expect(element_factory).toStrictEqual(element);

        element_factory = new ElementPieceCreator(ElementTypes.Earth).createPiece();
        element = new Earth();

        expect(element_factory).toStrictEqual(element);

        element_factory = new ElementPieceCreator(ElementTypes.Wind).createPiece();
        element = new Wind();

        expect(element_factory).toStrictEqual(element);
        
    })

    it('updatePosition: Pieces subclasses can update their position', async () => {
        const sage = new SagePieceCreator().createPiece();
        sage.updatePosition(1,2);

        expect(sage.row).toStrictEqual(1);
        expect(sage.column).toStrictEqual(2);
    })
})
  