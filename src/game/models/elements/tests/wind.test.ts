import Grid, { Position } from "../../grid"
import { Earth } from "../earth"
import { Fire } from "../fire"
import { Water } from "../water"
import { Wind } from "../wind"

describe('Wind: Rule of replacement', () => {
    
    it('Rule of replacement: Should return true if replaces Earth', async () => {
        let result;
        const wind = new Wind();
        result = wind.ruleOfReplacement(new Earth())

        expect(result).toBe(true)
    })

    it('Rule of replacement: Should return true if replaces Wind', async () => {
        let result;
        const wind = new Wind();
        
        result = wind.ruleOfReplacement(new Wind())

        expect(result).toBe(true)
    })

    it('Rule of replacement: Should return false if replaces anything else', async () => {
        let result;
        const wind = new Wind();
        
        result = wind.ruleOfReplacement(new Fire())
        expect(result).toBe(false)

        result = wind.ruleOfReplacement(new Water())
        expect(result).toBe(false)
    
    })

    it('Rule of replacement: Should return false if replacing a max whirlwind', async () => {
        let result;
        const wind = new Wind();

        const whirlwind: Wind = new Wind();
        whirlwind.increaseStackedWinds();
        whirlwind.increaseStackedWinds();
        whirlwind.increaseStackedWinds();
        whirlwind.increaseStackedWinds();

        expect(whirlwind.isMaxWhirlwind()).toBe(true);

        result = wind.ruleOfReplacement(whirlwind);

        expect(result).toBe(true)
    
    })

})

describe('Wind: reaction', () => {
    it('reaction: it should stack winds', async () => {
        
        const grid: Grid = new Grid(2,2);
        const wind: Wind = new Wind();
        const new_wind: Wind = new Wind();
        const pos: Position = {row: 1, column: 1};
        
        // Set grid
        wind.updatePosition(pos);
        new_wind.updatePosition(pos);
        grid.updateGridCell(wind);

        new_wind.reaction(grid, pos);

        expect(grid.isWhirlwindCell(pos)).toBe(true);
        expect(wind.getNumberOfStackedWinds()==2).toBe(true);
    })

    it('reaction: it should not stack winds on a max whirlwind', async () => {
        
        const grid: Grid = new Grid(2,2);
        const wind: Wind = new Wind();
        const new_wind: Wind = new Wind();
        const pos: Position = {row: 1, column: 1};
        
        // Set grid
        wind.updatePosition(pos);
        new_wind.updatePosition(pos);
        grid.updateGridCell(wind);

        expect(wind.getNumberOfStackedWinds()==1).toBe(true);
        new_wind.reaction(grid, pos);
        expect(wind.getNumberOfStackedWinds()==2).toBe(true);
        new_wind.reaction(grid, pos);
        expect(wind.getNumberOfStackedWinds()==3).toBe(true);
        new_wind.reaction(grid, pos);
        expect(wind.getNumberOfStackedWinds()==4).toBe(true);
        new_wind.reaction(grid, pos);
        expect(wind.getNumberOfStackedWinds()==5).toBe(false);
    })

    it('reaction: it should replace earth', async () => {
        
        const grid: Grid = new Grid(2,2);
        const earth: Earth = new Earth();
        const new_wind: Wind = new Wind();
        const pos: Position = {row: 1, column: 1};
        
        // Set grid
        earth.updatePosition(pos);
        new_wind.updatePosition(pos);
        grid.updateGridCell(earth);

        expect(grid.isEarthCell(pos)).toBe(true);
        new_wind.reaction(grid, pos);
        expect(grid.isWindCell(pos)).toBe(true);
    })

    it('reaction: it should not replace mountains nor ranges', async () => {
        
        const grid: Grid = new Grid(2,2);
        const earth: Earth = new Earth();
        const new_wind: Wind = new Wind();
        const pos: Position = {row: 1, column: 1};
        
        // Set grid
        earth.promoteToMountain();
        earth.updatePosition(pos);
        new_wind.updatePosition(pos);
        grid.updateGridCell(earth);

        expect(grid.isMountainCell(pos)).toBe(true);
        new_wind.reaction(grid, pos);
        expect(grid.isWindCell(pos)).toBe(false);

        expect(grid.isRangeCell(pos)).toBe(true);
        new_wind.reaction(grid, pos);
        expect(grid.isWindCell(pos)).toBe(false);
    })

})