//จัดการ Routing
const express = require("express");
const router = express.Router(); //ส่วนใหญ่จะตั้งชื่อว่า app

//เรียกใช้งาน Model โมเดล
const Product = require("../models/product");

// อัพโหลดไฟล์
const multer = require("multer");

const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, res, cd) {
    cd(null, "./public/images/products"); //ตำแหน่งจัดเก็บไฟล์
  },
  filename: function (req, res, cd) {
    cd(null, Date.now() + ".jpg"); // เปลี่ยนชื่อไฟล์ ป้องกันการซ้ำชื่อกัน
  },
});

//เริ่มต้นอัพโหลด
const upload = multer({
  storage: storage,
});

const name = "Sirawit";
const age = 36;
const Array = ["เสื้อ", "กางเกง", "หูฟัง", "พัดลม"];
const data = {
  name: "pai",
  age: 25,
  image: "https://images6.alphacoders.com/106/1069078.jpg",
};
const products = [
  {
    name: "คอม",
    price: 53500,
    image:
      "https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    name: "เสื้อ",
    price: 2500,
    image:
      "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    name: "กางเกง",
    price: 4800,
    image:
      "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    name: "คอม",
    price: 53500,
    image:
      "https://image.bestreview.asia/wp-content/uploads/2020/04/Desktop-PC-1024x546.jpg",
  },
  {
    name: "เสื้อ",
    price: 2500,
    image: "https://cf.shopee.co.th/file/fbecd5b8bc040e5f9f1ac840b61b52bd",
  },
  {
    name: "กางเกง",
    price: 4800,
    image:
      "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422972/item/goods_09_422972.jpg?width=1008&impolicy=quality_75",
  },
];
const html = "<b>ขอให้โชคดี</b>";

router.get("/api/item", (req, res) => res.json(products));

router.get("/", (req, res) => {
  Product.find().exec((err, doc) => {
    res.render("index.ejs", { products: doc });
  });
});

router.get("/add-product", (req, res) => {
  if (req.session.login) {
    //req.cookie.login
    res.render("form.ejs"); //ถ้าเข้าสู่ระบบแล้วให้ไปที่หน้า ฟอร์ม
  } else {
    res.render("admin.ejs"); //ยังไม่ได้ล็อคอืนก็ไปที่หน้า login ก่อน
  }
});

router.get("/manage", (req, res) => {
  // การใช้ cookie ในการตรวจสอบสิธทการเข้าถึง
  if (req.session.login) {
    //req.cookie.login
    Product.find().exec((err, doc) => {
      res.render("manage.ejs", { products: doc });
    });
  } else {
    res.render("admin.ejs"); //ยังไม่ได้ล็อคอืนก็ไปที่หน้า login ก่อน
  }

  //แสดงข้อมูล session
  console.log("รหัส session = ", req.sessionID);
  console.log("ข้อมูล session = ", req.session);
});

router.get("/delete/:id", (req, res) => {
  console.log("Delete ID : ", req.params.id);
  Product.findByIdAndDelete(req.params.id, { useFindAndModify: false }).exec(
    (err) => {
      if (err) console.log(err);
      res.redirect("manage.ejs");
    }
  );
});

router.get("/:id", (req, res) => {
  //ได้ id สินค้าแล้ว
  const product_id = req.params.id;

  Product.findOne({ _id: product_id }).exec((err, doc) => {
    if (err) return console.log(err);
    console.log(doc);
    res.render("product.ejs", { product: doc });
  });
});

//ออกจากระบบ เคียร์คุกกี้
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/manage");
  });
});

// การรับส่งข้อมูลแบบ post
router.post("/insert", upload.single("image"), (req, res) => {
  const data = req.body; //เก็บเป็น Object post จะใช้ .body
  const { name, price, description } = data;
  const image = req.file.filename;
  let dataall = new Product({
    name: name,
    price: price,
    image: image,
    description: description,
  });
  Product.saveProduct(dataall, (err) => {
    if (err) console.log(err);
    res.render("/");
  });
  // console.log(dataall);
  // res.render("form.ejs", { name: name });
});

router.post("/edit", (req, res) => {
  const edit_id = req.body.edit_id;
  console.log(edit_id);

  Product.findOne({ _id: edit_id }).exec((err, doc) => {
    if (err) return console.log(err);
    console.log(doc);
    //นำข้อมูลเดิมที่ต้องการแก้ไขไปแสดงในแบบฟอร์ม
    res.render("edit.ejs", { product: doc });
  });
});

router.post("/update", (req, res) => {
  const data = req.body; //เก็บเป็น Object post จะใช้ .body
  const { name, price, description } = data;
  // const image =new Product(req.file.filename)

  const update_id = req.body.update_id;
  let dataall = {
    name: name,
    price: price,
    // image:image,
    description: description,
  };

  // อัพเดตข้อมูล
  Product.findByIdAndUpdate(update_id, dataall, {
    useFindAndModify: false,
  }).exec((err) => {
    // if(err) return console.log(err);
    res.redirect("/manage");
  });
});

//การเข้าสู่ระบบด้วย Cookie
router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const timeExpire = 30000;

  if (username === "admin" && password === "123") {
    //การสร้าง Session
    req.session.username = username;
    req.session.password = password;
    req.session.login = true;
    req.session.cookie.maxAge = 30000;

    res.redirect("/manage");
  } else {
    res.render("404.ejs");
  }
});
const path = require("path");

module.exports = router;
