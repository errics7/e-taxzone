const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const SptGrade = sequelize.define('spt_grade', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    spt_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'spt_tahunan',
        key: 'id'
      }
    },
    graded_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    
    // Grading Criteria (0-100 scale)
    completeness_score: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    accuracy_score: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    presentation_score: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    understanding_score: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    
    // Overall Score (calculated from criteria)
    final_score: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    
    // Letter Grade
    letter_grade: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    
    // Feedback
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    
    // Additional comments for each criteria
    completeness_comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    accuracy_comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    presentation_comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    understanding_comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    
    // Grading Status
    status: {
      type: DataTypes.ENUM('draft', 'final', 'revised'),
      defaultValue: 'final'
    },
    
    // Revision tracking
    revision_number: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    previous_grade_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'spt_grade',
        key: 'id'
      }
    },
    
    // Timestamps
    graded_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'spt_grade',
    timestamps: false,
    indexes: [
      {
        fields: ['spt_id']
      },
      {
        fields: ['graded_by']
      },
      {
        fields: ['student_id']
      },
      {
        fields: ['status']
      },
      {
        unique: true,
        fields: ['spt_id', 'revision_number']
      }
    ]
  });

  return SptGrade;
};