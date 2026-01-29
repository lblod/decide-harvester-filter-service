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

export function buildInsertQuery(queryDefinition, subjectsToInsert) {
  const prefixBlock = buildPrefixBlock();
  const outputGraph = sparqlEscapeUri(queryDefinition.outputGraph);
  const triplesToInsert = subjectsToInsert.map(
    (subject) => `${sparqlEscapeUri(subject)} a ${queryDefinition.type} .`,
  );

  return `${prefixBlock}
INSERT DATA {
  GRAPH ${outputGraph} {
    ${triplesToInsert.join("\n")}
  }
}`;
}
