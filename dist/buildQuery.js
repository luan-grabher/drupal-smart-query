"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQuery = buildQuery;
const json_to_graphql_query_1 = require("json-to-graphql-query");
function buildQuery(dsl) {
    const converted = convertDSL(dsl);
    return (0, json_to_graphql_query_1.jsonToGraphQLQuery)({ query: converted }, { pretty: true });
}
function convertDSL(dsl) {
    const root = dsl.route;
    return {
        route: convertNode(root)
    };
}
function convertNode(obj) {
    const out = {};
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
function convertGroup(group) {
    const out = {};
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
            }
            else if (typeof fieldValue === "string") {
                out[key] = { __aliasFor: fieldValue };
            }
        }
    }
    return out;
}
function isGroup(x) {
    return x && typeof x === "object" && "source" in x;
}
function isSimpleField(x) {
    return x === true || typeof x === "string";
}
