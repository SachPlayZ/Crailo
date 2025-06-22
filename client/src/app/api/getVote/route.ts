import Vote from "@/lib/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Fetch the vote record from the database
    const body = await request.json();
    const { productId } = body;

    console.log("Fetching vote record for productId:", productId);

    const voteRecord = await Vote.findOne({ productId });
    if (!voteRecord) {
      return NextResponse.json({ error: "Vote record not found" }, { status: 404 });
    }

    // Calculate total votes and majority result
    const totalVotes = voteRecord.yesVotes + voteRecord.noVotes;
    let majorityResult = null;
    
    if (totalVotes >= 3) {
      majorityResult = voteRecord.yesVotes > voteRecord.noVotes;
    }

    return NextResponse.json({
      message: "Vote record fetched successfully",
      voteRecord,
      totalVotes,
      majorityResult
    });
  } catch (error) {
    console.error("Error fetching vote record:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}