/**
 * SptHeaderRepository
 *
 * Persistence / Data Access Layer for spt_header.
 * Repository does NOT own transactions, does NOT contain business logic,
 * and does NOT create/modify associations. See:
 * REPOSITORY_ARCHITECTURE_REVIEW_SPT_TAHUNAN_BADAN_FINAL.
 */

const spt_header = require("../models/spt_header.model");

class SptHeaderRepository {
  /**
   * Find one active (deleted_at IS NULL) record by primary key.
   * @returns {Promise<Model|null>}
   */
  async findById(id, options = {}) {
    const { transaction } = options;
    return spt_header.findOne({
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
    return spt_header.create(data, { transaction });
  }

  /**
   * Update an active record by primary key.
   * @returns {Promise<Model|null>}
   */
  async updateById(id, data, options = {}) {
    const { transaction } = options;
    const record = await spt_header.findOne({
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
    const record = await spt_header.findOne({
      where: { id, deleted_at: null },
      transaction,
    });
    if (!record) return null;
    await record.update({ deleted_at: new Date() }, { transaction });
    return record;
  }

  /**
   * Find one active record by the business key:
   * (company_id, tax_year, tax_return_type, amendment_number).
   * NOTE: company_id is a business relationship only — no association
   * to companies is used or created here.
   * @returns {Promise<Model|null>}
   */
  async findByBusinessKey(
    { company_id, tax_year, tax_return_type, amendment_number },
    options = {}
  ) {
    const { transaction } = options;
    return spt_header.findOne({
      where: {
        company_id,
        tax_year,
        tax_return_type,
        amendment_number,
        deleted_at: null,
      },
      transaction,
    });
  }
}

module.exports = new SptHeaderRepository();
