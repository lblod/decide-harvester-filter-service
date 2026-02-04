# Decide harvester filter service

## About
This service filters harvester tasks. It listens for `task:Task` deltas: when a task becomes `adms:status = scheduled`, the service loads the task and writes a filtered subset of data into a **temporary result graph**, which is linked to the task via `task:resultsContainer / task:hasGraph`. The output is deliberately minimal: for each matched subject the service writes a single triple `<subject-uri> a <rdf-type>` into the result graph.

Filtering is driven by two config sources:
- `config/query-definitions.js` defines which RDF types are targeted and how each type is linked to a bestuursorgaan using property paths (e.g. for besluiten).
- `config/bestuursorganen.js` provides the whitelist of bestuursorgaan URIs that are allowed to match. Only subjects that resolve to one of these bestuursorganen via the configured property path are included in the output.

## How it works
- A delta notification marks a task as `scheduled`.
- The service loads the task (and its optional input container graph).
- For each configured type in `query-definitions.js`:
  - It counts matching subjects in the ingest graph.
  - It inserts matching subjects into a temporary result graph in batches.
- The temporary result graph is recorded on the task.

## Input graph behavior
- **No input container graph**
  - The service searches the **ingest graph** for all matching subjects of the configured types and bestuursorganen and writes them into the temporary result graph.
- **With input container graph**
  - The service still evaluates types and bestuursorganen in the **ingest graph**, but it **restricts subjects** to those that appear in the input container graph.

## Usage

Add the following to your docker-compose file:

```yml
harvester-filter-service:
  image: lblod/decide-harvester-filter-service
  environment:
    INPUT_GRAPH: "http://mu.semte.ch/graphs/oslo-decisions"
    OPERATION_URI: http://lblod.data.gift/id/jobs/concept/TaskOperation/oslo-eli/filter

```

Add the delta rule:

```json
{
  "match": {
    "predicate": {
      "type": "uri",
      "value": "http://www.w3.org/ns/adms#status"
    },
    "object": {
      "type": "uri",
      "value": "http://redpencil.data.gift/id/concept/JobStatus/scheduled"
    }
  },
  "callback": {
    "method": "POST",
    "url": "http://harvester-filter-service/delta"
  },
  "options": {
    "resourceFormat": "v0.0.1",
    "gracePeriod": 1000,
    "ignoreFromSelf": true,
    "foldEffectiveChanges": true
  }
}
```

## Configuration

| Environment variable          | Description                                                                 | Default                                                              |
| ----------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `HIGH_LOAD_DATABASE_ENDPOINT` | SPARQL endpoint used for reads/writes of data (i.e. non-task data).         | `http://database:8890/sparql`                                        |
| `INPUT_GRAPH`                 | Graph to read from when filtering data.                                     | `http://mu.semte.ch/graphs/public`                                   |
| `DCR_BATCH_SIZE`              | Batch size for the insert-where query.                                      | `100`                                                                |
| `SLEEP_BETWEEN_BATCHES`       | Sleep time (ms) between batch inserts.                                      | `1000`                                                               |
| `OPERATION_URI`               | Only tasks with `task:operation` set to this URI are handled.               | `http://lblod.data.gift/id/jobs/concept/TaskOperation/decide-filter` | 


## Notes
- Result graphs are created per task and linked via `task:resultsContainer / task:hasGraph`.
- If you need additional filters, add them in `config/query-definitions.js`.

