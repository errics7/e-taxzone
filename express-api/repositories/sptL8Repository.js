/**
 * SptL8Repository
 *
 * Persistence / Data Access Layer for spt_l8.
 * Repository does NOT own transactions, does NOT contain business logic,
 * and does NOT create/modify associations. See:
 * REPOSITORY_ARCHITECTURE_REVIEW_SPT_TAHUNAN_BADAN_FINAL.
 */

const spt_l8 = require("../models/spt_l8.model");

class SptL8Repository {
  /**
   * Find one active (deleted_at IS NULL) record by primary key.
   * @returns {Promise<Model|null>}
   */
  async findById(id, options = {}) {
    const { transaction } = options;
    return spt_l8.findOne({
      where: { id, deleted_at: null },
      transaction,
    });
  }

  /**
   * Persist one new record.
   * @returns {Promise<Model>}
   */
  async create(data, options = {}) {
    const { transaction } = options;
    return spt_l8.create(data, { transaction });
  }

  /**
   * Update an active record by primary key.
   * @returns {Promise<Model|null>}
   */
  async updateById(id, data, options = {}) {
    const { transaction } = options;
    const record = await spt_l8.findOne({
      where: { id, deleted_at: null },
      transaction,
    });
    if (!record) return null;
    await record.update(data, { transaction });
    return record;
  }

  /**
   * Soft-delete an active record by primary key (deleted_at = now).
   * @returns {Promise<Model|null>}
   */
  async softDeleteById(id, options = {}) {
    const { transaction } = options;
    const record = await spt_l8.findOne({
      where: { id, deleted_at: null },
      transaction,
    });
    if (!record) return null;
    await record.update({ deleted_at: new Date() }, { transaction });
    return record;
  }

  /**
   * Find one active record by header_id.
   * Allowed as a single-row finder because header_id is UNIQUE (1:1
   * with spt_header per migration/dictionary).
   * @returns {Promise<Model|null>}
   */
  async findByHeaderId(header_id, options = {}) {
    const { transaction } = options;
    return spt_l8.findOne({
      where: { header_id, deleted_at: null },
      transaction,
    });
  }
}

module.exports = new SptL8Repository();
