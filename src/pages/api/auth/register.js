export default function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    // Dummy registration logic
    if (email && password) {
      res.status(200).json({ message: "Registrierung erfolgreich", email });
    } else {
      res.status(400).json({ message: "E-Mail und Passwort sind erforderlich" });
    }
  } else {
    res.status(405).json({ message: "Methode nicht erlaubt" });
  }
}
