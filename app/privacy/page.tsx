'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">日本語語彙力診断</Link>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">首页</Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600">关于测评</Link>
              <Link href="/resources" className="text-gray-700 hover:text-blue-600">学习资源</Link>
              <Link href="/login" className="text-gray-700 hover:text-blue-600">登录/注册</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">隐私政策</h1>
          
          <div className="space-y-6 text-gray-700">
            <p className="text-lg">
              日本語語彙力診断（以下简称&quot;本网站&quot;）致力于保护用户的隐私和个人信息。本隐私政策详细说明了我们如何收集、使用、存储和保护您的个人信息。
            </p>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. 信息收集</h2>
              <p className="mb-4">
                本网站在您使用我们的服务时可能会收集以下信息：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>个人基本信息（如您自愿提供的姓名、邮箱等）</li>
                <li>答题记录和测评结果</li>
                <li>浏览器信息、IP地址和访问时间</li>
                <li>使用习惯和偏好设置</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. 信息使用</h2>
              <p className="mb-4">
                我们收集的信息将用于以下目的：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>提供和改进测评服务</li>
                <li>生成个性化的测评报告</li>
                <li>发送与测评相关的通知和建议</li>
                <li>分析网站使用情况，优化用户体验</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. 信息存储与保护</h2>
              <p className="mb-4">
                我们采取以下措施保护您的个人信息：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>使用加密技术存储敏感信息</li>
                <li>限制访问个人信息的人员权限</li>
                <li>定期更新安全措施</li>
                <li>仅在必要的时间内保留您的个人信息</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. 信息共享</h2>
              <p className="mb-4">
                我们不会向第三方共享您的个人信息，除非：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>获得您的明确许可</li>
                <li>法律要求或为了遵守法律法规</li>
                <li>保护本网站的权利、财产或安全</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Cookie政策</h2>
              <p className="mb-4">
                本网站使用Cookie来：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>记住您的偏好设置</li>
                <li>分析网站流量</li>
                <li>提供个性化的内容和广告</li>
              </ul>
              <p className="mt-4">
                您可以通过浏览器设置拒绝或删除Cookie，但这可能会影响网站的某些功能。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. 用户权利</h2>
              <p className="mb-4">
                您有权：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>访问和查看您的个人信息</li>
                <li>请求更正或更新您的个人信息</li>
                <li>请求删除您的个人信息</li>
                <li>限制或反对您个人信息的处理</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. 隐私政策更新</h2>
              <p>
                本隐私政策可能会不时更新，更新后的政策将在本页面发布。我们建议您定期查看本政策以了解任何变更。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. 联系我们</h2>
              <p>
                如果您对本隐私政策有任何疑问或 concerns，请通过以下方式联系我们：
              </p>
              <p className="font-medium">
                邮箱：771329859@qq.com
              </p>
            </section>
          </div>

          {/* 返回首页按钮 */}
          <div className="mt-12 text-center">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg"
              >
                返回首页
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-2">© 2026 日本語語彙力診断. All rights reserved.</p>
          <p className="text-gray-400 text-sm">
            联系邮箱: 771329859@qq.com | 
            <Link href="/privacy" className="hover:text-white underline ml-2">隐私政策</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
