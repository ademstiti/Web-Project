import { checkLogin } from "../../../lib/repository";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const email = req.body.email;
  const password = req.body.password;

  const user = await checkLogin(email, password);

  if (!user) {
    return res.status(401).json({ message: "Wrong email or password" });
  }

  return res.status(200).json(user);
}