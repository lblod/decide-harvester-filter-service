// TODO: Fetch URIs from triplestore instead of having them hard-coded

// besluit:Bestuursorgaan -- besluit:bestuurt -> besluit:Bestuurseenheid
// besluit:Bestuursorgaan -- generiek:isTijdspecialisatieVan -> besluit:Bestuursorgaan

const BESTUURSORGAAN_BASE_URI = "data.lblod.info/id/bestuursorganen";
const BESTUURSEENHEID_BASE_URI = "data.lblod.info/id/bestuurseenheden";

const buildUris = (base, uuids) =>
  uuids.flatMap((uuid) => [`http://${base}/${uuid}`, `https://${base}/${uuid}`]);

const BESTUURSEENHEDEN = {
  gent: {
    uuid: "353234a365664e581db5c2f7cc07add2534b47b8e1ab87c821fc6e6365e6bef5",
    parentBestuursorganenUuids: [
      "6efc9b0c3ebb3371031d45e517d88f66eb115adf28e5e1827684522f56a8aa2c", // Burgemeester
      "c55fc5e892d9540e8d2463b4377e1f4b2caad04b280118f9fc408e5df61f5737", // College van Burgemeester en Schepenen
      "c126b20bc1a94de293b7fceaf998c82e9a7a1d56ba34cbf9992aa4bf01ae2b01", // Gemeenteraad
      "cc2aba212d4102c6fa9ee2d43f27a1cde04da144a21cb8b1683dc7bb1e0154d2", // Algemeen directeur
      "325c479023eed57b44ecdc40bb1c1b1b42a213975ca01f5a127bee6e9a4e7986", // Adjunct-algemeen directeur
      "304b1cf175214a830ab2000c5f38fd688524e34d33a0fda4466693378aef8a41", // Financieel directeur
      "d06e5e292522046e94ebd6560813604df8e467a7347efc46c8b066ab5bbd38b1", // Adjunct-financieel directeur
    ],
    tijdspecialisatieBestuursorganenUuids: [
      "807a46610dcbd3c0646ea9d13784d09ba0bb2f6de6cd7c9029e3dc9a15ad33a3", // Burgemeester
      "c484767ea88b545af011c47b52ac540a0ffdab400cfe9d3f53c6685ec8733cc7", // Burgemeester
      "0c0338929c4edb5e847f98481c1df2b22ffa858b44e49dec603d3d97cf6272c3", // Burgemeester
      "16d7f193d9f7f49c27a16978b2cb800c2ae06a8bd64a0532c4dd47aae83a2b60", // College van Burgemeester en Schepenen
      "196d3dc10bb71196ea971bb5ff315083742e9a458d97b51bc31e2320b8d9de7c", // College van Burgemeester en Schepenen
      "a315ccc212dc2e19db45209761f5786e125138d01815a8f339092b70778b18ee", // College van Burgemeester en Schepenen
      "0d0c1eeff199e9f0d9aabfa7e68b0600d6092fff099c5d7a0caba3d8ef762fb4", // Gemeenteraad
      "192502e559e9b150c6bf895e3c145b7cf80feb286c48182ccf25153192d43657", // Gemeenteraad
      "e1bdfec06e5407566b72ea6a1a9e89c82a1d5a81d1461772761e0974b2ddebef", // Gemeenteraad
      "20825ff7b875937c78d5520a1de2c29339ededf65c8a5c4fc9b257604769a3ed", // Algemeen directeur
      "c0cf2d8f3a45a50e65b34dab2059dbdab19d716e66f35f9a06e23b975d8d46e5", // Adjunct-algemeen directeur
      "3ee975c24dddc132d37c262cac268012335575cf3ea2c0fa274d5b75f9c8ecd0", // Financieel directeur
      "1e9960d4c38937637027f21226ad19ff443e7bd33b8f6cc1a9cd47cc34f6fc55", // Adjunct-financieel directeur
    ],
  },
  wingene: {
    uuid: "99ed6eee81a7aca47517cbffb46eaba38f3987eeb4ad32c020898644769eb615",
    parentBestuursorganenUuids: [
      "e5b2a2ba92c4242d2fa4a8bb3678f8eab08f607a594cfe1028485851d97c1f12", // Burgemeester
      "6a07008d9fae5ca5078c9c3c26716a07d33884df238b43ad05244ad223e700d3", // College van Burgemeester en Schepenen
      "18b1f7a571b9b610ea350dc3f4ded9ef08d0d8b7e811b50ef5109297a5039c6b", // Gemeenteraad
      "44d1ce18578144bc30f10ce79124e53b9b1fdfea55175cc0efbb2f3a953cba45", // Algemeen directeur
      "e652d4dc1070a29e7d65e85b803c8ae6155fa4ad8e4f2814f0c9b9d97cda75b9", // Adjunct-algemeen directeur
      "6e04c7171f1248a178c38400ee9af3c591a72f578b85b50fe760354232da8a76", // Financieel directeur
      "1fae54b1d95fd1bf769868ae39ad532d1c4beabbac83f18f4caf27af694db571", // Adjunct-financieel directeur
    ],
    tijdspecialisatieBestuursorganenUuids: [
      "a38aeec9bd2324e753922e20ce2cc78a6f80aec256f071622c77fabeb4cbe73e", // Burgemeester
      "b30fd3d8b9b676c004022eb675c5e07c3d8405bd0c193f21be59fbcc1b84c016", // Burgemeester
      "2ce0a5d10193056a8b34b3ec28d2c6072eb51665ebc884a449689376142c3886", // Burgemeester
      "0408ad28ad2d7a7d0b77112eb336385a6b5af80347080b026d5730a89b8690d3", // College van Burgemeester en Schepenen
      "52730cfa404492b6438d55676a64d792b8c18c2479b00139d58e5cc312ce7373", // College van Burgemeester en Schepenen
      "9f9ebe0cf34e31a84a8256504983511df559850f2690ea9d0895b8489b7fb186", // College van Burgemeester en Schepenen
      "04e7b50784ef98d1b69afd715bc58493e1eed7030c99c3a800772dbb4b8e8955", // Gemeenteraad
      "f5dd69237b6684a2ebf3676c2bb3ee5d6c4310dab73a26b29c40b0e547432bea", // Gemeenteraad
      "47ef5b203fcb576f3345d43baa5ed97ee595c4c5f5f18450051a6f5b7c1fb687", // Gemeenteraad
      "cd349ca4c07d538fc264300d7bdd68cf044b9082bd1a4e709efa004e945896bf", // Algemeen directeur
      "ce097dcf5de9133646313672624091fee2a1fe24df16747faec2a385d4554509", // Adjunct-algemeen directeur
      "ccab4926bffb423c0a4580b269f1164a9551dab7d80a0555229039761a8f5483", // Financieel directeur
      "6f568b23eae80121acd3afa5e596d216bfe6932091c93011c0db1dd183d4311f", // Adjunct-financieel directeur
    ],
  },
};

const bestuursorganenByBestuurseenheid = Object.fromEntries(
  Object.values(BESTUURSEENHEDEN).flatMap(
    ({ uuid, parentBestuursorganenUuids, tijdspecialisatieBestuursorganenUuids }) => {
      const bestuursorganen = [
        ...buildUris(BESTUURSORGAAN_BASE_URI, parentBestuursorganenUuids),
        ...buildUris(BESTUURSORGAAN_BASE_URI, tijdspecialisatieBestuursorganenUuids),
      ];
      return buildUris(BESTUURSEENHEID_BASE_URI, [uuid]).map((uri) => [uri, bestuursorganen]);
    },
  ),
);

export function getBestuursorganen(bestuurseenheidUri) {
  return bestuursorganenByBestuurseenheid[bestuurseenheidUri];
}
