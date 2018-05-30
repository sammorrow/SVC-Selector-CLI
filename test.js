const expect = require('chai').expect;
const spawn = require("child_process").spawn;
const child = spawn("node", ['shell']);

describe('Shell Tests', () => {

  describe('single selector', () => {
    it('pulls classes properly', done => {
      child.stdout.once('data', res => {
        expect(JSON.parse(res)).to.equal(26);
        done()
      })
      child.stdin.write("Input");
    })
    it('pulls classNames (finds 6 container classes)', done => {
      child.stdout.once('data', res => {
        expect(JSON.parse(res)).to.equal(6);
        done()
      })
      child.stdin.write(".container");
    })
    it('pulls identifiers properly', done => {
      child.stdout.once('data', res => {
        expect(JSON.parse(res)).to.equal(1);
        done()
      })
      child.stdin.write("#rate");
    })
  })

  describe('compound selector', () => {
    it('pulls nodes by class and className (single)', done => {
      child.stdout.once('data', res => {
        expect(JSON.parse(res)).to.equal(3);
        done()
      })
      child.stdin.write("StackView.column");
    })
    it('pulls nodes by class and classNames (multiple)', done => {
      child.stdout.once('data', res => {
        expect(JSON.parse(res)).to.equal(1);
        done()
      })
      child.stdin.write("StackView.container.accessoryView");
    })
    it('pulls nodes by class and identifier', done => {
      child.stdout.once('data', res => {
        expect(JSON.parse(res)).to.equal(1);
        done()
      })
      child.stdin.write("Input#rate");
    })
  })

  describe('multiple selectors', () => {
    it('pulls descendent nodes from parent class', done => {
      child.stdout.once('data', res => {
        expect(JSON.parse(res)).to.equal(5);
        done()
      })
      child.stdin.write("StackView .container");
    })
    it('pulls descendent nodes from parent className', done => {
      child.stdout.once('data', res => {
        expect(JSON.parse(res)).to.equal(3);
        done()
      })
      child.stdin.write(".columns StackView");
    })
    it('pulls descendent nodes from parent identifier', done => {
      child.stdout.once('data', res => {
        expect(JSON.parse(res)).to.equal(26);
        done()
      })
      child.stdin.write("#System Input");
    })
    it('pulls descendent nodes from compound selector', done => {
      child.stdout.once('data', res => {
        expect(JSON.parse(res)).to.equal(3);
        done()
      })
      child.stdin.write("StackView.columns .container");
    })
    it('supports multiple tiers of selectors', done => {
      child.stdout.once('data', res => {
        expect(JSON.parse(res)).to.equal(3);
        done()
      })
      child.stdin.write("#System StackView.columns .container");
    })
  })
  
})