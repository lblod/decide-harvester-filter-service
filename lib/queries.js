import { bestuursorganen } from "./../config/bestuursorganen";
import { prefixes } from "./../config/query-definitions";
import { sparqlEscapeUri } from "mu";
import { INPUT_GRAPH } from "./../constant";

function buildPrefixBlock() {
  return Object.entries(prefixes)
    .map(([prefix, uri]) => `PREFIX ${prefix}: <${sparqlEscapeUri(uri)}>`)
    .join("\n");
}

function buildValuesBlock(varName) {
  const lines = bestuursorganen.map((bestuursorgaan) => `<${bestuursorgaan}>`).join("\n");
  return `VALUES ${varName} {\n${lines}\n}`;
}

function buildRestrictionBlock(s, restrictionGraph) {
  const graph = sparqlEscapeUri(restrictionGraph);
  return `GRAPH ${graph} {\n${s} ?randomP ?randomO .\n}`;
}

export function buildCountQuery(queryDefinition, restrictionGraph) {
  const s = "?s";
  const prefixBlock = buildPrefixBlock();
  const inputGraph = sparqlEscapeUri(INPUT_GRAPH);

  const path = queryDefinition.bestuursorgaanPropertyPath || "";
  const pathBlock = path.length
    ? `${s} ${path} ?bestuursorgaan .\n${buildValuesBlock("?bestuursorgaan")}`
    : `${buildValuesBlock(s)}`;

  const restrictionBlock = restrictionGraph ? buildRestrictionBlock(s, restrictionGraph) : "";

  return `${prefixBlock}
SELECT (COUNT(DISTINCT ${s}) AS ?count)
WHERE {
  GRAPH ${inputGraph} {
    ${s} a ${queryDefinition.type} .
    ${pathBlock}
  }
  ${restrictionBlock}
}`;
}

export function buildInsertWhereQuery(
  queryDefinition,
  resultGraphUri,
  limit,
  offset,
  restrictionGraph,
) {
  const s = "?s";
  const prefixBlock = buildPrefixBlock();
  const inputGraph = sparqlEscapeUri(INPUT_GRAPH);
  const outputGraph = sparqlEscapeUri(resultGraphUri);

  const path = queryDefinition.bestuursorgaanPropertyPath || "";
  const pathBlock = path.length
    ? `${s} ${path} ?bestuursorgaan .\n${buildValuesBlock("?bestuursorgaan")}`
    : `${buildValuesBlock(s)}`;

  const restrictionBlock = restrictionGraph ? buildRestrictionBlock(s, restrictionGraph) : "";

  return `${prefixBlock}
INSERT {
  GRAPH ${outputGraph} {
    ${s} a ${queryDefinition.type} .
  }
}
WHERE {
  {
    SELECT DISTINCT ${s}
    WHERE {
      GRAPH ${inputGraph} {
        ${s} a ${queryDefinition.type} .
        ${pathBlock}
      }
      ${restrictionBlock}
    }
    LIMIT ${limit}
    OFFSET ${offset}
  }
}`;
}
