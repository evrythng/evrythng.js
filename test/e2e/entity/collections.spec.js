const { expect } = require('chai');
const ctx = require('../ctx');

describe('Collections', () => {
  it('should create a collection', async () => {
    const payload = {
      name: 'Test Collection',
      customFields: {
        color: 'red',
        serial: Date.now(),
      },
    };
    
    ctx.collection = await ctx.anonUser.collection().create(payload);

    expect(ctx.collection).to.be.an('object');
    expect(ctx.collection.customFields).to.deep.equal(payload.customFields);
  });

  it('should read a collection', async () => {
    const res = await ctx.anonUser.collection(ctx.collection.id).read();

    expect(res).to.be.an('object');
    expect(res.id).to.equal(ctx.collection.id);
  });

  it('should read all collections', async () => {
    const res = await ctx.anonUser.collection().read();

    expect(res).to.be.an('array');
    expect(res).to.have.length.gte(1);
  });

  it('should update a collection', async () => {
    const payload = { tags: ['updated'] };
    const res = await ctx.anonUser.collection(ctx.collection.id).update(payload);
    
    expect(res).to.be.an('object');
    expect(res.tags).to.deep.equal(payload.tags);
  });
});
