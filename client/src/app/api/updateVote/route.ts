import { Vote } from "@/lib/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { voteType, productId, voterAddress } = body;

    console.log("Received vote request:", { voteType, productId, voterAddress });
    if (!voteType || !productId || !voterAddress) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }


    // Check if this voter has already voted
    const existingVote = await Vote.findOne({
      productId,
      voterAddresses: voterAddress
    });

    if (existingVote) {
      return NextResponse.json({ error: "You have already voted on this product" }, { status: 400 });
    }

    // Get or create the vote record
    let voteRecord = await Vote.findOne({ productId });
    if (!voteRecord) {
      voteRecord = new Vote({
        productId,
        yesVotes: 0,
        noVotes: 0,
        voterAddresses: [], // Initialize the voterAddresses array
      });
    }

    // Update the vote count based on the vote type
    if (voteType === "yes") {
      voteRecord.yesVotes += 1;
    } else if (voteType === "no") {
      voteRecord.noVotes += 1;
    } else {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
    }

    // Calculate total votes and determine majority
    const totalVotes = voteRecord.yesVotes + voteRecord.noVotes;
    let majorityResult = null;

    if (totalVotes >= 3) {
      majorityResult = voteRecord.yesVotes > voteRecord.noVotes;
      voteRecord.finalResult = majorityResult;
      voteRecord.isFinalized = true;
    }

    // Ensure voterAddresses is initialized as an array
    if (!voteRecord.voterAddresses) {
      voteRecord.voterAddresses = [];
    }

    // Add the voter's address to the list
    voteRecord.voterAddresses.push(voterAddress);
    
    await voteRecord.save();

    // Return comprehensive vote status
    return NextResponse.json({
      status: "success",
      data: {
        voteRecord: {
          productId: voteRecord.productId,
          yesVotes: voteRecord.yesVotes,
          noVotes: voteRecord.noVotes,
          totalVotes,
          isFinalized: totalVotes >= 3,
          majorityResult,
          voterAddresses: voteRecord.voterAddresses,
        },
      },
    });
  } catch (error) {
    console.error("Error updating vote:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}