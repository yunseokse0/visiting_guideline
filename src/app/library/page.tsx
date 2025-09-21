'use client'

import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Download, 
  FileText, 
  File,
  Search,
  Filter
} from 'lucide-react'
import { useState } from 'react'

// 자료실 데이터 (실제로는 API에서 가져올 데이터)
const libraryDocuments = [
  {
    id: 'doc1',
    title: '이지케어 급여명세서 입력 가이드',
    description: '이지케어 시스템에서 급여명세서를 올바르게 입력하는 방법을 상세히 설명합니다.',
    type: 'guide' as const,
    downloadUrl: '#',
    tags: ['이지케어', '급여명세서', '입력방법'],
    category: '가이드'
  },
  {
    id: 'doc2',
    title: '공휴일·가족요양 처리 매뉴얼',
    description: '공휴일 근무와 가족요양 관련 급여 계산 및 처리 방법을 안내합니다.',
    type: 'guide' as const,
    downloadUrl: '#',
    tags: ['공휴일', '가족요양', '급여계산'],
    category: '가이드'
  },
  {
    id: 'doc3',
    title: '방문요양 OJT 상세 가이드',
    description: '방문요양 업무 전 과정에 대한 상세한 교육 자료입니다.',
    type: 'guide' as const,
    downloadUrl: '#',
    tags: ['방문요양', 'OJT', '전체과정'],
    category: '교육자료'
  },
  {
    id: 'doc4',
    title: '수급자 등록 신청서',
    description: '수급자 등록 시 필요한 신청서 양식입니다.',
    type: 'form' as const,
    downloadUrl: '#',
    tags: ['수급자', '등록', '신청서'],
    category: '양식'
  },
  {
    id: 'doc5',
    title: '요양보호사 등록 신청서',
    description: '요양보호사 등록을 위한 신청서 양식입니다.',
    type: 'form' as const,
    downloadUrl: '#',
    tags: ['요양보호사', '등록', '신청서'],
    category: '양식'
  },
  {
    id: 'doc6',
    title: '개인별장기요양 이용계획서 열람 신청서',
    description: '개인별장기요양 이용계획서 열람을 위한 신청서 양식입니다.',
    type: 'form' as const,
    downloadUrl: '#',
    tags: ['이용계획서', '열람', '신청서'],
    category: '양식'
  }
]

const categories = ['전체', '가이드', '교육자료', '양식', '템플릿']

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')

  const filteredDocuments = libraryDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === '전체' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            자료실
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            방문요양 업무에 필요한 가이드, 양식, 템플릿을 다운로드하세요.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="문서 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="card p-6 hover:shadow-lg transition-shadow duration-200">
              {/* Document Icon */}
              <div className="flex items-center mb-4">
                {doc.type === 'guide' ? (
                  <BookOpen className="h-8 w-8 text-blue-500" />
                ) : doc.type === 'form' ? (
                  <FileText className="h-8 w-8 text-green-500" />
                ) : (
                  <File className="h-8 w-8 text-purple-500" />
                )}
                <div className="ml-3">
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded">
                    {doc.category}
                  </span>
                </div>
              </div>

              {/* Document Info */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {doc.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {doc.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {doc.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Download Button */}
              <Button
                onClick={() => {
                  // 실제로는 파일 다운로드 로직 구현
                  alert('파일 다운로드 기능은 준비 중입니다.')
                }}
                className="w-full flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>다운로드</span>
              </Button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <File className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              다른 검색어나 카테고리를 시도해보세요.
            </p>
          </div>
        )}

        {/* Quick Access Section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            자주 사용하는 자료
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => alert('이지케어 가이드 준비 중')}
            >
              <BookOpen className="h-6 w-6" />
              <span className="text-sm">이지케어 가이드</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => alert('W4C 매뉴얼 준비 중')}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">W4C 매뉴얼</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => alert('롱텀케어 가이드 준비 중')}
            >
              <File className="h-6 w-6" />
              <span className="text-sm">롱텀케어 가이드</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => alert('희망이음 매뉴얼 준비 중')}
            >
              <Download className="h-6 w-6" />
              <span className="text-sm">희망이음 매뉴얼</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
