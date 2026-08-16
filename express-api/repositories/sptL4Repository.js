/**
 * SptL4Repository
 *
 * Persistence / Data Access Layer for spt_l4.
 * Repository does NOT own transactions, does NOT contain business logic,
 * and does NOT create/modify associations. See:
 * REPOSITORY_ARCHITECTURE_REVIEW_SPT_TAHUNAN_BADAN_FINAL.
 *
 * NOTE: PART_A/PART_B completeness is business/service validation, not
 * a Repository responsibility. No single-row assumption is made here.
 */

const spt_l4 = require("../models/spt_l4.model");

class SptL4Repository {
  /**
   * Find one active (deleted_at IS NULL) record by primary key.
   * @returns {Promise<Model|null>}
   */
  async findById(id, options = {}) {
    const { transaction } = options;
    return spt_l4.findOne({
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
    return spt_l4.create(data, { transaction });
  }

  /**
   * Update an active record by primary key.
   * @returns {Promise<Model|null>}
   */
  async updateById(id, data, options = {}) {
    const { transaction } = options;
    const record = await spt_l4.findOne({
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
    const record = await spt_l4.findOne({
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
    return spt_l4.findAll({
      where: { header_id, deleted_at: null },
      transaction,
    });
  }

  /**
   * Hard-delete a record by primary key (physical DELETE row).
   * Section G FINAL DECISION: L2/L3/L4/L7 child rows removed by the user
   * via the Draft UI are HARD deleted, not soft-deleted. Ownership
   * validation (row belongs to the requested header) is the Service's
   * responsibility, not the Repository's — mirrors updateById/findById.
   * @returns {Promise<number>} number of rows destroyed (0 or 1)
   */
  async hardDeleteById(id, options = {}) {
    const { transaction } = options;
    return spt_l4.destroy({
      where: { id },
      transaction,
    });
  }
}

module.exports = new SptL4Repository();
