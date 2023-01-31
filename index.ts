import { z } from 'zod';

// simple number schema.
let schema = z.number();
let res = schema.parse(5) as any;
console.log(res);

// throws error because of different type
try {
  res = schema.parse('5');
} catch (e) {
  console.error({ e });
}

// coerce string into number
schema = z.coerce.number();
res = schema.parse('5');
console.log({ res });

// coerce string into number, but result is error because string is invalid.
schema = z.coerce.number();
try {
  res = schema.parse('hello');
} catch (error) {
  console.error({ error });
}

// more restrictions on number, https://www.npmjs.com/package/zod#numbers
schema = z.coerce.number()
  .positive()
  .multipleOf(2)
// .nonnegative()
// .negative()
res = schema.parse(6);
console.log({ res });


// simple array schema, https://www.npmjs.com/package/zod#arrays
const arraySchema = z.array(z.any());
res = arraySchema.parse([]);
console.log({ res });

// with restrictions
const aSchema1 = z.array(z.any())
  .max(3)
  .min(1)
  // .length(4)
  // .nonempty()
try {
  res = aSchema1.parse([]);
} catch (error) {
  console.error({ error });
}

// coerce the array elements into number.
const aSchema2 = z.array(z.coerce.number());
try {
  res = aSchema2.parse([3, 4, '5']);
  console.log({ res });
} catch (e) {
  console.error({ e });
}

// Objects => https://www.npmjs.com/package/zod#objects
const objSchema = z.object({
  msg: z.coerce.string().optional(),
  email: z.coerce.string().email()
})
res = objSchema.parse({
  msg: 'hello',
  email: 'valid@email.com'
})
console.log({ res });

const invoiceSchema2 = z.object({
  id: z.coerce.number().positive(),
  totalTaxExclusive: z.coerce.number().finite(),
  taxAmount: z.coerce.number().finite(),
  totalTaxInclusive: z.coerce.number().finite(),
  products: z.array(z.object({
    sku: z.coerce.string().max(30),
    priceTaxExclusive: z.coerce.number().finite(),
    taxAmount: z.coerce.number().finite(),
    discount: z.coerce.number().finite().optional()
  }))
})

res = invoiceSchema2.parse({
  id: 1,
  totalTaxExclusive: 100,
  taxAmount: 15,
  totalTaxInclusive: 115,
  // whatever: 3224,
  products: [{
    sku: 'sku',
    priceTaxExclusive: 100,
    taxAmount: 15,
    discount: 0
  }]
})

console.log({ res });

