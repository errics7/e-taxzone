'use strict';

/**
 * spt_attachment_reconciliation — cleanup lease / retry state (G2.6-H).
 *
 * Additive only: three columns and one index. No existing column, index,
 * table or migration is touched; spt_attachment is not touched.
 *
 *   cleanup_attempt_count  SMALLINT UNSIGNED NOT NULL DEFAULT 0
 *     Retry budget AND fencing token. Incremented only by the atomic claim
 *     UPDATE (compare-and-swap on the value the worker read), never reset.
 *     A worker may write final state only while the count still equals the
 *     token it obtained at claim time.
 *
 *   cleanup_not_before_at  TIMESTAMP NULL
 *     Single "no worker may claim before this instant" marker. It is the
 *     active lease while a worker holds the candidate (claim time + lease),
 *     and the retry backoff deadline after a transient failure. NULL means
 *     claimable now. All comparisons and writes use the DATABASE clock.
 *
 *   last_result            VARCHAR(40) NULL
 *     Machine-readable outcome of the latest attempt (triage and alerting),
 *     including the DELETE_ISSUED marker written before a Drive delete.
 *
 * Existing columns keep their meaning, except cleanup_attempted_at, which now
 * records the start of the MOST RECENT attempt (it is no longer a
 * "claimed once" guard).
 *
 * Deploy order: run this migration BEFORE deploying the code that uses the
 * new columns. The service refuses to run cleanup (and refuses reconcile)
 * while any of the three columns is missing, so a partially applied or
 * not-yet-applied migration fails closed.
 *
 * MySQL/TiDB DDL is not transactional: if `up` fails part-way, the columns
 * that were added stay added. Readiness requires ALL three columns, so a
 * partial state keeps cleanup disabled until the migration is completed.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('spt_attachment_reconciliation', 'cleanup_attempt_count', {
      type: Sequelize.SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('spt_attachment_reconciliation', 'cleanup_not_before_at', {
      type: 'TIMESTAMP NULL',
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('spt_attachment_reconciliation', 'last_result', {
      type: Sequelize.STRING(40),
      allowNull: true,
    });

    // Serves the cleanup eligibility query:
    //   status = 'CLEANUP_PENDING' AND (cleanup_not_before_at IS NULL OR <= now)
    await queryInterface.addIndex(
      'spt_attachment_reconciliation',
      ['status', 'cleanup_not_before_at'],
      { name: 'idx_spt_attachment_reconciliation_status_not_before' }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'spt_attachment_reconciliation',
      'idx_spt_attachment_reconciliation_status_not_before'
    );
    await queryInterface.removeColumn('spt_attachment_reconciliation', 'last_result');
    await queryInterface.removeColumn('spt_attachment_reconciliation', 'cleanup_not_before_at');
    await queryInterface.removeColumn('spt_attachment_reconciliation', 'cleanup_attempt_count');
  },
};
