const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const url = 'mongodb://localhost:27017/todo-app';

// Connect to MongoDB
mongoose.connect(url, {})
    .then(() => console.log('MongoDB connected'))
    .catch((error) => {
        console.error('MongoDB connection failed:', error);
    });

// Define Todo model
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

const Todo = mongoose.model('Todo', todoSchema);

// Get all todos
app.get('/todos', async (req, res) => {
    try {
        // Fetch all todos , title and completed attributes
        const todos = await Todo.find({}, 'title completed');
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new todo
app.post('/todo', async (req, res) => {
    const title = req.body.title;
    const todo = new Todo({
        title,
        completed: false,
    });

    try {
        await todo.save();
        res.json({ message: 'Todo created' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update todo completed status
app.put('/todo/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        todo.completed = req.body.completed;
        await todo.save();
        res.json({ message: 'Todo updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a todo
app.delete('/todo/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        await todo.deleteOne({ _id: req.params.id });
        res.json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});