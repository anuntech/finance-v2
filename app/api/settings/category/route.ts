import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import clientPromise from "@/libs/mongo";
import mongoose from "mongoose";
import Category from "@/models/Category";

export async function POST(request: Request) {
  try {
    await connectMongo();

    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!body.color) {
      return NextResponse.json({ error: "Color is required" }, { status: 400 });
    }

    if (!body.type || !["output", "input", "others"].includes(body.type)) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    const category = await Category.create({
      name: body.name,
      color: body.color,
      type: body.type,
    });

    return NextResponse.json(category);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
