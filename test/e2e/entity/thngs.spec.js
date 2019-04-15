const { expect } = require('chai');
const ctx = require('../ctx');

describe('Thngs', () => {
  it('should create a Thng', async () => {
    const payload = {
      name: 'Test Thng',
      customFields: {
        color: 'red',
        serial: Date.now(),
      },
    };
    
    ctx.thng = await ctx.anonUser.thng().create(payload);

    expect(ctx.thng).to.be.an('object');
    expect(ctx.thng.customFields).to.deep.equal(payload.customFields);
  });

  it('should read a Thng', async () => {
    const res = await ctx.anonUser.thng(ctx.thng.id).read();

    expect(res).to.be.an('object');
    expect(res.id).to.equal(ctx.thng.id);
  });

  it('should read all Thngs', async () => {
    const res = await ctx.anonUser.thng().read();

    expect(res).to.be.an('array');
    expect(res).to.have.length.gte(1);
  });

  it('should update a Thng', async () => {
    const payload = { tags: ['updated'] };
    const res = await ctx.anonUser.thng(ctx.thng.id).update(payload);
    
    expect(res).to.be.an('object');
    expect(res.tags).to.deep.equal(payload.tags);
  });
});
