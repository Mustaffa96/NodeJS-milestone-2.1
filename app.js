const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express REST API',
            version: '1.0.0',
            description: 'A simple Express REST API with Swagger documentation',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Development server',
            },
        ],
    },
    apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware for better security and performance
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// In-memory data store (replace with a database in production)
let items = [];

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the item
 *         name:
 *           type: string
 *           description: Name of the item
 *         description:
 *           type: string
 *           description: Optional description of the item
 */

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Returns all items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: List of all items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
app.get('/api/items', (req, res) => {
    res.json(items);
});

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Get item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 */
app.get('/api/items/:id', (req, res) => {
    const item = items.find(i => i.id === req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
});

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 */
app.post('/api/items', (req, res) => {
    const item = {
        id: Date.now().toString(),
        ...req.body
    };
    items.push(item);
    res.status(201).json(item);
});

/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Update an item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 */
app.put('/api/items/:id', (req, res) => {
    const index = items.findIndex(i => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Item not found' });
    
    items[index] = {
        ...items[index],
        ...req.body,
        id: req.params.id
    };
    res.json(items[index]);
});

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Delete an item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Item deleted successfully
 *       404:
 *         description: Item not found
 */
app.delete('/api/items/:id', (req, res) => {
    const index = items.findIndex(i => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Item not found' });
    
    items.splice(index, 1);
    res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
});
