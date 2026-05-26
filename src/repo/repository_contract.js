// The RepositoryContract class serves as an abstract base class for repository implementations.
export class RepositoryContract {
  // The constructor checks if the class is being instantiated directly, and if so,
  // it throws an error. This is a common pattern in JavaScript to create abstract classes,
  // which are meant to be subclassed rather than instantiated on their own.
  constructor() {
    if (new.target === RepositoryContract) {
      throw new Error('Cannot instantiate abstract class')
    }
  }

  /**
   * Adds a new item to the repository.
   * @param {object} item - Plain object representation of Event
   * @returns {Promise<number|string>} generated ID
   */
  async add(_item) {
    throw new Error('add() not implemented')
  }

  /**
   * Retrieves an item by ID
   * @param {number|string} id
   * @returns {Promise<object|null>}
   */
  async getById(_id) {
    throw new Error('getById() not implemented')
  }

  /**
   * Retrieves all items
   * @returns {Promise<object[]>}
   */
  async getAll() {
    throw new Error('getAll() not implemented')
  }

  /**
   * Updates an existing item
   * @param {object} item
   */
  async update(_item) {
    throw new Error('update() not implemented')
  }

  /**
   * Deletes an item by ID
   * @param {number|string} id
   */
  async remove(_id) {
    throw new Error('remove() not implemented')
  }
}
