describe('Test suite mix #1', () => {
  it('test case #1', () => {
    expect(true).to.eq(true);
  });

  it('test case #2', () => {
    expect(true).to.eq(false);
  });

  it.skip('test case #3', () => {
    expect(true).to.eq(true);
  });
});

describe('Test suite mix #2', () => {
  it('test case #4', () => {
    expect(true).to.eq(true);
  });

  it.skip('test case #5', () => {
    expect(true).to.eq(true);
  });
});
