import {Model} from "survey-core";
import {Survey} from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import "./survey.css";

const json = {
    "logoPosition": "right",
    "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "question3",
                    "title": "Suostumus tietojen luovuttamiseen",
                    "isRequired": true,
                    "choices": [
                        {
                            "value": "Item 1",
                            "text": "Kyllä"
                        }
                    ]
                },
                {
                    "type": "text",
                    "name": "name",
                    "title": "Järjestön nimi",
                    "isRequired": true,
                },
                {
                    "type": "text",
                    "name": "operationPeriodStart",
                    "title": "Järjsetön toimintakauden alkupvm",
                    "isRequired": true,
                    "inputType": "number"
                },
                {
                    "type": "text",
                    "name": "operationPeriodEnd",
                    "title": "Järjsetön toimintakauden loppumispvm",
                    "isRequired": true,
                    "inputType": "number"
                },
                {
                    "type": "text",
                    "name": "question4",
                    "title": "Järjestön hallituksen (tms.) sähköpostiosoite",
                    "isRequired": true,
                    "inputType": "email"
                }
            ]
        },
        {
            "name": "page2",
            "elements": [
                {
                    "type": "text",
                    "name": "question5",
                    "title": "Järjestön puheenjohtajan nimi",
                    "isRequired": true
                },
                {
                    "type": "matrixdynamic",
                    "name": "question6",
                    "title": "Hallistuksen varsinaisten jäsenien nimet",
                    "isRequired": true,
                    "columns": [
                        {
                            "name": "Column 1",
                            "title": "Ethän listaa tähän hallituksen varajäseniä, toimihenkilöitä ym",
                            "cellType": "text"
                        }
                    ],
                    "choices": [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    "rowCount": 1,
                    "maxRowCount": 10,
                    "addRowLocation": "bottom"
                },
                {
                    "type": "text",
                    "name": "question7",
                    "title": "Järjestön jäsenmäärä",
                    "isRequired": true,
                    "inputType": "number"
                },
                {
                    "type": "text",
                    "name": "question8",
                    "title": "Järjestöön kuuluvien ylioppilaskunnan jäsenten lukumäärä ilmoituksen jättämishetkellä",
                    "inputType": "number"
                }
            ]
        },
        {
            "name": "page3",
            "title": "Tilavarausoikeudet",
            "description": "TREYn piirissä toimivien järjestöjen on mahdollista varata yliopiston tiloja käyttöönsä Resource Booker -ohjelmiston kautta.\r\nVaraukset tehdään opiskelijajärjestöjen omalla varauspohjalla (Student association bookings). Yliopisto tyhjentää vuoden 2024\r\ntilavarausoikeudellisten listan ja tilauvarausoikeudellisten lista korvataan nyt toimitettavilla uusilla tiedoilla. Sinun tulee siis\r\ntäyttää tietosi uudelleen, vaikka sinulla olisi ollut tilavarausoikeudet vuonna 2024.\r\nJokaisen järjestön on mahdollista toimittaa kolmen (3) henkilön yhteystiedot, joille oikeudet myönnetään. Kirjoitathan näiden\r\nkolmen henkilön yhteystiedot eri kenttiin alla.",
            "elements": [
                {
                    "type": "matrixdynamic",
                    "name": "question9",
                    "title": "Tilavarausoikeudet tarvitsevan henkilön @tuni.fi-sähköpostiosoite",
                    "isRequired": true,
                    "columns": [
                        {
                            "name": "column1",
                            "title": "Sähköpostiosoite",
                            "cellType": "text"
                        }
                    ],
                    "choices": [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    "cellType": "text",
                    "rowCount": 1,
                    "minRowCount": 1,
                    "maxRowCount": 3,
                    "addRowLocation": "bottom"
                },
                {
                    "type": "matrixdynamic",
                    "name": "question10",
                    "title": "Listalle trey-jarjestot@lists.tuni.fi lisättävä(t) sähköposti(t)\r",
                    "isRequired": false,
                    "columns": [
                        {
                            "name": "column1",
                            "title": "Sähköpostiosoite",
                            "cellType": "text"
                        }
                    ],
                    "choices": [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    "cellType": "text",
                    "rowCount": 1,
                    "minRowCount": 1,
                    "maxRowCount": 3,
                    "addRowLocation": "bottom"
                },
                {
                    "type": "matrixdynamic",
                    "name": "question11",
                    "title": "Listalle trey-hervanta@lists.tuni.fi lisättävä(t) sähköposti(t)\r",
                    "isRequired": false,
                    "columns": [
                        {
                            "name": "column1",
                            "title": "Sähköpostiosoite",
                            "cellType": "text"
                        }
                    ],
                    "choices": [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    "cellType": "text",
                    "rowCount": 1,
                    "minRowCount": 1,
                    "maxRowCount": 3,
                    "addRowLocation": "bottom"
                },
                {
                    "type": "matrixdynamic",
                    "name": "question12",
                    "title": "Listalle trey-keskusta@lists.tuni.fi lisättävä(t) sähköposti(t)",
                    "isRequired": false,
                    "columns": [
                        {
                            "name": "column1",
                            "title": "Sähköpostiosoite",
                            "cellType": "text"
                        }
                    ],
                    "choices": [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    "cellType": "text",
                    "rowCount": 1,
                    "minRowCount": 1,
                    "maxRowCount": 3,
                    "addRowLocation": "bottom"
                },
                {
                    "type": "matrixdynamic",
                    "name": "question13",
                    "title": "Listalle trey-kauppi@lists.tuni.fi lisättävä(t) sähköposti(t)\r",
                    "isRequired": false,
                    "columns": [
                        {
                            "name": "column1",
                            "title": "Sähköpostiosoite",
                            "cellType": "text"
                        }
                    ],
                    "choices": [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    "cellType": "text",
                    "rowCount": 1,
                    "minRowCount": 1,
                    "maxRowCount": 3,
                    "addRowLocation": "bottom"
                },
                {
                    "type": "matrixdynamic",
                    "name": "question14",
                    "title": "Listalle trey-puheenjohtajat@lists.tuni.fi lisättävä(t) sähköposti(t)\r",
                    "isRequired": false,
                    "columns": [
                        {
                            "name": "column1",
                            "title": "Sähköpostiosoite",
                            "cellType": "text"
                        }
                    ],
                    "choices": [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    "cellType": "text",
                    "rowCount": 1,
                    "minRowCount": 1,
                    "maxRowCount": 3,
                    "addRowLocation": "bottom"
                },
                {
                    "type": "matrixdynamic",
                    "name": "question15",
                    "title": "Listalle trey-tiedotuslista@lists.tuni.fi lisättävä(t) sähköposti(t)\r",
                    "isRequired": false,
                    "columns": [
                        {
                            "name": "column1",
                            "title": "Sähköpostiosoite",
                            "cellType": "text"
                        }
                    ],
                    "choices": [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    "cellType": "text",
                    "rowCount": 1,
                    "minRowCount": 1,
                    "maxRowCount": 3,
                    "addRowLocation": "bottom"
                },
                {
                    "type": "matrixdynamic",
                    "name": "question16",
                    "title": "Listalle trey-tuutorivastaavat@lists.tuni.fi lisättävä(t) sähköposti(t)\r",
                    "isRequired": false,
                    "columns": [
                        {
                            "name": "column1",
                            "title": "Sähköpostiosoite",
                            "cellType": "text"
                        }
                    ],
                    "choices": [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    "cellType": "text",
                    "rowCount": 1,
                    "minRowCount": 1,
                    "maxRowCount": 3,
                    "addRowLocation": "bottom"
                },
                {
                    "type": "matrixdynamic",
                    "name": "question17",
                    "title": "Listalle trey-tutororganisers@lists.tuni.fi lisättävä(t) sähköposti(t)\r",
                    "isRequired": false,
                    "columns": [
                        {
                            "name": "column1",
                            "title": "Sähköpostiosoite",
                            "cellType": "text"
                        }
                    ],
                    "choices": [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    "cellType": "text",
                    "rowCount": 1,
                    "minRowCount": 1,
                    "maxRowCount": 3,
                    "addRowLocation": "bottom"
                },
                {
                    "type": "matrixdynamic",
                    "name": "question18",
                    "title": "Listalle trey-kv@lists.tuni.fi lisättävä(t) sähköposti(t)\r",
                    "isRequired": false,
                    "columns": [
                        {
                            "name": "column1",
                            "title": "Sähköpostiosoite",
                            "cellType": "text"
                        }
                    ],
                    "choices": [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    "cellType": "text",
                    "rowCount": 1,
                    "minRowCount": 1,
                    "maxRowCount": 3,
                    "addRowLocation": "bottom"
                },
                {
                    "type": "matrixdynamic",
                    "name": "question19",
                    "title": "Listalle trey-kopovastaavat@lists.tuni.fi lisättävä(t) sähköposti(t)\r",
                    "isRequired": false,
                    "columns": [
                        {
                            "name": "column1",
                            "title": "Sähköpostiosoite",
                            "cellType": "text"
                        }
                    ],
                    "choices": [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    "cellType": "text",
                    "rowCount": 1,
                    "minRowCount": 1,
                    "maxRowCount": 3,
                    "addRowLocation": "bottom"
                },
                {
                    "type": "matrixdynamic",
                    "name": "question20",
                    "title": "Listalle trey-sopo@lists.tuni.fi lisättävä(t) sähköposti(t)\r",
                    "isRequired": false,
                    "columns": [
                        {
                            "name": "column1",
                            "title": "Sähköpostiosoite",
                            "cellType": "text"
                        }
                    ],
                    "choices": [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    "cellType": "text",
                    "rowCount": 1,
                    "minRowCount": 1,
                    "maxRowCount": 3,
                    "addRowLocation": "bottom"
                },
                {
                    "type": "matrixdynamic",
                    "name": "question21",
                    "title": "Listalle trey-tapahtumatoimijat@lists.tuni.fi lisättävä(t) sähköposti(t)",
                    "isRequired": false,
                    "columns": [
                        {
                            "name": "column1",
                            "title": "Sähköpostiosoite",
                            "cellType": "text"
                        }
                    ],
                    "choices": [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    "cellType": "text",
                    "rowCount": 1,
                    "minRowCount": 1,
                    "maxRowCount": 3,
                    "addRowLocation": "bottom"
                },
                {
                    "type": "matrixdynamic",
                    "name": "question22",
                    "title": "Listalle trey-alumnivastaavat@lists.tuni.fi lisättävä(t) sähköposti(t)\r",
                    "isRequired": false,
                    "columns": [
                        {
                            "name": "column1",
                            "title": "Sähköpostiosoite",
                            "cellType": "text"
                        }
                    ],
                    "choices": [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    "cellType": "text",
                    "rowCount": 1,
                    "minRowCount": 1,
                    "maxRowCount": 3,
                    "addRowLocation": "bottom"
                }
            ]
        },
        {
            "name": "page4",
            "title": "Intranetin laaja käyttöoikeus",
            "description": "TREYn piirissä toimivien järjestöjen viestintävastaavien tai muiden vastuuhenkilöiden (1 hlö / järjestö) on mahdollista saada laajemmat korkeakouluyhteisön Intranetin käyttöoikeudet, jotka mahdollistavat tarkemman uutisten kohdentamisen tutkintoohjelmittain ja opintosuunnittain. Lomakkeella ilmoitetaan kyseisen henkilön nimi ja sähköpostiosoite. Näiden vastuuhenkilöiden tulee tehdä yliopiston kanssa resurssisopimus, jotta laajemmat oikeudet voidaan myöntää. Tästä tulee lisää tietoa ja ohjeita vastuuhenkilöille lomakkeen sulkeuduttua",
            "elements": [
                {
                    "type": "text",
                    "name": "question25",
                    "title": "Vastuuhenkilön nimi",
                    "isRequired": true
                },
                {
                    "type": "text",
                    "name": "question23",
                    "title": "Vastuuhenkilön sähköposti (muu kuin @tuni.fi)",
                    "isRequired": true,
                    "inputType": "email"
                },
                {
                    "type": "radiogroup",
                    "name": "question24",
                    "title": "Minulla on suomalaiset verkkopankkitunnukset. Resurssisopimus hyväksytään suomalaisilla verkkopankkitunnuksilla. Lähetämme sinulle erilaiset ohjeet riippuen\r\nsiitä, löytyykö sinulta suomalaiset verkkopankkitunnukset vai ei.",
                    "isRequired": true,
                    "choices": [
                        {
                            "value": "Item 1",
                            "text": "Kyllä"
                        },
                        {
                            "value": "Item 2",
                            "text": "Ei"
                        }
                    ]
                }
            ]
        },
        {
            "name": "page5",
            "title": "Järjestötilojen käyttösopimus",
            "description": "Tampereen yliopisto on osoittanut järjestötiloja Tampereen ylioppilaskunnan (TREY) yhdistysasemassa toimiville järjestöille.\r\nJärjestötilojen käyttösopimuksella sovitaan yliopiston hallinnoimien järjestötilojen käytöstä ja niiden käyttöön liittyvistä edellytyksistä. Järjestötilojen käyttösopimuksen ylläpitoon tarvitaan ajantasaiset yhteystiedot.\r\nJärjestötilojen käyttösopimuksen löydät Intrasta: https://intra.tuni.fi/fi/kampukset-ja-tilat/tiloja-ja-kiinteistoja-koskevatpalvelut/jarjestotilat\r",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "panel1",
                    "title": "Järjestöllämme on järjestötila Tampereen yliopiston kampuksella\n",
                    "isRequired": true,
                    "choices": [
                        {
                            "value": "Item 1",
                            "text": "Kyllä"
                        },
                        {
                            "value": "Item 2",
                            "text": "Ei"
                        }
                    ]
                },
                {
                    "type": "comment",
                    "name": "question26",
                    "title": "Järjestötilan sijainti (kampus, rakennus ja järjestötilan tarkka koodi)"
                },
                {
                    "type": "comment",
                    "name": "question27",
                    "title": "Onko järjestöllä erillistä varastotilaa tai muuta tilaa kampuksella? Anna mahdollisimman\r\ntarkka sijainti.\r"
                },
                {
                    "type": "text",
                    "name": "question28",
                    "title": "Järjestön vastuuhenkilö koskien järjestötilojen käyttösopimusta vuonna 2025\r"
                },
                {
                    "type": "text",
                    "name": "question29",
                    "title": "Järjestön vastuuhenkilön @tuni.fi-sähköpostiosoite\r",
                    "inputType": "email"
                },
                {
                    "type": "text",
                    "name": "question30",
                    "title": ". Järjestön vastuuhenkilön puhelinnumero",
                    "inputType": "tel"
                }
            ]
        },
        {
            "name": "page6",
            "title": "Järjestön ajantasaiset säännöt ja toimintasuunnitelma",
            "description": "Tarvitsemme tietoomme järjestöjen ajantasaisen toimintasuunnitelman ja säännöt, joten toimitathan ne osoitteeseen liitteet@trey.fi lomakkeen täyttämisen yhteydessä. Lähetä liite .pdf-tiedostona ja nimeä se \"Järjestön nimi_säännöt_2025\" tai\r\n\"Järjestön nimi_toimintasuunnitelma_2025\".\r",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "question31",
                    "title": "Olen toimittanut järjestön säännöt ja toimintasuunnitelman osoitteeseen liitteet@trey.fi\r\noikein nimettynä .pdf-tiedostona. \n",
                    "isRequired": true,
                    "choices": [
                        {
                            "value": "Item 1",
                            "text": "Kyllä"
                        }
                    ]
                }
            ]
        }
    ]
}

export const Registration = () => {
    const survey = new Model(json);
    survey.css = {
        body: "survey-body",
    };

    return <div>
        <h1>Registration</h1>
        <Survey model={survey} />
    </div>
}