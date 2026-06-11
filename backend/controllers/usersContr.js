import { User } from "../models/userMod.js";

export const usersContr = {
  // GET /allUsers
  allUsers: async (req, res) => {
    try {
      const users = await User.find().select('-password'); // Esclude la password per sicurezza
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Errore nel recupero degli utenti" });
    }
  },

  // GET /addUser (Mostra form se usi un motore di template come EJS)
  showAddForm: (req, res) => {
    res.send("Form di inserimento utente"); 
  },

  // POST /addUser
  addUser: async (req, res) => {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json({ message: "Utente creato con successo", user: newUser });
    } catch (error) {
      res.status(400).json({ error: "Errore durante la creazione dell'utente", details: error.message });
    }
  },

  // GET /getUser/:id
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) return res.status(404).json({ error: "Utente non trovato" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Errore nel recupero dell'utente" });
    }
  },

  // GET /editUser/:id
  showEditForm: (req, res) => {
    res.send(`Form di modifica per utente con ID: ${req.params.id}`);
  },

  // POST /editUser/:id
  editUser: async (req, res) => {
    try {
      // Nota: { new: true, runValidators: true } restituisce l'utente aggiornato e applica i controlli
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updatedUser) return res.status(404).json({ error: "Utente non trovato" });
      
      // Forza il ricalcolo del fullName se cambiano nome o cognome
      if (req.body.firstName || req.body.lastName) {
        await updatedUser.save(); 
      }

      res.json({ message: "Utente aggiornato con successo", user: updatedUser });
    } catch (error) {
      res.status(400).json({ error: "Errore durante l'aggiornamento", details: error.message });
    }
  },

  // DELETE /delUser/:id
  delUser: async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) return res.status(404).json({ error: "Utente non trovato" });
      res.json({ message: "Utente eliminato con successo" });
    } catch (error) {
      res.status(500).json({ error: "Errore durante l'eliminazione" });
    }
  }
};
