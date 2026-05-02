import { addUser, getUserByEmail } from "../../../lib/repository";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const oldUser = await getUserByEmail(email);

    if (oldUser) {
      return res.status(400).json({ message: "Email already used" });
    }

    const user = await addUser(username, email, password);

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Register error",
      error: error.message,
    });
  }
}