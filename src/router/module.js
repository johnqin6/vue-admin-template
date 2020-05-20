const getChunks = (modulesContext) => {
  const chunks = modulesContext.keys().reduce((modules, key) => {
    modules[key.replace(/(^\.\/)|(\.js$)/g, '')] = modulesContext(key).default
    return modules
  }, {})

  return chunks
}

const outRoutes = []

const routerContexts = [
  require.context('@/views/module', true, /.routes.js$/)
]

routerContexts.forEach(routerContext => {
  const routerChunks = getChunks(routerContext)

  Object.keys(routerChunks).forEach(item => {
    outRoutes.push(...routerChunks[item])
  })
})

export default outRoutes
