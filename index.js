const { BlobServiceClient } = require('@azure/storage-blob');
const express = require('express');
const fetch = require('node-fetch');

require('dotenv').config({ path: './env/.env' });

const app = express();

const port = process.env.PORT || 3001;

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

app.get('/api/images/:imageName', async (req, res) => {
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
  const blobName = req.params.imageName;

  const containerClient = blobServiceClient.getContainerClient(containerName);
  
  try {
    const blobClient = containerClient.getBlobClient(blobName);
    
    const response = await blobClient.download();
    const stream = response.readableStreamBody;

    res.setHeader('Content-Type', response.contentType);
    stream.pipe(res);

    console.log('Imagen obtenida correctamente');

  } catch (error) {
    console.error(error);
    res.status(500).send('Hubo un error al obtener la imagen');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
