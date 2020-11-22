export interface MonitoringSuccess {
  status: 'pass'
  version: string
  links: {
    about: string
    project: string
  }
}

export interface MonitoringError {
  type: string
  title: string
  detail: string
  status: 0
}

export interface MonitoringUnavailable {
  status: 'pass'
  version: string
  links: {
    about: string
    project: string
  }
}