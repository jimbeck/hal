import { z } from 'zod';

export function parseHalTemplate(json: any) {
  // derive the target URL
  const target = json._templates.default.target || json._links.self.href;

  // build up a Zod “shape” for each property
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const prop of json._templates.default.properties) {
    let field: z.ZodTypeAny;

    if (prop.type === 'cv' && prop.accepted) {
      const values = prop.accepted.map((v: any) => v.id) as [string, ...string[]];
      const enumSchema = z.enum(values);
      field = prop.multiple ? z.array(enumSchema) : enumSchema;
    } else {
      switch (prop.type) {
        case 'string':
          field = z.string();
          if (prop.regex) {
            field = (field as z.ZodString).regex(
              new RegExp(prop.regex),
              prop.message
            );
          }
          break;
        case 'boolean':
          field = z.boolean();
          break;
        case 'number':
          field = z.coerce.number();
          break;
        case 'date':
          field = z.string().refine(
            (val) => !isNaN(Date.parse(val)),
            { message: 'Invalid date format' }
          );
          break;
        default:
          field = z.any();
      }
    }

    if (!prop.required) {
      field = field.optional();
    }

    shape[prop.name] = field;
  }

  return { target, schema: z.object(shape) };
}