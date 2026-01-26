
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Simple query to test DB connection
        const count = await prisma.article.count();
        const settings = await prisma.systemSettings.findFirst();

        return NextResponse.json({
            status: "ok",
            db: "connected",
            articleCount: count,
            hasSettings: !!settings,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error("Health Check Error:", error);
        return NextResponse.json({
            status: "error",
            message: error.message,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
