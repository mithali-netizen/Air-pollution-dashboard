"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  Users,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Car,
  Factory,
  Flame,
  Building,
  Target,
  Calendar,
  BarChart3,
  Lock,
  LogIn,
} from "lucide-react"

interface PolicyUser {
  id: string
  name: string
  role: "admin" | "analyst" | "viewer"
  department: string
}

interface Intervention {
  id: string
  name: string
  type: "traffic" | "industrial" | "construction" | "agricultural"
  status: "active" | "planned" | "completed"
  effectiveness: number
  startDate: string
  endDate?: string
  description: string
}

export default function PolicyPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<PolicyUser | null>(null)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated (mock)
    const savedUser = localStorage.getItem("policyUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
      loadPolicyData()
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Mock authentication
    setTimeout(() => {
      if (loginForm.email === "admin@delhi.gov.in" && loginForm.password === "admin123") {
        const mockUser: PolicyUser = {
          id: "1",
          name: "Dr. Rajesh Kumar",
          role: "admin",
          department: "Delhi Pollution Control Committee",
        }
        setUser(mockUser)
        setIsAuthenticated(true)
        localStorage.setItem("policyUser", JSON.stringify(mockUser))
        loadPolicyData()
      } else {
        alert("Invalid credentials. Use admin@delhi.gov.in / admin123")
      }
      setLoading(false)
    }, 1000)
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("policyUser")
  }

  const loadPolicyData = () => {
    // Mock interventions data
    const mockInterventions: Intervention[] = [
      {
        id: "1",
        name: "Odd-Even Vehicle Scheme",
        type: "traffic",
        status: "active",
        effectiveness: 23,
        startDate: "2024-01-15",
        description: "Alternate day vehicle restrictions based on license plate numbers",
      },
      {
        id: "2",
        name: "Industrial Emission Controls",
        type: "industrial",
        status: "active",
        effectiveness: 31,
        startDate: "2024-01-01",
        description: "Stricter emission norms for industrial units in NCR",
      },
      {
        id: "3",
        name: "Construction Dust Management",
        type: "construction",
        status: "planned",
        effectiveness: 0,
        startDate: "2024-02-01",
        description: "Mandatory dust suppression systems at construction sites",
      },
      {
        id: "4",
        name: "Stubble Burning Ban",
        type: "agricultural",
        status: "completed",
        effectiveness: 18,
        startDate: "2023-10-15",
        endDate: "2023-12-15",
        description: "Complete ban on agricultural residue burning with farmer incentives",
      },
    ]
    setInterventions(mockInterventions)
  }

  // Mock data for charts
  const sourceContributionData = [
    { name: "Vehicular", value: 42, color: "#ef4444" },
    { name: "Industrial", value: 31, color: "#f97316" },
    { name: "Stubble Burning", value: 18, color: "#eab308" },
    { name: "Construction", value: 9, color: "#22c55e" },
  ]

  const interventionEffectivenessData = [
    { name: "Odd-Even", before: 180, after: 138, reduction: 23 },
    { name: "Industrial Controls", before: 165, after: 114, reduction: 31 },
    { name: "Firecracker Ban", before: 220, after: 176, reduction: 20 },
    { name: "Construction Dust", before: 145, after: 116, reduction: 20 },
  ]

  const monthlyTrendData = [
    { month: "Oct", aqi: 220, interventions: 2 },
    { month: "Nov", aqi: 195, interventions: 3 },
    { month: "Dec", aqi: 175, interventions: 4 },
    { month: "Jan", aqi: 158, interventions: 5 },
    { month: "Feb", aqi: 142, interventions: 6 },
    { month: "Mar", aqi: 128, interventions: 6 },
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-md mx-auto px-4 py-16">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle>Policy Dashboard Access</CardTitle>
              <CardDescription>Sign in with your government credentials to access policy analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@delhi.gov.in"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  ) : (
                    <LogIn className="h-4 w-4 mr-2" />
                  )}
                  Sign In
                </Button>
              </form>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Demo Credentials:</strong>
                  <br />
                  Email: admin@delhi.gov.in
                  <br />
                  Password: admin123
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Policy Dashboard</h1>
            <p className="text-xl text-muted-foreground">
              Air quality management and intervention effectiveness analysis
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.department}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Interventions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{interventions.filter((i) => i.status === "active").length}</span>
                <Badge className="bg-success text-success-foreground">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Effectiveness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">24%</span>
                <Badge className="bg-primary text-primary-foreground">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  AQI Reduction
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">18%</span>
                <Badge className="bg-success text-success-foreground">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  Better
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Critical Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">7</span>
                <Badge className="bg-destructive text-destructive-foreground">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  High Priority
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="interventions">Interventions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Pollution Source Breakdown
                  </CardTitle>
                  <CardDescription>Current contribution by major pollution sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sourceContributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {sourceContributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {sourceContributionData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm">
                          {item.name}: {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5" />
                    Monthly AQI Trend
                  </CardTitle>
                  <CardDescription>Air quality improvement over time with interventions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Line type="monotone" dataKey="aqi" stroke="hsl(var(--destructive))" strokeWidth={3} />
                        <Line type="monotone" dataKey="interventions" stroke="hsl(var(--primary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="interventions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Intervention Effectiveness
                  </CardTitle>
                  <CardDescription>AQI reduction achieved by different policy measures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={interventionEffectivenessData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="before" fill="hsl(var(--destructive))" name="Before" />
                        <Bar dataKey="after" fill="hsl(var(--success))" name="After" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Active Interventions
                  </CardTitle>
                  <CardDescription>Currently implemented policy measures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {interventions
                      .filter((i) => i.status === "active")
                      .map((intervention) => {
                        const getIcon = (type: string) => {
                          switch (type) {
                            case "traffic":
                              return Car
                            case "industrial":
                              return Factory
                            case "agricultural":
                              return Flame
                            case "construction":
                              return Building
                            default:
                              return Target
                          }
                        }
                        const Icon = getIcon(intervention.type)

                        return (
                          <div key={intervention.id} className="p-4 bg-muted rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <Icon className="h-5 w-5 text-primary" />
                                <h4 className="font-semibold">{intervention.name}</h4>
                              </div>
                              <Badge className="bg-success text-success-foreground">
                                {intervention.effectiveness}% effective
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{intervention.description}</p>
                            <div className="flex items-center justify-between text-sm">
                              <span>Started: {new Date(intervention.startDate).toLocaleDateString()}</span>
                              <Progress value={intervention.effectiveness} className="w-24" />
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Traffic Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Peak Hour Reduction</span>
                      <span className="font-semibold">23%</span>
                    </div>
                    <Progress value={23} />
                    <div className="flex justify-between">
                      <span>Weekend Effect</span>
                      <span className="font-semibold">15%</span>
                    </div>
                    <Progress value={15} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Industrial Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Emission Reduction</span>
                      <span className="font-semibold">31%</span>
                    </div>
                    <Progress value={31} />
                    <div className="flex justify-between">
                      <span>Compliance Rate</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <Progress value={78} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Seasonal Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Winter Impact</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <Progress value={45} />
                    <div className="flex justify-between">
                      <span>Monsoon Relief</span>
                      <span className="font-semibold">35%</span>
                    </div>
                    <Progress value={35} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Urgent Recommendations
                  </CardTitle>
                  <CardDescription>AI-generated policy suggestions based on current data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Car className="h-4 w-4 text-destructive" />
                        <span className="font-semibold text-destructive">High Priority</span>
                      </div>
                      <p className="text-sm mb-2">
                        <strong>Implement Emergency Vehicle Restrictions</strong>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Current AQI levels (180+) suggest immediate traffic curbs. Recommend extending odd-even scheme
                        to weekends.
                      </p>
                    </div>

                    <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Factory className="h-4 w-4 text-warning" />
                        <span className="font-semibold text-warning">Medium Priority</span>
                      </div>
                      <p className="text-sm mb-2">
                        <strong>Enhance Industrial Monitoring</strong>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Industrial contribution increased by 8%. Deploy additional monitoring stations in Mayapuri and
                        Okhla areas.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    Optimization Opportunities
                  </CardTitle>
                  <CardDescription>Data-driven suggestions for policy improvements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-success" />
                        <span className="font-semibold text-success">Optimization</span>
                      </div>
                      <p className="text-sm mb-2">
                        <strong>Expand Green Corridor Network</strong>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Routes with tree cover show 15% lower AQI. Prioritize plantation along Ring Road and major
                        arterials.
                      </p>
                    </div>

                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-primary">Public Engagement</span>
                      </div>
                      <p className="text-sm mb-2">
                        <strong>Citizen Awareness Campaign</strong>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Areas with higher app usage show better compliance. Launch targeted campaigns in low-engagement
                        zones.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
