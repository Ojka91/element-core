import { Earth } from "../earth"
import { Fire } from "../fire"
import { Water } from "../water"
import { Wind } from "../wind"

describe('Water', () => {
    let result;
    it('Rule of replacement: Should return true if replaces Fire', async () => {
        const water = new Water()
        result = water.ruleOfReplacement(new Fire())

        expect(result).toBe(true)
    })

    it('Rule of replacement: Should return false if replaces anything else', async () => {
        const water = new Water()
        result = water.ruleOfReplacement(new Earth())
        expect(result).toBe(false)
        result = water.ruleOfReplacement(new Wind())
        expect(result).toBe(false)
        result = water.ruleOfReplacement(new Water())
        expect(result).toBe(false)
    
    })

})
  