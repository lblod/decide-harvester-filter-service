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
import { buildSelectQuery, buildInsertQuery } from "./queries";

export async function run(deltaEntry) {
  const task = await loadTask(deltaEntry);
  if (!task) return;
  try {
    await updateTaskStatus(task, STATUS_BUSY);

    const graphContainer = { id: uuid() };
    graphContainer.uri = `http://redpencil.data.gift/id/dataContainers/${graphContainer.id}`;
    const tempGraphUri = `http://redpencil.data.gift/id/graphs/${uuid()}`;

    await extractAndInsertSubjects(Object.keys(queryDefs), tempGraphUri);

    await appendTaskResultGraph(task, graphContainer, tempGraphUri);

    await updateTaskStatus(task, STATUS_SUCCESS);
  } catch (e) {
    console.error(e);
    if (task) {
      await appendTaskError(task, e.message);
      await updateTaskStatus(task, STATUS_FAILED);
    }
  }
}

async function extractAndInsertSubjects(types, resultGraphUri) {
  for (const type of types) {
    await extractAndInsertSubjectsForType(type, resultGraphUri);
  }
}

async function extractAndInsertSubjectsForType(type, resultGraphUri) {
  const queryDefinition = queryDefs[type];
  if (!queryDefinition) return;

  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const { subjects, hasMoreResults } = await fetchSubjectsBatch(queryDefinition, offset);

    await sleep();

    if (subjects.length) {
      await insertSubjectsBatch(queryDefinition, subjects, resultGraphUri);
      await sleep();
    }

    if (!hasMoreResults) {
      hasMore = false;
    } else {
      offset += BATCH_SIZE;
    }
  }
}

async function fetchSubjectsBatch(queryDefinition, offset) {
  const selectQuery = buildSelectQuery(queryDefinition, BATCH_SIZE, offset);
  const result = await query(selectQuery, {
    sparqlEndpoint: HIGH_LOAD_DATABASE_ENDPOINT,
    mayRetry: true,
  });
  const bindings = result?.results?.bindings ?? [];

  const subjects = bindings
    .map((binding) => binding?.s?.value)
    .filter((value) => typeof value === "string" && value.length);

  return {
    subjects,
    hasMoreResults: bindings.length === BATCH_SIZE,
  };
}

async function insertSubjectsBatch(queryDefinition, subjects, tempGraphUri) {
  const queryDefWithOutput = { ...queryDefinition, outputGraph: tempGraphUri };
  const insertQuery = buildInsertQuery(queryDefWithOutput, subjects);
  await update(insertQuery, {}, { sparqlEndpoint: HIGH_LOAD_DATABASE_ENDPOINT, mayRetry: true });
}

async function sleep() {
  if (SLEEP_BETWEEN_BATCHES > 0) {
    return new Promise((resolve) => setTimeout(resolve, SLEEP_BETWEEN_BATCHES));
  }
}
