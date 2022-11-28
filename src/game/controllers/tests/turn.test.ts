import { ElementTypes } from "@/game/models/elements/elements";
import { TurnModel, TurnStates } from "@/game/models/turn";
import { TurnController } from "../turn_controller";


describe('Turn', () => {

    it('isEndOfTurn: should return true if the state of the turn is EndOfTurn', async () => {
        const turn: TurnModel = new TurnModel(0);
        const turn_controller: TurnController = new TurnController(turn);
        turn.state = TurnStates.DrawingElements;

        expect(turn_controller.isEndOfTurn()).toBe(false);

        turn.state = TurnStates.EndTurn;
        expect(turn_controller.isEndOfTurn()).toBe(true);
        
    })
    it('isDrawingElementsAllowed: should return true if the state of the turn is drawing elements', async () => {
        const turn: TurnModel = new TurnModel(0);
        const turn_controller: TurnController = new TurnController(turn);
        turn.state = TurnStates.MovesAvailables;

        expect(turn_controller.isDrawingElementsAllowed()).toBe(false);

        turn.state = TurnStates.DrawingElements;
        expect(turn_controller.isDrawingElementsAllowed()).toBe(true);
    })
    it('isMovingSageAllowed: should return true if the state of the turn is moves availables and sage moves is not 0', async () => {
        const turn: TurnModel = new TurnModel(0);
        const turn_controller: TurnController = new TurnController(turn);
        turn.state = TurnStates.EndTurn;
        turn.available_sage_moves = 2;

        expect(turn_controller.isMovingSageAllowed()).toBe(false);
    
        turn.state = TurnStates.MovesAvailables;
        expect(turn_controller.isMovingSageAllowed()).toBe(true);

        turn.available_sage_moves = 0;
        expect(turn_controller.isMovingSageAllowed()).toBe(false);

    })
    it('isPlaceElementAllowed: should return true if the state of the turn is moves availables and there are elements available to place', async () => {
        const turn: TurnModel = new TurnModel(0);
        const turn_controller: TurnController = new TurnController(turn);
        turn.state = TurnStates.EndTurn;
        turn.chosen_elements = [ElementTypes.Earth, ElementTypes.Earth];
        
        expect(turn_controller.isPlaceElementAllowed()).toBe(false);
    
        turn.state = TurnStates.MovesAvailables;
        expect(turn_controller.isPlaceElementAllowed()).toBe(true);

        turn.chosen_elements = [];
        expect(turn_controller.isPlaceElementAllowed()).toBe(false);
    })
    it('isNumberOfDrawnElementsAllowed: should return true if the number of drawn elements is allowed', async () => {
        const turn: TurnModel = new TurnModel(0);
        const turn_controller: TurnController = new TurnController(turn);
        
        expect(turn_controller.isNumberOfDrawnElementsAllowed(4)).toBe(false);
    
        expect(turn_controller.isNumberOfDrawnElementsAllowed(3)).toBe(true);

        expect(turn_controller.isNumberOfDrawnElementsAllowed(0)).toBe(true);
    })
    it('setDrawnElements: model should be updated with data in ', async () => {
        const turn: TurnModel = new TurnModel(0);
        const turn_controller: TurnController = new TurnController(turn);
        const chosen_elements: Array<ElementTypes> = [ElementTypes.Earth, ElementTypes.Earth];

        expect(turn.state == TurnStates.DrawingElements).toBe(true);
        turn_controller.setDrawnElements(chosen_elements);

        expect(turn.chosen_elements.every((element, index) => element === turn.chosen_elements[index])).toBe(true);
        expect(turn.available_sage_moves == 3).toBe(true);
        expect(turn.player == 0).toBe(true);
        expect(turn.state == TurnStates.MovesAvailables).toBe(true);
        

    })
    it('getRemainingElements: should return the remaining elements', async () => {
        const turn: TurnModel = new TurnModel(0);
        const turn_controller: TurnController = new TurnController(turn);
        turn.chosen_elements = [ElementTypes.Earth, ElementTypes.Earth];
        const remaining_elements: Array<ElementTypes> = turn_controller.getRemainingElements()
        expect(remaining_elements.every((element, index) => element === turn.chosen_elements[index])).toBe(true);

    })
    it('removeElementFromList: should remove one element from the chosen element list and check for the end of the turn', async () => {
        const turn: TurnModel = new TurnModel(0);
        const turn_controller: TurnController = new TurnController(turn);
        const elements: Array<ElementTypes> = [ElementTypes.Earth, ElementTypes.Earth];
        turn.chosen_elements = [ElementTypes.Earth, ElementTypes.Earth];
        turn.available_sage_moves = 0;
        turn.state = TurnStates.MovesAvailables;
        let result; 

        expect(elements.every((element, index) => element === turn.chosen_elements[index])).toBe(true);
        
        result = turn_controller.removeElementFromList(ElementTypes.Earth);
        expect(result).toBe(true);
        expect(elements.every((element, index) => element === turn.chosen_elements[index])).toBe(false);
        expect(turn.state == TurnStates.MovesAvailables).toBe(true);

        result = turn_controller.removeElementFromList(ElementTypes.Fire);
        expect(result).toBe(false);

        result = turn_controller.removeElementFromList(ElementTypes.Earth);
        turn_controller.removeElementFromList(ElementTypes.Earth);
        expect(elements.every((element, index) => element === turn.chosen_elements[index])).toBe(false);
        expect(turn.state != TurnStates.MovesAvailables).toBe(true);

    })
    it('getPlayer: returns the player number of the turn', async () => {
        const turn: TurnModel = new TurnModel(0);
        const turn_controller: TurnController = new TurnController(turn);

        expect(turn_controller.getPlayer() == 0).toBe(true);
    })
})
  