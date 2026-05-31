import { Router } from "express";
import { prisma } from "../db.js";
import { auth } from "../auth.js";
import validator from 'validator';

const router = Router();

router.put("/api/user/update", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    const userId = session.user.id;
    const { firstName, lastName, email } = req.body;

    // Check for missing fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();

    // validation for email format
    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser && existingUser.id !== userId) {
      return res
        .status(400)
        .json({ error: "Email is already in use by another account" });
    }

    const fullName = `${cleanFirstName} ${cleanLastName}`;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: fullName,
        firstName: cleanFirstName,
        lastName: cleanLastName,
        email: cleanEmail,
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: updatedUser.name,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
