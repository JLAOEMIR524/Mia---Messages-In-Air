import { Router } from "express";
import { prisma } from "../db.js";
import { auth } from "../auth.js"; 

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

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
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