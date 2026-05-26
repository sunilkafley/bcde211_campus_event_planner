export class Event {
  #id
  #title
  #date
  #startTime
  #endTime
  #location
  #tags

  constructor(id, title, date, startTime, endTime, location = '', tags = []) {
    // Invalid input -> do not persist
    if (typeof title !== 'string' || !title.trim()) {
      throw new Error('Title is required')
    }

    if (!date) {
      throw new Error('Date is required')
    }

    if (startTime >= endTime) {
      throw new Error('End time must be after start time')
    }

    this.#id = id
    this.#title = title
    this.#date = date
    this.#startTime = startTime
    this.#endTime = endTime
    this.#location = location
    this.#tags = tags
  }

  get id() {
    return this.#id
  }

  set id(id) {
    this.#id = id
  }

  get title() {
    return this.#title
  }

  get date() {
    return this.#date
  }

  get startTime() {
    return this.#startTime
  }

  get endTime() {
    return this.#endTime
  }

  get location() {
    return this.#location
  }

  get tags() {
    return this.#tags
  }

  update(data) {
    if (data.title !== undefined) {
      if (!data.title.trim()) throw new Error('Invalid title')
      this.#title = data.title
    }

    if (data.startTime !== undefined) this.#startTime = data.startTime
    if (data.endTime !== undefined) this.#endTime = data.endTime

    if (this.#startTime >= this.#endTime) {
      throw new Error('Invalid time range')
    }

    if (data.location !== undefined) this.#location = data.location
    if (data.tags !== undefined) this.#tags = data.tags
  }

  // R9: Calculation within part
  getDuration() {
    return this.#endTime - this.#startTime
  }

  clone() {
    return new Event(
      this.#id,
      this.#title,
      this.#date,
      this.#startTime,
      this.#endTime,
      this.#location,
      [...this.#tags],
    )
  }

  toPlainObject() {
    const data = {
      title: this.#title,
      date: this.#date,
      startTime: this.#startTime,
      endTime: this.#endTime,
      location: this.#location,
      tags: this.#tags,
    }

    if (this.#id !== null && this.#id !== undefined) {
      data.id = this.#id
    }

    return data
  }
}
