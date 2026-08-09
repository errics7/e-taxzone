/**
 * SptL5TransactionRepository
 *
 * Persistence / Data Access Layer for spt_l5_transaction.
 * Repository does NOT own transactions, does NOT contain business logic,
 * and does NOT create/modify associations. See:
 * REPOSITORY_ARCHITECTURE_REVIEW_SPT_TAHUNAN_BADAN_FINAL.
 *
 * NOTE: spt_l5_transaction only has place_id (FK -> spt_l5_place.id).
 * It has no header_id column, so no findAllByHeaderId method exists
 * here by design.
 */

const spt_l5_transaction = require("../models/spt_l5_transaction.model");

class SptL5TransactionRepository {
  /**
   * Find one active (deleted_at IS NULL) record by primary key.
   * @returns {Promise<Model|null>}
   */
  async findById(id, options = {}) {
    const { transaction } = options;
    return spt_l5_transaction.findOne({
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
    return spt_l5_transaction.create(data, { transaction });
  }

  /**
   * Update an active record by primary key.
   * @returns {Promise<Model|null>}
   */
  async updateById(id, data, options = {}) {
    const { transaction } = options;
    const record = await spt_l5_transaction.findOne({
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
    const record = await spt_l5_transaction.findOne({
      where: { id, deleted_at: null },
      transaction,
    });
    if (!record) return null;
    await record.update({ deleted_at: new Date() }, { transaction });
    return record;
  }

  /**
   * Find all active records for a given place_id (1:N).
   * @returns {Promise<Model[]>}
   */
  async findAllByPlaceId(place_id, options = {}) {
    const { transaction } = options;
    return spt_l5_transaction.findAll({
      where: { place_id, deleted_at: null },
      transaction,
    });
  }

  /**
   * Find one active record by the business key: (place_id, tax_month).
   * Allowed as a single-row finder because (place_id, tax_month) is
   * UNIQUE per migration/dictionary.
   * @returns {Promise<Model|null>}
   */
  async findByPlaceAndTaxMonth({ place_id, tax_month }, options = {}) {
    const { transaction } = options;
    return spt_l5_transaction.findOne({
      where: { place_id, tax_month, deleted_at: null },
      transaction,
    });
  }
}

module.exports = new SptL5TransactionRepository();
