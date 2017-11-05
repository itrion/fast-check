import * as assert from 'power-assert';
import { DummyRandomGenerator } from './TestRandomGenerator'
import MutableRandomGenerator from '../../../src/random/generator/MutableRandomGenerator';
import Arbitrary from '../../../src/check/arbitrary/Arbitrary';
import { array } from '../../../src/check/arbitrary/ArrayArbitrary';
import * as jsc from 'jsverify';

class DummyArbitrary implements Arbitrary<any> {
    constructor(public value:() => number) {
    }
    generate(mrng: MutableRandomGenerator) {
        return { key: this.value() };
    }
}

describe("ArrayArbitrary", () => {
    describe('array', () => {
        it('Should generate an array using specified arbitrary', () => jsc.assert(
            jsc.forall(jsc.integer, (seed) => {
                const mrng = new MutableRandomGenerator(new DummyRandomGenerator(seed));
                const g = array(new DummyArbitrary(() => 42)).generate(mrng);
                assert.deepEqual(g, [...Array(g.length)].map(() => new Object({key: 42})));
                return true;
            })
        ));
        it('Should generate an array calling multiple times arbitrary generator', () => jsc.assert(
            jsc.forall(jsc.integer, (seed) => {
                const mrng = new MutableRandomGenerator(new DummyRandomGenerator(seed));
                let num = 0;
                const g = array(new DummyArbitrary(() => ++num)).generate(mrng);
                let numBis = 0;
                assert.deepEqual(g, [...Array(g.length)].map(() => new Object({key: ++numBis})));
                return true;
            })
        ));
        it('Should generate an array given maximal length', () => jsc.assert(
            jsc.forall(jsc.integer, jsc.integer(0, 10000), (seed, maxLength) => {
                const mrng = new MutableRandomGenerator(new DummyRandomGenerator(seed));
                const g = array(new DummyArbitrary(() => 42), maxLength).generate(mrng);
                return g.length <= maxLength;
            })
        ));
    });
});