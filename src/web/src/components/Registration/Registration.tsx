import {Model} from "survey-core";
import {Survey} from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import "./survey.css";
import {useCallback} from "react";

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
                    "name": "operatingPeriod.start",
                    "title": "Järjestön toimintakauden alkupvm",
                    "isRequired": true,
                    "inputType": "string"
                },
                {
                    "type": "text",
                    "name": "operatingPeriod.end",
                    "title": "Järjestön toimintakauden loppumispvm",
                    "isRequired": true,
                    "inputType": "string"
                },
                {
                    "type": "text",
                    "name": "email",
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
                    "name": "chairperson.name",
                    "title": "Järjestön puheenjohtajan nimi",
                    "isRequired": true
                },
                {
                    "type": "matrixdynamic",
                    "name": "boardmembers",
                    "title": "Hallistuksen varsinaisten jäsenien nimet",
                    "isRequired": true,
                    "columns": [
                        {
                            "name": "name",
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
                    "name": "memberCount",
                    "title": "Järjestön jäsenmäärä",
                    "isRequired": true,
                    "inputType": "number"
                },
                {
                    "type": "text",
                    "name": "treyMemberCount",
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
                    "name": "reservationRightsEmails",
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
                    "name": "emailLists.trey-jarjestot",
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
                    "name": "emailLists.trey-hervanta",
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
                    "name": "emailLists.trey-keskusta",
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
                    "name": "emailLists.trey-kauppi",
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
                    "name": "emailLists.trey-puheenjohtaja",
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
                    "name": "emailLists.trey-tiedotuslista",
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
                    "name": "emailLists.trey-tuutorivastaavat",
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
                    "name": "emailLists.trey-tutororganisers",
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
                    "name": "emailLists.trey-kv",
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
                    "name": "emailLists.trey-kopovastaavat",
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
                    "name": "emailLists.trey-sopo",
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
                    "name": "emailLists.trey-tapahtuma",
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
                    "name": "emailLists.trey-alumni",
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
                    "name": "associationFacility",
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
                    "type": "panel",
                    "name": "associationFacility",
                    "state": "collapsed",
                    "elements": [
                        {
                            "type": "comment",
                            "name": "roomCode",
                            "title": "Järjestötilan sijainti (kampus, rakennus ja järjestötilan tarkka koodi)"
                        },
                        {
                            "type": "comment",
                            "name": "otherInfo",
                            "title": "Onko järjestöllä erillistä varastotilaa tai muuta tilaa kampuksella? Anna mahdollisimman\r\ntarkka sijainti.\r"
                        },
                        {
                            "type": "panel",
                            "name": "contactPerson",
                            "elements": [
                                {
                                    "type": "text",
                                    "name": "name",
                                    "title": "Järjestön vastuuhenkilö koskien järjestötilojen käyttösopimusta vuonna 2025\r"
                                },
                                {
                                    "type": "text",
                                    "name": "email",
                                    "title": "Järjestön vastuuhenkilön @tuni.fi-sähköpostiosoite\r",
                                    "inputType": "email"
                                },
                                {
                                    "type": "text",
                                    "name": "phone",
                                    "title": ". Järjestön vastuuhenkilön puhelinnumero",
                                    "inputType": "tel"
                                }
                            ]
                        }
                    ]
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
    const surveyComplete = useCallback((survey: Model) => {
        console.log(survey.data);
    }, []);
    survey.onComplete.add(surveyComplete);

    survey.css = {
        body: "survey-body",
        question: {
            title: "survey-question-title",
            titleTopRoot: "question-frame",
        },
        panel: {
            withFrame: "survey-question-frame"
        },
        actionBar: {
            root: "survey-footer"
        }
    };

    return <div>
        <h1>Registration</h1>
        <Survey model={survey} />
    </div>
}