import { bestuursorganen } from "./../config/bestuursorganen";
import { prefixes } from "./../config/query-definitions";
import { sparqlEscapeUri } from "mu";
import { INGEST_GRAPH } from "./../constant";

function buildPrefixBlock() {
  return Object.entries(prefixes)
    .map(([prefix, uri]) => `PREFIX ${prefix}: <${uri}>`)
    .join("\n");
}

function buildValuesBlock(varName) {
  const lines = bestuursorganen.map((bestuursorgaan) => `<${bestuursorgaan}>`).join("\n");
  return `VALUES ${varName} {\n${lines}\n}`;
}

export function buildSelectQuery(queryDefinition, limit, offset) {
  const s = "?s";
  const prefixBlock = buildPrefixBlock();
  const inputGraph = sparqlEscapeUri(INGEST_GRAPH);

  const path = queryDefinition.bestuursorgaanPropertyPath || "";
  const pathBlock = path.length
    ? `${s} ${path} ?bestuursorgaan .\n${buildValuesBlock("?bestuursorgaan")}`
    : `${buildValuesBlock(s)}`;

  return `${prefixBlock}
SELECT DISTINCT ${s}
WHERE {
  GRAPH ${inputGraph} {
    ${s} a ${queryDefinition.type} .
    ${pathBlock}
  }
}
LIMIT ${limit}
OFFSET ${offset}`;
}

export function buildCountQuery(queryDefinition) {
  const s = "?s";
  const prefixBlock = buildPrefixBlock();
  const inputGraph = sparqlEscapeUri(INGEST_GRAPH);

  const path = queryDefinition.bestuursorgaanPropertyPath || "";
  const pathBlock = path.length
    ? `${s} ${path} ?bestuursorgaan .\n${buildValuesBlock("?bestuursorgaan")}`
    : `${buildValuesBlock(s)}`;

  return `${prefixBlock}
SELECT (COUNT(DISTINCT ${s}) AS ?count)
WHERE {
  GRAPH ${inputGraph} {
    ${s} a ${queryDefinition.type} .
    ${pathBlock}
  }
}`;
}

export function buildInsertWhereQuery(queryDefinition, resultGraphUri, limit, offset) {
  const s = "?s";
  const prefixBlock = buildPrefixBlock();
  const inputGraph = sparqlEscapeUri(INGEST_GRAPH);
  const outputGraph = sparqlEscapeUri(resultGraphUri);

  const path = queryDefinition.bestuursorgaanPropertyPath || "";
  const pathBlock = path.length
    ? `${s} ${path} ?bestuursorgaan .\n${buildValuesBlock("?bestuursorgaan")}`
    : `${buildValuesBlock(s)}`;

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
    }
    LIMIT ${limit}
    OFFSET ${offset}
  }
}`;
}
