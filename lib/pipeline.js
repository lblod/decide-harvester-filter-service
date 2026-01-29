import { uuid } from "mu";
import { querySudo as query, updateSudo as update } from "@lblod/mu-auth-sudo";
import {
  STATUS_BUSY,
  STATUS_SUCCESS,
  STATUS_FAILED,
  HIGH_LOAD_DATABASE_ENDPOINT,
  BATCH_SIZE,
  SLEEP_BETWEEN_BATCHES,
} from "../constant";
import { loadTask, updateTaskStatus, appendTaskResultGraph, appendTaskError } from "./task";
import { queryDefs } from "../config/query-definitions";
import { buildCountQuery, buildInsertWhereQuery } from "./queries";

export async function run(deltaEntry) {
  const task = await loadTask(deltaEntry);
  if (!task) return;
  try {
    console.info(`Starting filter task for ${deltaEntry}`);
    await updateTaskStatus(task, STATUS_BUSY);

    const graphContainer = { id: uuid() };
    graphContainer.uri = `http://redpencil.data.gift/id/dataContainers/${graphContainer.id}`;
    const tempGraphUri = `http://redpencil.data.gift/id/graphs/${uuid()}`;

    await extractAndInsertSubjects(Object.keys(queryDefs), tempGraphUri, task.inputContainerGraph);

    await appendTaskResultGraph(task, graphContainer, tempGraphUri);

    await updateTaskStatus(task, STATUS_SUCCESS);
    console.info(`Completed filter task for ${deltaEntry}`);
  } catch (e) {
    console.error(e);
    if (task) {
      await appendTaskError(task, e.message);
      await updateTaskStatus(task, STATUS_FAILED);
    }
  }
}

async function extractAndInsertSubjects(types, resultGraphUri, inputGraphUri) {
  for (const type of types) {
    console.info(`Processing type '${type}'`);
    await extractAndInsertSubjectsForType(type, resultGraphUri, inputGraphUri);
  }
}

async function extractAndInsertSubjectsForType(type, resultGraphUri, inputGraphUri) {
  const queryDefinition = queryDefs[type];
  if (!queryDefinition) return;

  const total = await fetchTargetCount(queryDefinition, inputGraphUri);
  console.info(`Type '${type}' has ${total} target(s)`);
  if (!total) return;

  let offset = 0;
  while (offset < total) {
    console.info(`Inserting batch for '${type}' (offset=${offset}, limit=${BATCH_SIZE})`);
    await insertBatch(queryDefinition, resultGraphUri, BATCH_SIZE, offset, inputGraphUri);
    await sleep();
    offset += BATCH_SIZE;
  }
}

async function fetchTargetCount(queryDefinition, inputGraphUri) {
  const countQuery = buildCountQuery(queryDefinition, inputGraphUri);
  const result = await query(countQuery, {
    sparqlEndpoint: HIGH_LOAD_DATABASE_ENDPOINT,
    mayRetry: true,
  });
  const countValue = result?.results?.bindings?.[0]?.count?.value;
  const count = parseInt(countValue, 10);
  return Number.isFinite(count) ? count : 0;
}

async function insertBatch(queryDefinition, resultGraphUri, batchSize, offset, inputGraphUri) {
  const insertQuery = buildInsertWhereQuery(
    queryDefinition,
    resultGraphUri,
    batchSize,
    offset,
    inputGraphUri,
  );
  await update(insertQuery, {}, { sparqlEndpoint: HIGH_LOAD_DATABASE_ENDPOINT, mayRetry: true });
}

async function sleep() {
  if (SLEEP_BETWEEN_BATCHES > 0) {
    return new Promise((resolve) => setTimeout(resolve, SLEEP_BETWEEN_BATCHES));
  }
}
