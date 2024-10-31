import {LikeCountCalculator} from "./like-count-calculator";

describe('', () => {
    it('Should ', () => {
        const calculator = new LikeCountCalculator();

        const result = calculator.calculateExsistingIncriment('Like', 0, 1)

        expect(result.dislikesCount).toBe(-1)
        expect(result.likesCount).toBe(1)
    })
})