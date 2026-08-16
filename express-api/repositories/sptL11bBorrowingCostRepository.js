'use strict';

/**
 * SptL11bBorrowingCostRepository
 * Persistence layer for 'spt_l11b_borrowing_cost'.
 * Source of truth: REPOSITORY_CONTRACT_SPT_TAHUNAN_BADAN_L9-L14_FINAL_LOCKED.
 *
 * Repository is persistence-only: no business logic, no ownership checks,
 * no derived-value calculation, no transaction ownership (Service owns
 * transactions; this layer only receives and propagates options.transaction).
 * Hard delete only — no soft delete / paranoid / deleted_at.
 */

const Model = require("../models/spt_l11b_borrowing_cost.model");

class SptL11bBorrowingCostRepository {
  /**
   * findById(id, options = {})
   * -> Model instance or null
   */
  async findById(id, options = {}) {
    const { transaction } = options;

    return Model.findByPk(id, {
      transaction,
    });
  }

  /**
   * create(data, options = {})
   * -> Model instance
   * CREATE ONLY — does not resolve/find existing rows.
   */
  async create(data, options = {}) {
    const { transaction } = options;

    return Model.create(data, {
      transaction,
    });
  }

  /**
   * updateById(id, data, options = {})
   * -> Model instance or null
   */
  async updateById(id, data, options = {}) {
    const { transaction } = options;

    const row = await Model.findByPk(id, { transaction });
    if (!row) {
      return null;
    }

    return row.update(data, {
      transaction,
    });
  }

  /**
   * hardDeleteById(id, options = {})
   * -> number (0 or 1) — physical DELETE, no soft delete.
   */
  async hardDeleteById(id, options = {}) {
    const { transaction } = options;

    return Model.destroy({
      where: { id },
      transaction,
    });
  }

  /**
   * findAllByL11bId(l11bId, options = {})
   * -> Model[]
   */
  async findAllByL11bId(l11bId, options = {}) {
    const { transaction } = options;

    return Model.findAll({
      where: { l11b_id: l11bId },
      transaction,
    });
  }
}

module.exports = new SptL11bBorrowingCostRepository();
