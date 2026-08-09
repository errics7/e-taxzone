/**
 * SptL7Repository
 *
 * Persistence / Data Access Layer for spt_l7.
 * Repository does NOT own transactions, does NOT contain business logic,
 * and does NOT create/modify associations. See:
 * REPOSITORY_ARCHITECTURE_REVIEW_SPT_TAHUNAN_BADAN_FINAL.
 *
 * NOTE: UNIQUE is (header_id, tax_year), NOT header_id alone.
 * header_id is 1:N with spt_header (hasMany/belongsTo), not 1:1.
 */

const spt_l7 = require("../models/spt_l7.model");

class SptL7Repository {
  /**
   * Find one active (deleted_at IS NULL) record by primary key.
   * @returns {Promise<Model|null>}
   */
  async findById(id, options = {}) {
    const { transaction } = options;
    return spt_l7.findOne({
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
    return spt_l7.create(data, { transaction });
  }

  /**
   * Update an active record by primary key.
   * @returns {Promise<Model|null>}
   */
  async updateById(id, data, options = {}) {
    const { transaction } = options;
    const record = await spt_l7.findOne({
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
    const record = await spt_l7.findOne({
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
    return spt_l7.findAll({
      where: { header_id, deleted_at: null },
      transaction,
    });
  }

  /**
   * Find one active record by the business key: (header_id, tax_year).
   * Allowed as a single-row finder because (header_id, tax_year) is
   * UNIQUE per migration/dictionary — header_id alone is NOT unique.
   * @returns {Promise<Model|null>}
   */
  async findByHeaderAndTaxYear({ header_id, tax_year }, options = {}) {
    const { transaction } = options;
    return spt_l7.findOne({
      where: { header_id, tax_year, deleted_at: null },
      transaction,
    });
  }
}

module.exports = new SptL7Repository();
