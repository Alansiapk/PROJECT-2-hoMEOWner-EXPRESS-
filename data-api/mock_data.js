//an array to represent a collection
//user collection
[
    {
        "_id": ObjectId("6412bebcdac700c9705ff128"),
        "name": "Alan",
        "dateOfBirth": "1990/3/15",
        "address": "Yishun Ave 6",
        "contactNumber": "98150531",
        "email": "alansiapk0315@gmail.com"

    },
    {
        "_id": ObjectId("6413e7a7440a1e6a4eef20ad"),
        "name": "Shiv",
        "dateOfBirth": "2000/5/15",
        "address": "Orchard Ave 6",
        "contactNumber": "93876546",
        "email": "sk_555@gmail.com"
    }


]

//cat collection

[
    {
        "_id": ObjectId("6412c00edac700c9705ff129"), //CAT ID
        "userID":ObjectId("6412bebcdac700c9705ff128"),
        "catName": "Pikachu",
        "catAge": "3 years old",
        "catBreed": "Persian",
        "catGender": "Male",
        "requireHomeVisit": true,
        "neutered": true,
        "personality": 
            [ "i knew too much",
             "party animal",
             "love bug",
             "secret admirer",
             "MVP",
             "shy" ],
        "familyStatus":
            ["Good with kids",
            "Good with other cats",
            "Leave me alone"],
        "comment": "Pikachu is a lovely cat!",
        "medicalHistory":[
            {
                "problem": "Eye condition",
                "date": "2021/3/16",
                "symptoms": ["Eye sore", "Easily bruised"]
            },
            {
                "problem": "Leg condition",
                "date": "2020/2/15",
                "symptoms": ["walk slowly"]
            }
        ],
        "pictureUrl":"https://imgur.com/a/ccCoYnc"

    }
]

//rehome cat post
[
    { "_id": ObjectId("636412d315dac700c9705ff12d"),
    "userId": ObjectId("6412bebcdac700c9705ff128"),//userID
    "catId": ObjectId("6412c00edac700c9705ff129"), //CAT ID
    "reason": "moving to other contry"
    }

]
