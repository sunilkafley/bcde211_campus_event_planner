import { IndexedDbEventRepository } from '../../src/repo/indexeddb_event_repository.js'

describe('IndexedDbEventRepository', () => {
  const DB_NAME = 'CampusEventPlannerDB'
  const STORE_NAME = 'events'

  let repo

  // ---------- Helpers ----------
  const deleteDatabase = (name = DB_NAME) =>
    new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase(name)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
      req.onblocked = () => {}
    })

  const createAsyncRequest = ({ result = undefined, error = null } = {}) => {
    const request = { onsuccess: null, onerror: null, result, error }

    setTimeout(() => {
      if (error) request.onerror?.({ target: request })
      else request.onsuccess?.({ target: request })
    }, 0)

    return request
  }

  const createFakeDb = ({ storeMethods = {}, txError = null } = {}) => {
    const store = {
      add: storeMethods.add ?? jest.fn(() => createAsyncRequest({ result: 1 })),
      get:
        storeMethods.get ?? jest.fn(() => createAsyncRequest({ result: null })),
      getAll:
        storeMethods.getAll ??
        jest.fn(() => createAsyncRequest({ result: [] })),
      put:
        storeMethods.put ??
        jest.fn(() => createAsyncRequest({ result: undefined })),
      delete:
        storeMethods.delete ??
        jest.fn(() => createAsyncRequest({ result: undefined })),
    }

    const db = {
      transaction: jest.fn(() => {
        const tx = {
          onerror: null,
          error: txError,
          objectStore: jest.fn(() => store),
        }

        if (txError) {
          setTimeout(() => tx.onerror?.({ target: tx }), 0)
        }

        return tx
      }),
      close: jest.fn(),
      objectStoreNames: {
        contains: jest.fn((name) => name === STORE_NAME),
      },
    }

    return db
  }

  const mockOpenFailure = (message) =>
    jest
      .spyOn(indexedDB, 'open')
      .mockImplementation(() =>
        createAsyncRequest({ error: new Error(message) }),
      )

  const mockOpenWithDb = (fakeDb) =>
    jest.spyOn(indexedDB, 'open').mockImplementation(() => {
      const request = { onsuccess: null, onerror: null, onupgradeneeded: null }

      setTimeout(() => {
        request.result = fakeDb
        request.onsuccess?.({ target: request })
      }, 0)

      return request
    })

  const mockRequestFailure = (method, message) => {
    const fakeDb = createFakeDb({
      storeMethods: {
        [method]: jest.fn(() =>
          createAsyncRequest({ error: new Error(message) }),
        ),
      },
    })

    return mockOpenWithDb(fakeDb)
  }

  // ---------- Setup ----------
  beforeEach(async () => {
    await deleteDatabase()
    repo = new IndexedDbEventRepository()
  })

  afterEach(async () => {
    repo?.close()
    jest.restoreAllMocks()
    await deleteDatabase().catch(() => {})
  })

  // ---------- open ----------
  describe('open()', () => {
    it('opens the database successfully', async () => {
      const db = await repo.open()

      expect(db).toBeDefined()
      expect(db.name).toBe(DB_NAME)
      expect(db.objectStoreNames.contains(STORE_NAME)).toBe(true)
    })

    it('rejects when open fails', async () => {
      mockOpenFailure('Connection failed')
      const failingRepo = new IndexedDbEventRepository()

      await expect(failingRepo.open()).rejects.toThrow('Connection failed')
    })

    it('continues failing after initial open failure', async () => {
      mockOpenFailure('Initial open failed')

      await expect(repo.getAll()).rejects.toThrow('Initial open failed')
      await expect(repo.add({ title: 'Event' })).rejects.toThrow(
        'Initial open failed',
      )
    })
  })

  // ---------- close ----------
  describe('close()', () => {
    it('does not throw if never opened', () => {
      expect(() => repo.close()).not.toThrow()
    })

    it('can be called multiple times safely', async () => {
      await repo.open()

      expect(() => {
        repo.close()
        repo.close()
      }).not.toThrow()
    })
  })

  // ---------- add ----------
  describe('add()', () => {
    it('adds event and returns id', async () => {
      const id = await repo.add({
        title: 'Test Event',
        date: '2026-01-01',
        startTime: 10,
        endTime: 12,
      })

      expect(id).toEqual(expect.any(Number))
    })

    it('persists event', async () => {
      const event = {
        title: 'Persist Event',
        date: '2026-01-01',
        startTime: 10,
        endTime: 12,
      }

      const id = await repo.add(event)
      const result = await repo.getById(id)

      expect(result).toEqual(expect.objectContaining({ id }))
    })

    it('rejects invalid input', async () => {
      await expect(repo.add(null)).rejects.toThrow('Invalid item')
    })

    it('rejects on request failure', async () => {
      mockRequestFailure('add', 'Add Failed')
      await expect(repo.add({ title: 'Fail' })).rejects.toThrow('Add Failed')
    })

    it('rejects on transaction failure', async () => {
      const fakeDb = createFakeDb({
        txError: new Error('Tx Failed'),
      })

      mockOpenWithDb(fakeDb)

      await expect(repo.add({ title: 'Tx' })).rejects.toThrow('Tx Failed')
    })
  })

  // ---------- getById ----------
  describe('getById()', () => {
    it('returns null if not found', async () => {
      const result = await repo.getById(999)
      expect(result).toBeNull()
    })

    it('returns item when found', async () => {
      const id = await repo.add({
        title: 'Find Me',
        date: '2026-01-01',
        startTime: 10,
        endTime: 12,
      })

      const result = await repo.getById(id)

      expect(result.id).toBe(id)
    })

    it('rejects on request error', async () => {
      mockRequestFailure('get', 'Get Failed')
      await expect(repo.getById(1)).rejects.toThrow('Get Failed')
    })

    it('rejects on transaction error', async () => {
  const fakeDb = {
    transaction: jest.fn(() => {
      const tx = {
        onerror: null,
        error: new Error('Tx Get Failed'),
        objectStore: jest.fn(() => ({
          get: jest.fn(() => ({})),
        })),
      }

      setTimeout(() => {
        tx.onerror?.({ target: tx })
      }, 0)

      return tx
    }),
    close: jest.fn(),
    objectStoreNames: {
      contains: jest.fn(() => true),
    },
  }

  jest.spyOn(indexedDB, 'open').mockImplementation(() => {
    const request = { onsuccess: null }

    setTimeout(() => {
      request.result = fakeDb
      request.onsuccess?.({ target: request })
    }, 0)

    return request
  })

  const repo = new IndexedDbEventRepository()

  await expect(repo.getById(1)).rejects.toThrow('Tx Get Failed')
})
  })

  // ---------- getAll ----------
  describe('getAll()', () => {
    it('returns empty array when no data', async () => {
      const result = await repo.getAll()
      expect(result).toEqual([])
    })

    it('rejects on request failure', async () => {
      mockRequestFailure('getAll', 'GetAll Failed')
      await expect(repo.getAll()).rejects.toThrow('GetAll Failed')
    })

    it('rejects on transaction error', async () => {
  // Arrange
  const fakeDb = {
    transaction: jest.fn(() => {
      const tx = {
        onerror: null,
        error: new Error('Tx GetAll Failed'),
        objectStore: jest.fn(() => ({
          getAll: jest.fn(() => ({})),
        })),
      }

      setTimeout(() => {
        tx.onerror?.({ target: tx })
      }, 0)

      return tx
    }),
    close: jest.fn(),
    objectStoreNames: {
      contains: jest.fn(() => true),
    },
  }

  jest.spyOn(indexedDB, 'open').mockImplementation(() => {
    const request = { onsuccess: null }

    setTimeout(() => {
      request.result = fakeDb
      request.onsuccess?.({ target: request })
    }, 0)

    return request
  })

  const repo = new IndexedDbEventRepository()

  await expect(repo.getAll()).rejects.toThrow('Tx GetAll Failed')
})
  })

  // ---------- update ----------
  describe('update()', () => {
    it('updates an existing event', async () => {
      const id = await repo.add({
        title: 'Old',
        date: '2026-01-01',
        startTime: 10,
        endTime: 12,
      })

      await repo.update({
        id,
        title: 'Updated',
        date: '2026-01-01',
        startTime: 10,
        endTime: 12,
      })

      const updated = await repo.getById(id)
      expect(updated.title).toBe('Updated')
    })

    it('rejects when id missing', async () => {
      await expect(repo.update({ title: 'No ID' })).rejects.toThrow()
    })

    it('rejects if item not found', async () => {
      const fakeDb = createFakeDb({
        storeMethods: {
          get: jest.fn(() => createAsyncRequest({ result: null })),
        },
      })

      mockOpenWithDb(fakeDb)

      await expect(repo.update({ id: 999 })).rejects.toThrow()
    })

    it('rejects on put failure', async () => {
      const fakeDb = createFakeDb({
        storeMethods: {
          get: jest.fn(() => createAsyncRequest({ result: { id: 1 } })),
          put: jest.fn(() =>
            createAsyncRequest({ error: new Error('Put Failed') }),
          ),
        },
      })

      mockOpenWithDb(fakeDb)

      await expect(repo.update({ id: 1 })).rejects.toThrow('Put Failed')
    })

    it('rejects on transaction error', async () => {
  const fakeDb = {
    transaction: jest.fn(() => {
      const tx = {
        onerror: null,
        error: new Error('Tx Update Failed'),
        objectStore: jest.fn(() => ({
          get: jest.fn(() => ({})),
        })),
      }

      setTimeout(() => {
        tx.onerror?.({ target: tx })
      }, 0)

      return tx
    }),
    close: jest.fn(),
    objectStoreNames: {
      contains: jest.fn(() => true),
    },
  }

  jest.spyOn(indexedDB, 'open').mockImplementation(() => {
    const request = { onsuccess: null }

    setTimeout(() => {
      request.result = fakeDb
      request.onsuccess?.({ target: request })
    }, 0)

    return request
  })

  const repo = new IndexedDbEventRepository()

  await expect(repo.update({ id: 1 })).rejects.toThrow('Tx Update Failed')
})
  })

  // ---------- remove ----------
  describe('remove()', () => {
    it('removes an event', async () => {
      const id = await repo.add({
        title: 'Delete Me',
        date: '2026-01-01',
        startTime: 10,
        endTime: 12,
      })

      await repo.remove(id)
      const result = await repo.getById(id)

      expect(result).toBeNull()
    })

    it('rejects on delete failure', async () => {
      mockRequestFailure('delete', 'Delete Failed')
      await expect(repo.remove(1)).rejects.toThrow('Delete Failed')
    })
  })

  it('rejects on transaction error', async () => {
  // Arrange
  const fakeDb = {
    transaction: jest.fn(() => {
      const tx = {
        onerror: null,
        error: new Error('Tx Remove Failed'),
        objectStore: jest.fn(() => ({
          delete: jest.fn(() => ({})),
        })),
      }

      // trigger transaction error branch
      setTimeout(() => {
        tx.onerror?.({ target: tx })
      }, 0)

      return tx
    }),
    close: jest.fn(),
    objectStoreNames: {
      contains: jest.fn(() => true),
    },
  }

  jest.spyOn(indexedDB, 'open').mockImplementation(() => {
    const request = { onsuccess: null }

    setTimeout(() => {
      request.result = fakeDb
      request.onsuccess?.({ target: request })
    }, 0)

    return request
  })

  const repo = new IndexedDbEventRepository()

  // Act & Assert
  await expect(repo.remove(1)).rejects.toThrow('Tx Remove Failed')
})
})
