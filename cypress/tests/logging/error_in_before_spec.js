describe('Error is generated in before()', () => {
  before(() => {
    const undef = undefined;
    undef.method();
  });

  it('logging shold be properly generated', () => {
    expect(true).to.eq(true);
  });
});
