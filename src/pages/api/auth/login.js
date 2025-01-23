export default function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    // Dummy login logic
    if (email === "user@example.com" && password === "password123") {
      res.status(200).json({ message: "Login erfolgreich", email });
    } else {
      res.status(401).json({ message: "Ungültige E-Mail oder Passwort" });
    }
  } else {
    res.status(405).json({ message: "Methode nicht erlaubt" });
  }
}
