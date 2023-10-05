require("dotenv").config({ path: "../.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const apiKey = process.env.OPENAI_API_KEY;

const app = express();
const PORT = 5000;

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/todoApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());

// Define a simple schema and model for our Todo
const TodoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
  tags: [String], // for tagging users
  hashtags: [String], // for hashtags
});

const Todo = mongoose.model("Todo", TodoSchema);

// Routes
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save();
  res.json(newTodo);
});

// Add this route to support delete functionality
app.delete("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", UserSchema);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Check if username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: "Username already exists" });
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user with the hashed password
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  res.status(200).json({ message: "User created successfully" });
});

app.get("/search", async (req, res) => {
  const { query } = req.query;

  // Search for users
  const users = await User.find({ username: new RegExp(query, "i") });

  // Search for todos with hashtags
  const todos = await Todo.find({ hashtags: new RegExp(query, "i") });

  res.json({ users, todos });
});

app.post("/create-todo", async (req, res) => {
  const { userInput } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that creates to-do lists.",
          },
          { role: "user", content: userInput },
        ],
        temperature: 0.7,
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const aiMessage = response.data.choices[0].message.content.trim();
    const todos = aiMessage.split("\n").filter((item) => item); // Split by line and filter out empty strings
    res.json({ todos });
  } catch (error) {
    console.error(
      "Detailed Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Error creating to-do list" });
  }
});
