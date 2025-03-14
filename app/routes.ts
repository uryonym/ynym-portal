import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  layout('routes/layout.tsx', [
    index('routes/home.tsx'),
    route('login', 'routes/login.tsx'),
    route('task', 'routes/task.tsx'),
  ]),
] satisfies RouteConfig
