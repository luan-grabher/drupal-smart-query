import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { SmartQueryDSL, SmartGroup, SmartFieldValue } from "./types";

export function buildQuery(dsl: SmartQueryDSL): string {
  const converted = convertDSL(dsl);

  return jsonToGraphQLQuery({ query: converted }, { pretty: true });
}

function convertDSL(dsl: SmartQueryDSL): any {
  const root = dsl.route;
  return {
    route: convertNode(root)
  };
}

function convertNode(obj: Record<string, any>): any {
  const out: any = {};

  for (const key of Object.keys(obj)) {
    const val = obj[key];

    if (key === "__args") {
      out.__args = val;
      continue;
    }

    if (isSimpleField(val)) {
      out[key] = val === true ? true : { __aliasFor: val };
      continue;
    }

    if (isGroup(val)) {
      out[val.source] = convertGroup(val);
      continue;
    }

    out[key] = convertNode(val);
  }

  return out;
}

function convertGroup(group: SmartGroup): any {
  const out: any = {};

  if (group.__union) {
    for (const typeName of Object.keys(group.__union)) {
      const fragmentName = `FRAG_${typeName}`;
      out[`... on ${typeName}`] = convertNode(group.__union[typeName]);
    }
    return out;
  }

  if (group.fields) {
    for (const key of Object.keys(group.fields)) {
      const fieldValue = group.fields[key];
      if (fieldValue === true) {
        out[key] = true;
      } else if (typeof fieldValue === "string") {
        out[key] = { __aliasFor: fieldValue };
      }
    }
  }

  return out;
}

function isGroup(x: any): x is SmartGroup {
  return x && typeof x === "object" && "source" in x;
}

function isSimpleField(x: any): boolean {
  return x === true || typeof x === "string";
}
