const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

const SCRIPT = 'function onActionCreated(event) { done(); }'

let operator

const describeReactorScriptTests = () => {
  it('should update the Reactor script', async () => {
    const payload = { script: SCRIPT }
    mockApi()
      .put('/projects/projectId/applications/applicationId/reactor/script', payload)
      .reply(200, payload)
    const res = await operator
      .project('projectId')
      .application('applicationId')
      .reactorScript()
      .update(payload)

    expect(res.script).to.equal(SCRIPT)
  })

  it('should read the Reactor script status', async () => {
    mockApi()
      .get('/projects/projectId/applications/applicationId/reactor/script/status')
      .reply(200, { updating: false })
    const res = await operator
      .project('projectId')
      .application('applicationId')
      .reactorScript()
      .status()
      .read()

    expect(res.updating).to.equal(false)
  })

  it('should read the Reactor script', async () => {
    mockApi()
      .get('/projects/projectId/applications/applicationId/reactor/script')
      .reply(200, { type: 'simple' })
    const res = await operator
      .project('projectId')
      .application('applicationId')
      .reactorScript()
      .read()

    expect(res).to.be.an('object')
    expect(res.type).to.equal('simple')
  })
}

const describeReactorScheduleTests = () => {
  it('should create a Reactor schedule', async () => {
    const payload = {
      event: {},
      cron: '0 0 * * * ?',
      description: 'Example Reactor schedule'
    }
    mockApi()
      .post('/projects/projectId/applications/applicationId/reactor/schedules', payload)
      .reply(201, payload)
    const res = await operator
      .project('projectId')
      .application('applicationId')
      .reactorSchedule()
      .create(payload)

    expect(res).to.be.an('object')
    expect(res.cron).to.equal(payload.cron)
  })

  it('should read all Reactor schedules', async () => {
    mockApi()
      .get('/projects/projectId/applications/applicationId/reactor/schedules')
      .reply(200, [{ id: 'scheduleId' }])
    const res = await operator
      .project('projectId')
      .application('applicationId')
      .reactorSchedule()
      .read()

    expect(res.length).to.be.gte(1)
  })

  it('should read a single Reactor schedule', async () => {
    mockApi()
      .get('/projects/projectId/applications/applicationId/reactor/schedules/scheduleId')
      .reply(200, { id: 'scheduleId' })
    const res = await operator
      .project('projectId')
      .application('applicationId')
      .reactorSchedule('scheduleId')
      .read()

    expect(res).to.be.an('object')
  })

  it('should update a single Reactor schedule', async () => {
    const payload = { enabled: false }
    mockApi()
      .put('/projects/projectId/applications/applicationId/reactor/schedules/scheduleId', payload)
      .reply(200, { id: 'scheduleId', enabled: false })
    const res = await operator
      .project('projectId')
      .application('applicationId')
      .reactorSchedule('scheduleId')
      .update({ enabled: false })

    expect(res).to.be.an('object')
    expect(res.id).to.equal('scheduleId')
    expect(res.enabled).to.equal(false)
  })

  it('should delete a single Reactor schedule', async () => {
    mockApi()
      .delete('/projects/projectId/applications/applicationId/reactor/schedules/scheduleId')
      .reply(200)
    await operator
      .project('projectId')
      .application('applicationId')
      .reactorSchedule('scheduleId')
      .delete()
  })
}

module.exports = (scopeType) => {
  describe('Reactor', () => {
    before(async () => {
      operator = getScope('operator')
    })

    describeReactorScriptTests()
    describeReactorScheduleTests()
  })
}
