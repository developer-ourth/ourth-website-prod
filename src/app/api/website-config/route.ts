import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const configPath = path.join(process.cwd(), "src/data/website-config.json");

export async function GET() {
  try {
    const fileContents = fs.readFileSync(configPath, "utf8");
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read configuration" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    fs.writeFileSync(configPath, JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update configuration" }, { status: 500 });
  }
}
