import {
  operatorTemplate,
  projectTemplate,
  applicationTemplate,
  userAccessTemplate
} from './data'

export default {
  testBase: 'https://api-test.evrythng.net',
  error: '/error',
  access: '/access',
  actions: '/actions',
  actionTypes: '/actions',
  applications: '/applications',
  application: `/projects/${projectTemplate.id}/applications/${applicationTemplate.id}`,
  batches: '/batches',
  collections: '/collections',
  dummy: '/path',
  files: '/files',
  locations: '/locations',
  operators: '/operators',
  operator: `/operators/${operatorTemplate.id}`,
  permissions: '/permissions',
  places: '/places',
  products: '/products',
  projects: '/projects',
  properties: '/properties',
  reactorScript: '/reactor/script',
  reactorSchedules: '/reactor/schedules',
  reactorLogs: '/reactor/logs',
  roles: '/roles',
  status: '/status',
  tasks: '/tasks',
  thngs: '/thngs',
  users: '/users',
  usersAccess: '/auth/evrythng/users',
  usersAccessValidate: `${userAccessTemplate.evrythngUser}/validate`
}
