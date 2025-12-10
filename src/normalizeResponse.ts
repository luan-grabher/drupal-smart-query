import { SmartQueryDSL, SmartGroup } from "./types";

export function normalizeResponse(dsl: SmartQueryDSL, rawResponse: any) {
  const route = rawResponse?.data?.route;
  if (!route) return null;

  const result: any = {
    url: route.url ?? null,
    internal: route.internal ?? null,
    entity: null,
    raw: rawResponse
  };

  const entity = route.entity;
  if (!entity) return result;

  result.entity = normalizeEntity(dsl.route.entity, entity);

  return result;
}

function normalizeEntity(dslEntity: any, entityRaw: any) {
  const out: any = {
    id: entityRaw.id ?? null,
    type: entityRaw.__typename ?? null,
    path: entityRaw.path ?? null
  };

  for (const key of Object.keys(dslEntity)) {
    if (["id", "path"].includes(key)) continue;
    const val = dslEntity[key];

    if (isGroup(val)) {
      out[key] = normalizeGroup(val, entityRaw);
      continue;
    }

    if (val === true) {
      out[key] = entityRaw[key] ?? null;
      continue;
    }

    if (typeof val === "string") {
      out[key] = entityRaw[val] ?? null;
      continue;
    }
  }

  return out;
}

function normalizeGroup(group: SmartGroup, entityRaw: any) {
  const sourceValue = entityRaw[group.source];
  if (!sourceValue) return null;

  if (group.__union) {
    return normalizeUnionGroup(group, sourceValue);
  }

  if (group.fields) {
    return normalizeFieldsGroup(group, sourceValue);
  }

  return null;
}

function normalizeFieldsGroup(group: SmartGroup, raw: any) {
  const out: any = {};

  for (const key of Object.keys(group.fields!)) {
    const mapping = group.fields![key];

    if (mapping === true) {
      out[key] = raw[key] ?? null;
      continue;
    }

    if (typeof mapping === "string") {
      out[key] = raw[mapping] ?? null;
      continue;
    }
  }

  return out;
}

function normalizeUnionGroup(group: SmartGroup, rawList: any[]) {
  if (!Array.isArray(rawList)) return [];

  const items = [];

  for (const item of rawList) {
    const type = item.__typename;
    const dslType = group.__union![type];

    if (!dslType) continue;

    const parsed: any = { type };

    for (const key of Object.keys(dslType)) {
      const mapping = dslType[key];

      if (mapping === true) {
        parsed[key] = extractValue(item[key]);
        continue;
      }

      if (typeof mapping === "string") {
        parsed[key] = extractValue(item[mapping]);
      }
    }

    items.push(parsed);
  }

  return items;
}

function extractValue(val: any) {
  if (!val) return null;
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    if (val.value) return val.value;
    if (val.processed) return val.processed;
    if (val.url) return val.url;
  }
  return val;
}

function isGroup(x: any): x is SmartGroup {
  return x && typeof x === "object" && "source" in x;
}
