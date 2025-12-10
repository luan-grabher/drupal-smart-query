"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeResponse = normalizeResponse;
function normalizeResponse(dsl, rawResponse) {
    var _a, _b, _c;
    const route = (_a = rawResponse === null || rawResponse === void 0 ? void 0 : rawResponse.data) === null || _a === void 0 ? void 0 : _a.route;
    if (!route)
        return null;
    const result = {
        url: (_b = route.url) !== null && _b !== void 0 ? _b : null,
        internal: (_c = route.internal) !== null && _c !== void 0 ? _c : null,
        entity: null,
        raw: rawResponse
    };
    const entity = route.entity;
    if (!entity)
        return result;
    result.entity = normalizeEntity(dsl.route.entity, entity);
    return result;
}
function normalizeEntity(dslEntity, entityRaw) {
    var _a, _b, _c, _d, _e;
    const out = {
        id: (_a = entityRaw.id) !== null && _a !== void 0 ? _a : null,
        type: (_b = entityRaw.__typename) !== null && _b !== void 0 ? _b : null,
        path: (_c = entityRaw.path) !== null && _c !== void 0 ? _c : null
    };
    for (const key of Object.keys(dslEntity)) {
        if (["id", "path"].includes(key))
            continue;
        const val = dslEntity[key];
        if (isGroup(val)) {
            out[key] = normalizeGroup(val, entityRaw);
            continue;
        }
        if (val === true) {
            out[key] = (_d = entityRaw[key]) !== null && _d !== void 0 ? _d : null;
            continue;
        }
        if (typeof val === "string") {
            out[key] = (_e = entityRaw[val]) !== null && _e !== void 0 ? _e : null;
            continue;
        }
    }
    return out;
}
function normalizeGroup(group, entityRaw) {
    const sourceValue = entityRaw[group.source];
    if (!sourceValue)
        return null;
    if (group.__union) {
        return normalizeUnionGroup(group, sourceValue);
    }
    if (group.fields) {
        return normalizeFieldsGroup(group, sourceValue);
    }
    return null;
}
function normalizeFieldsGroup(group, raw) {
    var _a, _b, _c, _d, _e;
    const out = {};
    for (const key of Object.keys(group.fields)) {
        const mapping = group.fields[key];
        if (mapping === true) {
            out[key] = (_a = raw[key]) !== null && _a !== void 0 ? _a : null;
            continue;
        }
        if (typeof mapping === "string") {
            out[key] = (_b = raw[mapping]) !== null && _b !== void 0 ? _b : null;
            continue;
        }
        // support nested group mapping inside fields: { source: 'MediaImage', fields: { url: 'mediaImage.url' } }
        if (mapping && typeof mapping === 'object' && 'source' in mapping) {
            const nestedRaw = raw[key];
            if (!nestedRaw) {
                out[key] = null;
                continue;
            }
            // If the nested group maps a single field, return that value directly (convenience for images -> url)
            const fieldKeys = Object.keys(mapping.fields || {});
            if (fieldKeys.length === 1) {
                const singleMap = mapping.fields[fieldKeys[0]];
                if (typeof singleMap === 'string') {
                    out[key] = (_c = getByPath(nestedRaw, singleMap)) !== null && _c !== void 0 ? _c : null;
                    continue;
                }
            }
            // Otherwise build an object with the mapped fields
            const nestedOut = {};
            for (const nk of fieldKeys) {
                const nm = mapping.fields[nk];
                if (nm === true) {
                    nestedOut[nk] = (_d = nestedRaw[nk]) !== null && _d !== void 0 ? _d : null;
                }
                else if (typeof nm === 'string') {
                    nestedOut[nk] = (_e = getByPath(nestedRaw, nm)) !== null && _e !== void 0 ? _e : null;
                }
            }
            out[key] = nestedOut;
            continue;
        }
    }
    return out;
}
function getByPath(obj, path) {
    if (!obj || !path)
        return null;
    const parts = path.split('.');
    let cur = obj;
    for (const p of parts) {
        if (cur == null)
            return null;
        cur = cur[p];
    }
    return cur;
}
function normalizeUnionGroup(group, rawList) {
    if (!Array.isArray(rawList))
        return [];
    const items = [];
    for (const item of rawList) {
        const type = item.__typename;
        const dslType = group.__union[type];
        if (!dslType)
            continue;
        const parsed = { type };
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
function extractValue(val) {
    if (!val)
        return null;
    if (typeof val === "string")
        return val;
    if (typeof val === "object") {
        if (val.value)
            return val.value;
        if (val.processed)
            return val.processed;
        if (val.url)
            return val.url;
    }
    return val;
}
function isGroup(x) {
    return x && typeof x === "object" && "source" in x;
}
