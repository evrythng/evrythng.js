const { expect } = require('chai')
const { getScope } = require('../util')

const NAME = 'test'
const SCRIPT = 'function onActionCreated(event) { done(); }'

let operator, project, application, schedule

const describeReactorScriptTests = () => {
  it('should update the Reactor script', async () => {
    const payload = { script: SCRIPT }
    await operator.projects(project.id).applications(application.id)
      .reactorScript()
      .update(payload)
  })

  it('should read the Reactor script status', async function () {
    this.timeout(30000)
    
    let status = { updating: true }
    while(status.updating) {
      status = await operator.projects(project.id).applications(application.id)
        .reactorScript()
        .status()
        .read()
    }

    expect(status.updating).to.equal(false)
  })

  it('should read the Reactor script', async () => {
    const res = await operator.projects(project.id).applications(application.id)
      .reactorScript()
      .read()

    expect(res).to.be.an('object')
    expect(res.type).to.equal('simple')
    expect(res.script).to.equal(SCRIPT)
  })
}

const describeReactorScheduleTests = () => {
  it('should create a Reactor schedule', async () => {
    const payload = { 
      function: 'onScheduledEvent', 
      event: {}, 
      cron: '0 0 * * * ?', 
      description: 'Example Reactor schedule', 
      enabled: true 
    }
    const res = await operator.projects(project.id).applications(application.id)
      .reactorSchedules()
      .create(payload)

    expect(res).to.be.an('object')
    expect(res.id).to.have.length(24)
    expect(res.cron).to.equal(payload.cron)
  })

  it('should read all Reactor schedules', async () => {
    const res = await operator.projects(project.id).applications(application.id)
      .reactorSchedules()
      .read()

    schedule = res[0]

    expect(res.length).to.be.gte(1)
    expect(schedule).to.be.an('object')
    expect(schedule.id).to.have.length(24)
  })

  it('should read a single Reactor schedule', async () => {
    const res = await operator.projects(project.id).applications(application.id)
      .reactorSchedules(schedule.id)
      .read()

    expect(res).to.be.an('object')
    expect(res.id).to.equal(schedule.id)
  })

  it('should update a single Reactor schedule', async () => {
    const res = await operator.projects(project.id).applications(application.id)
      .reactorSchedules(schedule.id)
      .update({ enabled: false })

    expect(res).to.be.an('object')
    expect(res.id).to.equal(schedule.id)
    expect(res.enabled).to.equal(false)
  })

  it('should delete a single Reactor schedule', async () => {
    await operator.projects(project.id).applications(application.id)
      .reactorSchedules(schedule.id)
      .delete()
  })
}

module.exports = (scopeType) => {
  describe('Reactor', () => {
    before(async () => {
      operator = getScope('operator')

      project = await operator.projects().create({ name: NAME })
      const appPayload = { name: NAME, socialNetworks: {} }
      application = await operator.projects(project.id).applications().create(appPayload)
    })

    after(async () => {
      await operator.projects(project.id).applications(application.id).delete()
      await operator.projects(project.id).delete()
    })

    describeReactorScriptTests()
    describeReactorScheduleTests()
  })
}
