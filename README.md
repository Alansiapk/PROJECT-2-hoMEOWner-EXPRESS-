# hoMEOWner API

This is a RESTful API project built using NodeJS (ExpressJS) and MongoDB for a cat adoption website. It is used in combination with a frontend interface, React which can be found [here]([https://github.com/Alansiapk/hoMEOWner-react]

## Sample MongoDB Document

![Sample MongoDB document](https://github.com/Alansiapk/PROJECT-2-hoMEOWner-EXPRESS-/blob/main/MongoData.png)

GET /catCollection
```
#### Response
Returns an array of the cat records

### Create a new cat record

#### Request
```
POST /catCollection
```
#### Response
New cat is added to the database

### Edit a cat record based on the ID

#### Request
```
PUT /catCollection/:cat_id
```
#### Response
Cat record (cat_id: _id) is updated in the database

### Delete a cat record based on the ID

#### Request
```
DELETE /catCollection/:cat_id
```
#### Response
cat record (cat_id: _id) is deleted from the database

### Post a comment on a certain cat

#### Request
```

## Technologies Used

1. [ExpressJS](https://expressjs.com/) & [NodeJS](https://nodejs.org/en/) - minimalist web application framework to help manage servers and routes
2. [MongoDB & MongoDB Atlas](https://www.mongodb.com/) - manage document-oriented information, store or retrieve information
3. [Render.com](https://render.com/) - cloud platform server for API

## Testing

Testing is done for the HTTP methods (POST, GET, PUT, DELETE) via the [Advanced REST Client](https://install.advancedrestclient.com/install).

## Deployment

Deployment is done through render.com. For the detailed deployment steps, you may refer [here](https://docs.google.com/document/d/173cDw6ndseX_Iw42YEPpdpR_4A5dJ3cVVqdv-ukG0ds/edit).
