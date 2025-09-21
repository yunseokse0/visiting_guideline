'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { 
  Calculator, 
  Plus, 
  Minus, 
  Trash2, 
  TrendingUp, 
  Wallet, 
  Shield,
  Info,
  AlertCircle,
  CheckCircle,
  PieChart,
  Save,
  Download,
  FileText
} from 'lucide-react'
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Pie } from 'recharts'
import jsPDF from 'jspdf'
import { 
  serviceItems, 
  userBurdenTypes, 
  categoryColors, 
  categoryNames,
  longTermCareGrades,
  dayOfWeekPricing,
  timeSlotPricing,
  legalReferences,
  monthlyLimitsByGrade
} from '@/data/simulation-data'
import { 
  ServiceItem, 
  UserBurdenType, 
  SimulationInput, 
  SimulationResult 
} from '@/types'

export default function SimulationPage() {
  const [customerName, setCustomerName] = useState<string>('')
  const [selectedService, setSelectedService] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [burdenType, setBurdenType] = useState<string>('normal')
  const [dayOfWeek, setDayOfWeek] = useState<string>('weekday')
  const [grade, setGrade] = useState<string>('grade3')
  const [simulationItems, setSimulationItems] = useState<SimulationInput[]>([])
  const [results, setResults] = useState<SimulationResult[]>([])
  const [showOptimization, setShowOptimization] = useState<boolean>(false)

  // 서비스 추가
  const handleAddService = () => {
    if (!selectedService) {
      alert('서비스를 선택해주세요.')
      return
    }

    const newItem: SimulationInput = {
      serviceId: selectedService,
      quantity: quantity,
      burdenTypeId: burdenType,
      dayOfWeek: dayOfWeek as 'weekday' | 'weekend' | 'holiday' | 'weekend-holiday' | 'extended-weekend',
      grade: grade as 'grade1' | 'grade2' | 'grade3' | 'grade4' | 'grade5'
    }

    setSimulationItems([...simulationItems, newItem])
    setSelectedService('')
    setQuantity(1)
  }

  // 서비스 제거
  const handleRemoveService = (index: number) => {
    const newItems = simulationItems.filter((_, i) => i !== index)
    setSimulationItems(newItems)
  }

  // 수량 변경
  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return
    
    const newItems = simulationItems.map((item, i) => 
      i === index ? { ...item, quantity: newQuantity } : item
    )
    setSimulationItems(newItems)
  }

  // 부담 유형 변경
  const handleBurdenTypeChange = (index: number, newBurdenType: string) => {
    const newItems = simulationItems.map((item, i) => 
      i === index ? { ...item, burdenTypeId: newBurdenType } : item
    )
    setSimulationItems(newItems)
  }

  // 서비스별 제한사항 및 가산 요금 계산
  const calculateServiceCost = (serviceId: string, quantity: number, dayOfWeek: string = 'weekday') => {
    const service = serviceItems.find(s => s.id === serviceId)
    if (!service) return { totalCost: 0, baseCost: 0, additionalCost: 0, isOverLimit: false, dayMultiplier: 1.0 }

    let baseCost = 0
    let additionalCost = 0
    let isOverLimit = false

    // 요일별 가산 요금 적용
    const dayPricing = dayOfWeekPricing.find(d => d.dayType === dayOfWeek)
    const dayMultiplier = dayPricing ? dayPricing.multiplier : 1.0

    // 방문요양 제한사항 적용
    if (serviceId === 'visit-1') {
      // 기본급여: 주 3회 제한
      if (quantity <= 3) {
        baseCost = service.price * quantity * dayMultiplier
      } else {
        baseCost = service.price * 3 * dayMultiplier
        // 4회 이상은 가산급여 적용
        const additionalQuantity = quantity - 3
        const additionalService = serviceItems.find(s => s.id === 'visit-5')
        if (additionalService) {
          additionalCost = additionalService.price * additionalQuantity * dayMultiplier
        }
        isOverLimit = true
      }
    }
    // 주야간보호 제한사항 적용
    else if (serviceId === 'daycare-1') {
      // 기본급여: 월 20일 제한
      if (quantity <= 20) {
        baseCost = service.price * quantity * dayMultiplier
      } else {
        baseCost = service.price * 20 * dayMultiplier
        // 21일 이상은 가산급여 적용
        const additionalQuantity = quantity - 20
        const additionalService = serviceItems.find(s => s.id === 'daycare-3')
        if (additionalService) {
          additionalCost = additionalService.price * additionalQuantity * dayMultiplier
        }
        isOverLimit = true
      }
    }
    // 단기보호 제한사항 적용
    else if (serviceId === 'shortstay-1') {
      // 기본급여: 월 15일 제한
      if (quantity <= 15) {
        baseCost = service.price * quantity * dayMultiplier
      } else {
        baseCost = service.price * 15 * dayMultiplier
        // 16일 이상은 가산급여 적용
        const additionalQuantity = quantity - 15
        const additionalService = serviceItems.find(s => s.id === 'shortstay-2')
        if (additionalService) {
          additionalCost = additionalService.price * additionalQuantity * dayMultiplier
        }
        isOverLimit = true
      }
    }
    // 특수장비 제한사항 적용 (월 1개 제한)
    else if (service.category === 'equipment') {
      if (quantity <= 1) {
        baseCost = service.price * quantity * dayMultiplier
      } else {
        baseCost = service.price * 1 * dayMultiplier
        // 2개 이상은 추가 요금 없음 (제한 초과)
        isOverLimit = true
      }
    }
    // 기타 서비스 (연장급여 등)
    else {
      baseCost = service.price * quantity * dayMultiplier
    }

    return {
      totalCost: baseCost + additionalCost,
      baseCost,
      additionalCost,
      isOverLimit,
      dayMultiplier
    }
  }

  // 계산 실행
  const calculateResults = () => {
    const newResults: SimulationResult[] = simulationItems.map(item => {
      const service = serviceItems.find(s => s.id === item.serviceId)
      const burden = userBurdenTypes.find(b => b.id === item.burdenTypeId)
      const grade = longTermCareGrades.find(g => g.id === item.grade)
      
      if (!service || !burden) return null

      const costInfo = calculateServiceCost(item.serviceId, item.quantity, item.dayOfWeek)
      
        // 소득 기준에 따른 본인 부담률 적용 (등급과 무관)
        const finalBurdenRate = burden.rate
      
      const userBurden = costInfo.totalCost * finalBurdenRate
      const insuranceCoverage = costInfo.totalCost - userBurden

      return {
        serviceId: item.serviceId,
        serviceName: service.name,
        quantity: item.quantity,
        unitPrice: service.price,
        totalCost: costInfo.totalCost,
        burdenRate: finalBurdenRate,
        userBurden,
        insuranceCoverage,
        // 추가 정보
        baseCost: costInfo.baseCost,
        additionalCost: costInfo.additionalCost,
        isOverLimit: costInfo.isOverLimit,
        dayMultiplier: costInfo.dayMultiplier,
          grade: grade?.name || '미선택' // 등급은 서비스 제공 범위만 결정
      }
    }).filter(Boolean) as SimulationResult[]

    setResults(newResults)
  }

  // 결과가 변경될 때마다 자동 계산
  useEffect(() => {
    if (simulationItems.length > 0) {
      calculateResults()
    } else {
      setResults([])
    }
  }, [simulationItems])

  // 총계 계산
  const totalUserBurden = results.reduce((sum, result) => sum + result.userBurden, 0)
  const totalInsuranceCoverage = results.reduce((sum, result) => sum + result.insuranceCoverage, 0)
  const totalCost = totalUserBurden + totalInsuranceCoverage
  
  // 월별 한도액 체크
  const currentGrade = longTermCareGrades.find(g => g.id === grade)
  const monthlyLimit = currentGrade ? monthlyLimitsByGrade[currentGrade.id as keyof typeof monthlyLimitsByGrade] : null
  const isOverMonthlyLimit = monthlyLimit && totalCost > monthlyLimit.limit
  const remainingLimit = monthlyLimit ? Math.max(0, monthlyLimit.limit - totalCost) : 0

  // 차트 데이터 생성
  const pieChartData = [
    { name: '본인 부담금', value: totalUserBurden, color: '#ef4444' },
    { name: '보험 적용', value: totalInsuranceCoverage, color: '#22c55e' }
  ]

  const barChartData = results.map(result => ({
    name: result.serviceName.length > 15 ? result.serviceName.substring(0, 15) + '...' : result.serviceName,
    '본인 부담금': result.userBurden,
    '보험 적용': result.insuranceCoverage,
    '총 비용': result.totalCost
  }))

  const COLORS = ['#ef4444', '#22c55e']

  // 선택된 서비스 정보
  const selectedServiceInfo = serviceItems.find(s => s.id === selectedService)
  const selectedBurdenInfo = userBurdenTypes.find(b => b.id === burdenType)

  // 시뮬레이션 결과 저장
  const handleSaveSimulation = () => {
    if (!customerName || results.length === 0) {
      alert('고객 이름을 입력하고 시뮬레이션을 완료해주세요.')
      return
    }

    const simulationData = {
      customerName,
      date: new Date().toISOString(),
      results,
      totalUserBurden,
      totalInsuranceCoverage,
      totalCost
    }

    // localStorage에 저장
    const savedSimulations = JSON.parse(localStorage.getItem('simulations') || '[]')
    savedSimulations.push(simulationData)
    localStorage.setItem('simulations', JSON.stringify(savedSimulations))
    
    alert(`${customerName}님의 시뮬레이션 결과가 저장되었습니다.`)
  }

  // 서비스 조합 최적화 추천
  const getOptimizationRecommendations = () => {
    if (!monthlyLimit || results.length === 0) return []

    const recommendations = []
    const currentCost = totalCost
    const limit = monthlyLimit.limit
    const remainingBudget = limit - currentCost

    // 1. 한도액 내 최적화
    if (remainingBudget > 0) {
      const recommendedServices = serviceItems.filter(service => {
        const serviceCost = service.price * (dayOfWeekPricing.find(d => d.dayType === dayOfWeek)?.multiplier || 1)
        return serviceCost <= remainingBudget && !simulationItems.some(item => item.serviceId === service.id)
      }).slice(0, 3)

      if (recommendedServices.length > 0) {
        recommendations.push({
          type: 'budget_optimization',
          title: '예산 내 추가 서비스 추천',
          description: `월 한도액 내에서 추가로 이용 가능한 서비스입니다. (잔여 예산: ${remainingBudget.toLocaleString()}원)`,
          services: recommendedServices.map(service => ({ ...service, type: 'ServiceItem' as const })),
          icon: '💰',
          color: 'green'
        })
      }
    }

    // 2. 비용 절약 추천
    const expensiveServices = results.filter(result => result.userBurden > 50000)
    if (expensiveServices.length > 0) {
        recommendations.push({
          type: 'cost_saving',
          title: '비용 절약 추천',
          description: '본인 부담금이 높은 서비스에 대한 대안을 제안합니다.',
          services: expensiveServices.map(service => ({ ...service, type: 'SimulationResult' as const })),
          icon: '💡',
          color: 'yellow'
        })
    }

    // 3. 한도 초과 경고
    if (isOverMonthlyLimit) {
      recommendations.push({
        type: 'limit_warning',
        title: '월 한도액 초과 경고',
        description: `월 한도액을 ${((currentCost - limit) / limit * 100).toFixed(1)}% 초과했습니다. 서비스 조합을 재검토해보세요.`,
        services: [],
        icon: '⚠️',
        color: 'red'
      })
    }

    return recommendations
  }

  // 보호자 설명용 간단한 요약서 생성
  const generateSimpleSummary = () => {
    if (!customerName || results.length === 0) return null

    const summary = {
      customerName,
      date: new Date().toLocaleDateString('ko-KR'),
      totalCost,
      totalUserBurden,
      totalInsuranceCoverage,
      monthlyLimit: monthlyLimit?.limit || 0,
      isOverLimit: isOverMonthlyLimit,
      services: results.map(result => ({
        name: result.serviceName,
        quantity: result.quantity,
        userBurden: result.userBurden,
        insuranceCoverage: result.insuranceCoverage
      }))
    }

    return summary
  }

  // 시뮬레이션 결과 PDF 다운로드
  const handleDownloadPDF = () => {
    if (!customerName || results.length === 0) {
      alert('고객 이름을 입력하고 시뮬레이션을 완료해주세요.')
      return
    }

    try {
      const doc = new jsPDF()
      
      // 현재 날짜/시간 생성
      const now = new Date()
      const dateStr = now.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\./g, '').replace(/\s/g, '')
      const timeStr = now.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/:/g, '').replace(/\s/g, '')
      
      // 파일명 생성: 고객명_날짜_시간
      const fileName = `${customerName}_${dateStr}_${timeStr}.pdf`
      
      // PDF 제목
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('장기요양보험 수가 시뮬레이션 보고서', 105, 20, { align: 'center' })
      
      // 구분선
      doc.setDrawColor(0, 0, 0)
      doc.line(20, 30, 190, 30)
      
      // 고객 정보
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(`고객명: ${customerName}`, 20, 45)
      doc.text(`시뮬레이션 날짜: ${now.toLocaleDateString('ko-KR')} ${now.toLocaleTimeString('ko-KR')}`, 20, 55)
      
      // 서비스별 상세 내역
      doc.setFont('helvetica', 'bold')
      doc.text('서비스별 상세 내역', 20, 75)
      
      let yPosition = 90
      results.forEach((result, index) => {
        // 페이지 넘김 체크
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(`${index + 1}. ${result.serviceName}`, 20, yPosition)
        
        yPosition += 8
        doc.setFont('helvetica', 'normal')
        doc.text(`   수량: ${result.quantity}개`, 25, yPosition)
        yPosition += 6
        doc.text(`   단가: ${result.unitPrice.toLocaleString()}원`, 25, yPosition)
        yPosition += 6
        doc.text(`   총 비용: ${result.totalCost.toLocaleString()}원`, 25, yPosition)
        yPosition += 6
        doc.text(`   본인 부담금: ${result.userBurden.toLocaleString()}원 (${Math.round(result.burdenRate * 100)}%)`, 25, yPosition)
        yPosition += 6
        doc.text(`   보험 적용: ${result.insuranceCoverage.toLocaleString()}원`, 25, yPosition)
        yPosition += 12
      })
      
      // 총계
      if (yPosition > 220) {
        doc.addPage()
        yPosition = 20
      }
      
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('총계', 20, yPosition)
      yPosition += 10
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.text(`총 비용: ${totalCost.toLocaleString()}원`, 20, yPosition)
      yPosition += 8
      doc.text(`본인 부담금: ${totalUserBurden.toLocaleString()}원`, 20, yPosition)
      yPosition += 8
      doc.text(`보험 적용: ${totalInsuranceCoverage.toLocaleString()}원`, 20, yPosition)
      
      // 비율 정보
      const userBurdenRate = ((totalUserBurden / totalCost) * 100).toFixed(1)
      const insuranceRate = ((totalInsuranceCoverage / totalCost) * 100).toFixed(1)
      yPosition += 12
      doc.text(`본인 부담률: ${userBurdenRate}%`, 20, yPosition)
      yPosition += 6
      doc.text(`보험 적용률: ${insuranceRate}%`, 20, yPosition)
      
      // 주의사항
      if (yPosition > 200) {
        doc.addPage()
        yPosition = 20
      }
      
      yPosition += 20
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('주의사항', 20, yPosition)
      yPosition += 8
      
      doc.setFont('helvetica', 'normal')
      const warnings = [
        '• 본 시뮬레이션은 2025년 기준 수가표를 기반으로 한 예상 계산입니다.',
        '• 실제 본인 부담금은 지역, 서비스 제공기관에 따라 차이가 있을 수 있습니다.',
        '• 정확한 비용은 해당 서비스 제공기관에 문의하시기 바랍니다.',
        '• 본인 부담 유형에 따라 실제 부담률이 달라질 수 있습니다.'
      ]
      
      warnings.forEach(warning => {
        doc.text(warning, 20, yPosition)
        yPosition += 6
      })
      
      // PDF 다운로드
      doc.save(fileName)
      
    } catch (error) {
      console.error('PDF 생성 중 오류 발생:', error)
      alert('PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 헤더 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="h-8 w-8 text-primary-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              수가 시뮬레이션
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4">
            2025년 장기요양보험 수가표를 기반으로 본인 부담금을 미리 확인하고 계획을 세워보세요
          </p>
          {customerName && (
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium">
              <span className="mr-2">👤</span>
              {customerName}님의 시뮬레이션
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 서비스 선택 */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                <Plus className="h-5 w-5 mr-2 text-primary-600" />
                서비스 추가
              </h2>

              {/* 고객 이름 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  고객 이름
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="고객 이름을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* 서비스 선택 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  서비스 선택
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">서비스를 선택하세요</option>
                  {Object.entries(categoryNames).map(([category, name]) => (
                    <optgroup key={category} label={name}>
                      {serviceItems
                        .filter(item => item.category === category)
                        .map(item => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                            {item.id.includes('night') && ' (야간)'}
                            {item.id.includes('holiday') && ' (휴일)'}
                            {item.id.includes('extended') && ' (연장)'}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
                
                {/* 빠른 선택 버튼들 */}
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedService('visit-1')}
                    className="text-xs"
                  >
                    방문요양 기본
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedService('visit-2')}
                    className="text-xs"
                  >
                    방문요양 야간
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedService('visit-3')}
                    className="text-xs"
                  >
                    방문요양 휴일
                  </Button>
                </div>
              </div>

              {/* 서비스 정보 */}
              {selectedServiceInfo && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {selectedServiceInfo.name}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[selectedServiceInfo.category]}`}>
                      {categoryNames[selectedServiceInfo.category]}
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                    {selectedServiceInfo.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 dark:text-blue-400">
                      단가: {selectedServiceInfo.price.toLocaleString()}원
                    </span>
                    <span className="text-sm text-blue-600 dark:text-blue-400">
                      단위: {selectedServiceInfo.unit}
                    </span>
                  </div>
                </div>
              )}

              {/* 수량 선택 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  수량
                </label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-center focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

                {/* 요일 선택 - 개선된 UI */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    서비스 요일 선택
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {dayOfWeekPricing.map(day => {
                      const isSelected = dayOfWeek === day.dayType
                      const isSpecial = day.dayType.includes('-') || day.dayType === 'extended-weekend'
                      
                      return (
                        <button
                          key={day.dayType}
                          type="button"
                          onClick={() => setDayOfWeek(day.dayType)}
                          className={`
                            p-3 text-left rounded-lg border-2 transition-all duration-200
                            ${isSelected 
                              ? isSpecial 
                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' 
                                : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                            }
                          `}
                        >
                          <div className="font-medium text-sm">
                            {day.name}
                            {day.multiplier > 1 && (
                              <span className={`ml-1 px-2 py-0.5 rounded text-xs font-bold ${
                                isSpecial ? 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200' : 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                              }`}>
                                +{Math.round((day.multiplier - 1) * 100)}%
                              </span>
                            )}
                          </div>
                          <div className="text-xs mt-1 opacity-75">
                            {day.description}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  
                  {/* 선택된 요일 상세 정보 */}
                  {dayOfWeekPricing.find(d => d.dayType === dayOfWeek) && (
                    <div className={`mt-3 p-3 rounded-lg border ${
                      dayOfWeek.includes('-') || dayOfWeek === 'extended-weekend'
                        ? 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
                        : 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          dayOfWeek.includes('-') || dayOfWeek === 'extended-weekend' ? 'bg-red-500' : 'bg-blue-500'
                        }`}></div>
                        <span className={`text-sm font-medium ${
                          dayOfWeek.includes('-') || dayOfWeek === 'extended-weekend' 
                            ? 'text-red-700 dark:text-red-300' 
                            : 'text-blue-700 dark:text-blue-300'
                        }`}>
                          {dayOfWeekPricing.find(d => d.dayType === dayOfWeek)?.name}
                        </span>
                        <span className={`text-sm ${
                          dayOfWeek.includes('-') || dayOfWeek === 'extended-weekend' 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-blue-600 dark:text-blue-400'
                        }`}>
                          (배수: {dayOfWeekPricing.find(d => d.dayType === dayOfWeek)?.multiplier}x)
                        </span>
                      </div>
                      <p className={`text-xs mt-1 ${
                        dayOfWeek.includes('-') || dayOfWeek === 'extended-weekend' 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-blue-600 dark:text-blue-400'
                      }`}>
                        {dayOfWeekPricing.find(d => d.dayType === dayOfWeek)?.description}
                      </p>
                    </div>
                  )}
                </div>

              {/* 장기요양 등급 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  장기요양 등급 (서비스 제공 범위 결정)
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {longTermCareGrades.map(gradeItem => (
                    <option key={gradeItem.id} value={gradeItem.id}>
                      {gradeItem.name}
                    </option>
                  ))}
                </select>
                {longTermCareGrades.find(g => g.id === grade) && (
                  <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                      <strong>등급 설명:</strong> {longTermCareGrades.find(g => g.id === grade)?.description}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      ⚠️ 등급은 서비스 제공 범위를 결정하며, 본인 부담률은 아래 소득 기준에 따라 결정됩니다.
                    </p>
                  </div>
                )}
              </div>

              {/* 본인 부담 유형 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  본인 부담률 (소득 기준에 따라 결정)
                </label>
                <select
                  value={burdenType}
                  onChange={(e) => setBurdenType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {userBurdenTypes.map(burden => (
                    <option key={burden.id} value={burden.id}>
                      {burden.name}
                    </option>
                  ))}
                </select>
                {selectedBurdenInfo && (
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-xs text-green-700 dark:text-green-300">
                      <strong>본인 부담률:</strong> {Math.round(selectedBurdenInfo.rate * 100)}%
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      {selectedBurdenInfo.description}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      ✅ 2025년 수가표 기준 정확한 본인 부담률이 적용됩니다.
                    </p>
                  </div>
                )}
              </div>

              {/* 추가 버튼 */}
              <Button
                onClick={handleAddService}
                disabled={!selectedService}
                className="w-full flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>서비스 추가</span>
              </Button>
            </div>
          </div>

          {/* 시뮬레이션 목록 및 결과 */}
          <div className="lg:col-span-2">
            {/* 시뮬레이션 목록 */}
            {simulationItems.length > 0 ? (
              <div className="card p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
                    시뮬레이션 목록
                  </h2>
                  {customerName && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      고객: {customerName}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {simulationItems.map((item, index) => {
                    const service = serviceItems.find(s => s.id === item.serviceId)
                    const burden = userBurdenTypes.find(b => b.id === item.burdenTypeId)
                    const day = dayOfWeekPricing.find(d => d.dayType === item.dayOfWeek)
                    const gradeInfo = longTermCareGrades.find(g => g.id === item.grade)
                    
                    if (!service || !burden) return null

                    return (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                {service.name}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[service.category]}`}>
                                {categoryNames[service.category]}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                단가: {service.price.toLocaleString()}원 × {item.quantity}개 = {(service.price * item.quantity).toLocaleString()}원
                              </p>
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                {day && (
                                  <span className={`px-2 py-0.5 rounded font-medium ${
                                    day.multiplier >= 1.8 
                                      ? 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200' 
                                      : day.multiplier > 1
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
                                  }`}>
                                    {day.name} {day.multiplier > 1 && `(+${Math.round((day.multiplier - 1) * 100)}%)`}
                                  </span>
                                )}
                                {gradeInfo && (
                                  <span className="px-2 py-0.5 rounded font-medium bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200">
                                    {gradeInfo.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveService(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-3">
                          <div className="flex items-center space-x-2">
                            <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">수량:</label>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(index, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(index, item.quantity + 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">부담유형:</label>
                            <select
                              value={item.burdenTypeId}
                              onChange={(e) => handleBurdenTypeChange(index, e.target.value)}
                              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-w-0 flex-1"
                            >
                              {userBurdenTypes.map(b => (
                                <option key={b.id} value={b.id}>
                                  {b.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="card p-6 mb-6 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  시뮬레이션할 서비스를 추가해주세요.
                </p>
              </div>
            )}

            {/* 계산 결과 */}
            {results.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-primary-600" />
                    계산 결과
                  </h2>
                  {customerName && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      고객: {customerName}
                    </div>
                  )}
                </div>

                  {/* 결과 카드 (모바일 친화적) */}
                  <div className="space-y-4 mb-6">
                    {results.map((result, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                              {result.serviceName}
                            </h4>
                            <div className="flex flex-wrap gap-2 text-xs mb-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200 rounded">
                                부담률 {Math.round(result.burdenRate * 100)}%
                              </span>
                              {result.isOverLimit && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-200 rounded">
                                  ⚠️ 제한 초과
                                </span>
                              )}
                              {result.dayMultiplier && result.dayMultiplier > 1 && (
                                <span className={`px-2 py-1 rounded ${
                                  result.dayMultiplier >= 1.8 
                                    ? 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200' 
                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                                }`}>
                                  📅 +{Math.round((result.dayMultiplier - 1) * 100)}%
                                </span>
                              )}
                              {result.grade && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200 rounded">
                                  🏷️ {result.grade}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 mb-1">수량</div>
                            <div className="font-medium">
                              {result.quantity}개
                              {result.isOverLimit && (
                                <div className="text-xs text-orange-600 dark:text-orange-400">
                                  (기본 + {result.quantity - (result.baseCost ? Math.round(result.baseCost / result.unitPrice) : 0)})
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 mb-1">단가</div>
                            <div className="font-medium">
                              {result.unitPrice.toLocaleString()}원
                              {result.additionalCost && result.additionalCost > 0 && (
                                <div className="text-xs text-orange-600 dark:text-orange-400">
                                  + 가산 {Math.round(result.additionalCost / Math.max(1, result.quantity - (result.baseCost ? Math.round(result.baseCost / result.unitPrice) : 0)))}원
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 mb-1">총 비용</div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {result.totalCost.toLocaleString()}원
                              {result.baseCost && result.additionalCost && result.additionalCost > 0 && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  (기본 {result.baseCost.toLocaleString()} + 가산 {result.additionalCost.toLocaleString()})
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 mb-1">본인 부담</div>
                            <div className="font-medium text-red-600">
                              {result.userBurden.toLocaleString()}원
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="text-gray-500 dark:text-gray-400 mb-1">보험 적용</div>
                            <div className="font-medium text-green-600">
                              {result.insuranceCoverage.toLocaleString()}원
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 총계 */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">총 비용</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {totalCost.toLocaleString()}원
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center justify-center">
                          <Wallet className="h-4 w-4 mr-1" />
                          본인 부담금
                        </div>
                        <div className="text-xl font-bold text-red-600">
                          {totalUserBurden.toLocaleString()}원
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center justify-center">
                          <Shield className="h-4 w-4 mr-1" />
                          보험 적용
                        </div>
                        <div className="text-xl font-bold text-green-600">
                          {totalInsuranceCoverage.toLocaleString()}원
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 월별 한도액 체크 */}
                  {monthlyLimit && (
                    <div className={`rounded-lg p-4 mb-6 border-2 ${
                      isOverMonthlyLimit 
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`text-lg font-semibold flex items-center ${
                          isOverMonthlyLimit 
                            ? 'text-red-700 dark:text-red-300' 
                            : 'text-blue-700 dark:text-blue-300'
                        }`}>
                          {isOverMonthlyLimit ? (
                            <>
                              <AlertCircle className="h-5 w-5 mr-2" />
                              월 한도액 초과
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-5 w-5 mr-2" />
                              월 한도액 내 이용
                            </>
                          )}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isOverMonthlyLimit 
                            ? 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200' 
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                        }`}>
                          {currentGrade?.name} 기준
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">월 한도액</div>
                          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {monthlyLimit.limit.toLocaleString()}원
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">사용 금액</div>
                          <div className={`text-lg font-bold ${
                            isOverMonthlyLimit ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {totalCost.toLocaleString()}원
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">잔여 한도</div>
                          <div className={`text-lg font-bold ${
                            isOverMonthlyLimit ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {isOverMonthlyLimit 
                              ? `-${(totalCost - monthlyLimit.limit).toLocaleString()}원`
                              : `${remainingLimit.toLocaleString()}원`
                            }
                          </div>
                        </div>
                      </div>
                      
                      {isOverMonthlyLimit && (
                        <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
                          <p className="text-sm text-red-700 dark:text-red-300">
                            <strong>⚠️ 주의:</strong> 월 한도액을 {((totalCost - monthlyLimit.limit) / monthlyLimit.limit * 100).toFixed(1)}% 초과했습니다. 
                            초과분은 본인 부담금으로 처리되며, 보험 적용이 제한될 수 있습니다.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                {/* 차트 시각화 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* 파이 차트 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                      <PieChart className="h-5 w-5 mr-2 text-primary-600" />
                      비용 구성비
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(1)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => [`${value.toLocaleString()}원`, '']}
                            labelStyle={{ color: '#374151' }}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* 바 차트 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
                      서비스별 비용 분석
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="name" 
                            stroke="#6b7280"
                            fontSize={12}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis 
                            stroke="#6b7280"
                            fontSize={12}
                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                          />
                          <Tooltip 
                            formatter={(value: number, name: string) => [`${value.toLocaleString()}원`, name]}
                            labelStyle={{ color: '#374151' }}
                          />
                          <Legend />
                          <Bar dataKey="본인 부담금" fill="#ef4444" name="본인 부담금" />
                          <Bar dataKey="보험 적용" fill="#22c55e" name="보험 적용" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                  {/* 최적화 추천 */}
                  {results.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
                          서비스 최적화 추천
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowOptimization(!showOptimization)}
                        >
                          {showOptimization ? '숨기기' : '보기'}
                        </Button>
                      </div>
                      
                      {showOptimization && (
                        <div className="space-y-4">
                          {getOptimizationRecommendations().map((recommendation, index) => (
                            <div key={index} className={`p-4 rounded-lg border ${
                              recommendation.color === 'green' 
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                : recommendation.color === 'yellow'
                                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                            }`}>
                              <div className="flex items-start space-x-3">
                                <span className="text-2xl">{recommendation.icon}</span>
                                <div className="flex-1">
                                  <h4 className={`font-medium ${
                                    recommendation.color === 'green'
                                      ? 'text-green-800 dark:text-green-200'
                                      : recommendation.color === 'yellow'
                                        ? 'text-yellow-800 dark:text-yellow-200'
                                        : 'text-red-800 dark:text-red-200'
                                  }`}>
                                    {recommendation.title}
                                  </h4>
                                  <p className={`text-sm mt-1 ${
                                    recommendation.color === 'green'
                                      ? 'text-green-700 dark:text-green-300'
                                      : recommendation.color === 'yellow'
                                        ? 'text-yellow-700 dark:text-yellow-300'
                                        : 'text-red-700 dark:text-red-300'
                                  }`}>
                                    {recommendation.description}
                                  </p>
                                  {recommendation.services.length > 0 && (
                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                                      {recommendation.services.slice(0, 4).map((service, idx) => (
                                        <div key={idx} className="p-2 bg-white dark:bg-gray-800 rounded border">
                                          <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                            {service.type === 'ServiceItem' ? service.name : service.serviceName}
                                          </div>
                                          <div className="text-xs text-gray-600 dark:text-gray-400">
                                            {service.type === 'ServiceItem' ? `${service.price.toLocaleString()}원` : `${service.userBurden.toLocaleString()}원`}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 보호자 설명용 간단한 요약서 */}
                  {results.length > 0 && generateSimpleSummary() && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4 flex items-center">
                        <Info className="h-5 w-5 mr-2" />
                        보호자 설명용 간단 요약서
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-blue-200 dark:border-blue-700">
                          <span className="font-medium text-blue-700 dark:text-blue-300">고객명</span>
                          <span className="text-blue-800 dark:text-blue-200">{customerName}님</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-200 dark:border-blue-700">
                          <span className="font-medium text-blue-700 dark:text-blue-300">월 총 비용</span>
                          <span className="text-blue-800 dark:text-blue-200">{totalCost.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-200 dark:border-blue-700">
                          <span className="font-medium text-blue-700 dark:text-blue-300">본인 부담금</span>
                          <span className="text-red-600 font-semibold">{totalUserBurden.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-200 dark:border-blue-700">
                          <span className="font-medium text-blue-700 dark:text-blue-300">보험 적용</span>
                          <span className="text-green-600 font-semibold">{totalInsuranceCoverage.toLocaleString()}원</span>
                        </div>
                        {monthlyLimit && (
                          <div className="flex justify-between items-center py-2">
                            <span className="font-medium text-blue-700 dark:text-blue-300">월 한도액</span>
                            <span className={`font-semibold ${isOverMonthlyLimit ? 'text-red-600' : 'text-blue-600'}`}>
                              {monthlyLimit.limit.toLocaleString()}원
                              {isOverMonthlyLimit && <span className="text-xs ml-1">(초과)</span>}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>💡 설명 포인트:</strong> 총 {totalCost.toLocaleString()}원 중 
                          <span className="text-red-600 font-semibold">{totalUserBurden.toLocaleString()}원</span>을 
                          본인 부담하시고, <span className="text-green-600 font-semibold">{totalInsuranceCoverage.toLocaleString()}원</span>은 
                          장기요양보험에서 지원받으실 수 있습니다.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 저장 및 다운로드 버튼 */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <Button
                      onClick={handleSaveSimulation}
                      className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4" />
                      <span>결과 저장</span>
                    </Button>
                    <Button
                      onClick={handleDownloadPDF}
                      variant="outline"
                      className="flex items-center justify-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>PDF 다운로드</span>
                    </Button>
                  </div>

                {/* 관계 법령 정보 */}
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-green-800 dark:text-green-200">
                      <p className="font-medium mb-2">관계 법령 및 근거</p>
                      <ul className="space-y-1 text-xs">
                        <li>• {legalReferences.primary}</li>
                        <li>• {legalReferences.enforcement}</li>
                        <li>• {legalReferences.regulation}</li>
                        <li>• {legalReferences.pricing}</li>
                        <li>• {legalReferences.burden}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 안내 메시지 */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <p className="font-medium mb-1">주의사항</p>
                      <ul className="space-y-1 text-xs">
                        <li>• 본 시뮬레이션은 2025년 기준 수가표를 기반으로 한 예상 계산입니다.</li>
                        <li>• 요일별 가산 요금, 등급별 본인 부담률이 자동 적용됩니다.</li>
                        <li>• 실제 본인 부담금은 지역, 서비스 제공기관에 따라 차이가 있을 수 있습니다.</li>
                        <li>• 정확한 비용은 해당 서비스 제공기관에 문의하시기 바랍니다.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
