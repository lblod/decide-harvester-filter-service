// Bestuurseenheid Gent: https://data.lblod.info/id/bestuurseenheden/353234a365664e581db5c2f7cc07add2534b47b8e1ab87c821fc6e6365e6bef5

const BASE_URI = "data.lblod.info/id/bestuursorganen";

// besluit:Bestuursorgaan -- besluit:bestuurt -> besluit:Bestuurseenheid
const parentBestuursorganenGentUuids = [
  "6efc9b0c3ebb3371031d45e517d88f66eb115adf28e5e1827684522f56a8aa2c", // Burgemeester Gent
  "c126b20bc1a94de293b7fceaf998c82e9a7a1d56ba34cbf9992aa4bf01ae2b01", // Gemeenteraad Gent
  "c55fc5e892d9540e8d2463b4377e1f4b2caad04b280118f9fc408e5df61f5737", // College van Burgemeester en Schepenen Gent
  "304b1cf175214a830ab2000c5f38fd688524e34d33a0fda4466693378aef8a41", // Financieel directeur Gent
  "325c479023eed57b44ecdc40bb1c1b1b42a213975ca01f5a127bee6e9a4e7986", // Adjunct-algemeen directeur Gent
  "cc2aba212d4102c6fa9ee2d43f27a1cde04da144a21cb8b1683dc7bb1e0154d2", // Algemeen directeur Gent
  "d06e5e292522046e94ebd6560813604df8e467a7347efc46c8b066ab5bbd38b1", // Adjunct-financieel directeur Gent
];

// besluit:Bestuursorgaan -- generiek:isTijdspecialisatieVan -> besluit:Bestuursorgaan
const tijdspecialisatieBestuursorganenGentUuids = [
  "807a46610dcbd3c0646ea9d13784d09ba0bb2f6de6cd7c9029e3dc9a15ad33a3", // Burgemeester Gent
  "c484767ea88b545af011c47b52ac540a0ffdab400cfe9d3f53c6685ec8733cc7", // Burgemeester Gent
  "0c0338929c4edb5e847f98481c1df2b22ffa858b44e49dec603d3d97cf6272c3", // Burgemeester Gent
  "0d0c1eeff199e9f0d9aabfa7e68b0600d6092fff099c5d7a0caba3d8ef762fb4", // Gemeenteraad Gent
  "192502e559e9b150c6bf895e3c145b7cf80feb286c48182ccf25153192d43657", // Gemeenteraad Gent
  "e1bdfec06e5407566b72ea6a1a9e89c82a1d5a81d1461772761e0974b2ddebef", // Gemeenteraad Gent
  "16d7f193d9f7f49c27a16978b2cb800c2ae06a8bd64a0532c4dd47aae83a2b60", // College van Burgemeester en Schepenen Gent
  "196d3dc10bb71196ea971bb5ff315083742e9a458d97b51bc31e2320b8d9de7c", // College van Burgemeester en Schepenen Gent
  "a315ccc212dc2e19db45209761f5786e125138d01815a8f339092b70778b18ee", // College van Burgemeester en Schepenen Gent
  "3ee975c24dddc132d37c262cac268012335575cf3ea2c0fa274d5b75f9c8ecd0", // Financieel directeur Gent
  "c0cf2d8f3a45a50e65b34dab2059dbdab19d716e66f35f9a06e23b975d8d46e5", // Adjunct-algemeen directeur Gent
  "20825ff7b875937c78d5520a1de2c29339ededf65c8a5c4fc9b257604769a3ed", // Algemeen directeur Gent
  "1e9960d4c38937637027f21226ad19ff443e7bd33b8f6cc1a9cd47cc34f6fc55", // Adjunct-financieel directeur Gent
];

const buildUris = (uuids) =>
  uuids.flatMap((uuid) => [`http://${BASE_URI}/${uuid}`, `https://${BASE_URI}/${uuid}`]);

const parentBestuursorganenGent = buildUris(parentBestuursorganenGentUuids);
const tijdspecialisatieBestuursorganenGent = buildUris(tijdspecialisatieBestuursorganenGentUuids);

export const bestuursorganen = [
  ...parentBestuursorganenGent,
  ...tijdspecialisatieBestuursorganenGent,
];
