export const prefixes = {
  besluit: "http://data.vlaanderen.be/ns/besluit#",
  dcterms: "http://purl.org/dc/terms/",
  prov: "http://www.w3.org/ns/prov#",
  mandaat: "http://data.vlaanderen.be/ns/mandaat#",
};

export const queryDefs = {
  // agendapunt: {
  //   type: "besluit:Agendapunt",
  //   bestuursorgaanPropertyPath: "^besluit:behandelt / besluit:isGehoudenDoor",
  // },
  // behandelingVanAgendapunt: {
  //   type: "besluit:BehandelingVanAgendapunt",
  //   bestuursorgaanPropertyPath: "dcterms:subject / ^besluit:behandelt / besluit:isGehoudenDoor",
  // },
  besluit: {
    type: "besluit:Besluit",
    bestuursorgaanPropertyPath:
      "^prov:generated / dcterms:subject / ^besluit:behandelt / besluit:isGehoudenDoor",
  },
  // bestuursorgaan: {
  //   type: "besluit:Bestuursorgaan",
  //   bestuursorgaanPropertyPath: "",
  // },
  // mandataris: {
  //   type: "mandaat:Mandataris",
  //   bestuursorgaanPropertyPath:
  //     "^besluit:heeftVoorzitter / dcterms:subject / ^besluit:behandelt / besluit:isGehoudenDoor",
  // },
  // stemming: {
  //   type: "besluit:Stemming",
  //   bestuursorgaanPropertyPath:
  //     "^besluit:heeftStemming / dcterms:subject / ^besluit:behandelt / besluit:isGehoudenDoor",
  // },
};
