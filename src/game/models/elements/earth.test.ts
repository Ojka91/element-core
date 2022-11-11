import { Earth } from "./earth"
import { Fire } from "./fire"
import { Water } from "./water"
import { Wind } from "./wind"

describe('Earth', () => {
    it('Rule of replacement: Should return true if repalces water or earth', async () => {
        const earth = new Earth()
        const water = earth.ruleOfReplacement(new Water())
        const replacedEarth = earth.ruleOfReplacement(new Earth())

        expect(water).toBe(true)
        expect(replacedEarth).toBe(true)
    })

    it('Rule of replacement: Should return false if repalces a range of mountains', async () => {
        const earth = new Earth()
        earth.ruleOfReplacement(new Earth())
        const result = earth.ruleOfReplacement(new Earth())

        expect(result).toBe(false)
    })

    it('Rule of replacement: Should return false if repalces fire or wind', async () => {
        const earth = new Earth()
        const fire = earth.ruleOfReplacement(new Fire())
        const wind = earth.ruleOfReplacement(new Wind())

        expect(fire).toBe(false)
        expect(wind).toBe(false)
    })

})
  