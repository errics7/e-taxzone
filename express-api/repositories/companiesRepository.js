/**
 * CompaniesRepository
 *
 * Persistence / Data Access Layer for companies.
 * Repository does NOT own transactions, does NOT contain business logic,
 * and does NOT create/modify associations. See:
 * REPOSITORY_ARCHITECTURE_REVIEW_SPT_TAHUNAN_BADAN_FINAL.
 *
 * NOTE: unlike spt_header / spt_l1 / spt_l5_place / spt_l5_transaction /
 * spt_main_form, companies has NO deleted_at column (it uses
 * registration_status instead) — no method here filters on deleted_at.
 *
 * Read-only by design (G2.6-B scope): only findById is needed for
 * ownership resolution. No create/update/delete/findAll here.
 */

const companies = require("../models/companies.model");

class CompaniesRepository {
  /**
   * Find one record by primary key.
   * @returns {Promise<Model|null>}
   */
  async findById(id, options = {}) {
    const { transaction } = options;
    return companies.findOne({
      where: { id },
      transaction,
    });
  }
}

module.exports = new CompaniesRepository();
