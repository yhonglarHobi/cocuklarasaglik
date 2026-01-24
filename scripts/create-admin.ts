import { prisma } from "@/lib/prisma";

async function createDefaultAdmin() {
    try {
        // Check if any user exists
        const existingUser = await prisma.user.findFirst();

        if (existingUser) {
            console.log("✅ User already exists:", existingUser.email);
            return;
        }

        // Create default admin user
        const admin = await prisma.user.create({
            data: {
                email: "admin@cocuklarasaglik.com",
                name: "Admin",
                password: "hashed_password_placeholder", // In production, use proper password hashing
                role: "ADMIN"
            }
        });

        console.log("✅ Default admin user created successfully!");
        console.log("Email:", admin.email);
        console.log("Role:", admin.role);
        console.log("\nNow you can generate articles!");

    } catch (error) {
        console.error("❌ Error creating admin:", error);
    } finally {
        await prisma.$disconnect();
    }
}

createDefaultAdmin();
