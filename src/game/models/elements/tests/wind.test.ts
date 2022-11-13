import { Earth } from "../earth"
import { Fire } from "../fire"
import { Water } from "../water"
import { Wind } from "../wind"

describe('Wind', () => {
    let result;
    const wind = new Wind();
    it('Rule of replacement: Should return true if replaces Earth', async () => {
        result = wind.ruleOfReplacement(new Earth())

        expect(result).toBe(true)
    })

    it('Rule of replacement: Should return true if replaces Wind', async () => {
        result = wind.ruleOfReplacement(new Wind())

        expect(result).toBe(true)
    })

    it('Rule of replacement: Should return false if replaces anything else', async () => {
        result = wind.ruleOfReplacement(new Fire())
        expect(result).toBe(false)

        result = wind.ruleOfReplacement(new Water())
        expect(result).toBe(false)
    
    })

})
  