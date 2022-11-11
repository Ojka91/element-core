import { Earth } from "./earth"
import { Fire } from "./fire"
import { Water } from "./water"
import { Wind } from "./wind"

describe('Fire', () => {
    it('Rule of replacement: Should return true if repalces wind', async () => {
        const fire = new Fire()
        const result = fire.ruleOfReplacement(new Wind())

        expect(result).toBe(true)
    })

    it('Rule of replacement: Should return false if repalces everything else', async () => {
        const fire = new Fire()
        const earth = fire.ruleOfReplacement(new Earth())
        const water = fire.ruleOfReplacement(new Water())
        const doubleFire = fire.ruleOfReplacement(new Fire())

        expect(earth).toBe(false)
        expect(water).toBe(false)
        expect(doubleFire).toBe(false)
    })

})
  