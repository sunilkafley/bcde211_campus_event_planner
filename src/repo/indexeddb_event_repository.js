import { RepositoryContract } from './repository_contract.js'

/**
 * A concrete implementation of the Repository Contract using the Browser's IndexedDB.
 * This class encapsulates all the complexity of the IDBRequest and Transaction lifecycle.
 */
export class IndexedDbEventRepository extends RepositoryContract {
  #dbName
  #storeName
  #db // This will hold the IDBDatabase instance once opened
  #version

  // is used to keep track of the ongoing open() call, to prevent multiple simultaneous opens
  #openingPromise = null

  constructor() {
    super()
    this.#dbName = 'CampusEventPlannerDB'
    this.#storeName = 'events'
    this.#db = null
    this.#version = 1
  }

  /**
   * Opens the database connection.
   * Handles the 'upgradeneeded' event to create object stores if they don't exist.
   * @returns {Promise<IDBDatabase>}
   */
  open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.#dbName, this.#version)

      request.onerror = () => reject(request.error)

      // upgradeneeded is called when the database is created for the first time
      // or when a higher version number is passed
      request.onupgradeneeded = (event) => {
        const db = event.target.result

        if (!db.objectStoreNames.contains(this.#storeName)) {
          db.createObjectStore(this.#storeName, {
            keyPath: 'id',
            autoIncrement: true,
          })
        }
      }

      request.onsuccess = () => {
        this.#db = request.result

        // to indicate that the database operation has completed and there are
        // no longer any pending opening requests.
        this.#openingPromise = null

        resolve(this.#db)
      }
    })
  }

  /**
   * Closes the database connection.
   * If the database is not open, this method does nothing.
   * After calling this method, all operations on the repository will throw an error.
   */
  close() {
    if (this.#db) {
      this.#db.close()
      this.#db = null
      this.#openingPromise = null
    }
  }

  /**
   * Ensures the database is open before performing operations.
   * This prevents race conditions if methods are called before connection is established.
   */
  async ensureDb() {
    if (this.#db) return

    if (!this.#openingPromise) {
      this.#openingPromise = this.open()
    }

    await this.#openingPromise
  }

  /**
   * Adds a new item to the database.
   * @param {object} item A plain object representing the todo item.
   *                      Any supplied `id` property is ignored because the store
   *                      uses autoIncrement.
   * @returns {Promise<number>} A promise that resolves with the generated ID.
   * @throws {Error} If the item is invalid (null, undefined, or not an object).
   */
  async add(item) {
    await this.ensureDb()

    return new Promise((resolve, reject) => {
      const { tx, store } = this.#getStore('readwrite')

      if (!item || typeof item !== 'object') {
        throw new Error('Invalid item')
      }

      // We need to remove the id property if it exists, because the store is configured
      // with autoIncrement: true
      const { id: _id, ...data } = item

      // The add() method of the IDBObjectStore interface adds a new record to a database,
      // or updates an existing record if the given item already exists.
      // It returns an IDBRequest object, and the result of the request will be the generated
      // ID for the new record.
      const request = store.add(data)

      let settled = false
      const fail = (err) => {
        if (!settled) {
          settled = true
          reject(err)
        }
      }

      tx.onerror = () => fail(tx.error)
      request.onerror = () => fail(request.error)
      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }

  /**
   * Gets the object store for the specified mode.
   * @param {string} mode The transaction mode ("readonly" or "readwrite").
   * @returns {object} An object containing the transaction and store.
   */
  #getStore(mode = 'readonly') {
    // transactions are used to group multiple operations together, and related
    // to a specific object store. They also provide atomicity and error
    // handling for those operations.
    const tx = this.#db.transaction(this.#storeName, mode)
    const store = tx.objectStore(this.#storeName)
    return { tx, store }
  }

  async getById(id) {
    await this.ensureDb()
    return new Promise((resolve, reject) => {
      const { tx, store } = this.#getStore()

      // The get() method of the IDBObjectStore interface retrieves a record from the database
      // by its key. It returns an IDBRequest object, and the result of the request will be the
      // record if found, or undefined if not found.
      const request = store.get(id)

      // to ensure that the error is only rejected once,
      // even if multiple errors occur.
      let settled = false
      const fail = (err) => {
        if (!settled) {
          settled = true
          reject(err)
        }
      }
      tx.onerror = () => fail(tx.error)
      request.onerror = () => fail(request.error)

      // If the result is not null, it creates a new object using the spread operator
      // ({ ...result }) to ensure that the result is a plain object. If the result is null,
      // it resolves the promise with null.
      request.onsuccess = () => {
        const result = request.result
        resolve(result ? { ...result } : null)
      }
    })
  }

  async getAll() {
    await this.ensureDb()

    return new Promise((resolve, reject) => {
      const { tx, store } = this.#getStore()

      // The getAll() method of the IDBObjectStore interface retrieves all records from the
      // database. It returns an IDBRequest object, and the result of the request will be an
      // array of all records in the object store.
      const request = store.getAll()

      // We need to handle both transaction and request errors, and ensure we only reject once
      let settled = false
      const fail = (err) => {
        if (!settled) {
          settled = true
          reject(err)
        }
      }
      tx.onerror = () => fail(tx.error)
      request.onerror = () => fail(request.error)

      request.onsuccess = () => {
        const result = request.result || []
        // We return a new array of plain objects to avoid exposing IDB-specific properties
        resolve(result.map((item) => ({ ...item })))
      }
    })
  }

  async update(item) {
    await this.ensureDb()

    if (!item || item.id === null || item.id === undefined) {
      throw new Error('Cannot update: missing id')
    }

    return new Promise((resolve, reject) => {
      const { tx, store } = this.#getStore('readwrite')

      // First check whether the record exists
      // The get() method of the IDBObjectStore interface retrieves a record from the database
      // by its key.
      // It returns an IDBRequest object, and the result of the request will be the record
      // if found, or undefined if not found.
      const request = store.get(item.id)

      let settled = false
      const fail = (err) => {
        if (!settled) {
          settled = true
          reject(err)
        }
      }
      tx.onerror = () => fail(tx.error)
      request.onerror = () => fail(request.error)

      request.onsuccess = () => {
        const existing = request.result

        if (!existing) {
          reject(new Error(`Cannot update: todo ${item.id} not found`))
          return
        }

        const stored = { ...item }
        // The put() method of the IDBObjectStore interface updates a given record in a database,
        // or inserts a new record if the given item does not already exist.
        const putRequest = store.put(stored)

        putRequest.onerror = () => reject(putRequest.error)
        putRequest.onsuccess = () => resolve({ ...stored })
      }
    })
  }

  async remove(id) {
    await this.ensureDb()

    return new Promise((resolve, reject) => {
      const { tx, store } = this.#getStore('readwrite')

      // The delete() method of the IDBObjectStore interface deletes a record from the database
      // by its key. It returns an IDBRequest object, and the result of the request will be undefined.
      const request = store.delete(id)

      let settled = false
      const fail = (err) => {
        if (!settled) {
          settled = true
          reject(err)
        }
      }
      tx.onerror = () => fail(tx.error)
      request.onerror = () => fail(request.error)

      request.onsuccess = () => resolve()
    })
  }
}
