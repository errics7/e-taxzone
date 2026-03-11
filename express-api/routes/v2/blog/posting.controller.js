// const db = require("../../../config/database");
const sequelizeConf = require("../../../config/sequelizeconf");
const { Sequelize } = require("sequelize");
const moment = require("moment-timezone");
const blog = require("../../../models/blog.model");
moment.locale("id");
moment.tz.setDefault("Asia/Jakarta");

exports.dataBlog = async (req, res) => {
  var type = req.params.type;
  const sql = `SELECT blog.slug,blog.updated_date,CASE WHEN users.nama IS NULL THEN 'Belum ada update' ELSE users.nama END AS nama FROM blog LEFT JOIN users ON blog.updated_by=users.id WHERE blog.type=:type`;

  const queryBlog = await sequelizeConf
    .query(sql, {
      replacements: { type: type },
      // logging: console.log,
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  res.status(200).json({
    success: true,
    data: queryBlog,
  });
};
// selected
exports.selected = async (req, res) => {
  //
  var slug = req.params.slug.toString().toLowerCase();
  var type = req.params.type;
  const sql = `SELECT * FROM blog where slug=:slug AND type=:type`;
  const queryBlog = await sequelizeConf
    .query(sql, {
      replacements: { slug: slug, type: type },
      // logging: console.log,
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  console.log(queryBlog);
  res.status(200).json({
    success: true,
    data: queryBlog.length !== 0 ? queryBlog[0] : null,
  });
};

exports.update = async (req, res) => {
  const content = req.body.content;
  const id = req.body.id;
  const updated = moment().format("YYYY-MM-DD HH:mm:ss");
  const updated_id = req.auth._id;
  // Update db

  await blog
    .update(
      {
        content: content,
        updated_by: updated_id,
        updated: updated,
      },
      {
        where: {
          id: id,
        },
      }
    )
    .then(() => {
      res.status(200).json({
        status: 200,
        success: true,
        message: "Data Berhasil Diperbarui",
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
};

exports.newpages = async (req, res) => {
  const noww = moment().format("YYYY-MM-DD HH:mm:ss");
  //
  // insert db
  // const sql =
  //   "insert into blog (content,slug,created_by,created_date,updated_by,updated_date) values (?)";
  blog
    .create({
      content: req.body.content,
      slug: req.body.slug,
      id: req.body.id,
      type: req.body.type,
      created_by: req.body.id,
      created_date: noww,
      updated_by: req.body.id,
      updated_date: noww,
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  // .then(function (result) {
  //   res.json(result);
  // })
  // .catch(function (error) {
  //   res.status(400).json({
  //     message: error,
  //   })
  // });
  // await sequelizeConf.query(sql, {
  //   replacements: {
  //     content: req.body.content,
  //     slug: req.body.slug,
  //     id: req.body.id,
  //     type: req.body.type,
  //     created_by: req.body.id,
  //     created_date: noww,
  //     updated_by: req.body.id,
  //     updated_date: noww
  //   },
  //   // logging: console.log,
  //   plain: false,
  //   raw: true,
  // })
  // .catch(error => {
  //   res.status(400).json({
  //     message: error,
  //   })
  // })

  // if no error
  res.status(200).json({
    status: 200,
    success: true,
    message: "Data Berhasil Dipublikasi",
  });
};
