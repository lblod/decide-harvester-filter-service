export const prefixes = {
  besluit: "http://data.vlaanderen.be/ns/besluit#",
  dcterms: "http://purl.org/dc/terms/",
  prov: "http://www.w3.org/ns/prov#",
  mandaat: "http://data.vlaanderen.be/ns/mandaat#",
};

export const queryDefs = {
  besluit: {
    type: "besluit:Besluit",
    bestuursorgaanPropertyPath:
      "^prov:generated / dcterms:subject / ^besluit:behandelt / besluit:isGehoudenDoor",
  },
};
