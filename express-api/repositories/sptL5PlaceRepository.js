/**
 * SptL5PlaceRepository
 *
 * Persistence / Data Access Layer for spt_l5_place.
 * Repository does NOT own transactions, does NOT contain business logic,
 * and does NOT create/modify associations. See:
 * REPOSITORY_ARCHITECTURE_REVIEW_SPT_TAHUNAN_BADAN_FINAL.
 *
 * NOTE: tku_number is not unique — no single-row finder based on
 * tku_number is provided by design.
 */

const spt_l5_place = require("../models/spt_l5_place.model");

class SptL5PlaceRepository {
  /**
   * Find one active (deleted_at IS NULL) record by primary key.
   * @returns {Promise<Model|null>}
   */
  async findById(id, options = {}) {
    const { transaction } = options;
    return spt_l5_place.findOne({
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
    return spt_l5_place.create(data, { transaction });
  }

  /**
   * Update an active record by primary key.
   * @returns {Promise<Model|null>}
   */
  async updateById(id, data, options = {}) {
    const { transaction } = options;
    const record = await spt_l5_place.findOne({
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
    const record = await spt_l5_place.findOne({
      where: { id, deleted_at: null },
      transaction,
    });
    if (!record) return null;
    await record.update({ deleted_at: new Date() }, { transaction });
    return record;
  }

  /**
   * Find all active records for a given header_id (1:N).
   * @returns {Promise<Model[]>}
   */
  async findAllByHeaderId(header_id, options = {}) {
    const { transaction } = options;
    return spt_l5_place.findAll({
      where: { header_id, deleted_at: null },
      transaction,
    });
  }
}

module.exports = new SptL5PlaceRepository();
