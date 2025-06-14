export function buildPayload(data: any, properties: any[]) {
  const result: any = {};
  properties.forEach((prop) => {
    const value = data[prop.name];
    if (prop.path) {
      const keys = prop.path.split('.');
      let curr = result;
      keys.forEach((key: string, i: number) => {
        if (i === keys.length - 1) {
          curr[key] = value;
        } else {
          curr[key] = curr[key] || {};
          curr = curr[key];
        }
      });
    } else {
      result[prop.name] = value;
    }
  });
  return result;
}
