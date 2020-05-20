export default [
  {
    path: '/news',
    name: 'news',
    component: () => import('@/views/module/news/News.vue'),
    meta: {
      title: '测试'
    }
  }
]
