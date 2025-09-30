import { NextResponse } from "next/server"
import { getPolicyFeedbackManager } from "@/lib/policy-feedback"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const policyId = searchParams.get('policyId')
    const action = searchParams.get('action')

    const feedbackManager = getPolicyFeedbackManager()

    if (action === 'metrics') {
      const metrics = await feedbackManager.getRealTimeMetrics()
      return NextResponse.json(metrics)
    }

    if (action === 'impact' && policyId) {
      const startDate = searchParams.get('startDate') || '2024-01-01'
      const endDate = searchParams.get('endDate')
      const impact = await feedbackManager.analyzePolicyImpact(policyId, startDate, endDate || undefined)
      return NextResponse.json(impact)
    }

    if (policyId) {
      const feedback = await feedbackManager.getFeedbackByPolicy(policyId)
      return NextResponse.json(feedback)
    }

    const allFeedback = await feedbackManager.getAllFeedback()
    return NextResponse.json(allFeedback)
  } catch (error) {
    console.error("Failed to fetch policy feedback:", error)
    return NextResponse.json(
      { error: "Failed to fetch policy feedback" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { policyId, aqiData, publicSentiment, complianceData } = body

    const feedbackManager = getPolicyFeedbackManager()
    const feedback = await feedbackManager.collectPolicyFeedback(
      policyId,
      aqiData,
      publicSentiment,
      complianceData
    )

    return NextResponse.json(feedback)
  } catch (error) {
    console.error("Failed to collect policy feedback:", error)
    return NextResponse.json(
      { error: "Failed to collect policy feedback" },
      { status: 500 }
    )
  }
}
