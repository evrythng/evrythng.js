const { expect } = require('chai');
const ctx = require('../ctx');

describe('Products', () => {
  it('should create a product', async () => {
    const payload = {
      name: 'Test Product',
      customFields: {
        color: 'red',
        serial: Date.now(),
      },
    };
    
    ctx.product = await ctx.anonUser.product().create(payload);

    expect(ctx.product).to.be.an('object');
    expect(ctx.product.customFields).to.deep.equal(payload.customFields);
  });

  it('should read a product', async () => {
    const res = await ctx.anonUser.product(ctx.product.id).read();

    expect(res).to.be.an('object');
    expect(res.id).to.equal(ctx.product.id);
  });

  it('should read all products', async () => {
    const res = await ctx.anonUser.product().read();

    expect(res).to.be.an('array');
    expect(res).to.have.length.gte(1);
  });

  it('should update a product', async () => {
    const payload = { tags: ['updated'] };
    const res = await ctx.anonUser.product(ctx.product.id).update(payload);
    
    expect(res).to.be.an('object');
    expect(res.tags).to.deep.equal(payload.tags);
  });
});
