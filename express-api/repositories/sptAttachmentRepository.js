/**
 * SptAttachmentRepository
 *
 * Persistence / Data Access Layer for spt_attachment.
 * Repository does NOT own transactions, does NOT contain business logic,
 * and does NOT create/modify associations. See:
 * REPOSITORY_ARCHITECTURE_REVIEW_SPT_TAHUNAN_BADAN_FINAL.
 *
 * NOTE: unlike spt_header / spt_l1 / spt_l2 / spt_main_form, spt_attachment
 * has NO deleted_at column (hard delete only per Database Dictionary), so
 * no method here filters or sets deleted_at.
 */

const spt_attachment = require("../models/spt_attachment.model");

class SptAttachmentRepository {
  /**
   * Find one record by primary key.
   * @returns {Promise<Model|null>}
   */
  async findById(id, options = {}) {
    const { transaction } = options;
    return spt_attachment.findOne({
      where: { id },
      transaction,
    });
  }

  /**
   * Find all records for a given header_id (1:N,
   * header_id is not unique on spt_attachment).
   * @returns {Promise<Model[]>}
   */
  async findAllByHeaderId(header_id, options = {}) {
    const { transaction } = options;
    return spt_attachment.findAll({
      where: { header_id },
      transaction,
    });
  }

  /**
   * Persist one new record.
   * @returns {Promise<Model>}
   */
  async create(data, options = {}) {
    const { transaction } = options;
    return spt_attachment.create(data, { transaction });
  }

  /**
   * Update a record by primary key.
   * @returns {Promise<Model|null>}
   */
  async updateById(id, data, options = {}) {
    const { transaction } = options;
    const record = await spt_attachment.findOne({
      where: { id },
      transaction,
    });
    if (!record) return null;
    await record.update(data, { transaction });
    return record;
  }

  /**
   * Hard-delete a record by primary key (physical DELETE row).
   * spt_attachment has no deleted_at column — deletion is always a
   * hard delete. Ownership validation (row belongs to the requested
   * header) is the Service's responsibility, not the Repository's —
   * mirrors updateById/findById.
   * @returns {Promise<number>} number of rows destroyed (0 or 1)
   */
  async hardDeleteById(id, options = {}) {
    const { transaction } = options;
    return spt_attachment.destroy({
      where: { id },
      transaction,
    });
  }
}

module.exports = new SptAttachmentRepository();
