export interface PolicyFeedback {
  id: string
  policyId: string
  timestamp: string
  aqiBefore: number
  aqiAfter: number
  aqiReduction: number
  effectiveness: number
  publicSentiment: number
  complianceRate: number
  costBenefitRatio: number
  stakeholderSatisfaction: number
  implementationChallenges: string[]
  successFactors: string[]
  recommendations: string[]
}

export interface RealTimeMetrics {
  timestamp: string
  totalPolicies: number
  activePolicies: number
  averageEffectiveness: number
  totalAQIReduction: number
  publicApprovalRating: number
  complianceRate: number
  costEffectiveness: number
  topPerformingPolicy: string
  underperformingPolicy: string
  trends: {
    effectiveness: number[]
    compliance: number[]
    publicSentiment: number[]
  }
}

export interface PolicyImpactAnalysis {
  policyId: string
  name: string
  startDate: string
  endDate?: string
  totalAQIReduction: number
  averageEffectiveness: number
  peakEffectiveness: number
  lowestEffectiveness: number
  publicSentimentTrend: number[]
  complianceTrend: number[]
  costPerAQIPoint: number
  roi: number
  lessonsLearned: string[]
  bestPractices: string[]
  recommendations: string[]
}

export class PolicyFeedbackManager {
  private static instance: PolicyFeedbackManager
  private feedbackData: PolicyFeedback[] = []
  private realTimeMetrics: RealTimeMetrics | null = null
  private impactAnalyses: PolicyImpactAnalysis[] = []

  static getInstance(): PolicyFeedbackManager {
    if (!PolicyFeedbackManager.instance) {
      PolicyFeedbackManager.instance = new PolicyFeedbackManager()
    }
    return PolicyFeedbackManager.instance
  }

  async collectPolicyFeedback(policyId: string, aqiData: any, publicSentiment: number, complianceData: any): Promise<PolicyFeedback> {
    const feedback: PolicyFeedback = {
      id: `feedback-${Date.now()}`,
      policyId,
      timestamp: new Date().toISOString(),
      aqiBefore: aqiData.before || 0,
      aqiAfter: aqiData.after || 0,
      aqiReduction: Math.max(0, (aqiData.before || 0) - (aqiData.after || 0)),
      effectiveness: this.calculateEffectiveness(aqiData, complianceData),
      publicSentiment,
      complianceRate: complianceData.rate || 0,
      costBenefitRatio: this.calculateCostBenefitRatio(policyId, aqiData),
      stakeholderSatisfaction: this.calculateStakeholderSatisfaction(policyId, publicSentiment),
      implementationChallenges: this.identifyChallenges(policyId, complianceData),
      successFactors: this.identifySuccessFactors(policyId, aqiData),
      recommendations: this.generateRecommendations(policyId, aqiData, complianceData)
    }

    this.feedbackData.push(feedback)
    await this.updateRealTimeMetrics()
    
    return feedback
  }

  private calculateEffectiveness(aqiData: any, complianceData: any): number {
    const aqiReduction = Math.max(0, (aqiData.before || 0) - (aqiData.after || 0))
    const complianceRate = complianceData.rate || 0
    
    // Effectiveness = AQI reduction * compliance rate / 100
    return Math.round((aqiReduction * complianceRate) / 100)
  }

  private calculateCostBenefitRatio(policyId: string, aqiData: any): number {
    // Mock calculation - in real implementation, this would use actual cost data
    const aqiReduction = Math.max(0, (aqiData.before || 0) - (aqiData.after || 0))
    const estimatedCost = this.getPolicyCost(policyId)
    
    return aqiReduction > 0 ? Math.round((aqiReduction / estimatedCost) * 100) : 0
  }

  private getPolicyCost(policyId: string): number {
    // Mock policy costs
    const costs: { [key: string]: number } = {
      "odd-even": 1000000,
      "industrial-controls": 5000000,
      "stubble-ban": 2000000,
      "construction-dust": 3000000
    }
    return costs[policyId] || 1000000
  }

  private calculateStakeholderSatisfaction(policyId: string, publicSentiment: number): number {
    // Mock calculation based on policy type and public sentiment
    const baseSatisfaction = publicSentiment
    const policyMultiplier = this.getPolicySatisfactionMultiplier(policyId)
    
    return Math.round(baseSatisfaction * policyMultiplier)
  }

  private getPolicySatisfactionMultiplier(policyId: string): number {
    const multipliers: { [key: string]: number } = {
      "odd-even": 0.8, // More controversial
      "industrial-controls": 0.9,
      "stubble-ban": 0.7, // Affects farmers
      "construction-dust": 0.85
    }
    return multipliers[policyId] || 0.8
  }

  private identifyChallenges(policyId: string, complianceData: any): string[] {
    const challenges: string[] = []
    
    if (complianceData.rate < 70) {
      challenges.push("Low compliance rate - need better enforcement")
    }
    
    if (complianceData.resistance > 30) {
      challenges.push("Public resistance to policy implementation")
    }
    
    if (complianceData.resourceConstraints) {
      challenges.push("Insufficient resources for implementation")
    }
    
    // Policy-specific challenges
    switch (policyId) {
      case "odd-even":
        challenges.push("Traffic congestion during peak hours")
        challenges.push("Public transport capacity constraints")
        break
      case "industrial-controls":
        challenges.push("Industry compliance monitoring")
        challenges.push("Economic impact on businesses")
        break
      case "stubble-ban":
        challenges.push("Farmer cooperation and alternatives")
        challenges.push("Agricultural season timing")
        break
    }
    
    return challenges
  }

  private identifySuccessFactors(policyId: string, aqiData: any): string[] {
    const factors: string[] = []
    
    if (aqiData.after < aqiData.before) {
      factors.push("Effective AQI reduction achieved")
    }
    
    if (aqiData.consistency > 80) {
      factors.push("Consistent policy implementation")
    }
    
    // Policy-specific success factors
    switch (policyId) {
      case "odd-even":
        factors.push("Public transport availability")
        factors.push("Clear communication to public")
        break
      case "industrial-controls":
        factors.push("Industry cooperation")
        factors.push("Effective monitoring systems")
        break
      case "stubble-ban":
        factors.push("Farmer incentives and alternatives")
        factors.push("Satellite monitoring effectiveness")
        break
    }
    
    return factors
  }

  private generateRecommendations(policyId: string, aqiData: any, complianceData: any): string[] {
    const recommendations: string[] = []
    
    if (complianceData.rate < 70) {
      recommendations.push("Improve compliance monitoring and enforcement")
      recommendations.push("Increase public awareness and education")
    }
    
    if (aqiData.after > aqiData.before * 0.9) {
      recommendations.push("Review policy effectiveness and consider modifications")
      recommendations.push("Implement additional complementary measures")
    }
    
    if (complianceData.resistance > 30) {
      recommendations.push("Address public concerns and resistance")
      recommendations.push("Consider policy alternatives or modifications")
    }
    
    return recommendations
  }

  async updateRealTimeMetrics(): Promise<RealTimeMetrics> {
    const now = new Date()
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    const recentFeedback = this.feedbackData.filter(f => 
      new Date(f.timestamp) > last24Hours
    )
    
    const totalPolicies = new Set(recentFeedback.map(f => f.policyId)).size
    const activePolicies = totalPolicies // All recent policies are considered active
    
    const averageEffectiveness = recentFeedback.length > 0 
      ? recentFeedback.reduce((sum, f) => sum + f.effectiveness, 0) / recentFeedback.length 
      : 0
    
    const totalAQIReduction = recentFeedback.reduce((sum, f) => sum + f.aqiReduction, 0)
    
    const publicApprovalRating = recentFeedback.length > 0
      ? recentFeedback.reduce((sum, f) => sum + f.publicSentiment, 0) / recentFeedback.length
      : 0
    
    const complianceRate = recentFeedback.length > 0
      ? recentFeedback.reduce((sum, f) => sum + f.complianceRate, 0) / recentFeedback.length
      : 0
    
    const costEffectiveness = recentFeedback.length > 0
      ? recentFeedback.reduce((sum, f) => sum + f.costBenefitRatio, 0) / recentFeedback.length
      : 0
    
    // Find top and underperforming policies
    const policyPerformance = new Map<string, number>()
    recentFeedback.forEach(f => {
      const current = policyPerformance.get(f.policyId) || 0
      policyPerformance.set(f.policyId, current + f.effectiveness)
    })
    
    const topPerformingPolicy = policyPerformance.size > 0 
      ? Array.from(policyPerformance.entries()).reduce((a, b) => a[1] > b[1] ? a : b)[0]
      : "None"
    
    const underperformingPolicy = policyPerformance.size > 0
      ? Array.from(policyPerformance.entries()).reduce((a, b) => a[1] < b[1] ? a : b)[0]
      : "None"
    
    // Calculate trends (simplified)
    const trends = {
      effectiveness: recentFeedback.map(f => f.effectiveness),
      compliance: recentFeedback.map(f => f.complianceRate),
      publicSentiment: recentFeedback.map(f => f.publicSentiment)
    }
    
    this.realTimeMetrics = {
      timestamp: now.toISOString(),
      totalPolicies,
      activePolicies,
      averageEffectiveness: Math.round(averageEffectiveness),
      totalAQIReduction: Math.round(totalAQIReduction),
      publicApprovalRating: Math.round(publicApprovalRating),
      complianceRate: Math.round(complianceRate),
      costEffectiveness: Math.round(costEffectiveness),
      topPerformingPolicy,
      underperformingPolicy,
      trends
    }
    
    return this.realTimeMetrics
  }

  async getRealTimeMetrics(): Promise<RealTimeMetrics | null> {
    if (!this.realTimeMetrics) {
      await this.updateRealTimeMetrics()
    }
    return this.realTimeMetrics
  }

  async analyzePolicyImpact(policyId: string, startDate: string, endDate?: string): Promise<PolicyImpactAnalysis> {
    const policyFeedback = this.feedbackData.filter(f => 
      f.policyId === policyId && 
      new Date(f.timestamp) >= new Date(startDate) &&
      (!endDate || new Date(f.timestamp) <= new Date(endDate))
    )
    
    if (policyFeedback.length === 0) {
      throw new Error("No feedback data found for the specified policy and date range")
    }
    
    const totalAQIReduction = policyFeedback.reduce((sum, f) => sum + f.aqiReduction, 0)
    const effectivenessValues = policyFeedback.map(f => f.effectiveness)
    const averageEffectiveness = effectivenessValues.reduce((sum, val) => sum + val, 0) / effectivenessValues.length
    const peakEffectiveness = Math.max(...effectivenessValues)
    const lowestEffectiveness = Math.min(...effectivenessValues)
    
    const publicSentimentTrend = policyFeedback.map(f => f.publicSentiment)
    const complianceTrend = policyFeedback.map(f => f.complianceRate)
    
    const totalCost = this.getPolicyCost(policyId)
    const costPerAQIPoint = totalCost / Math.max(totalAQIReduction, 1)
    const roi = (totalAQIReduction / totalCost) * 100
    
    const analysis: PolicyImpactAnalysis = {
      policyId,
      name: this.getPolicyName(policyId),
      startDate,
      endDate,
      totalAQIReduction: Math.round(totalAQIReduction),
      averageEffectiveness: Math.round(averageEffectiveness),
      peakEffectiveness,
      lowestEffectiveness,
      publicSentimentTrend,
      complianceTrend,
      costPerAQIPoint: Math.round(costPerAQIPoint),
      roi: Math.round(roi),
      lessonsLearned: this.extractLessonsLearned(policyFeedback),
      bestPractices: this.extractBestPractices(policyFeedback),
      recommendations: this.generateImpactRecommendations(policyFeedback)
    }
    
    this.impactAnalyses.push(analysis)
    return analysis
  }

  private getPolicyName(policyId: string): string {
    const names: { [key: string]: string } = {
      "odd-even": "Odd-Even Vehicle Scheme",
      "industrial-controls": "Industrial Emission Controls",
      "stubble-ban": "Stubble Burning Ban",
      "construction-dust": "Construction Dust Management"
    }
    return names[policyId] || "Unknown Policy"
  }

  private extractLessonsLearned(feedback: PolicyFeedback[]): string[] {
    const lessons: string[] = []
    
    const avgCompliance = feedback.reduce((sum, f) => sum + f.complianceRate, 0) / feedback.length
    if (avgCompliance < 70) {
      lessons.push("Low compliance rates indicate need for better enforcement mechanisms")
    }
    
    const avgSentiment = feedback.reduce((sum, f) => sum + f.publicSentiment, 0) / feedback.length
    if (avgSentiment < 60) {
      lessons.push("Public resistance affects policy effectiveness")
    }
    
    const avgEffectiveness = feedback.reduce((sum, f) => sum + f.effectiveness, 0) / feedback.length
    if (avgEffectiveness > 80) {
      lessons.push("High effectiveness achieved when all stakeholders cooperate")
    }
    
    return lessons
  }

  private extractBestPractices(feedback: PolicyFeedback[]): string[] {
    const practices: string[] = []
    
    const highEffectivenessFeedback = feedback.filter(f => f.effectiveness > 80)
    if (highEffectivenessFeedback.length > 0) {
      practices.push("Regular monitoring and feedback collection")
      practices.push("Stakeholder engagement and communication")
      practices.push("Adaptive implementation based on real-time data")
    }
    
    return practices
  }

  private generateImpactRecommendations(feedback: PolicyFeedback[]): string[] {
    const recommendations: string[] = []
    
    const avgEffectiveness = feedback.reduce((sum, f) => sum + f.effectiveness, 0) / feedback.length
    if (avgEffectiveness < 50) {
      recommendations.push("Consider policy revision or alternative approaches")
      recommendations.push("Increase stakeholder engagement")
    }
    
    const avgCompliance = feedback.reduce((sum, f) => sum + f.complianceRate, 0) / feedback.length
    if (avgCompliance < 70) {
      recommendations.push("Improve compliance monitoring and enforcement")
      recommendations.push("Provide incentives for compliance")
    }
    
    return recommendations
  }

  async getFeedbackByPolicy(policyId: string): Promise<PolicyFeedback[]> {
    return this.feedbackData.filter(f => f.policyId === policyId)
  }

  async getAllFeedback(): Promise<PolicyFeedback[]> {
    return this.feedbackData
  }

  async getImpactAnalyses(): Promise<PolicyImpactAnalysis[]> {
    return this.impactAnalyses
  }
}

export const getPolicyFeedbackManager = () => PolicyFeedbackManager.getInstance()
