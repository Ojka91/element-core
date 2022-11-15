import { ElementTypes } from "../elements"
import { ElementFactoryMap } from "../elements_factory"
import { Fire } from "../fire"


describe('Fire', () => {
    let result;
    it('Rule of replacement: Should return true if replaces wind', async () => {
        const fire = new Fire()
        
        const wind = new ElementFactoryMap[ElementTypes.Wind]().createElement();
        result = fire.ruleOfReplacement(wind);

        expect(result).toBe(true)
    })

    it('Rule of replacement: Should return false if replaces everything else', async () => {
        const fire = new Fire();
        const earth = new ElementFactoryMap[ElementTypes.Earth]().createElement();
        const water = new ElementFactoryMap[ElementTypes.Water]().createElement();
        const fire_2 = new ElementFactoryMap[ElementTypes.Fire]().createElement();
        
        // Shouldn't replace earth
        result = fire.ruleOfReplacement(earth)
        expect(result).toBe(false);
        // Shoudln't replace water
        result = fire.ruleOfReplacement(water)
        expect(result).toBe(false);
        // Cannot stack neither replace fire over fire
        result = fire.ruleOfReplacement(fire_2);
        expect(result).toBe(false);
        
    })

})
  