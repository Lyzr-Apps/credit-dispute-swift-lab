'use client'

import { useState } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, ArrowLeft, Send, CheckCircle, XCircle, AlertCircle, User, Building, Headphones } from 'lucide-react'
import { DocumentUpload } from '@/components/DocumentUpload'

// Agent IDs
const AGENT_IDS = {
  DISPUTE_CONVERSATION: '6984954ad957d325f54b4ded',
  KNOWLEDGE_RETRIEVAL: '698491e74b4f342743a1793f',
  CASE_ANALYSIS: '69849207257a39e26c94e7be',
  DISPUTE_ANALYSIS_MANAGER: '69849222323dfe72e4c8cd61',
  TRANSACTION_VALIDATION: '698492412a28e3ee67ced147'
}

// TypeScript Interfaces based on actual test responses
interface DisputeConversationResult {
  transaction_id: string | null
  amount: number
  merchant_name: string
  transaction_date: string
  dispute_type: string
  customer_narrative: string
  timeline: string
  previous_contact_attempts: string | null
  information_complete: boolean
  next_steps: string
}

interface KnowledgeRetrievalResult {
  retrieved_policies: Array<{
    policy_id: string
    policy_name: string
    policy_content: string
    relevance_score: string
    applicable_conditions: string[]
  }>
  relevant_faqs: Array<{
    faq_id: string
    question: string
    answer: string
    category: string
  }>
  historical_cases: Array<{
    case_id: string
    similarity_score: string
    outcome: string
    resolution_time: string
    key_factors: string[]
  }>
  knowledge_summary: string
  retrieval_confidence: string
}

interface CaseAnalysisResult {
  case_analysis_id: string
  resolution_confidence: string
  policy_compliance: {
    compliant: boolean
    matched_policies: string[]
    compliance_score: string
  }
  evidence_assessment: {
    strength: string
    completeness: string
    gaps: string[]
  }
  risk_factors: {
    financial_risk: string
    fraud_indicators: string[]
    complexity_level: string
  }
  recommended_action: string
  escalation_required: boolean
  escalation_reasons: string[]
  estimated_resolution_time: string
  analysis_reasoning: string
}

interface DisputeAnalysisManagerResult {
  dispute_resolution_id: string
  final_decision: string
  confidence_score: string
  knowledge_summary: {
    applicable_policies: string[]
    historical_precedents: string
    policy_alignment: string
  }
  case_evaluation: {
    compliance_status: string
    evidence_quality: string
    risk_level: string
  }
  resolution_details: {
    recommended_action: string
    approval_amount: number
    resolution_timeline: string
    next_steps: string[]
  }
  escalation_info: {
    requires_escalation: boolean
    escalation_priority: string
    escalation_reasons: string[]
    assigned_department: string | null
  }
  manager_notes: string
}

interface TransactionValidationResult {
  validation_id: string
  transaction_id: string
  validation_status: string
  merchant_data: {
    transaction_found: boolean
    recorded_amount: number | null
    recorded_date: string | null
    customer_id: string | null
    authorization_code: string | null
  }
  discrepancy_analysis: {
    amount_match: boolean
    date_match: boolean
    customer_match: boolean
    discrepancies_found: string[]
  }
  supporting_evidence: {
    delivery_confirmation: boolean
    service_completion: boolean
    refund_processed: boolean
    communication_logs: string[]
  }
  fraud_indicators: {
    suspicious_activity: boolean
    risk_flags: string[]
    fraud_score: number
  }
  validation_recommendation: {
    recommended_action: string
    confidence: number
    reasoning: string
  }
  merchant_notes: string
}

interface ChatMessage {
  role: 'user' | 'agent'
  content: string
  timestamp: Date
}

type PortalView = 'landing' | 'customer' | 'support' | 'merchant'

export default function Home() {
  const [currentView, setCurrentView] = useState<PortalView>('landing')

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'landing' && <LandingPage onSelectPortal={setCurrentView} />}
      {currentView === 'customer' && <CustomerPortal onBack={() => setCurrentView('landing')} />}
      {currentView === 'support' && <SupportDashboard onBack={() => setCurrentView('landing')} />}
      {currentView === 'merchant' && <MerchantDashboard onBack={() => setCurrentView('landing')} />}
    </div>
  )
}

// Landing Page Component
function LandingPage({ onSelectPortal }: { onSelectPortal: (view: PortalView) => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1E3A5F' }}>
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Credit Dispute Management System
          </h1>
          <p className="text-xl text-gray-300">
            AI-powered dispute resolution with human oversight
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Customer Portal */}
          <Card className="hover:shadow-2xl transition-shadow cursor-pointer" onClick={() => onSelectPortal('customer')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1E3A5F' }}>
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Customer Portal</CardTitle>
              <CardDescription className="text-base">
                File and track your credit disputes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Submit new disputes via chat</li>
                <li>• Real-time AI assistance</li>
                <li>• Instant case analysis</li>
                <li>• Track dispute status</li>
              </ul>
              <Button className="w-full mt-6" style={{ backgroundColor: '#1E3A5F' }}>
                Access Portal
              </Button>
            </CardContent>
          </Card>

          {/* Support Dashboard */}
          <Card className="hover:shadow-2xl transition-shadow cursor-pointer" onClick={() => onSelectPortal('support')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1E3A5F' }}>
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Support Dashboard</CardTitle>
              <CardDescription className="text-base">
                Review and resolve escalated cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Review escalated disputes</li>
                <li>• Access AI analysis insights</li>
                <li>• Make final decisions</li>
                <li>• Human-in-the-loop controls</li>
              </ul>
              <Button className="w-full mt-6" style={{ backgroundColor: '#1E3A5F' }}>
                Access Dashboard
              </Button>
            </CardContent>
          </Card>

          {/* Merchant Dashboard */}
          <Card className="hover:shadow-2xl transition-shadow cursor-pointer" onClick={() => onSelectPortal('merchant')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1E3A5F' }}>
                <Building className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Merchant Dashboard</CardTitle>
              <CardDescription className="text-base">
                Validate disputed transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• View disputed transactions</li>
                <li>• AI-assisted validation</li>
                <li>• Upload supporting evidence</li>
                <li>• Submit transaction proofs</li>
              </ul>
              <Button className="w-full mt-6" style={{ backgroundColor: '#1E3A5F' }}>
                Access Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Customer Portal Component
function CustomerPortal({ onBack }: { onBack: () => void }) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [disputeStarted, setDisputeStarted] = useState(false)
  const [disputeData, setDisputeData] = useState<DisputeConversationResult | null>(null)
  const [analysisResult, setAnalysisResult] = useState<DisputeAnalysisManagerResult | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  const [uploadedDocumentIds, setUploadedDocumentIds] = useState<string[]>([])

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const startDispute = async () => {
    setDisputeStarted(true)
    const welcomeMessage: ChatMessage = {
      role: 'agent',
      content: 'Hello! I\'m here to help you with your credit dispute. Can you tell me about the transaction you\'d like to dispute?',
      timestamp: new Date()
    }
    setChatMessages([welcomeMessage])
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }
    setChatMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    try {
      const result = await callAIAgent(inputMessage, AGENT_IDS.DISPUTE_CONVERSATION)

      if (result.success && result.response.status === 'success') {
        const data = result.response.result as DisputeConversationResult
        setDisputeData(data)

        const agentMessage: ChatMessage = {
          role: 'agent',
          content: data.next_steps || 'Thank you for providing that information.',
          timestamp: new Date()
        }
        setChatMessages(prev => [...prev, agentMessage])
      } else {
        showNotification('error', 'Failed to process your message. Please try again.')
      }
    } catch (error) {
      showNotification('error', 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const submitForAnalysis = async () => {
    if (!disputeData) return

    setLoading(true)
    try {
      const analysisMessage = `Process dispute for transaction: Customer disputes ${disputeData.dispute_type} charge of $${disputeData.amount} from ${disputeData.merchant_name} on ${disputeData.transaction_date}. ${disputeData.customer_narrative}`

      const result = await callAIAgent(analysisMessage, AGENT_IDS.DISPUTE_ANALYSIS_MANAGER)

      if (result.success && result.response.status === 'success') {
        const data = result.response.result as DisputeAnalysisManagerResult
        setAnalysisResult(data)
        setShowAnalysis(true)
        showNotification('success', 'Dispute analysis completed successfully!')
      } else {
        showNotification('error', 'Failed to analyze dispute. Please try again.')
      }
    } catch (error) {
      showNotification('error', 'An error occurred during analysis.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold" style={{ color: '#1E3A5F' }}>Customer Portal</h1>
          </div>
        </div>

        {notification && (
          <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
            notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {notification.type === 'error' && <XCircle className="w-5 h-5" />}
            {notification.type === 'info' && <AlertCircle className="w-5 h-5" />}
            <span>{notification.message}</span>
          </div>
        )}

        {!disputeStarted ? (
          <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
            <Card className="max-w-md w-full">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">File a Credit Dispute</CardTitle>
                <CardDescription>
                  Our AI assistant will guide you through the dispute process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  style={{ backgroundColor: '#1E3A5F' }}
                  onClick={startDispute}
                >
                  Start Dispute
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : showAnalysis ? (
          <DisputeAnalysisView result={analysisResult!} onClose={() => setShowAnalysis(false)} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface - 70% */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle>Dispute Chat</CardTitle>
                  <CardDescription>Provide details about your disputed transaction</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {msg.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg px-4 py-2">
                          <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      disabled={loading}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={loading || !inputMessage.trim()}
                      style={{ backgroundColor: '#1E3A5F' }}
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dispute Summary Sidebar - 30% */}
            <div className="lg:col-span-1">
              <Card className="h-[600px] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Dispute Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {disputeData ? (
                    <>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Amount</label>
                        <p className="text-2xl font-bold text-red-600">
                          ${disputeData.amount.toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-600">Merchant</label>
                        <p className="text-lg">{disputeData.merchant_name}</p>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-600">Transaction Date</label>
                        <p>{disputeData.transaction_date}</p>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-600">Dispute Type</label>
                        <p className="capitalize">{disputeData.dispute_type}</p>
                      </div>

                      {disputeData.transaction_id && (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Transaction ID</label>
                          <p className="text-sm font-mono">{disputeData.transaction_id}</p>
                        </div>
                      )}

                      <div>
                        <label className="text-sm font-semibold text-gray-600">Status</label>
                        <div className="flex items-center gap-2 mt-1">
                          {disputeData.information_complete ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span className="text-green-600 font-semibold">Complete</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-5 h-5 text-yellow-600" />
                              <span className="text-yellow-600 font-semibold">In Progress</span>
                            </>
                          )}
                        </div>
                      </div>

                      {disputeData.customer_narrative && (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Your Statement</label>
                          <p className="text-sm text-gray-700 mt-1">{disputeData.customer_narrative}</p>
                        </div>
                      )}

                      <div className="border-t pt-4">
                        <DocumentUpload
                          onUploadComplete={(assetIds) => {
                            setUploadedDocumentIds(assetIds)
                            showNotification('success', `Uploaded ${assetIds.length} document(s)`)
                          }}
                          maxFiles={5}
                          label="Supporting Documents"
                        />
                        {uploadedDocumentIds.length > 0 && (
                          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                            {uploadedDocumentIds.length} document(s) attached to this dispute
                          </div>
                        )}
                      </div>

                      {disputeData.information_complete && (
                        <Button
                          className="w-full mt-4"
                          style={{ backgroundColor: '#22c55e' }}
                          onClick={submitForAnalysis}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            'Submit for Analysis'
                          )}
                        </Button>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Start chatting to populate dispute details...
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Dispute Analysis View Component
function DisputeAnalysisView({ result, onClose }: { result: DisputeAnalysisManagerResult; onClose: () => void }) {
  const isApproved = result.final_decision === 'auto_approve'
  const isEscalated = result.escalation_info.requires_escalation

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {isApproved ? (
              <CheckCircle className="w-16 h-16 text-green-600" />
            ) : isEscalated ? (
              <AlertCircle className="w-16 h-16 text-yellow-600" />
            ) : (
              <XCircle className="w-16 h-16 text-red-600" />
            )}
          </div>
          <CardTitle className="text-3xl">
            {isApproved ? 'Dispute Approved' : isEscalated ? 'Under Review' : 'Decision Pending'}
          </CardTitle>
          <CardDescription className="text-lg">
            Resolution ID: {result.dispute_resolution_id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Resolution Details</h3>
            <p className="text-sm text-gray-700 mb-4">{result.resolution_details.recommended_action}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-semibold text-gray-600">Amount:</label>
                <p className="text-lg font-bold text-green-600">
                  ${result.resolution_details.approval_amount.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="font-semibold text-gray-600">Timeline:</label>
                <p>{result.resolution_details.resolution_timeline}</p>
              </div>
              <div>
                <label className="font-semibold text-gray-600">Confidence:</label>
                <p>{result.confidence_score}%</p>
              </div>
              <div>
                <label className="font-semibold text-gray-600">Risk Level:</label>
                <p className="capitalize">{result.case_evaluation.risk_level}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Next Steps</h3>
            <ul className="space-y-2">
              {result.resolution_details.next_steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-2 text-blue-900">Analysis Notes</h3>
            <p className="text-sm text-blue-800">{result.manager_notes}</p>
          </div>

          <Button onClick={onClose} className="w-full" style={{ backgroundColor: '#1E3A5F' }}>
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Support Dashboard Component
function SupportDashboard({ onBack }: { onBack: () => void }) {
  const [selectedCase, setSelectedCase] = useState<DisputeAnalysisManagerResult | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  // Sample escalated cases (in real app, fetch from API)
  const escalatedCases: DisputeAnalysisManagerResult[] = [
    {
      dispute_resolution_id: 'ESC-2026-001',
      final_decision: 'pending_review',
      confidence_score: '67',
      knowledge_summary: {
        applicable_policies: ['Complex Fraud Policy', 'High-Value Transaction Review'],
        historical_precedents: 'Mixed outcomes in similar cases requiring additional documentation',
        policy_alignment: 'partial'
      },
      case_evaluation: {
        compliance_status: 'requires_review',
        evidence_quality: 'moderate',
        risk_level: 'high'
      },
      resolution_details: {
        recommended_action: 'Request additional documentation from customer',
        approval_amount: 1250,
        resolution_timeline: '5-7 business days',
        next_steps: [
          'Request proof of non-receipt',
          'Verify merchant response',
          'Conduct fraud assessment'
        ]
      },
      escalation_info: {
        requires_escalation: true,
        escalation_priority: 'high',
        escalation_reasons: ['High transaction value', 'Inconsistent documentation'],
        assigned_department: 'Fraud Review Team'
      },
      manager_notes: 'Case escalated due to transaction amount exceeding auto-approval threshold and conflicting merchant response.'
    }
  ]

  const handleDecision = (caseId: string, decision: 'approve' | 'deny' | 'request_info') => {
    const actions = {
      approve: 'Dispute approved successfully',
      deny: 'Dispute denied and customer notified',
      request_info: 'Additional information requested from customer'
    }
    showNotification('success', actions[decision])
    setSelectedCase(null)
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold" style={{ color: '#1E3A5F' }}>Support Dashboard</h1>
          </div>
        </div>

        {notification && (
          <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
            notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {notification.type === 'error' && <XCircle className="w-5 h-5" />}
            {notification.type === 'info' && <AlertCircle className="w-5 h-5" />}
            <span>{notification.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Case List - Left */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Escalated Cases</CardTitle>
                <CardDescription>{escalatedCases.length} cases require review</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {escalatedCases.map((caseItem) => (
                  <div
                    key={caseItem.dispute_resolution_id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedCase?.dispute_resolution_id === caseItem.dispute_resolution_id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedCase(caseItem)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">{caseItem.dispute_resolution_id}</p>
                        <p className="text-xs text-gray-600">Priority: {caseItem.escalation_info.escalation_priority}</p>
                      </div>
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    </div>
                    <p className="text-lg font-bold text-red-600">
                      ${caseItem.resolution_details.approval_amount.toFixed(2)}
                    </p>
                    <div className="mt-2 text-xs">
                      {caseItem.escalation_info.escalation_reasons.map((reason, idx) => (
                        <span key={idx} className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-1 mb-1">
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {escalatedCases.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No escalated cases</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Case Details - Right */}
          <div className="lg:col-span-2">
            {selectedCase ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Case Details: {selectedCase.dispute_resolution_id}</CardTitle>
                      <CardDescription>Escalated for human review</CardDescription>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedCase.escalation_info.escalation_priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedCase.escalation_info.escalation_priority.toUpperCase()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Case Overview */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="text-sm font-semibold text-gray-600">Dispute Amount</label>
                      <p className="text-2xl font-bold text-red-600">
                        ${selectedCase.resolution_details.approval_amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="text-sm font-semibold text-gray-600">AI Confidence</label>
                      <p className="text-2xl font-bold">{selectedCase.confidence_score}%</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="text-sm font-semibold text-gray-600">Risk Level</label>
                      <p className="text-lg capitalize">{selectedCase.case_evaluation.risk_level}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="text-sm font-semibold text-gray-600">Evidence Quality</label>
                      <p className="text-lg capitalize">{selectedCase.case_evaluation.evidence_quality}</p>
                    </div>
                  </div>

                  {/* Escalation Reasons */}
                  <div>
                    <h3 className="font-semibold mb-2">Escalation Reasons</h3>
                    <ul className="space-y-2">
                      {selectedCase.escalation_info.escalation_reasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Policy References */}
                  <div>
                    <h3 className="font-semibold mb-2">Applicable Policies</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCase.knowledge_summary.applicable_policies.map((policy, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {policy}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* AI Analysis */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold mb-2 text-blue-900">AI Analysis</h3>
                    <p className="text-sm text-blue-800 mb-3">{selectedCase.manager_notes}</p>
                    <p className="text-xs text-blue-700">
                      <strong>Recommended Action:</strong> {selectedCase.resolution_details.recommended_action}
                    </p>
                  </div>

                  {/* Decision Buttons */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleDecision(selectedCase.dispute_resolution_id, 'approve')}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Dispute
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => handleDecision(selectedCase.dispute_resolution_id, 'deny')}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Deny Dispute
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDecision(selectedCase.dispute_resolution_id, 'request_info')}
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Request More Info
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center text-gray-500">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">Select a case to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Merchant Dashboard Component
function MerchantDashboard({ onBack }: { onBack: () => void }) {
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [validationResult, setValidationResult] = useState<TransactionValidationResult | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  const [uploadedEvidenceIds, setUploadedEvidenceIds] = useState<string[]>([])

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  // Sample disputed transactions
  const disputedTransactions = [
    {
      id: 'TXN-2024-98765',
      amount: 250,
      date: '2024-02-03',
      customer: 'Jane Doe',
      status: 'disputed',
      type: 'unauthorized'
    },
    {
      id: 'TXN-2024-98766',
      amount: 89.99,
      date: '2024-02-01',
      customer: 'John Smith',
      status: 'disputed',
      type: 'product_not_received'
    }
  ]

  const startValidation = async (transactionId: string) => {
    setSelectedTransaction(transactionId)
    const welcomeMessage: ChatMessage = {
      role: 'agent',
      content: `I'm here to help you validate transaction ${transactionId}. Please provide any evidence you have such as delivery confirmation, customer signatures, or authorization records.`,
      timestamp: new Date()
    }
    setChatMessages([welcomeMessage])
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading || !selectedTransaction) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }
    setChatMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    try {
      const result = await callAIAgent(
        `Validate transaction ${selectedTransaction}: ${inputMessage}`,
        AGENT_IDS.TRANSACTION_VALIDATION
      )

      if (result.success) {
        const data = result.response.result as TransactionValidationResult
        setValidationResult(data)

        const agentMessage: ChatMessage = {
          role: 'agent',
          content: data.validation_recommendation.reasoning,
          timestamp: new Date()
        }
        setChatMessages(prev => [...prev, agentMessage])
      } else {
        showNotification('error', 'Failed to process validation. Please try again.')
      }
    } catch (error) {
      showNotification('error', 'An error occurred during validation.')
    } finally {
      setLoading(false)
    }
  }

  const submitValidation = () => {
    showNotification('success', 'Validation submitted successfully!')
    setSelectedTransaction(null)
    setChatMessages([])
    setValidationResult(null)
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold" style={{ color: '#1E3A5F' }}>Merchant Dashboard</h1>
          </div>
        </div>

        {notification && (
          <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
            notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {notification.type === 'error' && <XCircle className="w-5 h-5" />}
            {notification.type === 'info' && <AlertCircle className="w-5 h-5" />}
            <span>{notification.message}</span>
          </div>
        )}

        {!selectedTransaction ? (
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Disputed Transactions</CardTitle>
                <CardDescription>Transactions requiring merchant validation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {disputedTransactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="p-4 border rounded-lg hover:border-blue-500 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">{txn.id}</p>
                          <p className="text-sm text-gray-600">Customer: {txn.customer}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-red-600">${txn.amount.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">{txn.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          {txn.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <Button
                          size="sm"
                          style={{ backgroundColor: '#1E3A5F' }}
                          onClick={() => startValidation(txn.id)}
                        >
                          Validate Transaction
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Validation Chat */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle>Validation Assistant</CardTitle>
                  <CardDescription>Transaction: {selectedTransaction}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {msg.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg px-4 py-2">
                          <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Describe your evidence..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      disabled={loading}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={loading || !inputMessage.trim()}
                      style={{ backgroundColor: '#1E3A5F' }}
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Validation Summary */}
            <div className="lg:col-span-1">
              <Card className="h-[600px] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Validation Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {validationResult ? (
                    <>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Status</label>
                        <p className="text-lg capitalize font-semibold">{validationResult.validation_status.replace('_', ' ')}</p>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-600">Recommendation</label>
                        <p className="capitalize">{validationResult.validation_recommendation.recommended_action.replace('_', ' ')}</p>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-600">Confidence</label>
                        <p>{validationResult.validation_recommendation.confidence}%</p>
                      </div>

                      {validationResult.discrepancy_analysis.discrepancies_found.length > 0 && (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Discrepancies</label>
                          <ul className="mt-2 space-y-1">
                            {validationResult.discrepancy_analysis.discrepancies_found.map((disc, idx) => (
                              <li key={idx} className="text-sm text-red-600">• {disc}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-800">{validationResult.merchant_notes}</p>
                      </div>

                      <div className="border-t pt-4">
                        <DocumentUpload
                          onUploadComplete={(assetIds) => {
                            setUploadedEvidenceIds(assetIds)
                            showNotification('success', `Uploaded ${assetIds.length} evidence file(s)`)
                          }}
                          maxFiles={10}
                          label="Upload Evidence"
                        />
                        {uploadedEvidenceIds.length > 0 && (
                          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                            {uploadedEvidenceIds.length} evidence file(s) attached
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 pt-4 border-t">
                        <Button
                          className="w-full"
                          style={{ backgroundColor: '#22c55e' }}
                          onClick={submitValidation}
                        >
                          Submit Validation
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setSelectedTransaction(null)
                            setChatMessages([])
                            setValidationResult(null)
                            setUploadedEvidenceIds([])
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">
                        Provide validation evidence to see summary...
                      </p>
                      <div className="border-t pt-4">
                        <DocumentUpload
                          onUploadComplete={(assetIds) => {
                            setUploadedEvidenceIds(assetIds)
                            showNotification('success', `Uploaded ${assetIds.length} evidence file(s)`)
                          }}
                          maxFiles={10}
                          label="Upload Evidence"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
