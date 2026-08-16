'use strict';

/**
 * spt_l1 — UNIQUE constraint correction (BUG 3: L1A/L1C/L1D collision).
 *
 * FINAL decision: L1A, L1C, and L1D all persist into the same spt_l1
 * table (distinguished by section_type). The original constraint from
 * 20260808150020-create-spt-l1.js was:
 *
 *   uq_spt_l1_header_section_account: (header_id, section_code, account_code)
 *
 * This is missing section_type, so an identical account_code under
 * section_code 'A' collides across L1A / L1C / L1D even though they are
 * legitimately distinct rows (e.g. L1A|A|4002, L1C|A|4002, L1D|A|4002
 * must all be allowed to coexist under the same header_id).
 *
 * New identity (per FINAL decision):
 *
 *   (header_id, section_type, section_code, account_code)
 *
 * This migration only swaps the UNIQUE constraint. No table is created
 * or dropped, no column is added/removed/renamed, and no existing row
 * is modified or deleted. A pre-migration duplicate check against the
 * new key (header_id, section_type, section_code, account_code) found
 * 0 duplicates, so existing data is preserved as-is.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('spt_l1', 'uq_spt_l1_header_section_account');

    await queryInterface.addConstraint('spt_l1', {
      fields: ['header_id', 'section_type', 'section_code', 'account_code'],
      type: 'unique',
      name: 'uq_spt_l1_header_type_section_account',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('spt_l1', 'uq_spt_l1_header_type_section_account');

    await queryInterface.addConstraint('spt_l1', {
      fields: ['header_id', 'section_code', 'account_code'],
      type: 'unique',
      name: 'uq_spt_l1_header_section_account',
    });
  },
};
