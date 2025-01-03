db.createUser({
    user: "admin",
    pwd: "admin",
    roles: [
        {
            role: "readWrite",
            db: "auction"
        }
    ]
});
db = db.getSiblingDB('auction');
db.createCollection('users');
db.getCollection('users').insertMany(
    [
        {
          "userId": 1,
          "name": "Harry",
          "surname": "Potter",
          "username": "harryp",
          "password": "$2a$05$60xpi9hNH7MiXTTklQ//6uevkDQp62qf5IZQ5/QjiRd9KXkbQrulO"
        },
        {
          "userId": 2,
          "name": "Hermione",
          "surname": "Granger",
          "username": "hermione",
          "password": "$2a$05$aqp9j7RsrQ0/PEDg3oT8FOIJBse3zID/Zp33oo8Mc3j1uAvvn1INi"
        },
        {
          "userId": 3,
          "name": "Ron",
          "surname": "Weasley",
          "username": "ron",
          "password": "$2a$05$g5pE71vhZZwb0Z3Av94YT.hdVZqghHa2FK8c4BoiUAnIr4K1hMgrm"
        },
        {
          "userId": 4,
          "name": "Albus",
          "surname": "Dumbledore",
          "username": "silente",
          "password": "$2a$05$aqp9j7RsrQ0/PEDg3oT8FOIJBse3zID/Zp33oo8Mc3j1uAvvn1INi"
        },
        {
          "userId": 5,
          "name": "Severus",
          "surname": "Snape",
          "username": "piton",
          "password": "$2a$05$bdTXP/mPS1bvsCZ2cUnddea8tsjiAq2uuAey8x/vIiidnR.nu0iJK"
        },
        {
          "userId": 6,
          "name": "Rubeus",
          "surname": "Hagrid",
          "username": "hagrid",
          "password": "$2a$05$CrXqyATMfSYnNGdJvLdkse8A7vs0mVa7rfp99rXXWsSrxwTbpKTa."
        },
        {
          "userId": 7,
          "name": "Draco",
          "surname": "Malfoy",
          "username": "draco",
          "password": "$2a$05$CJNOvB31ixT5mkdRBToLCeNPRI3FO22B//2C5GZ..wGclBCLFq/vS"
        },
        {
          "userId": 8,
          "name": "Minerva",
          "surname": "McGonagall",
          "username": "mcgranitt",
          "password": "$2a$05$Yc8.lJtHklttDB3ewPbNjeph7YrqrgwPpFL6fkzt50hn.FqFGUe7."
        },
        {
          "userId": 9,
          "name": "Sirius",
          "surname": "Black",
          "username": "felpato",
          "password": "$2a$05$xbnfnlQuvhHw4DDn9kQ5O.L05R2dQ7E8i0.KpFfI3rkKwQBS2sQxS"
        },
        {
          "userId": 10,
          "name": "Bellatrix",
          "surname": "Lestrange",
          "username": "bellatrix",
          "password": "$2a$05$CPAwSLNOahIa..KPniP2tuEJb/ttN7pAbu/0L0KonD6qOlxv9u1Dq"
        }
    ]
);

db = db.getSiblingDB('auction');
db.createCollection('auctions');

db.getCollection('auctions').insertMany(
    [
        {
          "auctionId": 1,
          "user": 1,
          "title": "Mantello dell'Invisibilità",
          "description": "Raro mantello che rende invisibile chiunque lo indossi.",
          "closingDate": ISODate("2025-01-16T15:00:00.000Z"),
          "initialValue": "500",
          "bids": [
            {
              "bidId": 1,
              "userId": 7,
              "username": "draco",
              "offerDate": ISODate("2024-12-15T09:30:00.000Z"),
              "value": 520
            },
            {
              "bidId": 2,
              "userId": 10,
              "username": "bellatrix",
              "offerDate": ISODate("2024-12-16T10:00:00.000Z"),
              "value": 550
            },
            {
              "bidId": 3,
              "userId": 3,
              "username": "ron",
              "offerDate": ISODate("2025-01-05T13:00:00.000Z"),
              "value": 580
            }
          ]
        },
        {
          "auctionId": 2,
          "user": 3,
          "title": "Maglione fatto a mano da mamma",
          "description": "Maglione caldo con una 'R' ricamata. Perfetto per l'inverno!",
          "closingDate": ISODate("2024-12-27T19:00:00.000Z"),
          "initialValue": "50",
          "bids": [
            {
              "bidId": 1,
              "userId": 8,
              "username": "mcgranitt",
              "offerDate": ISODate("2024-11-14T11:20:00.000Z"),
              "value": 60
            },
            {
              "bidId": 2,
              "userId": 9,
              "username": "felpato",
              "offerDate": ISODate("2024-11-15T10:45:00.000Z"),
              "value": 65
            }
          ]
        },
        {
          "auctionId": 3,
          "user": 2,
          "title": "Libro della storia di Hogwarts",
          "description": "Edizione originale contenente la storia della famosa scuola di magia.",
          "closingDate": ISODate("2024-12-31T13:00:00.000Z"),
          "initialValue": "20",
          "bids": [
            {
              "bidId": 1,
              "userId": 3,
              "username": "ron",
              "offerDate": ISODate("2024-10-04T14:00:00.000Z"),
              "value": 25
            }
          ]
        },
        {
          "auctionId": 4,
          "user": 7,
          "title": "Collana maledetta",
          "description": "Antica collana incantata, intrisa di potenti maledizioni. Un cimelio raro per veri intenditori di magia oscura.",
          "closingDate": ISODate("2025-01-08T09:30:00.000Z"),
          "initialValue": "1000",
          "bids": [
            {
              "bidId": 1,
              "userId": 10,
              "username": "bellatrix",
              "offerDate": ISODate("2024-12-26T12:00:00.000Z"),
              "value": 1050
            },
            {
              "bidId": 2,
              "userId": 1,
              "username": "harryp",
              "offerDate": ISODate("2024-12-26T13:00:00.000Z"),
              "value": 1051
            },
            {
              "bidId": 3,
              "userId": 4,
              "username": "silente",
              "offerDate": ISODate("2025-01-03T14:00:00.000Z"),
              "value": 1070
            },
            {
              "bidId": 4,
              "userId": 8,
              "username": "mcgranitt",
              "offerDate": ISODate("2025-01-07T08:00:00.000Z"),
              "value": 1100
            }
          ]
        },
        {
          "auctionId": 5,
          "user": 5,
          "title": "Pozione polisucco",
          "description": "Pozione per trasformarsi temporaneamente in un'altra persona.",
          "closingDate": ISODate("2025-01-08T11:00:00.000Z"),
          "initialValue": "300",
          "bids": [
            {
              "bidId": 1,
              "userId": 2,
              "username": "hermione",
              "offerDate": ISODate("2024-12-26T13:00:00.000Z"),
              "value": 304
            },
            {
              "bidId": 2,
              "userId": 6,
              "username": "hagrid",
              "offerDate": ISODate("2025-01-06T14:00:00.000Z"),
              "value": 330
            },
            {
              "bidId": 3,
              "userId": 3,
              "username": "ron",
              "offerDate": ISODate("2025-01-06T18:00:00.000Z"),
              "value": 350
            }
          ]
        },
        {
          "auctionId": 6,
          "user": 8,
          "title": "Manico di scopa Nimbus 2000",
          "description": "Famoso manico di scopa, perfetto per partite di Quidditch tra amici!",
          "closingDate": ISODate("2025-01-09T19:00:00.000Z"),
          "initialValue": "800",
          "bids": [
            {
              "bidId": 1,
              "userId": 9,
              "username": "felpato",
              "offerDate": ISODate("2024-12-27T08:30:00.000Z"),
              "value": 850
            },
            {
              "bidId": 2,
              "userId": 7,
              "username": "draco",
              "offerDate": ISODate("2024-12-27T10:00:00.000Z"),
              "value": 950
            },
            {
              "bidId": 3,
              "userId": 4,
              "username": "silente",
              "offerDate": ISODate("2024-12-27T10:30:00.000Z"),
              "value": 955
            },
            {
              "bidId": 4,
              "userId": 2,
              "username": "hermione",
              "offerDate": ISODate("2025-01-02T11:00:00.000Z"),
              "value": 980
            }
          ]
        },
        {
          "auctionId": 7,
          "user": 4,
          "title": "Bacchetta di sambuco",
          "description": "Leggendaria bacchetta, uno dei tre doni della morte.",
          "closingDate": ISODate("2025-12-15T17:00:00.000Z"),
          "initialValue": "1200",
          "bids": [
            {
              "bidId": 1,
              "userId": 7,
              "username": "draco",
              "offerDate": ISODate("2024-12-24T19:30:00.000Z"),
              "value": 1230
            },
            {
              "bidId": 2,
              "userId": 2,
              "username": "hermione",
              "offerDate": ISODate("2024-12-27T10:30:00.000Z"),
              "value": 1250
            },
            {
              "bidId": 3,
              "userId": 3,
              "username": "ron",
              "offerDate": ISODate("2025-01-07T10:30:00.000Z"),
              "value": 1260
            }
          ]
        },
        {
          "auctionId": 8,
          "user": 8,
          "title": "Cappello parlante",
          "description": "Simbolo delle antiche tradizioni di smistamento nelle case. Compralo per sapere a quale casa appartieni!",
          "closingDate": ISODate("2025-01-03T17:00:00.000Z"),
          "initialValue": "70",
          "bids": [
            {
              "bidId": 1,
              "userId": 2,
              "username": "hermione",
              "offerDate": ISODate("2025-01-01T15:20:00.000Z"),
              "value": 80
            },
            {
              "bidId": 2,
              "userId": 4,
              "username": "silente",
              "offerDate": ISODate("2025-01-02T15:20:00.000Z"),
              "value": 85
            }
          ]
        },
        {
          "auctionId": 9,
          "user": 6,
          "title": "Uovo di drago Ungaro Spinato",
          "description": "Splendido uovo appartiene a un Ungaro Spinato (probabilmente...). Un pezzo raro e perfetto per chi ama le creature magiche... ma ricordate, va trattato con rispetto!",
          "closingDate": ISODate("2024-12-29T16:00:00.000Z"),
          "initialValue": "400",
          "bids": [
            {
              "bidId": 1,
              "userId": 8,
              "username": "mcgranitt",
              "offerDate": ISODate("2024-12-27T13:00:00.000Z"),
              "value": 420
            },
            {
              "bidId": 2,
              "userId": 5,
              "username": "piton",
              "offerDate": ISODate("2024-12-28T13:00:00.000Z"),
              "value": 430
            },
            {
              "bidId": 3,
              "userId": 1,
              "username": "harryp",
              "offerDate": ISODate("2024-12-29T13:00:00.000Z"),
              "value": 440
            }
          ]
        },
        {
          "auctionId": 10,
          "user": 10,
          "title": "Anello di Voldemort",
          "description": "Anello appartenuto a tu sai chi. Solo i veri seguaci del potere oscuro ne saranno degni.",
          "closingDate": ISODate("2024-12-15T10:00:00.000Z"),
          "initialValue": "600",
          "bids": [
            {
              "bidId": 1,
              "userId": 1,
              "username": "harryp",
              "offerDate": ISODate("2024-11-27T13:00:00.000Z"),
              "value": 700
            },
            {
              "bidId": 2,
              "userId": 4,
              "username": "silente",
              "offerDate": ISODate("2024-11-30T13:00:00.000Z"),
              "value": 800
            },
            {
              "bidId": 3,
              "userId": 7,
              "username": "draco",
              "offerDate": ISODate("2024-12-14T13:00:00.000Z"),
              "value": 850
            }
          ]
        },
        {
          "auctionId": 11,
          "user": 9,
          "title": "Mappa del Malandrino",
          "description": "Mappa incantata che mostra ogni angolo di Hogwarts e i movimenti di tutte le persone. Un oggetto essenziale per chi vuole esplorare la scuola in segreto.",
          "closingDate": ISODate("2025-01-12T15:00:00.000Z"),
          "initialValue": "100",
          "bids": [
            {
              "bidId": 1,
              "userId": 2,
              "username": "hermione",
              "offerDate": ISODate("2025-01-05T14:00:00.000Z"),
              "value": 110
            },
            {
              "bidId": 2,
              "userId": 7,
              "username": "draco",
              "offerDate": ISODate("2025-01-07T14:30:00.000Z"),
              "value": 120
            },
            {
              "bidId": 3,
              "userId": 1,
              "username": "harryp",
              "offerDate": ISODate("2025-01-07T19:40:00.000Z"),
              "value": 125
            }
          ]
        }
    ]
);
