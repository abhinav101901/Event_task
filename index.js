const express = require('express');
const multer = require('multer')
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

const url = 'mongodb+srv://abhinav:abhi123@cluster0.qicwtqo.mongodb.net/Task'; 
const dbName = 'Task'; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(multer().any())

// app.post('/api/formdata', async (req, res) => {
//   try {
//     const formData = req.body; // Assuming the form data is sent in the request body
//      console.log(formData)
//     const client = await MongoClient.connect(url);
//     const db = client.db("Task");
//     const collection = db.collection("Task");

//     const result = await collection.insertOne(formData);

//     client.close();

//     res.status(201).json({ message: 'Form data stored successfully', documentId: result.insertedId });
//   } catch (error) {
//     console.error('Failed to store form data:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

//................................... E V E N T  _  C R E A T I O N ........................................................
app.post('/api/v3/app/events', async (req, res) => {
  try {
    const documentData = req.body; 
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection('Task'); 
    const result = await collection.insertOne(documentData);
    client.close();
    res.status(201).json({ message: 'Document created successfully', documentId: result.insertedId });
  } catch (error) {
    console.error('Failed to create document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//--------------------------------- E V E N T - U P D A T E------------------------------------------------
app.put('/api/v3/app/events/:id', async (req, res) => {
    try {
      const documentId = req.params.id; 
      const documentData = req.body;
      const client = await MongoClient.connect(url);
      const db = client.db(dbName);
      const collection = db.collection('Task'); 
  
      const result = await collection.updateOne(
        { _id: new ObjectId(documentId) }, 
        { $set: documentData } 
      );
      client.close();
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Document not found' });
      }
      res.json({ message: 'Document updated successfully' });
    } catch (error) {
      console.error('Failed to update document:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

//----------------------------------------E V E N T -  D E L E T E -------------------------------------------------------------

  app.delete('/api/v3/app/events/:id', async (req, res) => {
    try {
      const documentId = req.params.id; 
    //   console.log(typeof documentId)
      const client = await MongoClient.connect(url);
      const db = client.db(dbName);
      const collection = db.collection('Task'); 
      const result = await collection.deleteOne({ _id: new ObjectId(documentId)});
  
      client.close();
      if (result.deletedCount === 0) {
        res.status(404).json({ error: 'Document not found' });
      } else {
        res.json({ message: 'Document deleted successfully' });
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
//-------------------------------------E V E N T - D E S P L A Y -  B Y-  I D -----------------------------------------------------------

  app.get('/api/v3/app/events', async (req, res) => {
    try {
      const documentId = req.query.id; 
      const client = await MongoClient.connect(url);
      const db = client.db(dbName);
      const collection = db.collection('Task'); 
      const document = await collection.findOne({ _id: new ObjectId(documentId) });
  
      client.close();
  
      if (!document) {
        res.status(404).json({ error: 'Document not found' });
      } else {
        res.json(document);
      }
    } catch (error) {
      console.error('Failed to retrieve document:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });  

//--------------------------------E V E N T - D I S P L A Y - W I T H - P A G E - A N D - L I M I T S--------------------

  app.get('/api/v3/app/events', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; 
      const limit = parseInt(req.query.limit) || 10; 
      const client = await MongoClient.connect(url);
      const db = client.db(dbName);
      const collection = db.collection("Task");
      const skip = (page - 1) * limit; 
      const events = await collection.find().sort({ timestamp: -1 }).skip(skip).limit(limit).toArray();

      client.close();
  
      res.json(events);
    } catch (error) {
      console.error('Failed to retrieve events:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
