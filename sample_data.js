//user collection
[
    {
        "_id": ObjectId("632473246873"),
        "name": "Alan",
        "dateOfBirth": "1990/3/15",
        "IC": "S9084907G",
        "address": "Yishun Ave 6",
        "ContactNumber": "98150531",
        "email": "alansiapk0315@gmail.com",

    }

]

//cat collection

[
    {
        "_id": ObjectId("8743327"), //POST ID
        "userID":ObjectId("632473246873"),
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
                "_id": ObjectId("12312"),
                "problem": "Eye condition",
                "date": "2021/3/16",
                "symptoms": ["Eye sore", "Easily bruised"]
            },
            {
                "_id": ObjectId("3478"),
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
    { "_id": ObjectId("632473246873"),
    "postId": ObjectId("8743327"), //POST ID
    "userId": ObjectId("632473246873"),
    "reason": "moving to other contry",
    "care":"clean"
    }

]
//.gi